import React, { useState, useEffect } from "react"
import { InlineShareButtons } from "sharethis-reactjs"
import { useSelector } from "react-redux"
import { Helmet } from "react-helmet"
import { Tooltip } from "antd"
import { format as formatDate } from "date-fns"
import ReactJson from "react-json-view-ssr"
import Tilty from 'react-tilty'
import store from "store"
import { Link } from "gatsby"
import {
  processAsset,
  imageStringToCloudflare,
  randomHSL,
  validUrl,
} from "@/utils/index"
import { SVGFavicon, SVGSun, SVGMoon } from "@/svg"
import Confetti from "@/components/Confetti"
import Cardano from "@/services/cardano"
import { format, truncate } from "@/utils/index"
import * as style from "./style.module.scss"

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
  const theme = useSelector((state) => state.settings.theme)
  const [loading, setLoading] = useState(true)
  const [loadingImg, setLoadingImg] = useState(true)
  const [found, setFound] = useState(false)
  const [assetInfo, setAssetInfo] = useState({})
  const [selectedMint, setSelectedMint] = useState()
  const [isLight, setIsLight] = useState(
    store.get("app.settings.viewerLight") || false
  )
  const [disable3d, setDisable3d] = useState(
    store.get("app.settings.disable3d") || false
  )

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
  }, [networkBlock, fingerprint])

  const switch3d = () => {
    setDisable3d(!disable3d)
    store.set("app.settings.disable3d", !disable3d)
  }

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

  const imageName = assetInfo.metadataNft?.name || assetInfo.assetName
  const imageUrl = imageStringToCloudflare(assetInfo.metadataNft?.image)

  return (
    <div className="ray__block">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <Link to="/explorer/">Explorer</Link>
        <i>/</i>
        <span>Asset {truncate(fingerprint)}</span>
      </div>
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
          <Helmet title={imageName}>
            <meta
              property="og:title"
              content={`${imageName} — Cardano NFT Token`}
            />
            <meta property="og:image" content={imageUrl} />
          </Helmet>
          <Confetti policyId={assetInfo.policyId} />
          <Tilty className={`${style.tilt} ${disable3d && style.tiltDisabled}`} reverse={true} max={25}>
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
              <div
                className={style.tilt3d}
                onClick={switch3d}
                onKeyPress={switch3d}
                role="button"
                tabIndex="0"
              >
                3D
              </div>
              <div className={style.previewInner}>
                <div className="px-5">
                  <h1 className="mb-1">
                    <span className={style.title}>{imageName}</span>
                  </h1>
                  <div className="mb-3">
                    Quantity: <strong>{format(assetInfo.quantity || 0)}</strong> —{" "}
                    <span className="text-break">{fingerprint}</span>
                    <div>
                      Policy ID{" "}
                      <Link
                        to={`/explorer/search/?policyID=${assetInfo.policyId}`}
                        className="link--dashed text-break"
                      >
                        {assetInfo.policyId}
                      </Link>
                    </div>
                  </div>
                </div>
                {assetInfo.metadataNft?.image && (
                  <div className="pt-4">
                    {/* <div className={style.by}>
                    {assetInfo.minterr && "Minted & Explored by "}
                    {!assetInfo.minterr && "Explored by "}
                    <SVGMinterr />
                  </div> */}
                    <div className={style.image}>
                      <img
                        className={`${style.tiltInner} ${loadingImg ? "visually-hidden" : ""}`}
                        ref={(input) => {
                          if (!input) {
                            return
                          }
                          input.onload = () => {
                            setLoadingImg(false)
                          }
                        }}
                        alt={imageName}
                        src={imageUrl}
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
                            Loading...
                            <br />
                            <Tooltip
                              title={
                                <div className="text-center">
                                  Pass the captcha on the following link. If you see an image, you don't need to take any action, just surf the NFT!
                                </div>
                              }
                            >
                              <a
                                href={`${imageUrl}?v=${Math.random()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Unable to load?
                              </a>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                    </div>
                    {metadataNftTransformed.length > 0 && (
                      <div
                        className={`${style.shortMetadata} text-break max-width-700 ms-auto mt-5 me-auto`}
                      >
                        {metadataNftTransformed.map((item, index) => {
                          const [key, value] = item
                          const stopWords = ["image", "Image", "name", "Name"]
                          if (stopWords.includes(key)) {
                            return <span key={index} />
                          } else if (validUrl(value)) {
                            return (
                              <span style={{ color: randomHSL() }} key={index}>
                                <span className="text-capitalize">{key}</span>:{" "}
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {value}
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
                              <span style={{ color: randomHSL() }} key={index}>
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
                            <span style={{ color: randomHSL() }} key={index}>
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
          </Tilty>
          <div>
            <div className="mb-5">
              <InlineShareButtons
                config={{
                  enabled: true,
                  alignment: "center",
                  min_count: 0,
                  image: imageUrl,
                  title: `${imageName} — Cardano NFT Token`,
                  show_total: true,
                  networks: [
                    "twitter",
                    "telegram",
                    "discord",
                    "facebook",
                    "reddit",
                    "sharethis",
                  ],
                }}
              />
            </div>
            <div className={style.mints}>
              <div className="text-center">
                <h5 className="mb-4">Mints Metadata Viewer</h5>
                <div>
                  {assetInfo.tokenMints.map((mint) => {
                    const { hash, includedAt } = mint.transaction
                    return (
                      <span
                        key={hash}
                        className={`${style.viewerLink} ${hash === selectedMint ? style.viewerLinkActive : ""
                          }`}
                        onClick={() => setSelectedMint(hash)}
                        onKeyPress={() => setSelectedMint(hash)}
                        role="button"
                        tabIndex="0"
                      >
                        {formatDate(new Date(includedAt), "yyyy-MM-dd HH:mm:ss")}
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
                      theme={theme === 'default' ? 'rjv-default' : 'railscasts'}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Asset
