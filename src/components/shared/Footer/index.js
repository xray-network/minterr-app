import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Input, Tooltip } from 'antd'
import store from 'store'
import { SVGRay, SVGCardano, SVGWallet, SVGTwitter, SVGAtSign, SVGChrome, SVGApple, SVGCategory, SVGAndroid, SVGInternet } from "@/svg"
import * as style from "./style.module.scss"

const Footer = () => {
  const networkSlot = useSelector((state) => state.settings.networkSlot)
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [network, setNetwork] = useState(store.get('app.settings.network') || 'mainnet')

  const switchNetwork = () => {
    const nextNetwork = network === 'mainnet' ? 'testnet' : 'mainnet'
    store.set('app.settings.network', nextNetwork)
    setNetwork(nextNetwork)
    window.location.reload()
  }

  return (
    <div className="ray__block mb-0">
      <div className="mb-5">
        <div className="ray__line mb-5" />
        <div className={style.top}>
          <div className="row">
            <div className="col-12 col-sm-8 mb-3">
              <div className="row">
                <div className="col-4">
                  <div className="d-flex mb-4">
                    <span className="ray__icon me-2">
                      <SVGWallet />
                    </span>
                    <strong>Solutions</strong>
                  </div>
                  <ul className="list-unstyled">
                    <li><a href="https://rraayy.com/ray-wallet/" className="text-muted">Ray Wallet</a></li>
                    <li><a href="https://rraayy.com/stake/" className="text-muted">Ray Stake</a></li>
                    <li><a href="https://rraayy.com/rewards/" className="text-muted">Ray Rewards</a></li>
                    <li><a href="https://rraayy.com/swap/" className="text-muted">Ray Swap</a></li>
                    <li><a href="https://rraayy.com/kickstart/" className="text-muted">Ray Kickstart</a></li>
                    <li><a href="https://rraayy.com/nft-marketplace/" className="text-muted">Ray NFT</a></li>
                    <li><a href="https://rraayy.com/graph/" className="text-muted">Ray Graph</a></li>
                    <li><a href="https://rraayy.com/data/" className="text-muted">Ray Data</a></li>
                    <li><a href="https://minterr.org/" className="text-muted">Minterr</a></li>
                    <li><a href="https://rraayy.com/cardano-web3/" className="text-muted">CardanoWeb3.js</a></li>
                    <li><a href="https://rraayy.com/tokens-list/" className="text-muted">Tokens List</a></li>
                  </ul>
                </div>
                <div className="col-4">
                  <div className="d-flex mb-4">
                    <span className="ray__icon me-2">
                      <SVGAtSign />
                    </span>
                    <strong>Information</strong>
                  </div>
                  <ul className="list-unstyled">
                    <li><a href="https://rraayy.com/xray-token/" className="text-muted">XRAY Token</a></li>
                    <li><a href="https://rraayy.com/updates/" className="text-muted">Roadmap & Updates</a></li>
                    <li><a href="https://rraayy.com/wiki/" className="text-muted">Wiki</a></li>
                    <li><a href="https://status.rraayy.com/" className="text-muted">Status</a></li>
                    <li><a href="https://rraayy.com/about/" className="text-muted">About</a></li>
                    <li><a href="https://rraayy.com/whitepaper/" className="text-muted">Whitepaper</a></li>
                    <li><a href="https://docs.rraayy.com/" className="text-muted">Docs</a></li>
                    <li><a href="https://rraayy.com/audit/" className="text-muted">Audit</a></li>
                    <li><a href="https://rraayy.com/terms-of-use/" className="text-muted">Terms of Use</a></li>
                  </ul>
                </div>
                <div className="col-4">
                  <div className="d-flex mb-4">
                    <span className="ray__icon me-2">
                      <SVGTwitter />
                    </span>
                    <strong>Minterr</strong>
                  </div>
                  <ul className="list-unstyled mb-5">
                    <li><a href="https://twitter.com/MinterrNFT" className="text-muted">Twitter</a></li>
                    <li><a href="https://discord.gg/dDVXcthYWn" className="text-muted">Discord</a></li>
                  </ul>
                  <div className="d-flex mb-4">
                    <span className="ray__icon me-2">
                      <SVGTwitter />
                    </span>
                    <strong>Ray Network</strong>
                  </div>
                  <ul className="list-unstyled">
                    <li><a href="https://twitter.com/RayWallet" className="text-muted">Twitter</a></li>
                    <li><a href="https://t.me/RayWalletCommunity" className="text-muted">Telegram Chat</a></li>
                    <li><a href="https://t.me/RayWallet" className="text-muted">Telegram</a></li>
                    <li><a href="https://discord.gg/WhZmm46APN" className="text-muted">Discord</a></li>
                    <li><a href="https://www.reddit.com/r/RayWallet" className="text-muted">Reddit</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="row">
                <div className="col-6 col-sm-12">
                  <div className="mb-3">
                    <strong>Ray Wallet Apps</strong>
                  </div>
                  <div className="mb-4">
                    <div>
                      <Tooltip title="Web Version">
                        <a href="https://raywallet.org/" className={style.app}>
                          <span className="ray__icon ray__icon--22">
                            <SVGInternet />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Chrome Extension">
                        <a href="https://rraayy.com/ray-wallet/" className={style.app}>
                          <span className="ray__icon ray__icon--22">
                            <SVGChrome />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="macOS App">
                        <a href="https://rraayy.com/ray-wallet/" className={style.app}>
                          <span className="ray__icon ray__icon--22">
                            <SVGApple />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Windows App">
                        <a href="https://rraayy.com/ray-wallet/" className={style.app}>
                          <span className="ray__icon ray__icon--22">
                            <SVGCategory />
                          </span>
                        </a>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="iOS App">
                        <a href="https://rraayy.com/ray-wallet/" className={style.app}>
                          <span className="ray__icon ray__icon--22">
                            <SVGApple />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Android App">
                        <a href="https://rraayy.com/ray-wallet/" className={style.app}>
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
                    <strong>Ray Stake Apps</strong>
                  </div>
                  <div className="mb-4">
                    <div>
                      <Tooltip title="Web Version">
                        <a href="https://rraayy.com/stake/" className={style.app}>
                          <span className="ray__icon ray__icon--22">
                            <SVGInternet />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="iOS App">
                        <a href="https://rraayy.com/stake/" className={style.app}>
                          <span className="ray__icon ray__icon--22">
                            <SVGApple />
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip title="Android App">
                        <a href="https://rraayy.com/stake/" className={style.app}>
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
                <strong>Newsletters</strong>
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
        <div className={style.bottom}>
          <div className="mb-2">
            <a
              className={style.ray}
              href="https://rraayy.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <SVGRay />
              <span>Ray Network</span>
            </a>
          </div>
          <p className="mb-2 text-muted">
            Advanced Ecosystem for Cardano Blockchain Platform.{' '}
            <span>
              <span>Powered with</span>{' '}
              <a
                href="https://cardano.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={style.cardano}>
                  <SVGCardano />
                </span>
                <strong>Cardano</strong>
              </a>
            </span>
          </p>
          <p className="mb-2 text-muted">
            <span className="me-2 text-capitalize">Cardano {network} Status: Block {networkBlock}, Slot {networkSlot}</span>
            <span
              className="link"
              onClick={switchNetwork}
              onKeyPress={switchNetwork}
              role="button"
              tabIndex="0"
            >
              Switch to {network === 'mainnet' ? 'Testnet' : 'Mainnet'}
            </span>
          </p>
          <p className="mb-0 text-muted">{new Date().getFullYear()} &copy; Ray Labs DAO</p>
        </div>
      </div>
    </div>
  )
}

export default Footer