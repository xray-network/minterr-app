import React from "react"
import { useSelector } from "react-redux"
import { Link } from "gatsby"
import Confetti from "react-confetti"
import { SVGArrowForward } from "@/svg"
import * as style from "./style.module.scss"

const ConfettiBlock = ({ policyId }) => {
  const projectsData = useSelector((state) => state.settings.projectsData)

  const inProjects = !!projectsData.filter((item) => {
    return item.policies.filter((policy) => policy === policyId)[0] === policyId
  }).length

  return (
    <div>
      {inProjects && (
        <Link
          to="/top-nft-projects/"
          rel="noopener noreferrer"
          target="_blank"
          className={style.banner}
        >
          <div className={style.bannerInner}>
            <div className={style.bannerConfetti}>
              <Confetti width={1290} height={80} />
            </div>
            <div className={style.bannerText}>
              <span role="img" aria-label="">🔥</span>{' '}
              <strong>
                This project nominated in Top Projects! Vote for it{' '}
                <span className="ray__icon ray__icon--inline">
                  <SVGArrowForward />
                </span>
              </strong>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default ConfettiBlock
