import React from "react"
import { Link } from "gatsby"

const Explorer = () => {
  return (
    <div className="ray__block">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <span>Cardano NFT Explorer</span>
      </div>
      <div className="ray__left">
        <h2 className="mb-0">
          Explorer: Cardano Native Tokens{" "}
          <span role="img" aria-label="">
            👀
          </span>
        </h2>
        <span className="text-muted">Total 0 tokens</span>
      </div>
    </div>
  )
}

export default Explorer
