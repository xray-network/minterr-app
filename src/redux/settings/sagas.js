import { all, takeEvery, put, call, select } from "redux-saga/effects"
import store from "store"
import actions from "./actions"
import Cardano from "../../services/cardano"

export function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield store.set(`app.settings.${setting}`, value)
  yield put({
    type: "settings/SET_STATE",
    payload: {
      [setting]: value,
    },
  })
}

export function* LOAD_APP({ mnemonic }) {
  const storeSession = yield select((state) => state.settings.storeSession)
  const accountKeys = yield Cardano.crypto.getAccountKeys(mnemonic)
  const [{ address }] = yield Cardano.crypto.getAccountAddresses(
    accountKeys.publicKey,
    1,
    [0]
  )

  const { policyId, script, scriptHash } = yield Cardano.crypto.generatePolicyForPubkey(
    accountKeys.publicKey
  )

  if (storeSession) {
    yield store.set("app.settings.mnemonic", mnemonic)
  }

  yield put({
    type: "settings/SET_STATE",
    payload: {
      mnemonic,
    },
  })
  yield put({
    type: "settings/SET_STATE",
    payload: {
      accountKeys,
    },
  })
  yield put({
    type: "settings/SET_STATE",
    payload: {
      address,
    },
  })
  yield put({
    type: "settings/SET_STATE",
    payload: {
      policyId,
    },
  })
  yield put({
    type: "settings/SET_STATE",
    payload: {
      script,
    },
  })
  yield put({
    type: "settings/SET_STATE",
    payload: {
      scriptHash,
    },
  })

  yield call(GET_BALANCE)
}

export function* FETCH_NETWORK_STATE() {
  const networkInfo = yield call(Cardano.explorer.getNetworkInfo)

  yield put({
    type: "settings/CHANGE_SETTING",
    payload: {
      setting: "networkBlock",
      value: networkInfo?.data?.data?.cardano?.tip?.number || 0,
    },
  })

  yield put({
    type: "settings/CHANGE_SETTING",
    payload: {
      setting: "networkSlot",
      value: networkInfo?.data?.data?.cardano?.tip?.slotNo || 0,
    },
  })
}

export function* GET_BALANCE() {
  const addressStateLoading = yield select(
    (state) => state.settings.addressStateLoading
  )
  const accountKeys = yield select((state) => state.settings.accountKeys)
  if (addressStateLoading || !accountKeys.publicKey) {
    return
  }

  yield put({
    type: "settings/SET_STATE",
    payload: {
      addressStateLoading: true,
    },
  })

  const addressState = yield Cardano.explorer.getAccountStateByPublicKey(
    accountKeys.publicKey,
    1,
    0
  )

  yield put({
    type: "settings/SET_STATE",
    payload: {
      addressState,
    },
  })

  yield put({
    type: "settings/SET_STATE",
    payload: {
      addressStateLoading: false,
    },
  })
}

export function* CHANGE_STORE_SESSION({ payload }) {
  yield put({
    type: "settings/CHANGE_SETTING",
    payload: {
      setting: "storeSession",
      value: payload,
    },
  })

  if (!payload) {
    yield store.remove("app.settings.mnemonic")
  } else {
    const mnemonic = yield select((state) => state.settings.mnemonic)
    yield put({
      type: "settings/CHANGE_SETTING",
      payload: {
        setting: "mnemonic",
        value: mnemonic,
      },
    })
  }
}

export function* GENERATE_NEW_SESSION({ mnemonic }) {
  if (
    !window.confirm(
      "Proceed with caution!\nThis will replace the current mnemonic with the new one. Click Cancel and write down the old mnemonic if you want to keep it."
    )
  ) {
    return
  }
  yield call(LOAD_APP, {
    mnemonic: mnemonic || Cardano.crypto.generateMnemonic(),
  })
}

export function* SWITCH_MEGA_MENU() {
  const megaMenu = yield select((state) => state.settings.megaMenu)
  document.getElementsByTagName("body")[0].classList.toggle("overflow-hidden")
  yield put({
    type: "settings/SET_STATE",
    payload: {
      megaMenu: !megaMenu,
    },
  })
}

export function* CHANGE_THEME({ theme }) {
  document
    .querySelector("html")
    .setAttribute("data-disable-transitions", "true")
  document.querySelector("html").setAttribute("data-theme", theme)
  setTimeout(() => {
    document.querySelector("html").removeAttribute("data-disable-transitions")
  }, 500)
  yield put({
    type: "settings/CHANGE_SETTING",
    payload: {
      setting: "theme",
      value: theme,
    },
  })
}

export function* SETUP() {
  const storeSession = yield select((state) => state.settings.storeSession)
  const mnemonic = yield select((state) => state.settings.mnemonic)
  const theme = yield select((state) => state.settings.theme)

  yield call(CHANGE_THEME, { theme })
  yield Cardano.init()
  yield put({
    type: "settings/SET_STATE",
    payload: {
      init: true,
    },
  })
  yield call(FETCH_NETWORK_STATE)
  yield call(LOAD_APP, {
    mnemonic: (storeSession && mnemonic) || Cardano.crypto.generateMnemonic(),
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    takeEvery(actions.CHANGE_STORE_SESSION, CHANGE_STORE_SESSION),
    takeEvery(actions.LOAD_APP, LOAD_APP),
    takeEvery(actions.GET_BALANCE, GET_BALANCE),
    takeEvery(actions.GENERATE_NEW_SESSION, GENERATE_NEW_SESSION),
    takeEvery(actions.FETCH_NETWORK_STATE, FETCH_NETWORK_STATE),
    takeEvery(actions.SWITCH_MEGA_MENU, SWITCH_MEGA_MENU),
    takeEvery(actions.CHANGE_THEME, CHANGE_THEME),
    SETUP(),
  ])
}
