import React, { useState, useEffect, useRef } from 'react'
import { SVGFavicon } from "@/svg"
import handleViewport from 'react-in-viewport'
import { imageStringToCloudflare, fetchImageBlob, drawOnCanvas } from '@/utils/index'
import * as style from "./style.module.scss"

const Image = ({ nft, assetName, inViewport, forwardedRef }) => {
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState()
  const [observed, setObserved] = useState(false)
  const [crashed, setCrashed] = useState(false)
  const [, setType] = useState()
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
        .catch((error) => {
          setLoading(false)
          setCrashed(true)
        })
    }
  }, [inViewport, url, observed])


  // useEffect(() => {
  //   if (inViewport && url) {
  //     const img = document.createElement('img')
  //     img.onload((e) => {

  //       const canvas = document.createElement('canvas')
  //       const max_size = 200
  //       let width = img.width
  //       let height = img.height

  //       if (width > height) {
  //         if (width > max_size) {
  //           height *= max_size / width;
  //           width = max_size;
  //         }
  //       } else {
  //         if (height > max_size) {
  //           width *= max_size / height;
  //           height = max_size;
  //         }
  //       }

  //       canvas.width = width
  //       canvas.height = height
  //       canvas.getContext('2d').drawImage(image, 0, 0, width, height)
  //       const data = canvas.toDataURL('image/jpeg')

  //       setLoading(false)
  //       setImage(data)
  // }, [inViewport, url])

  return (
    <div className={style.image} ref={forwardedRef}>
      {/* IMAGE CAN'T BE LOADED */}
      {(crashed && url) && (
        <span className="ray__icon ray__icon--32">
          Crash
        </span>
      )}
      {/* WRONG IMAGE SCHEME */}
      {(!url && nft) && (
        <span className="ray__icon ray__icon--32">
          <SVGFavicon />
        </span>
      )}
      {/* REGULAR TOKEN */}
      {(!nft) && (
        <span className="ray__icon ray__icon--32">
          Asset
        </span>
      )}
      {/* LOADING */}
      {(url && loading) && (
        <div className={style.loading}>
          <div className="spinner-border spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {/* IMAGE LOADED */}
      {(image && !loading) && (
        <canvas ref={canvasRef} />
      )}
    </div>
  )
}
export default handleViewport(Image)