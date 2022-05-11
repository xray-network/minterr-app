import React, { useState, useEffect, useRef } from "react"
import { Tooltip } from "antd"
import { SVGFavicon } from "@/svg"
import handleViewport from "react-in-viewport"
import {
  imageStringToCloudflare,
  fetchImageBlob,
  drawOnCanvas,
} from "@/utils/index"
import * as style from "./style.module.scss"

const Image = ({ nft, minted, assetName, inViewport, forwardedRef }) => {
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState()
  const [observed, setObserved] = useState(false)
  const [crashed, setCrashed] = useState(false)
  const [type, setType] = useState()
  const url = imageStringToCloudflare(nft?.image)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (inViewport && !observed) {
      setObserved(true)
      fetchImageBlob(url)
        .then((blob) => {
          setLoading(false)
          setImage(true)
          setType(blob.type)
          drawOnCanvas(canvasRef, blob.url)
        })
        .catch(() => {
          setLoading(false)
          setCrashed(true)
        })
    }
  }, [inViewport, url, observed])

  const isUnableToLoad = crashed && url
  const isWrongImageScheme = !url && nft
  const isNotNft = !nft
  const isLoading = url && loading
  const isSuccess = image && !loading

  return (
    <div
      className={`${style.image}`}
      ref={forwardedRef}
    >
      {type === "image/gif" && <span className={style.type}>GIF</span>}
      {minted && <span className={style.minted}>Minted!</span>}
      {/* IMAGE CAN'T BE LOADED */}
      {isUnableToLoad && (
        <div className={style.placeholder}>
          <span className="ray__icon ray__icon--32">
            <SVGFavicon />
          </span>
          <Tooltip
            title={
              <div className="text-center">
                Pass the captcha on the following link. If you see an image, you don't need to take any action, just surf the NFT!
              </div>
            }
          >
            <a
              href={`${url}?v=${Math.random()}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              role="button"
              tabIndex="0"
            >
              Unable to load?
            </a>
          </Tooltip>
        </div>
      )}
      {/* WRONG IMAGE SCHEME */}
      {isWrongImageScheme && (
        <div className={style.placeholder}>
          <span className="ray__icon ray__icon--32">
            <SVGFavicon />
          </span>
          <span>Image Not Found</span>
        </div>
      )}
      {/* REGULAR TOKEN */}
      {isNotNft && (
        <div className={style.placeholder}>
          <span className="ray__icon ray__icon--32">
            <SVGFavicon />
          </span>
          <span>Fungible Token</span>
        </div>
      )}
      {/* LOADING */}
      {isLoading && (
        <div className={style.loading}>
          <div
            className="spinner-border spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {/* IMAGE LOADED */}
      {isSuccess && !isUnableToLoad && <canvas ref={canvasRef} />}
    </div>
  )
}
export default handleViewport(Image)
