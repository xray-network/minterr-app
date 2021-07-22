export const imageStringToCloudflare = (i) => {
  if (!(typeof i === 'string')) {
    return false
  }
  if (i.startsWith('ipfs://ipfs/')) {
    return `https://cloudflare-ipfs.com/ipfs/${i.replace('ipfs://ipfs/', '')}`
  }
  if (i.startsWith('ipfs://')) {
    return `https://cloudflare-ipfs.com/ipfs/${i.replace('ipfs://', '')}`
  }
  if (i.startsWith('https://') || i.startsWith('http://')) {
    return i
  }
  if (i) {
    return `https://cloudflare-ipfs.com/ipfs/${i}`
  }
  return false
}

export const drawOnCanvas = (canvasRef, blob) => {
  const canvas = canvasRef.current
  const scale = 6
  const img = new Image()
  const ctx = canvas.getContext('2d')
  img.onload = function () {
    const width = img.width / scale
    const height = img.height / scale
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
  }
  img.src = blob
}

export const validUrl = (url) => {
  return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(url);
}

export const fetchImageBlob = async (url) => {
  if (validUrl(url)) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        return {
          url: URL.createObjectURL(blob),
          type: blob.type,
        }
      })
      .catch(err => { })
  } else {
    return Promise.reject('URL is not valid')
  }
}