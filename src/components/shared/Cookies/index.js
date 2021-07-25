import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as style from "./style.module.scss"

const Cookies = () => {
  const cookiesViewed = useSelector((state) => state.settings.cookiesViewed)
  const dispatch = useDispatch()

  const [cookiesAnimation, setCookiesAnimation] = useState(false)

  const setCookiesHidden = () => {
    dispatch({
      type: "settings/CHANGE_SETTING",
      payload: {
        setting: "cookiesViewed",
        value: true,
      },
    })
  }

  useEffect(() => {
    setTimeout(() => {
      setCookiesAnimation(true)
    }, 2000)
    // eslint-disable-next-line
  }, [])

  return (
    <div
      className={`${style.cookies} ${cookiesViewed && "d-none"} ${
        cookiesAnimation && style.cookiesAnimated
      }`}
    >
      <h5 className="mb-3">
        <strong>
          Our site uses cookies{" "}
          <span role="img" aria-label="">
            🍪
          </span>
        </strong>
      </h5>
      <p className={style.description}>
        Cookies can enable us to track and target the interests of our users to
        enhance the experience on our site, and for advertising purposes. Usage
        of a cookie is in no way linked to any personally identifiable
        information on our website.
      </p>
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault()
          setCookiesHidden(true)
        }}
        className="ray__button ray__button--small"
      >
        Got it
      </a>
    </div>
  )
}

export default Cookies
