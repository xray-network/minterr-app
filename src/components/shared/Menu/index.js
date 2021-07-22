import React from "react"
import { Link } from "gatsby"
import * as style from "./style.module.scss"
import { SVGMinterr, SVGWallet, SVGAddCircled, SVGSun, SVGZap, SVGSearch } from "@/svg"

const Menu = () => {
  return (
    <div className="ray__block mb-4">
      <div className={style.menu}>
        <Link to="/" className={`${style.menuLogo} me-4`}>
          <SVGMinterr />
        </Link>
        <span className="text-muted d-sm-inline d-none">
          Cardano minting tool and NFT explorer #1
        </span>
        <span className="ms-auto me-3">
          <a
            href="https://raywallet.org"
            className="ant-btn ray__btn ray__btn--round"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pe-2">Ray Wallet</span>
            <span className="ray__icon">
              <SVGWallet />
            </span>
          </a>
        </span>
        <span role="button" tabIndex="0" className="cursor-pointer me-3">
          <span className="ray__icon ray__icon--22">
            <SVGSun />
          </span>
        </span>
        <span className={`${style.menuIcon} cursor-pointer`} />
      </div>
      <div className="ray__line" />
      <div className={style.Submenu}>
        <Link
          to="/"
          className={style.SubmenuLink}
          activeClassName={style.SubmenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGAddCircled />
          </span>
          <span>Mint Tokens</span>
        </Link>
        <Link
          to="/live/"
          className={style.SubmenuLink}
          activeClassName={style.SubmenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGZap />
          </span>
          <span>Live Feed</span>
        </Link>
        <Link
          to="/explorer/"
          className={style.SubmenuLink}
          activeClassName={style.SubmenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGSearch />
          </span>
          <span>Tokens Explorer</span>
        </Link>
      </div>
    </div>
  )
}

export default Menu