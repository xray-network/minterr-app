import React from "react"
import { Link } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import SearchInputHeader from "@/components/pages/SearchInputHeader"
import {
  SVGMinterr,
  SVGWallet,
  SVGAddCircled,
  SVGSun,
  SVGMoon,
  SVGZap,
  SVGSearch,
  SVGTrophy,
} from "@/svg"
import * as style from "./style.module.scss"

const Menu = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.settings.theme)

  const changeTheme = () => {
    dispatch({
      type: 'settings/CHANGE_THEME',
      theme: theme === 'default' ? 'dark' : 'default',
    })
  }

  const switchMegaMenu = () => {
    dispatch({
      type: 'settings/SWITCH_MEGA_MENU',
    })
  }

  return (
    <div className="ray__block mb-3">
      <div className={style.menu}>
        <Link to="/" className={`${style.menuLogo} me-4`}>
          <SVGMinterr />
        </Link>
        <span className="flex-grow-1 d-none d-sm-inline pe-2 pe-md-4">
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
        <span
          className={`cursor-pointer me-3 ms-auto ms-sm-0 ${style.menuSwitch}`}
          onClick={changeTheme}
          onKeyPress={changeTheme}
          role="button"
          tabIndex="0"
        >
          <span className={theme === 'default' ? '' : 'd-none'}>
            <span className="ray__icon">
              <SVGSun />
            </span>
          </span>
          <span className={theme !== 'default' ? '' : 'd-none'}>
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
          aria-label="Open Menu"
        />
      </div>
      <div className="ray__line" />
      <div className={style.submenu}>
        <Link
          to="/"
          className={style.submenuLink}
          activeClassName={style.submenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGSearch />
          </span>
          <span className={style.submenuLinkWidth}>
            <span>Tokens Explorer</span>
            <span>Tokens Explorer</span>
          </span>
        </Link>
        <Link
          to="/mint-cardano-tokens/"
          className={style.submenuLink}
          activeClassName={style.submenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGAddCircled />
          </span>
          <span className={style.submenuLinkWidth}>
            <span>Mint Tokens</span>
            <span>Mint Tokens</span>
          </span>
        </Link>
        <Link
          to="/live/"
          className={style.submenuLink}
          activeClassName={style.submenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGZap />
          </span>
          <span className={style.submenuLinkWidth}>
            <span>Live Feed</span>
            <span>Live Feed</span>
          </span>
        </Link>
        <Link
          to="/top-nft-projects/"
          className={style.submenuLink}
          activeClassName={style.submenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGTrophy />
          </span>
          <span className={style.submenuLinkWidth}>
            <span>Top Projects</span>
            <span>Top Projects</span>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Menu
