import React from "react"
import { Link } from "gatsby"
import SearchInputHeader from '@/components/pages/SearchInputHeader'
import {
  SVGMinterr,
  SVGWallet,
  SVGAddCircled,
  SVGSun,
  SVGZap,
  SVGSearch,
  SVGTrophy,
} from "@/svg"
import * as style from "./style.module.scss"

const Menu = () => {
  return (
    <div className="ray__block mb-3">
      <div className={style.menu}>
        <Link to="/" className={`${style.menuLogo} me-4`}>
          <SVGMinterr />
        </Link>
        <span className="flex-grow-1 pe-2 pe-md-4">
          <SearchInputHeader />
        </span>
        <span className="ms-auto me-3 d-none d-sm-inline">
          <a
            href="https://raywallet.io"
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
        <span role="button" tabIndex="0" className={`cursor-pointer me-3 ms-auto ms-sm-0 ${style.menuSwitch}`}>
          <span className="ray__icon">
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
            <SVGSearch />
          </span>
          <span className={style.SubmenuLinkWidth}>
            <span>Tokens Explorer</span>
            <span>Tokens Explorer</span>
          </span>
        </Link>
        <Link
          to="/mint-cardano-tokens/"
          className={style.SubmenuLink}
          activeClassName={style.SubmenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGAddCircled />
          </span>
          <span className={style.SubmenuLinkWidth}>
            <span>Mint Tokens</span>
            <span>Mint Tokens</span>
          </span>
        </Link>
        <Link
          to="/live/"
          className={style.SubmenuLink}
          activeClassName={style.SubmenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGZap />
          </span>
          <span className={style.SubmenuLinkWidth}>
            <span>Live Feed</span>
            <span>Live Feed</span>
          </span>
        </Link>
        <Link
          to="/top-nft-projects/"
          className={style.SubmenuLink}
          activeClassName={style.SubmenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGTrophy />
          </span>
          <span className={style.SubmenuLinkWidth}>
            <span>Top Projects</span>
            <span>Top Projects</span>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Menu
