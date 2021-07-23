import React, { useState, useEffect } from "react"
import { Link } from 'gatsby'
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
        ? range(networkBlock - 4, networkBlock + 1) // query 5 blocks before from current
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
    setLiveState(newLiveState.splice(-10)) // show not more than 10 blocks
  }

  const processTransactions = (txs) => {
    const tokens = []
    try {
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
    } catch { }
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
      <h1 className="mb-5 pt-3  text-center">
        Oh no, there are so many NFTs!<br />Interplanetary file system is overloaded! <span role="img" aria-label="">💎</span>
      </h1>
      <div className="text-muted text-center mb-5 pb-4 max-width-800 ms-auto me-auto">
        <p className="mb-2">The data is updated every minute and shows all transferred Native Tokens in new blocks.</p>
        <p className="mb-0">Too many "Unable to Load" messages? Go through the captcha at the following <a href="https://cloudflare-ipfs.com/ipfs/QmaYWWWmrUJkWiKAaHRiYwLaSCNGT8he4ZpuQd5TddvRVJ" target="_blank" rel="noopener noreferrer">link</a>. If you see Ray Diamond, you don't need to take any action, just surf NFTs!</p>
      </div>
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
            <div className="mb-5" key={block.number}>
              <h5 className="text-center">
                Block <Link to={`/explorer/block/${block.number}`} target="_blank" rel="noopener noreferrer" className="link--dashed">{block.number}</Link> outputs
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