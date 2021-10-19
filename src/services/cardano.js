import CardanoWeb3 from "../cardano-web3-browser"
import { notification } from "antd"
import store from "store"

const network = store.get("app.settings.network")

const Cardano = new CardanoWeb3({
  crypto: {
    network: network === "testnet" ? "testnet" : "mainnet",
  },
  explorer: {
    url:
      network === "testnet"
        ? "https://api-testnet-graphql.raynet.work"
        : "https://api-mainnet-graphql.raynet.work",
    responseHandler: (response) => {
      const { data } = response
      if (data.errors) {
        data.errors.forEach(() => {
          notification.warning({
            message: "Something went wrong :(",
            description:
              "Please try to update your wallet data or reload the app",
          })
        })
        return false
      }
      return response
    },
    errorHandler: () => {
      notification.warning({
        message: "Something went wrong :(",
      })
    },
  },
})

export default Cardano
