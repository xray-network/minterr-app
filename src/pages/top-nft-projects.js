import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Top from "@/components/Top"

const PageLive = () => {
  return (
    <MainLayout>
      <Helmet title="Cardano Top 20 NFT Projects" />
      <Top />
    </MainLayout>
  )
}

export default PageLive
