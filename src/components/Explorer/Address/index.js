import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { processAsset, truncate } from "@/utils/index"
import Cardano from "@/services/cardano"
import Gallery from "@/components/Gallery"

const query = (address, networkBlock) => `
  query paymentAddressSummary {
    paymentAddresses(
      addresses: ["${address}"]
    ) {
      summary(atBlock: ${networkBlock}) {
        assetBalances {
          quantity
          asset {
            assetName
            policyId
            fingerprint
            assetId
            tokenMints {
              quantity
              transaction {
                hash
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

const Address = ({ address }) => {
  const [liveState, setLiveState] = useState([])
  const [loading, setLoading] = useState(true)
  const [prevSearch, setPrevSearch] = useState()
  const [totalAda, setTotalAda] = useState(0)
  const init = useSelector((state) => state.settings.init)
  const networkBlock = useSelector((state) => state.settings.networkBlock)

  useEffect(() => {
    if (init && address !== prevSearch && networkBlock !== 0) {
      fetchData()
      setPrevSearch(address)
    }
    // eslint-disable-next-line
  }, [init, address, networkBlock])

  const fetchData = () => {
    setLiveState([])
    setLoading(true)
    Cardano.explorer
      .query({
        query: query(address, networkBlock),
      })
      .then((result) => {
        processAddresses(result?.data?.data?.paymentAddresses || [])
      })
  }

  const processAddresses = (addresses) => {
    const result = []
    let ada = 0
    addresses.forEach((address) => {
      address?.summary?.assetBalances.forEach((token) => {
        if (token.asset.assetId === 'ada') {
          ada = (parseInt(token.quantity, 10) / 1e6).toFixed(6)
          return
        }
        result.push(processAsset(token.asset))
      })
    })
    const updatedLiveState = [...liveState]

    setLoading(false)
    updatedLiveState.push(...result)
    setLiveState(updatedLiveState)
    setTotalAda(ada)
  }

  return (
    <div className="mb-5">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <Link to="/explorer/">Explorer</Link>
        <i>/</i>
        <span>Address {truncate(address)}</span>
      </div>
      <div className="text-left text-md-center">
        <h5 className="mb-1">
          Address <span className="text-break">{address}</span>
        </h5>
      </div>
      {liveState.length > 0 && (
        <div>
          <div className="mb-4 text-muted text-left text-md-center">
            Total: {totalAda} <span className="ray__ticker">ADA</span>
            {", "}
            {liveState.length < 2500 && `${liveState.length} tokens`}
            {liveState.length >= 2500 && `more than ${liveState.length} tokens`}
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

export default Address
