import React, { useState, useEffect, forwardRef } from "react"
import { InlineShareButtons } from "sharethis-reactjs"
import Project from "./project"
import FlipMove from "react-flip-move"
import * as style from "./style.module.scss"
import projectsData from "./ray-top-nft-projects.json"

const ProjectFlip = forwardRef(({ rank, project }, ref) => {
  return (
    <div ref={ref}>
      <Project rank={rank} project={project} />
    </div>
  )
})

const Top = () => {
  const [projects, setProjects] = useState(projectsData)

  useEffect(() => {
    fetchVotes()
    // eslint-disable-next-line
  }, [])

  const fetchVotes = () => {
    const voteAddresses = projects.map((item) => item.voteAddress)
    const voteResults = {}
    voteAddresses.forEach((item) => {
      voteResults[item] = (Math.random() * 10000).toFixed(0)
    })
    setTimeout(() => {
      setProjects(
        projects
          .map((item) => {
            return {
              ...item,
              votes: voteResults[item.voteAddress],
            }
          })
          .sort((a, b) => b.votes.localeCompare(a.votes))
      )
    }, 2000)
  }

  return (
    <div className="ray__block pt-3">
      <h1 className="mb-4">
        The highest quality Cardano projects are here! Vote for your favorites!{" "}
        <span role="img" aria-label="">
          💫
        </span>
      </h1>
      <h5>
        Vote by sending any amount of ADA to the project address to get it up on
        the list. 1 <span className="ray__ticker">ADA</span> = 10 points.
        Remember stranger, the higher a project is on the list, the more
        attention it gets!
      </h5>
      <div className="text-muted mb-5 pb-4 max-width-800">
        <p className="mb-0">
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
      <FlipMove>
        {projects.map((item, index) => {
          const id = item.policies[0]
          return <ProjectFlip key={id} rank={index + 1} project={item} />
        })}
      </FlipMove>
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
