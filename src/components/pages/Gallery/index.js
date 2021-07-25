import React from "react"
import { Link } from "gatsby"
import Image from "./image"
import * as style from "./style.module.scss"

const Gallery = ({ tokens }) => (
  <div className={style.container}>
    {tokens.map((token) => {
      return (
        <Link
          to={`/explorer/?asset=${token.fingerprint}`}
          className={style.nft}
          key={token.fingerprint}
        >
          <Image
            nft={token.metadataNft}
            minted={token.minted}
            assetName={token.assetName}
          />
          <div className={style.name}>{token.assetName}</div>
        </Link>
      )
    })}
  </div>
)
export default Gallery
