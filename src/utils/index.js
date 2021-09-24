import React from "react"

export const truncate = (x) => {
  return x ? `${x.substring(0, 8)}...${x.slice(-8)}` : ""
}

export const format = (x, precision = 0) => {
  return precision
    ? parseInt(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parseFloat(x) - parseInt(x))
      .toFixed(precision)
      .toString()
      .replace("0.", ".")
    : parseInt(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatValue = (value, postfix = "") => {
  return (
    <span>
      {value || "—"}
      {value && postfix ? postfix : ""}
    </span>
  )
}

export const randomHSL = () => {
  return `hsla(${~~(360 * Math.random())},70%,70%,1)`
}

export const imageStringToCloudflare = (i) => {
  // const provider = "https://ipfs.blockfrost.dev/ipfs/"
  // const provider = 'https://cloudflare-ipfs.com/ipfs/'
  const provider = "https://infura-ipfs.io/ipfs/"

  if (!(typeof i === "string")) {
    return ""
  }
  if (i.startsWith("ipfs://ipfs/")) {
    return `${provider}${i.replace("ipfs://ipfs/", "")}`
  }
  if (i.startsWith("ipfs://")) {
    return `${provider}${i.replace("ipfs://", "")}`
  }
  if (i.startsWith("https://") || i.startsWith("http://")) {
    return i
  }
  if (i) {
    return `${provider}${i}`
  }
  return ""
}

export const drawOnCanvas = (canvasRef, blob) => {
  const canvas = canvasRef.current
  const scale = 6
  const img = new Image()
  const ctx = canvas.getContext("2d")
  img.onload = function () {
    const width = img.width / scale
    const height = img.height / scale
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
  }
  img.src = blob
}

export const validUrl = (value) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  )
}

export const fetchImageBlob = async (url) => {
  if (validUrl(url)) {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        return {
          url: URL.createObjectURL(blob),
          type: blob.type,
        }
      })
      .catch((err) => { })
  } else {
    return Promise.reject("URL is not valid")
  }
}

export const process721Metadata = (metadata, policyId, assetName) => {
  if (metadata) {
    const pickedBy721 = metadata.filter((item) => item.key === "721")[0]
    if (pickedBy721) {
      const { value } = pickedBy721
      const pickedByPolicy = value[policyId]
      if (pickedByPolicy) {
        const pickedByName = pickedByPolicy[assetName]
        if (pickedByName) {
          return pickedByName
        }
      } else {
        return value
      }
    }
  }
  return undefined
}

export const processAsset = (asset) => {
  if (asset) {
    const assetName = Buffer.from(asset.assetName, "hex").toString()
    const metadataRaw = asset.tokenMints[0]?.transaction?.metadata
    const metadataNft = process721Metadata(
      metadataRaw,
      asset.policyId,
      assetName
    )
    const minterr = metadataNft
      ? metadataNft.publisher === "https://minterr.io"
      : false
    let quantity = 0
    asset.tokenMints.forEach((mint) => {
      quantity = quantity + parseInt(mint.quantity, 10)
    })
    return {
      assetName,
      assetId: asset.assetId,
      policyId: asset.policyId,
      fingerprint: asset.fingerprint,
      tokenMints: asset.tokenMints,
      quantity,
      minterr,
      metadataNft,
    }
  }
  return undefined
}
