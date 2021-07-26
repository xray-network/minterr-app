import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { formatDistance } from "date-fns"
import { processAsset } from "@/utils/index"
import Cardano from "../../../../services/cardano"
import Gallery from "@/components/pages/Gallery"

const query = (blockNumber) => `
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
              tokenMints (limit: 1, order_by: { transaction: { includedAt: asc } }) {
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

const BlockLive = ({ blockNumber, setLoadingOuter = () => {} }) => {
  const [liveState, setLiveState] = useState([])
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
        query: query(blockNumber),
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

    setLoadingOuter(false)
    updatedLiveState.push(...updatedResult)
    setLiveState(updatedLiveState)
  }

  const processTransactions = (txs) => {
    const tokens = []
    try {
      txs.forEach((tx) => {
        tx.outputs.forEach((output) => {
          output.tokens.forEach((token) => {
            const tk = {
              ...processAsset(token.asset),
              minted: tx.hash === token.asset.tokenMints[0]?.transaction?.hash,
            }
            tokens.push(tk)
          })
        })
      })
    } catch {}
    return tokens
  }

  return (
    <div className="mb-5">
      {liveState.map((block) => {
        return (
          <div className="text-left mb-5 text-md-center" key={block.number}>
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
            <div className="text-muted mb-4">
              {block.tokens.length < 2500 &&
                `Total ${block.tokens.length} token(s)`}
              {block.tokens.length >= 2500 &&
                `Total more than ${block.tokens.length} token(s)`}
              {", "}
              {formatDistance(new Date(block.forgedAt), new Date(), {
                addSuffix: true,
              })}
            </div>
            <Gallery tokens={block.tokens} />
          </div>
        )
      })}
    </div>
  )
}

export default BlockLive
