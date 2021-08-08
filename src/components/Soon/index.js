import React from "react"
import * as style from "./style.module.scss"

const Soon = () => {
  return (
    <div className="ray__block">
      <div className={style.error}>
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className={style.description}>
              <h1 className={style.title}>Soon</h1>
              <p className="mb-4">
                Our team is working tirelessly to make this page come alive
                soon!
              </p>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={style.pig}>
              <img
                src="/resources/images/pig.svg"
                title="Ray Piglet"
                alt="Ray Piglet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Soon
