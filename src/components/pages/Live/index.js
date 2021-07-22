import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { range } from 'lodash'

import Cardano from "../../../services/cardano"
import Gallery from "@/components/pages/Gallery"

const query = (blocks) => `
  query blockByNumber {
    blocks(where: { number: { _in: [${blocks}] } }) {
      hash
      number
      forgedAt
      transactions {
        hash
        outputs {
          address
          tokens {
            asset {
              assetName
              policyId
              fingerprint
              assetId
              tokenMints {
                transaction {
                  metadata {
                    key
                    value
                  }
                }
              }
            }
            quantity
          }
        }
      }
    }
  }
`

const Live = () => {
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [prevBlock, serPrevBlock] = useState()
  const [firstRun, setFirstRun] = useState(true)
  const [liveState, setLiveState] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [networkBlock])

  const fetchData = () => {
    if (networkBlock !== 0 && networkBlock !== prevBlock) {
      const blocksToQuery = firstRun
        ? range(networkBlock - 5, networkBlock + 1)
        : prevBlock ? generateBlocksToQuery() : [networkBlock]
      serPrevBlock(networkBlock)
      Cardano.explorer.query({
        query: query(blocksToQuery),
      }).then((result) => {
        setLoading(false)
        processBlocks(result?.data?.data?.blocks || [])
      })
      setFirstRun(false)
    }
  }

  const generateBlocksToQuery = () => {
    const diff = networkBlock - prevBlock
    return range(networkBlock + 1 - diff, networkBlock + 1)
  }

  const processBlocks = (blocks) => {
    const result = blocks.map((block) => {
      return {
        number: block.number,
        forgedAt: block.forgedAt,
        tokens: processTransactions(block.transactions)
      }
    })
    const newLiveState = [...liveState]
    newLiveState.push(...result.filter((item) => item.tokens.length > 0))
    setLiveState(newLiveState.splice(-20))
  }

  const processTransactions = (txs) => {
    const tokens = []
    txs.forEach((tx) => {
      tx.outputs.forEach((output) => {
        output.tokens.forEach((token) => {
          const assetName = Buffer.from(token.asset.assetName, 'hex').toString()
          const tk = {
            assetName,
            assetId: token.asset.assetId,
            policyId: token.asset.policyId,
            fingerprint: token.asset.fingerprint,
            toAddress: output.address,
            txHash: tx.hash,
            minted: tx.hash === token.asset.tokenMints[0]?.transaction?.hash,
            metadataRaw: token.asset.tokenMints[0]?.transaction?.metadata,
            metadataNft: process721Metadata(
              token.asset.tokenMints[0]?.transaction?.metadata,
              token.asset.policyId,
              assetName,
            )
          }
          tokens.push(tk)
        })
      })
    })
    return tokens
  }

  const process721Metadata = (metadata, policyId, assetName) => {
    if (metadata) {
      const pickedBy721 = metadata.filter(item => item.key === "721")[0] || undefined
      if (pickedBy721) {
        const { value } = pickedBy721
        const pickedByPolicy = value[policyId]
        if (pickedByPolicy) {
          const pickedByName = pickedByPolicy[assetName]
          if (pickedByName) {
            return pickedByName
          }
        } else {
          return value
        }
      }
    }
    return undefined
  }

  return (
    <div className="ray__block">
      <h1 className="mb-5 text-center">
        Oh no, there are so many NFTs! Catch one! <span role="img" aria-label="">💎</span>
      </h1>
      {loading && (
        <div className="text-center">
          <div className="spinner-border spinner-border-lg text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div>
        {[...liveState].reverse().map((block) => {
          return (
            <div key={block.number}>
              <h5 className="text-center">
                Block <a href={`/explorer/block/${block.number}`} target="_blank" rel="noopener noreferrer" className="link--dashed">{block.number}</a> outputs
              </h5>
              <Gallery tokens={block.tokens} />
            </div>
          )
        })}
        {(liveState.length < 1 && !loading) && (
          <h5 className="text-center">
            No NFTs have been found in the last 5 blocks. Please wait a few minutes...
          </h5>
        )}
      </div>
    </div>
  )
}

export default Live