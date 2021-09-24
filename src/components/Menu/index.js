import React from "react"
import { Link } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import SearchInputHeader from "@/components/SearchInputHeader"
import {
  SVGMinterr,
  SVGAddCircled,
  SVGSun,
  SVGMoon,
  SVGZap,
  SVGSearch,
  SVGTrophy,
  SVGHome,
} from "@/svg"
import * as style from "./style.module.scss"

const Menu = () => {
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
    <div className="ray__block mb-3">
      <div className={style.menu}>
        <div className="row">
          <div className="col-4 d-flex align-items-center">
            <Link to="/" className={`${style.menuLogo} me-3`}>
              <SVGMinterr />
            </Link>
            <div className={`d-none text-muted d-md-inline ${style.menuLogoDescr}`}>
              Cardano NFT Explorer & Minter
              <br />
              by Ray Network
            </div>
          </div>
          <div className="col-4 d-flex align-items-center">
            <span className="flex-grow-1 d-none d-sm-inline">
              <SearchInputHeader />
            </span>
          </div>
          <div className="col-4 d-flex align-items-center">
            <span className="ms-auto me-3 d-none d-sm-inline">
              <Link
                to="/mint-cardano-tokens/"
                className="ant-btn ray__btn ray__btn--orange ray__btn--round"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="pe-2">Mint Token</span>
                <span className="ray__icon">
                  <SVGZap />
                </span>
              </Link>
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
              aria-label="Open Menu"
            />
          </div>
        </div>
      </div>
      <div className="ray__line" />
      <div className={style.submenu}>
        <Link
          to="/"
          className={style.submenuLink}
          activeClassName={style.submenuLinkActive}
        >
          <span className="ray__icon me-2">
            <SVGHome />
          </span>
          <span className={style.submenuLinkWidth}>
            <span>Home</span>
            <span>Home</span>
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
          to="/explorer/"
          className={style.submenuLink}
          activeClassName={style.submenuLinkActive}
          partiallyActive={true}
        >
          <span className="ray__icon me-2">
            <SVGSearch />
          </span>
          <span className={style.submenuLinkWidth}>
            <span>Explorer</span>
            <span>Explorer</span>
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
