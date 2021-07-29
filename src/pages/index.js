import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import Explorer from "@/components/pages/Explorer"

const PageExplorer = () => {
  return (
    <MainLayout>
      <Helmet title="Mint Cardano Tokens & Explore Assets" />
      <Explorer />
    </MainLayout>
  )
}

export default PageExplorer
