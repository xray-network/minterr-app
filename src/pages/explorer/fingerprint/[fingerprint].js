import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from '@/layouts/Main'

const ExplorerBlock = ({ params }) => {
  return (
    <MainLayout>
      <div className="ray__block">
        <Helmet title={`Cardano Fingerprint Explorer`} />
        <h1>Couldn't find fingerprint</h1>
        <p>We couldn't locate the fingerprint "{params.fingerprint}"</p>
      </div>
    </MainLayout>
  )
}

export default ExplorerBlock