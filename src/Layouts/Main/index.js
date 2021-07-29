import React from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import Menu from "@/components/shared/Menu"
import MegaMenu from "@/components/shared/MegaMenu"
import Footer from "@/components/shared/Footer"
import Cookies from "@/components/shared/Cookies"
import * as style from "./style.module.scss"

const MainLayout = ({ children }) => {
  const megaMenuVisible = useSelector((state) => state.settings.megaMenu)

  return (
    <div className={style.layout}>
      <Helmet titleTemplate="%s | Minterr" title="Mint Cardano Tokens">
        <link rel="preload" href="/resources/font/circular.css" as="style" />
        <link rel="stylesheet" href="/resources/font/circular.css" />
        <meta property="og:url" content="https://minterr.io" />
        <meta
          name="description"
          content="Mint NFT and Fungible Tokens in a few clicks with Minterr — Cardano minting tool and NFT explorer #1. Absolutely free of charge!"
        />
      </Helmet>
      <div>
        <Menu />
        {megaMenuVisible && <MegaMenu />}
        {children}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
      <Cookies />
    </div>
  )
}

export default MainLayout
