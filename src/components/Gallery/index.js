import React, { useState } from "react"
import { Link } from "gatsby"
import { Button } from "antd"
import Image from "./image"
import { format } from "@/utils/index"
import * as style from "./style.module.scss"

const Gallery = ({ tokens }) => {
  const diff = 16
  const [count, setCount] = useState(diff)

  return (
    <div>
      <div className={style.container}>
        {tokens.slice(0, count).map((token) => {
          return (
            <Link
              to={`/explorer/search/?asset=${token.fingerprint}`}
              className={style.nft}
              key={token.fingerprint}
            >
              <Image
                nft={token.metadataNft}
                minted={token.minted}
                assetName={token.assetName}
              />
              <div className={style.name}>
                <strong>{token.assetName}</strong>{" "}
                <span className="text-muted">({format(token.quantity)})</span>
              </div>
            </Link>
          )
        })}
      </div>
      {count < tokens.length && (
        <div className="mt-3 pb-2 text-center">
          <Button type="primary" className="ray__btn--round px-5" onClick={() => setCount(count + diff)}>
            {tokens.length - count >= diff && (
              <strong>Show next {diff} asset(s)</strong>
            )}
            {tokens.length - count < diff && (
              <strong>Show last {tokens.length - count} asset(s)</strong>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Gallery
