import store from "store"
import actions from "./actions"

const STORED_SETTINGS = (storedSettings) => {
  const settings = {}
  const skip = ["modalEncrypt"]
  Object.keys(storedSettings).forEach((key) => {
    if (skip.includes(key)) {
      return
    }
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== "undefined" ? item : storedSettings[key]
  })
  return settings
}

const initialState = {
  ...STORED_SETTINGS({
    theme: "default",
    cookiesViewed: false,
    mnemonic: "",
  }),
  storeSession: true,
  init: false,
  networkInfo: {},
  networkSlot: 0,
  networkBlock: 0,
  accountKeys: {},
  address: "",
  policyId: "",
  script: "",
  addressState: {},
  addressStateLoading: false,
  transaction: "",
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
