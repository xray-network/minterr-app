import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { processAsset, truncate } from "@/utils/index"
import Cardano from "@/services/cardano"
import Gallery from "@/components/Gallery"
import Confetti from "@/components/Confetti"

const query = (policyID) => `
  query blockByNumber {
    assets(
      where: {
        policyId: {
          _eq: "${policyID}"
        }
      }
    ) {
      assetName
      policyId
      fingerprint
      assetId
      tokenMints {
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
`

const BlockFetcher = ({ policyID }) => {
  const [liveState, setLiveState] = useState([])
  const [loading, setLoading] = useState(true)
  const [prevSearch, setPrevSearch] = useState()
  const init = useSelector((state) => state.settings.init)

  useEffect(() => {
    if (init && policyID !== prevSearch) {
      fetchData()
      setPrevSearch(policyID)
    }
    // eslint-disable-next-line
  }, [init, policyID])

  const fetchData = () => {
    setLiveState([])
    setLoading(true)
    Cardano.explorer
      .query({
        query: query(policyID),
      })
      .then((result) => {
        processPolicy(result?.data?.data?.assets || [])
      })
  }

  const processPolicy = (assets) => {
    const result = assets.map((asset) => processAsset(asset))
    setLoading(false)
    setLiveState(result)
  }

  return (
    <div className="mb-5">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <Link to="/explorer/">Explorer</Link>
        <i>/</i>
        <span>Policy ID {truncate(policyID)}</span>
      </div>
      <Confetti policyId={policyID} />
      <div className="text-left text-md-center">
        <h5 className="mb-1">
          Policy ID <span className="text-break">{policyID}</span>
        </h5>
      </div>
      {liveState.length > 0 && (
        <div>
          <div className="mb-4 text-muted text-left text-md-center">
            {liveState.length < 2500 && `Total ${liveState.length} token(s)`}
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

export default BlockFetcher
