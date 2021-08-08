import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Live from "@/components/Live"

const PageLive = () => {
  return (
    <MainLayout>
      <Helmet title="Cardano NFT Live Feed" />
      <Live />
    </MainLayout>
  )
}

export default PageLive
