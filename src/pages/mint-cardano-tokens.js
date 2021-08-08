import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import MintingForm from "@/components/MintingForm"
import TransactionModal from "@/components/TransactionModal"

const PageIndex = () => {
  return (
    <MainLayout>
      <Helmet title="Mint Cardano NFT Tokens" />
      <MintingForm />
      <TransactionModal />
    </MainLayout>
  )
}

export default PageIndex
