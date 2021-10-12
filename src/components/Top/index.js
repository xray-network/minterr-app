import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import { InlineShareButtons } from "sharethis-reactjs"
import Project from "./project"
import Cardano from "@/services/cardano"
import * as style from "./style.module.scss"

const Top = () => {
  const [projects, setProjects] = useState([])
  const init = useSelector((state) => state.settings.init)

  useEffect(() => {
    fetchVotes()
    // eslint-disable-next-line
  }, [init])

  const fetchVotes = () => {
    fetch('https://raw.githubusercontent.com/ray-network/cardano-verified/main/nft/list.json')
      .then(response => response.json())
      .then(projectsData => {
        const voteAddresses = projectsData?.data?.map((item) => item.voteAddress) || []
        Cardano.explorer.query({
          query: `
            query paymentAddressSummary {
              paymentAddresses (addresses: ${JSON.stringify(voteAddresses)}) {
                address
                summary {
                  assetBalances {
                    quantity
                    asset {
                      assetId
                    }
                  }
                }
              }
            }
          `
          // TODO: change current balance to outputs history
          // query: `
          //   query tx {
          //     transactions(where: {
          //       outputs: { 
          //         address: {
          //           _eq: ""
          //         }
          //       }
          //     }) {
          //       hash
          //       block {
          //         number
          //       }
          //       outputs (where: {
          //         address: {
          //           _eq: ""
          //         }
          //       }) {
          //         address
          //         value
          //       }
          //     }
          //   }
          // `
        })
          .then((result) => {
            const paymentAddresses = result?.data?.data?.paymentAddresses || []
            const paymentAddressesResults = {}
            paymentAddresses.forEach((item) => {
              const ada = item.summary.assetBalances.filter((asset) => asset.asset.assetId === 'ada')[0] || {}
              paymentAddressesResults[item.address] = ada.quantity || 0
            })
            setProjects(
              projectsData?.data?.map((item) => {
                  return {
                    ...item,
                    votes: (parseInt(parseInt(paymentAddressesResults[item.voteAddress]) / 1000000 * 10)).toString(),
                  }
                })
                .sort((a, b) => b.votes - a.votes)
            )
          })
      })
  }

  return (
    <div className="ray__block">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <span>Cardano Top 20 NFT Projects</span>
      </div>
      <div className="ray__left mb-5">
        <h2 className="mb-4">
          The highest quality Cardano projects are here! Vote for your favorites!{" "}
          <span role="img" aria-label="">
            💫
          </span>
        </h2>
        <h5>
          Vote by sending any amount of ADA to the project address to get it up on
          the list. 1 <span className="ray__ticker">ADA</span> = 10 votes.
          Remember stranger, the higher a project is on the list, the more
          attention it gets!
        </h5>
        <p className="text-muted mb-0">
          Do you want to promote the NFT project? Send us a direct message on{" "}
          <a
            href="https://twitter.com/MinterrApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          .
        </p>
      </div>
      {projects.length < 1 && (
        <div className="text-center mb-5 pb-5">
          <div className="pt-5 mb-5">
            <h1>Observing...</h1>
          </div>
          <div className="pt-4">
            <div
              className="spinner-border spinner-border-lg text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}
      {projects.length > 0 && projects.map((item, index) => {
        return (
          <Project key={index} rank={index + 1} project={item} />
        )
      })}
      <div className={style.share}>
        <InlineShareButtons
          config={{
            enabled: true,
            alignment: "center",
            min_count: 0,
            title: `The best Cardano NFT projects are here!`,
            show_total: true,
            networks: [
              "twitter",
              "telegram",
              "discord",
              "facebook",
              "reddit",
              "sharethis",
            ],
          }}
        />
      </div>
    </div>
  )
}

export default Top
