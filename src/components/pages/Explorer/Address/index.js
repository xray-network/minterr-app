import React, { useState, useEffect, useRef } from "react"
import { InlineShareButtons } from "sharethis-reactjs"
import { useSelector } from "react-redux"
import { Helmet } from "react-helmet"
import { message } from "antd"
import store from "store"
import { Link } from "gatsby"
import * as style from "./style.module.scss"
import { processAsset, imageStringToCloudflare } from "@/utils/index"
import { SVGMinterr, SVGFavicon, SVGSun, SVGMoon } from "@/svg"
import Cardano from "../../../../services/cardano"

const query = (fingerpint) => `
  query blockByNumber {
    assets(
      where: {
        fingerprint: { _eq: "${fingerpint}" }
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

const Address = ({ block }) => {
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [isLight, setIsLight] = useState(
    store.get("app.settings.viewerLight") || false
  )
  const [loading, setLoading] = useState(true)
  const [loadingImg, setLoadingImg] = useState(true)
  const [found, setFound] = useState(false)
  const [assetInfo, setAssetInfo] = useState({})

  useEffect(() => {
    if (networkBlock !== 0) {
      Cardano.explorer
        .query({
          query: query(fingerprint),
        })
        .then((result) => {
          const asset =
            result?.data?.data?.assets.length && result?.data?.data?.assets[0]
          if (asset) {
            setAssetInfo(processAsset(asset))
            setFound(true)
          } else {
            setFound(false)
          }
          setLoading(false)
        })
    }
  }, [networkBlock])

  const onCopy = () => {
    message.success("Copied to clipboard")
  }

  const switchColor = () => {
    setIsLight(!isLight)
    store.set("app.settings.viewerLight", !isLight)
  }

  return (
    <div className="ray__block pt-3">
      {loading && (
        <div>
          <div className="text-center mb-5">
            <h1>Searching for a token...</h1>
            <p>Searching for a token with the fingerprint "{fingerprint}"</p>
          </div>
          <div className="text-center pt-4">
            <div
              className="spinner-border spinner-border-lg text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}
      {!loading && !found && (
        <div>
          <div className={style.preview}>
            <div className={style.previewInner}>
              <h1 className="mb-1">
                <span className={style.title}>Couldn't find token</span>
              </h1>
              <p className="text-muted mb-4">
                We couldn't locate the fingerprint "{fingerprint}"
              </p>
              <div className={style.pig}>
                <img
                  src="/resources/images/pig.svg"
                  title="Ray Piglet"
                  alt="Ray Piglet"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && found && <div>[address]</div>}
    </div>
  )
}

export default Address
