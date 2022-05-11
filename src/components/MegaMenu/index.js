import React from "react"
import { Link } from "gatsby"
import { Tooltip } from "antd"
import { useDispatch, useSelector } from "react-redux"
import {
  SVGRay,
  SVGWallet,
  SVGCardano,
  SVGSun,
  SVGMoon,
  SVGTwitter,
  SVGAtSign,
  SVGChrome,
  SVGApple,
  SVGCategory,
  SVGAndroid,
  SVGInternet,
} from "@/svg"
import * as style from "./style.module.scss"
import imgWallet1 from "./wallet1.png"
import imgWallet2 from "./wallet2.png"

const MegaMenu = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.settings.theme)

  const changeTheme = () => {
    dispatch({
      type: "settings/CHANGE_THEME",
      theme: theme === "default" ? "dark" : "default",
    })
  }

  const switchMegaMenu = () => {
    dispatch({
      type: "settings/SWITCH_MEGA_MENU",
    })
  }

  return (
    <div className={style.fixed}>
      <div className="ray__block mb-3">
        <div className={style.menu}>
          <Link to="/" className={`${style.menuLogo} me-4`}>
            <SVGRay />
            <span>Ray Network</span>
          </Link>
          <span className="flex-grow-1 d-none d-sm-inline pe-2 pe-md-4">
            Powered with{" "}
            <span className={style.menuCardano}>
              <SVGCardano />
            </span>{" "}
            Cardano
          </span>
          <span className="ms-auto me-3 d-none d-sm-inline">
            <a
              href="https://raywallet.io"
              className="ant-btn ray__btn ray__btn--round"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="pe-2">RayWallet</span>
              <span className="ray__icon">
                <SVGWallet />
              </span>
            </a>
          </span>
          <span
            className={`cursor-pointer me-3 ms-auto ms-sm-0 ${style.menuSwitch}`}
            onClick={changeTheme}
            onKeyPress={changeTheme}
            role="button"
            tabIndex="0"
          >
            <span className={theme === "default" ? "" : "d-none"}>
              <span className="ray__icon">
                <SVGSun />
              </span>
            </span>
            <span className={theme !== "default" ? "" : "d-none"}>
              <span className="ray__icon">
                <SVGMoon />
              </span>
            </span>
          </span>
          <span
            className={`${style.menuIcon} cursor-pointer`}
            onClick={switchMegaMenu}
            onKeyPress={switchMegaMenu}
            role="button"
            tabIndex="0"
            aria-label="Close Menu"
          />
        </div>
        <div className="ray__line" />
      </div>
      <div className="ray__block pt-3 mb-0">
        <div className="mb-5">
          <div>
            <div className="row">
              <div className="col-12 col-sm-8 mb-3">
                <div className={`${style.footerLists} row`}>
                  <div
                    className="col-6 col-sm-4"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <div className="d-flex mb-4">
                      <span className="ray__icon me-2 mb-1 mb-sm-0">
                        <SVGWallet />
                      </span>
                      <h6 className="mb-0">Cardano Solutions</h6>
                    </div>
                    <ul className="list-unstyled mb-4">
                      <li>
                        <a
                          href="https://raywallet.io"
                          className="text-muted"
                        >
                          RayWallet
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raystake.io"
                          className="text-muted"
                        >
                          RayStake
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://rayswap.io"
                          className="text-muted"
                        >
                          RaySwap
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raypad.io"
                          className="text-muted"
                        >
                          RayPad
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://minterr.io"
                          className="text-muted"
                        >
                          Minterr
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/graph/"
                          className="text-muted"
                        >
                          RayGraph
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/data/"
                          className="text-muted"
                        >
                          RayData
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/ray-network/cardano-web3.js"
                          className="text-muted"
                        >
                          CardanoWeb3.js
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/cardano-list/"
                          className="text-muted"
                        >
                          Cardano List
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="col-6 col-sm-4"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <div className="d-flex mb-4">
                      <span className="ray__icon me-2 mb-1 mb-sm-0">
                        <SVGAtSign />
                      </span>
                      <h6 className="mb-0">Information</h6>
                    </div>
                    <ul className="list-unstyled mb-5">
                      <li>
                        <a
                          href="https://raynetwork.io/xray/"
                          className="text-muted"
                        >
                          XRAY Token
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/xdiamond/"
                          className="text-muted"
                        >
                          XDIAMOND
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/roadmap/"
                          className="text-muted"
                        >
                          Roadmap & Updates
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/wiki/"
                          className="text-muted"
                        >
                          Wiki
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://status.raynetwork.io/"
                          className="text-muted"
                        >
                          Status
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/about/"
                          className="text-muted"
                        >
                          About
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/whitepaper/"
                          className="text-muted"
                        >
                          Whitepaper
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://docs.raynetwork.io/"
                          className="text-muted"
                        >
                          Docs
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/audit/"
                          className="text-muted"
                        >
                          Audit
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://raynetwork.io/terms-of-use/"
                          className="text-muted"
                        >
                          Terms of Use
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="col-12 col-sm-4"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    <div className="row">
                      <div className="col-6 col-sm-12">
                        <div className="d-flex mb-4">
                          <span className="ray__icon me-2 mb-1 mb-sm-0">
                            <SVGTwitter />
                          </span>
                          <h6 className="mb-0">Ray Network</h6>
                        </div>
                        <ul className="list-unstyled mb-5">
                          <li>
                            <a
                              href="https://twitter.com/RayNetwork"
                              className="text-muted"
                            >
                              Twitter
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://t.me/RayNetwork"
                              className="text-muted"
                            >
                              Telegram Chat
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://t.me/RayNetworkChannel"
                              className="text-muted"
                            >
                              Telegram
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://discord.gg/WhZmm46APN"
                              className="text-muted"
                            >
                              Discord
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.reddit.com/r/RayNetwork"
                              className="text-muted"
                            >
                              Reddit
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="col-6 col-sm-12">
                        <div className="d-flex mb-4">
                          <span className="ray__icon me-2 mb-1 mb-sm-0">
                            <SVGTwitter />
                          </span>
                          <h6 className="mb-0">Minterr.io</h6>
                        </div>
                        <ul className="list-unstyled mb-4">
                          <li>
                            <a
                              href="https://twitter.com/MinterrApp"
                              className="text-muted"
                            >
                              Twitter
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://discord.gg/dDVXcthYWn"
                              className="text-muted"
                            >
                              Discord
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" data-aos="fade-up" data-aos-delay="900">
            <div className="col-12 col-md-6">
              <div className="row">
                <div className="col-6 col-md-12">
                  <div className="mb-3">
                    <h6 className="mb-0">RayWallet Apps</h6>
                  </div>
                  <div className="mb-4">
                    <div>
                      <Tooltip title="Web Version">
                        <a
                          href="https://raywallet.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGInternet />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Chrome Extension">
                        <a
                          href="https://raywallet.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGChrome />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="macOS App">
                        <a
                          href="https://raywallet.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGApple />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Windows App">
                        <a
                          href="https://raywallet.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGCategory />
                          </span>
                        </a>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="iOS App">
                        <a
                          href="https://raywallet.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGApple />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Android App">
                        <a
                          href="https://raywallet.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGAndroid />
                          </span>
                        </a>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-12">
                  <div className="mb-3">
                    <h6 className="mb-0">RayStake Apps</h6>
                  </div>
                  <div className="mb-4">
                    <div>
                      <Tooltip title="Web Version">
                        <a
                          href="https://raystake.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGInternet />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="iOS App">
                        <a
                          href="https://raystake.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGApple />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Android App">
                        <a
                          href="https://raystake.io"
                          className={style.footerApp}
                        >
                          <span className="ray__icon ray__icon--22">
                            <SVGAndroid />
                          </span>
                        </a>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className={style.wallets}>
                <img src={imgWallet2} alt="RayWallet" />
                <img src={imgWallet1} alt="RayWallet" />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <p className="mb-2 text-muted">
              Advanced Ecosystem for Cardano Blockchain Platform
            </p>
            <p className="mb-0 text-muted">
              {new Date().getFullYear()} &copy; Ray Labs DAO
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
