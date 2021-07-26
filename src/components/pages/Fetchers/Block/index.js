import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { formatDistance } from "date-fns"
import { processAsset } from "@/utils/index"
import Cardano from "../../../../services/cardano"
import Gallery from "@/components/pages/Gallery"

const query = (blockNumber, solo) => `
  query blockByNumber {
    blocks(where: { number: { _eq: ${blockNumber} } }) {
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
              tokenMints (limit: ${solo ? 2500 : 1}, order_by: { transaction: { includedAt: asc } }) {
                transaction {
                  hash
                  includedAt
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

const BlockFetcher = ({
  blockNumber,
  solo = true,
  setLoadingOuter = () => { },
}) => {
  const [liveState, setLiveState] = useState([])
  const [loading, setLoading] = useState(true)
  const init = useSelector((state) => state.settings.init)

  useEffect(() => {
    if (init) {
      fetchData()
    }
    // eslint-disable-next-line
  }, [init])

  const fetchData = () => {
    Cardano.explorer
      .query({
        query: query(blockNumber, solo),
      })
      .then((result) => {
        processBlocks(result?.data?.data?.blocks || [])
      })
  }

  const processBlocks = (blocks) => {
    const result = blocks.map((block) => {
      return {
        number: block.number,
        forgedAt: block.forgedAt,
        tokens: processTransactions(block.transactions),
      }
    })
    const updatedLiveState = [...liveState]
    const updatedResult = result.filter((item) => item.tokens.length > 0)

    setLoading(false)
    if (updatedResult.length > 0) {
      setLoadingOuter(false)
      updatedLiveState.push(...updatedResult)
      setLiveState(updatedLiveState)
    }
  }

  const processTransactions = (txs) => {
    const tokens = []
    try {
      txs.forEach((tx) => {
        tx.outputs.forEach((output) => {
          output.tokens.forEach((token) => {
            const tk = {
              ...processAsset(token.asset),
              toAddress: output.address,
              txHash: tx.hash,
              minted: tx.hash === token.asset.tokenMints[0]?.transaction?.hash,
            }
            tokens.push(tk)
          })
        })
      })
    } catch { }
    return tokens
  }

  return (
    <div className="mb-5">
      {solo && (
        <div className="text-left text-md-center">
          <h5 className="mb-0">Block {blockNumber} outputs</h5>
        </div>
      )}
      {liveState.map((block) => {
        return (
          <div className="text-left mb-5 text-md-center" key={block.number}>
            {!solo && (
              <h5 className="mb-1">
                Block{" "}
                <Link
                  to={`/explorer/search/?block=${block.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link--dashed"
                >
                  {block.number}
                </Link>{" "}
                outputs
              </h5>
            )}
            <div className="text-muted mb-4">
              {formatDistance(new Date(block.forgedAt), new Date(), {
                addSuffix: true,
              })}
            </div>
            <Gallery tokens={block.tokens} />
          </div>
        )
      })}
      {solo && liveState.length === 0 && !loading && (
        <div className="text-center">
          <h1 className="pt-5 mb-5">Unable to find tokens in the block</h1>
          <div className="pt-4">
            <h1>:(</h1>
          </div>
        </div>
      )}
      {solo && loading && (
        <div className="text-center ">
          <div className="pt-5 mb-5">
            <h1>Loading block data...</h1>
          </div>
          <div className="pt-4">
            <div
              className="spinner-border spinner-border-lg text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockFetcher
