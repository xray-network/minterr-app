import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { processAsset, truncate } from "@/utils/index"
import Cardano from "@/services/cardano"
import Gallery from "@/components/Gallery"

const query = (transaction) => `
  query transactionsByHashesWithTokens {
    transactions(
      where: {
        hash: {
          _eq: "${transaction}"
        }
      }
    ) {
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
            tokenMints(limit: 1, order_by: { transaction: { includedAt: asc } }) {
              quantity
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
`

const Transaction = ({ transaction }) => {
  const [liveState, setLiveState] = useState([])
  const [loading, setLoading] = useState(true)
  const [prevSearch, setPrevSearch] = useState()
  const init = useSelector((state) => state.settings.init)

  useEffect(() => {
    if (init && transaction !== prevSearch) {
      fetchData()
      setPrevSearch(transaction)
    }
    // eslint-disable-next-line
  }, [init, transaction])

  const fetchData = () => {
    setLiveState([])
    setLoading(true)
    Cardano.explorer
      .query({
        query: query(transaction),
      })
      .then((result) => {
        processTransactions(result?.data?.data?.transactions || [])
      })
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
    } catch { }

    setLoading(false)
    setLiveState(tokens)
  }

  return (
    <div className="mb-5">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <Link to="/explorer/">Explorer</Link>
        <i>/</i>
        <span>Transaction {truncate(transaction)}</span>
      </div>
      <div className="text-left text-md-center">
        <h5 className="mb-1">
          Transaction <span className="text-break">{transaction}</span>
        </h5>
      </div>
      {liveState.length > 0 && (
        <div>
          <div className="mb-4 text-muted text-left text-md-center">
            {liveState.length < 2500 && `Total ${liveState.length} tokens`}
            {liveState.length >= 2500 &&
              `Total more than ${liveState.length} tokens`}
          </div>
          <Gallery tokens={liveState} />
        </div>
      )}
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

export default Transaction
