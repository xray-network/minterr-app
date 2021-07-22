import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from '@/layouts/Main'

const ExplorerBlock = ({ params }) => {
  return (
    <MainLayout>
      <div className="ray__block">
        <Helmet title={`Cardano Transaction Explorer`} />
        <h1>Couldn't find transaction</h1>
        <p>We couldn't locate the transaction "{params.transaction}"</p>
      </div>
    </MainLayout>
  )
}

export default ExplorerBlock