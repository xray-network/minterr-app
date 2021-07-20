import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from '@/layouts/Main'
// import Explorer from '@/components/pages/Explorer'
import Soon from '@/components/shared/Soon'

export default () => {
  return (
    <MainLayout>
      <Helmet title="Cardano Asset Explorer" />
      {/* <Explorer /> */}
      <Soon />
    </MainLayout>
  )
}
