import React from 'react'
import Image from './image'
import * as style from "./style.module.scss"

const Gallery = ({ tokens }) => (
  <div className={style.container}>
    {tokens.map((token) => {
      return (
        <a
          href={`/explorer/asset/${token.fingerprint}`}
          target="_blank" rel="noopener noreferrer"
          className={style.nft}
          key={token.fingerprint}
        >
          <Image
            nft={token?.metadataNft}
            assetName={token.assetName}
          />
          <div className={style.name}>
            {token.assetName}
          </div>
        </a>
      )
    })}
  </div>
)
export default Gallery