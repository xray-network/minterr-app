import React, { useState } from "react"
import { Link } from "gatsby"
import QRCode from "qrcode.react"
import { Tooltip, message, Popover } from "antd"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { SVGCopy } from "@/svg"
import * as style from "./style.module.scss"


const Top = ({ project, rank }) => {
  const [showAll, setShowAll] = useState(false)
  // const [loading] = useState(false)

  const onCopy = () => {
    message.success("Copied to clipboard")
  }

  const cutLink = (link) => {
    return link.replace("https://www.", "").replace("https://", "")
  }
  const formattedAddress = `${project.voteAddress.slice(0, 8)}...${project.voteAddress.slice(-12)}`
  const policies = showAll ? project.policies : [project.policies[0]]

  return (
    <div>
      <div className={style.project}>
        <div className={style.projectImage}>
          <span className={style.projectImageCount}>#{rank}</span>
          <Link to={`/explorer/search/?policyID=${project.policies[0]}`}>
            <img src={`https://raw.githubusercontent.com/ray-network/cardano-verified/main/nft/example/${project.policies[0]}.png`} alt={project.name} />
          </Link>
        </div>
        <div className={style.projectInfo}>
          <div className={style.projectVote}>
            <div>
              <span className={style.projectVoteLabel}>
                <span className="me-2 text-muted">Voting Address</span>
                <Popover
                  content={<QRCode value={project.voteAddress} size="50" />}
                >
                  <span className="link">QR Code</span>
                </Popover>
              </span>{" "}
              <CopyToClipboard text={project.voteAddress} onCopy={onCopy}>
                <Tooltip title="Copy to clipboard">
                  <span
                    className={`${style.projectVoteAddress} cursor-pointer`}
                  >
                    <span className="me-2">{formattedAddress}</span>
                    <span className="ray__icon ray__icon--inline">
                      <SVGCopy />
                    </span>
                  </span>
                </Tooltip>
              </CopyToClipboard>
            </div>
            <div className="d-flex align-items-center">
              {project.votes && (
                <div>
                  <span className={style.projectVoteLabel}>
                    <span className="text-muted">Votes</span>
                  </span>{" "}
                  <span className={style.projectVoteAddress}>
                    {project.votes}
                  </span>
                </div>
              )}
              {!project.votes && (
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
          </div>
          <h2 className="mb-2">{project.name}</h2>
          <div className="mb-2 text-muted">{project.description}</div>
          <div className="mb-2">
            <span className="me-2">
              {/* <span className="ray__icon ray__icon--inline">
                <SVGHome />
              </span>{" "} */}
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {cutLink(project.url)}
              </a>{" "}
            </span>
            <span className="me-2">
              {/* <span className="ray__icon ray__icon--inline">
                <SVGTwitter />
              </span>{" "} */}
              <a
                href={project.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cutLink(project.twitter)}
              </a>
            </span>
          </div>
          <div>
            <span className={`${style.projectLabel} me-2 text-muted`}>
              Explore Policies ({project.policies.length})
            </span>
            {project.policies.length > 1 && (
              <span
                className="link"
                onClick={() => setShowAll(!showAll)}
                onKeyPress={() => setShowAll(!showAll)}
                role="button"
                tabIndex="0"
              >
                {!showAll && <span>Show All</span>}
                {showAll && <span>Hide</span>}
              </span>
            )}
          </div>
          <div className="mb-2">
            {policies.map((policy) => {
              return (
                <div key={policy}>
                  <Link
                    to={`/explorer/search/?policyID=${policy}`}
                    className="link--dashed text-break"
                  >
                    {policy}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Top
