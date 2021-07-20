import React from "react"
import { Helmet } from "react-helmet"
import Menu from '@/components/shared/Menu'
import Footer from '@/components/shared/Footer'
import Cookies from '@/components/shared/Cookies'
import * as style from "./style.module.scss"

const MainLayout = ({ children }) => {
  return (
    <div className={style.layout}>
      <Helmet titleTemplate="%s | Minterr" title="Mint Cardano Tokens">
        <meta property="og:url" content="https://minterr.org" />
        <meta
          name="description"
          content="Mint Non-Fungible and Fungible Tokens in a few clicks with Minterr, Cardano minting tool and NFT explorer #1"
        />
      </Helmet>
      <Cookies />
      <div>
        <Menu />
        {children}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout