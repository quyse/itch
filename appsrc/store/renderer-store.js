
import {createStore, applyMiddleware, compose} from 'redux'
import {electronEnhancer} from 'redux-electron-store'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import reactors from '../renderer-reactors'
import reducer from '../reducers'

import env from '../env'

const filter = true
const sagaMiddleware = createSagaMiddleware()
const middleware = [
  sagaMiddleware
]

const REDUX_DEVTOOLS_ENABLED = process.env.REDUX_DEVTOOLS === '1'

if (env.name === 'development' || REDUX_DEVTOOLS_ENABLED) {
  const logger = createLogger({
    predicate: (getState, action) => !action.MONITOR_ACTION
  })
  middleware.push(logger)
}

const enhancers = [
  applyMiddleware(...middleware),
  electronEnhancer({
    filter,
    postDispatchCallback: (action) => {
      const reactor = reactors[action.type]
      if (reactor) {
        reactor(store, action)
      }
    }
  })
]

if (REDUX_DEVTOOLS_ENABLED) {
  const DevTools = require('../components/dev-tools').default
  enhancers.push(DevTools.instrument())
}

const enhancer = compose(...enhancers)

const initialState = {}
const store = createStore(reducer, initialState, enhancer)

export default store
