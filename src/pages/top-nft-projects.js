import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Top from "@/components/pages/Top"

const PageLive = () => {
  return (
    <MainLayout>
      <Helmet title="Cardano Top 10 NFT Projects" />
      <Top />
    </MainLayout>
  )
}

export default PageLive
