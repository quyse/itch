
import {createStore, applyMiddleware, compose} from 'redux'
import {electronEnhancer} from 'redux-electron-store'
import createLogger from 'redux-cli-logger'

import reactors from '../reactors'
import reducer from '../reducers'

const crashGetter = (store) => (next) => (action) => {
  try {
    if (action && !action.type) {
      throw new Error('refusing to dispatch action with null type: ', action)
    }
    return next(action)
  } catch (e) {
    console.log(`Uncaught redux: for action ${action.type}: ${e.stack}`)
  }
}

const middleware = [
  crashGetter
]

const beChatty = process.env.MARCO_POLO === '1'

if (beChatty) {
  const logger = createLogger({
    predicate: (getState, action) => {
      return !action.MONITOR_ACTION &&
         !/^WINDOW_/.test(action.type) &&
         !/_DB_/.test(action.type) &&
         !/LOCALE_/.test(action.type)
    },
    stateTransformer: (state) => ''
  })

  middleware.push(logger)
}

const enhancer = compose(
  applyMiddleware(...middleware),
  electronEnhancer({
    postDispatchCallback: (action) => {
      const reactor = reactors[action.type]
      if (reactor) {
        reactor(store, action)
      }
    }
  })
)

const initialState = {}
const store = createStore(reducer, initialState, enhancer)

export default store
