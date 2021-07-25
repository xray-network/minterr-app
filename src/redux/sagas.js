import { all } from "redux-saga/effects"
import settings from "./settings/sagas"

export default function* rootSaga() {
  yield all([settings()])
}
