import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from '@/layouts/Main'

const ExplorerBlock = ({ params }) => {
  return (
    <MainLayout>
      <div className="ray__block">
        <Helmet title={`Cardano Policy ID Explorer`} />
        <h1>Couldn't find policyId</h1>
        <p>We couldn't locate the policyId "{params.policyId}"</p>
      </div>
    </MainLayout>
  )
}

export default ExplorerBlock