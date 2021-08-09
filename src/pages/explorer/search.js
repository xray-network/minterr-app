import React from "react"
import { Helmet } from "react-helmet"
import qs from "qs"
import Asset from "@/components/Explorer/Asset"
import Block from "@/components/Explorer/Block"
import Transaction from "@/components/Explorer/Transaction"
import Address from "@/components/Explorer/Address"
import Policy from "@/components/Explorer/Policy"
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
          <div className="ray__block">
            <Block blockNumber={query.block} />
          </div>
        </>
      )}
      {query.transaction && (
        <>
          <Helmet title={`Transaction ${query.transaction}`} />
          <div className="ray__block">
            <Transaction transaction={query.transaction} />
          </div>
        </>
      )}
      {query.address && (
        <>
          <Helmet title={`Address ${query.address}`} />
          <div className="ray__block">
            <Address address={query.address} />
          </div>
        </>
      )}
      {query.policyID && (
        <>
          <Helmet title={`Policy ID ${query.policyID}`} />
          <div className="ray__block">
            <Policy policyID={query.policyID} />
          </div>
        </>
      )}
    </MainLayout>
  )
}

export default Explorer
