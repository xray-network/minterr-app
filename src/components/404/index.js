import React from "react"
import { Link } from "gatsby"
import * as style from "./style.module.scss"

const Page404 = () => {
  return (
    <div className="ray__block">
      <div className={style.error}>
        <div className="row">
          <div className="col-lg-6">
            <div className={style.pig}>
              <img
                src="/resources/images/pig.svg"
                title="Ray Piglet"
                alt="Ray Piglet"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className={style.description}>
              <h1 className={style.title}>Page not found</h1>
              <p className="mb-4">
                This page is broken or the page has been moved.
                <br />
                Try these pages instead:
              </p>
              <div>
                <Link className="me-4 ray__link" to="/">
                  Tokens Explorer
                </Link>
                <Link className="me-4 ray__link" to="/mint-cardano-tokens/">
                  Mint Tokens
                </Link>
                <Link className="me-4 ray__link" to="/top-nft-projects/">
                  Top Projects
                </Link>
                <Link className="me-4 ray__link" to="/live/">
                  Live Feed
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page404
