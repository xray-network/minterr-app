import React, { useState } from "react"
// import { formatDistance, subHours } from "date-fns"
// import * as style from "./style.module.scss"

const Top = () => {
  // const [projectsCount, setProjectsCount] = useState(52)
  // const [totalAdaVotes, setTotalAdaVotes] = useState(14231.125984)
  // const [updatedAt, setUpdatedAt] = useState(subHours(new Date(), 3))
  const [loading] = useState(true)

  return (
    <div className="ray__block pt-3">
      <h1 className="text-center mb-4">
        The highest quality Cardano projects are here!
        <br />
        Vote for your idols!{" "}
        <span role="img" aria-label="">
          💫
        </span>
      </h1>
      <h5 className="text-center">
        Vote by sending any amount of ADA to the project address to get it up on
        the list.
        <br />1 <span className="ray__ticker">ADA</span> = 10 points. Remember
        stranger, the higher a project is on the list, the more attention it
        gets!
      </h5>
      <div className="text-muted text-center mb-5 pb-4 max-width-800 ms-auto me-auto">
        {/* <p className="mb-2">A total of <strong className="text-nowrap">{totalAdaVotes}</strong> ADA votes were cast for <strong className="text-nowrap">{projectsCount}</strong> projects. The last vote was <strong className="text-nowrap">{formatDistance(updatedAt, new Date(), { addSuffix: true })}</strong>.</p> */}
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
      {loading && (
        <div className="text-center">
          <div
            className="spinner-border spinner-border-lg text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Top
