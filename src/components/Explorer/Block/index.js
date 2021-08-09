import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { formatDistance } from "date-fns"
import { processAsset } from "@/utils/index"
import Cardano from "@/services/cardano"
import Gallery from "@/components/Gallery"

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
            quantity
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
          }
        }
      }
    }
  }
`

const Block = ({ blockNumber }) => {
  const [liveState, setLiveState] = useState([])
  const [loading, setLoading] = useState(true)
  const [prevSearch, setPrevSearch] = useState()
  const init = useSelector((state) => state.settings.init)

  useEffect(() => {
    if (init && blockNumber !== prevSearch) {
      fetchData()
      setPrevSearch(blockNumber)
    }
    // eslint-disable-next-line
  }, [init, blockNumber])

  const fetchData = () => {
    setLiveState([])
    setLoading(true)
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
    const updatedResult = result.filter((item) => item.tokens.length > 0)

    setLoading(false)
    setLiveState(updatedResult)
  }

  const processTransactions = (txs) => {
    const tokens = []
    try {
      txs.forEach((tx) => {
        tx.outputs.forEach((output) => {
          output.tokens.forEach((token) => {
            const tk = {
              ...processAsset(token.asset),
              quantity: token.quantity,
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
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <Link to="/explorer/">Explorer</Link>
        <i>/</i>
        <span>Block {blockNumber}</span>
      </div>
      <div className="text-left text-md-center">
        <h5 className="mb-1">Block {blockNumber} outputs</h5>
      </div>
      {liveState.map((block) => {
        return (
          <div className="text-left mb-5 text-md-center" key={block.number}>
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
      {liveState.length === 0 && !loading && (
        <div className="text-center">
          <h1 className="pt-5 mb-5">Unable to find tokens</h1>
          <div className="pt-4">
            <h1>:(</h1>
          </div>
        </div>
      )}
      {loading && (
        <div className="text-center ">
          <div className="pt-5 mb-5">
            <h1>Observing...</h1>
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

export default Block
