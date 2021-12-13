import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Input, Tooltip } from "antd"
import store from "store"
import {
  SVGRay,
  SVGCardano,
  SVGWallet,
  SVGTwitter,
  SVGAtSign,
  SVGChrome,
  SVGApple,
  SVGCategory,
  SVGAndroid,
  SVGInternet,
} from "@/svg"
import * as style from "./style.module.scss"

const Footer = () => {
  const networkSlot = useSelector((state) => state.settings.networkSlot)
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [network, setNetwork] = useState(
    store.get("app.settings.network") || "mainnet"
  )

  const switchNetwork = () => {
    const nextNetwork = network === "mainnet" ? "testnet" : "mainnet"
    store.set("app.settings.network", nextNetwork)
    setNetwork(nextNetwork)
    window.location.reload()
  }

  return (
    <div className="ray__block mb-0">
      <div className="mb-5">
        <div className={style.footerTop}>
          <div className="ray__line mb-5" />
          <div className="row">
            <div className="col-12 col-sm-8 mb-3">
              <div className={`${style.footerLists} row`}>
                <div className="col-6 col-sm-4 ">
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
                      <a href="https://rayswap.io" className="text-muted">
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
                        href="https://raygraph.io"
                        className="text-muted"
                      >
                        RayGraph
                      </a>
                    </li>
                    <li>
                      <a href="https://raydata.io" className="text-muted">
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
                        href="https://cardanolist.io"
                        className="text-muted"
                      >
                        Cardano List
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-6 col-sm-4">
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
                      <a href="https://raynetwork.io/wiki/" className="text-muted">
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
                      <a href="https://docs.raynetwork.io/" className="text-muted">
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
                <div className="col-12 col-sm-4">
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
            <div className="col-12 col-sm-4">
              <div className="row">
                <div className="col-6 col-sm-12">
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
                <div className="col-6 col-sm-12">
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
              <div className="mb-3">
                <h6 className="mb-0">Newsletters</h6>
              </div>
              <div className="mb-4">
                <Input.Search
                  placeholder="Enter your email"
                  allowClear
                  enterButton="Subscribe"
                  size="large"
                  onSearch={() => { }}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <a
              className={style.footerRay}
              href="https://raynetwork.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <SVGRay />
              <span>Ray Network</span>
            </a>
          </div>
          <p className="mb-2 text-muted">
            Advanced Ecosystem for Cardano Blockchain Platform.{" "}
            <span>
              <span>Powered with</span>{" "}
              <a
                href="https://cardano.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={style.footerCardano}>
                  <SVGCardano />
                </span>
                <strong>Cardano</strong>
              </a>
            </span>
          </p>
          <p className="mb-2 text-muted">
            <span className="me-2 text-capitalize">
              Cardano {network} Status: Block {networkBlock}, Slot {networkSlot}
            </span>
            <span
              className="link"
              onClick={switchNetwork}
              onKeyPress={switchNetwork}
              role="button"
              tabIndex="0"
            >
              Switch to {network === "mainnet" ? "Testnet" : "Mainnet"}
            </span>
            {network === "testnet" && (
              <span className={style.footerTestnet}>Testnet</span>
            )}
            {network === "testnet" && (
              <a
                href="https://developers.cardano.org/en/testnets/cardano/tools/faucet/"
                target="_blank"
                rel="noopener noreferrer"
                className={style.footerFaucet}
              >
                tADA Faucet
              </a>
            )}
          </p>
          <p className="mb-0 text-muted">
            {new Date().getFullYear()} &copy; Ray Labs DAO
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
