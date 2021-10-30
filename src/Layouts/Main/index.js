import React from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import Menu from "@/components/Menu"
import MegaMenu from "@/components/MegaMenu"
import Footer from "@/components/Footer"
import Cookies from "@/components/Cookies"
import * as style from "./style.module.scss"

const MainLayout = ({ children }) => {
  const megaMenuVisible = useSelector((state) => state.settings.megaMenu)

  return (
    <div className={style.layout}>
      <Helmet titleTemplate="%s | Minterr" title="Mint Cardano Tokens">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
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
