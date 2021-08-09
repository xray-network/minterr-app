import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { Checkbox } from "antd"
import { range } from "lodash"
import BlockLive from "@/components/Explorer/BlockLive"

const Live = () => {
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [prevBlock, serPrevBlock] = useState()
  const [firstRun, setFirstRun] = useState(true)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEmpty, setShowEmpty] = useState(false)

  useEffect(() => {
    if (networkBlock !== 0 && networkBlock !== prevBlock) {
      const blocksToQuery = firstRun
        ? range(networkBlock - 9, networkBlock + 1).reverse() // query 5 blocks before from current
        : prevBlock
          ? generateBlocksToQuery()
          : [networkBlock]
      setBlocks([...blocksToQuery, ...blocks])
      serPrevBlock(networkBlock)
      setFirstRun(false)
    }
    // eslint-disable-next-line
  }, [networkBlock])

  const generateBlocksToQuery = () => {
    const diff = networkBlock - prevBlock
    return range(networkBlock + 1 - diff, networkBlock + 1).reverse()
  }

  return (
    <div className="ray__block">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <span>Cardano NFT Live Feed Explorer</span>
      </div>
      <div className="ray__left mb-5">
        <h2 className="mb-4">
          Live Feed: Interplanetary file system is overloaded!{" "}
          <span role="img" aria-label="">
            💎
          </span>
        </h2>
        <p className="text-muted">
          The data is updated every minute and shows all found Native Tokens in
          new blocks. The pictures are downloaded directly from IPFS, so this
          may take some time.
        </p>
        <Checkbox
          className="cursor-pointer"
          checked={showEmpty}
          onChange={(e) => setShowEmpty(e.target.checked)}
        >
          Show Empty Blocks
        </Checkbox>
      </div>
      <div>
        {blocks.map((blockNumber) => {
          return (
            <BlockLive
              key={blockNumber}
              blockNumber={blockNumber}
              setLoadingOuter={setLoading}
              showEmpty={showEmpty}
            />
          )
        })}
        {loading && (
          <div className="text-center">
            <div
              className="spinner-border spinner-border-lg text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="pt-3">Waiting for a block with tokens.</div>
            <div>Please wait a few minutes...</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Live
