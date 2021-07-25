import { combineReducers } from "redux"
import settings from "./settings/reducers"

const Reducers = () =>
  combineReducers({
    settings,
  })

export default Reducers
