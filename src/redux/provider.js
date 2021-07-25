import React from "react"

import { applyMiddleware, createStore } from "redux"
import { Provider } from "react-redux"

import createSagaMiddleware from "redux-saga"

import reducers from "./reducers"
import root from "./sagas"
import Runner from "./runner"

const ReduxProvider = ({ element }) => {
  const middleware = createSagaMiddleware()
  const store = createStore(reducers(), applyMiddleware(middleware))

  middleware.run(root)

  return (
    <Provider store={store}>
      <Runner>{element}</Runner>
    </Provider>
  )
}

export default ReduxProvider
