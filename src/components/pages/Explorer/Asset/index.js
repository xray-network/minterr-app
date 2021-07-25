import React, { useState, useEffect } from "react"
import { InlineShareButtons } from "sharethis-reactjs"
import { useSelector } from "react-redux"
import { Helmet } from "react-helmet"
import { Tooltip } from "antd"
import { format } from "date-fns"
import ReactJson from "react-json-view-ssr"
import store from "store"
import { Link } from "gatsby"
import * as style from "./style.module.scss"
import {
  processAsset,
  imageStringToCloudflare,
  randomHSL,
  validUrl,
} from "@/utils/index"
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
      tokenMints (order_by: { transaction: { includedAt: asc } }) {
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

const Asset = ({ fingerprint }) => {
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [isLight, setIsLight] = useState(
    store.get("app.settings.viewerLight") || false
  )
  const [loading, setLoading] = useState(true)
  const [loadingImg, setLoadingImg] = useState(true)
  const [found, setFound] = useState(false)
  const [assetInfo, setAssetInfo] = useState({})
  const [selectedMint, setSelectedMint] = useState()

  useEffect(() => {
    if (networkBlock !== 0 && !found) {
      Cardano.explorer
        .query({
          query: query(fingerprint),
        })
        .then((result) => {
          const asset =
            result?.data?.data?.assets.length && result?.data?.data?.assets[0]
          if (asset) {
            console.log(result)
            console.log(processAsset(asset))

            setAssetInfo(processAsset(asset))
            setFound(true)
          } else {
            setFound(false)
          }
          setLoading(false)
        })
    }
  }, [networkBlock, fingerprint, found])

  const switchColor = () => {
    setIsLight(!isLight)
    store.set("app.settings.viewerLight", !isLight)
  }

  const metadataNftTransformed =
    assetInfo?.metadataNft &&
    Object.keys(assetInfo?.metadataNft).map((key) => {
      const value = assetInfo.metadataNft[key]
      if (key === "image") return [key, imageStringToCloudflare(value)]
      return [key, value]
    })

  return (
    <div className="ray__block pt-3">
      {loading && (
        <div>
          <div className="text-center mb-5">
            <h1>Searching for an asset...</h1>
            <p>Searching for an asset with the fingerprint "{fingerprint}"</p>
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
                <span className={style.title}>Couldn't find asset</span>
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
      {!loading && found && (
        <div>
          <div
            className={`${style.preview} ${isLight ? style.previewLight : ""}`}
          >
            <div
              className={style.switchTheme}
              onClick={switchColor}
              onKeyPress={switchColor}
              role="button"
              tabIndex="0"
            >
              {isLight && <SVGSun />}
              {!isLight && <SVGMoon />}
            </div>
            <div className={style.previewInner}>
              <div className="px-5">
                <h1 className="mb-1">
                  <span className={style.title}>
                    {assetInfo.metadataNft?.name || assetInfo.assetName}
                  </span>
                </h1>
                <p className="text-muted mb-3">
                  Quantity: <strong>{assetInfo.quantity || 0}</strong> —{" "}
                  <span className="text-break">{fingerprint}</span>
                </p>
              </div>
              {assetInfo.metadataNft?.image && (
                <div>
                  <div className={style.by}>
                    {assetInfo.minterr && "Minted by "}
                    {!assetInfo.minterr && "Explored by "}
                    <SVGMinterr />
                  </div>
                  <div className={style.image}>
                    <img
                      className={loadingImg ? "visually-hidden" : ""}
                      ref={(input) => {
                        if (!input) {
                          return
                        }
                        input.onload = () => {
                          setLoadingImg(false)
                        }
                      }}
                      alt={assetInfo.metadataNft?.name || assetInfo.assetName}
                      src={imageStringToCloudflare(
                        assetInfo.metadataNft?.image
                      )}
                    />
                    {loadingImg && (
                      <div className="text-center mt-3 pt-5 pb-5">
                        <div
                          className="spinner-border spinner-border-lg text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-3">
                          Image not loading?
                          <br />
                          <Tooltip
                            title={
                              <div className="text-center">
                                If you see Ray Diamond on the following link,
                                you don't need to take any action, just surf
                                NFTs!
                              </div>
                            }
                          >
                            <a
                              href="https://cloudflare-ipfs.com/ipfs/QmaYWWWmrUJkWiKAaHRiYwLaSCNGT8he4ZpuQd5TddvRVJ"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Pass the captcha!
                            </a>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </div>
                  {metadataNftTransformed.length > 0 && (
                    <div
                      className={`${style.shortMetadata} text-break max-width-800 ms-auto mt-5 me-auto`}
                    >
                      {metadataNftTransformed.map((item, index) => {
                        const [key, value] = item
                        const stopWords = ["image", "Image", "name", "Name"]
                        if (stopWords.includes(key)) {
                          return ""
                        } else if (validUrl(value)) {
                          return (
                            <span style={{ color: randomHSL() }}>
                              <span className="text-capitalize">{key}</span>:{" "}
                              <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Link
                              </a>
                              {metadataNftTransformed.length === index + 1
                                ? ""
                                : ", "}
                            </span>
                          )
                        } else if (
                          typeof value === "string" ||
                          typeof value === "number"
                        ) {
                          return (
                            <span style={{ color: randomHSL() }}>
                              <span className="text-capitalize text-break">
                                {key}
                              </span>
                              : {value}
                              {metadataNftTransformed.length === index + 1
                                ? ""
                                : ", "}
                            </span>
                          )
                        }
                        return (
                          <span style={{ color: randomHSL() }}>
                            <span className="text-capitalize text-break">
                              {key}
                            </span>
                            : [...]
                            {metadataNftTransformed.length === index + 1
                              ? ""
                              : ", "}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
              {!assetInfo.metadataNft && (
                <div className={style.notFound}>
                  <SVGFavicon />
                  <div>Fungible Token</div>
                </div>
              )}
              {assetInfo.metadataNft && !assetInfo.metadataNft.image && (
                <div className={style.notFound}>
                  <SVGFavicon />
                  <div>Image Not Found</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="text-center mb-4">
              <h5 className="mb-2">View all assets under this Policy ID</h5>
              <Link
                to={`/explorer?policyID=${assetInfo.policyId}`}
                className="link--dashed text-break"
              >
                {assetInfo.policyId}
              </Link>
            </div>
            <div className="mb-5">
              <Helmet>
                <meta
                  property="og:title"
                  content={`${
                    assetInfo.metadataNft?.name || assetInfo.assetName
                  } — Cardano NFT Token`}
                />
                <meta
                  property="og:image"
                  content={imageStringToCloudflare(
                    assetInfo.metadataNft?.image
                  )}
                />
              </Helmet>
              <InlineShareButtons
                config={{
                  enabled: true,
                  alignment: "center",
                  min_count: 0,
                  show_total: true,
                  networks: [
                    "twitter",
                    "telegram",
                    "discord",
                    "facebook",
                    "reddit",
                    "other",
                  ],
                }}
              />
            </div>
            <div className="text-center">
              <h5 className="mb-4">Mints Metadata Viewer</h5>
              <div>
                {assetInfo.tokenMints.map((mint) => {
                  const { hash, includedAt } = mint.transaction
                  return (
                    <span
                      key={hash}
                      className={`${style.viewerLink} ${
                        hash === selectedMint ? style.viewerLinkActive : ""
                      }`}
                      onClick={() => setSelectedMint(hash)}
                      onKeyPress={() => setSelectedMint(hash)}
                      role="button"
                      tabIndex="0"
                    >
                      {format(new Date(includedAt), "yyyy-MM-dd HH:mm:ss")}
                    </span>
                  )
                })}
              </div>
              {selectedMint && (
                <div className={`${style.viewer} mt-3`}>
                  <ReactJson
                    src={
                      assetInfo.tokenMints.filter(
                        (mint) => mint.transaction.hash === selectedMint
                      )[0]
                    }
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    name={false}
                    // theme="brewer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Asset
