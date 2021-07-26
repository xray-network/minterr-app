import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, navigate } from "gatsby"
import { Button } from "antd"
import Cardano from "../../../services/cardano"
import SerchInput from "@/components/pages/SearchInput"

const query = `
  query aggregate {
    assets_aggregate {
      aggregate {
        count
      }
    }
    tokenMints_aggregate {
      aggregate {
        count
      }
    }
    epochs_aggregate {
      aggregate {
        count
      }
    }
  }
`

const Explorer = () => {
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [stat, setStat] = useState({
    assets: 0,
    epochs: 0,
    mints: 0,
  })

  useEffect(() => {
    if (networkBlock !== 0) {
      Cardano.explorer
        .query({
          query,
        })
        .then((result) => {
          setStat({
            assets: result?.data?.data?.assets_aggregate?.aggregate?.count || 0,
            epochs: result?.data?.data?.epochs_aggregate?.aggregate?.count || 0,
            mints:
              result?.data?.data?.tokenMints_aggregate?.aggregate?.count || 0,
          })
        })
    }
  }, [networkBlock])

  return (
    <div className="ray__block pt-3">
      <h1 className="mb-5">
        Are you here to find NFT diamonds?
        <br />
        We've got something!{" "}
        <span role="img" aria-label="">
          🧐
        </span>
      </h1>
      <SerchInput />
      <h1 className="pt-3 mb-5">Better yet, mint your NFT token!</h1>
      <div className="mb-5">
        <Button
          onClick={() => {
            navigate("/mint-cardano-tokens/")
          }}
          type="primary"
          className="ray__btn--extra"
        >
          Mint a token!
        </Button>
      </div>
      <div className="text-muted mb-5 max-width-800">
        <p className="mb-2">
          Current epoch is <strong>{stat.epochs}</strong>. During this time,{" "}
          <strong>{stat.assets}</strong> tokens have been minted{" "}
          <strong>{stat.mints}</strong> times in <strong>{networkBlock}</strong>{" "}
          blocks.
        </p>
        <p>
          Didn't find what you were looking for? Check out the{" "}
          <Link to="/top-nft-projects/">Top NFT Projects</Link>!
        </p>
      </div>
    </div>
  )
}

export default Explorer
