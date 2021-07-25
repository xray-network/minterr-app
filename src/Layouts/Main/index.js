import React from "react"
import { Helmet } from "react-helmet"
import Menu from "@/components/shared/Menu"
import Footer from "@/components/shared/Footer"
import Cookies from "@/components/shared/Cookies"
import * as style from "./style.module.scss"

const MainLayout = ({ children }) => {
  return (
    <div className={style.layout}>
      <Helmet titleTemplate="%s | Minterr" title="Mint Cardano Tokens">
        <link rel="preload" href="/resources/font/circular.css" as="style" />
        <link rel="stylesheet" href="/resources/font/circular.css" />
        <meta property="og:url" content="https://minterr.io" />
        <meta
          name="description"
          content="Mint NFT and Fungible Tokens online in a few clicks with Minterr — Cardano minting tool and NFT explorer #1. Absolutely free of charge!"
        />
      </Helmet>
      <div>
        <Menu />
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
