import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { range } from "lodash"
import BlockLive from "@/components/pages/Explorer/BlockLive"

const Live = () => {
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [prevBlock, serPrevBlock] = useState()
  const [firstRun, setFirstRun] = useState(true)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (networkBlock !== 0 && networkBlock !== prevBlock) {
      const blocksToQuery = firstRun
        ? range(networkBlock - 4, networkBlock + 1).reverse() // query 5 blocks before from current
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
      <h1 className="mb-4 pt-3">
        Oh yes, there are so many NFTs!
        <br />
        Interplanetary file system is overloaded!{" "}
        <span role="img" aria-label="">
          💎
        </span>
      </h1>
      <div className="text-muted mb-5 pb-4 max-width-800">
        <p className="mb-0">
          The data is updated every minute and shows all found Native Tokens in
          new blocks. The pictures are downloaded directly from IPFS, so this
          may take some time.
        </p>
      </div>
      <div>
        {blocks.map((blockNumber) => {
          return (
            <BlockLive
              key={blockNumber}
              blockNumber={blockNumber}
              setLoadingOuter={setLoading}
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
            <div>Please wait for a while...</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Live
