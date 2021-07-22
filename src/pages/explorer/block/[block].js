import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from '@/layouts/Main'

const ExplorerBlock = ({ params }) => {
  return (
    <MainLayout>
      <div className="ray__block">
        <Helmet title={`Cardano Block ${params.block} Explorer`} />
        <h1>Couldn't find block</h1>
        <p>We couldn't locate the block "{params.block}"</p>
      </div>
    </MainLayout>
  )
}

export default ExplorerBlock