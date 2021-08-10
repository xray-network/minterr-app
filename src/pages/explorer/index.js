import React from "react"
import { Helmet } from "react-helmet"
import qs from "qs"
import MainLayout from "@/layouts/Main"
import Explorer from "@/components/Explorer/Explorer"

const PageExplorer = ({ location }) => {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  return (
    <MainLayout>
      <Helmet title="Mint Cardano Tokens & Explore Assets" />
      <Explorer search={query.name} />
    </MainLayout>
  )
}

export default PageExplorer
