import React, { useState, useEffect } from "react"
import AliceCarousel from "react-alice-carousel"
import { useSelector } from "react-redux"
import { Link, navigate } from "gatsby"
import { Button } from "antd"
import Cardano from "@/services/cardano"
import SerchInput from "@/components/SearchInput"
import * as style from "./style.module.scss"

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
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
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
            epochs:
              result?.data?.data?.epochs_aggregate?.aggregate?.count - 1 || 0,
            mints:
              result?.data?.data?.tokenMints_aggregate?.aggregate?.count || 0,
          })
        })
    }
  }, [networkBlock])

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/ray-network/cardano-verified/main/nft/list.json')
      .then(response => response.json())
      .then(projectsData => {
        setProjects(projectsData?.data || [])
        setLoadingProjects(false)
      })
    // eslint-disable-next-line
  }, [])

  let isDragging

  return (
    <div className="ray__block pt-3">
      <div className={style.block}>
        <div className={style.slider}>
          {loadingProjects && (
            <div
              className="spinner-border spinner-border-lg text-primary mt-5"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {!loadingProjects && (
            <>
              <Link to="/top-nft-projects/" className={style.sliderLink}>Top Projects &rarr;</Link>
              <AliceCarousel
                autoHeight={false}
                infinite
                disableButtonsControls
                disableDotsControls
                autoPlay
                autoPlayInterval={3000}
                mouseTracking
                autoPlayStrategy="none"
                autoWidth
                paddingLeft={150}
                paddingRight={150}
              >
                {[...projects, ...projects].map((project, index) => (
                  <div
                    key={index}
                    className={style.sliderItem}
                    onDragStart={(e) => {
                      e.preventDefault();
                      isDragging = true
                    }}
                    onClickCapture={(e) => {
                      if (isDragging) {
                        isDragging = false
                        e.preventDefault()
                        return
                      }
                    }}
                    role="button"
                    tabIndex="0"
                  >
                    <Link to={`/explorer/search/?policyID=${project.policies[0]}`}>
                      <img src={`https://raw.githubusercontent.com/ray-network/cardano-verified/main/nft/example/${project.policies[0]}.png`} alt={project.name} />
                    </Link>
                  </div>
                ))}
              </AliceCarousel>
            </>
          )}
        </div>
        <h1 className="mb-5">
          Are you here to find NFT diamonds?
          <br />
          We've got something!{" "}
          <span role="img" aria-label="">
            🤘
          </span>
        </h1>
        <div className="max-width-800 mx-auto">
          <SerchInput />
        </div>
        <h1 className="pt-3 mb-5">Better yet, mint your NFT token!</h1>
        <div className="mb-5">
          <Button
            onClick={() => {
              navigate("/mint-cardano-tokens/")
            }}
            type="primary"
            className="d-inline-flex ray__btn ray__btn--inline ray__btn--orange ray__btn--round ray__btn--extra"
          >
            Mint a token!
          </Button>
        </div>
        <div className="text-muted mx-auto">
          <p className="mb-2">
            Current epoch is <strong>{stat.epochs}</strong>. During this time,{" "}
            <strong>{stat.assets}</strong> tokens have been minted{" "}
            <strong>{stat.mints}</strong> times in <strong>{networkBlock}</strong>{" "}
            blocks.
          </p>
          <p className="mb-0">
            Didn't find what you were looking for? Check out the{" "}
            <Link to="/top-nft-projects/">Top NFT Projects</Link>!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Explorer
