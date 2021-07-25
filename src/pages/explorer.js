import React from "react"
import { Helmet } from "react-helmet"
import qs from "qs"
import Asset from "@/components/pages/Explorer/Asset"
import Block from "@/components/pages/Explorer/Block"
import MainLayout from "@/layouts/Main"

const Explorer = ({ location }) => {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  return (
    <MainLayout>
      {query.asset && (
        <>
          <Helmet title={`Asset ${query.asset}`} />
          <Asset fingerprint={query.asset} />
        </>
      )}
      {query.block && (
        <>
          <Helmet title={`Block ${query.block}`} />
          <Block block={query.block} />
        </>
      )}
      {query.transaction && (
        <>
          <Helmet title={`Transaction ${query.transaction}`} />
          {query.transaction}
        </>
      )}
      {query.address && (
        <>
          <Helmet title={`Address ${query.address}`} />
          {query.address}
        </>
      )}
      {query.policyID && (
        <>
          <Helmet title={`Policy ID ${query.policyID}`} />
          {query.policyID}
        </>
      )}
    </MainLayout>
  )
}

export default Explorer
