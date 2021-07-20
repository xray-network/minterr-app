import React from "react"
import style from "./style.module.scss"
import { Link } from "gatsby"

export default () => {
  return (
    <div className="ray__block">
      <div className={style.error}>
        <div className="row">
          <div className="col-lg-6">
            <div className={style.pig}>
              <img src="/resources/images/pig.svg" title="Ray Piglet" alt="Ray Piglet" />
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
              <div className={style.links}>
                <Link className="mr-4 ray__link" to="/">
                  Homepage
                </Link>
                <Link className="mr-4 ray__link" to="/live/">
                  Live
                </Link>
                <Link className="mr-4 ray__link" to="/explorer/">
                  Asset Explorer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
