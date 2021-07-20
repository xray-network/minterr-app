import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from '@/layouts/Main'
// import Live from '@/components/pages/Live'
import Soon from '@/components/shared/Soon'

export default () => {
  return (
    <MainLayout>
      <Helmet title="Cardano NFT Live Feed" />
      {/* <Live /> */}
      <Soon />
    </MainLayout>
  )
}
