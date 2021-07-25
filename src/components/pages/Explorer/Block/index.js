import React from "react"
import BlockFetcher from "@/components/pages/Fetchers/Block"

const Block = ({ block }) => {
  return (
    <div className="ray__block pt-3">
      <BlockFetcher blockNumber={block} />
    </div>
  )
}

export default Block
