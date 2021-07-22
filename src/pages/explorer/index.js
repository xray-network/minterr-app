import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from '@/layouts/Main'
// import Explorer from '@/components/pages/Explorer'
import Soon from '@/components/shared/Soon'

const PageExplorer = () => {
  return (
    <MainLayout>
      <Helmet title="Cardano NFT Asset Explorer" />
      {/* <Explorer /> */}
      <Soon />
    </MainLayout>
  )
}

export default PageExplorer