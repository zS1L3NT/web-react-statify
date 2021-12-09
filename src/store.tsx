import access_token from "./reducers/AccessTokenReducer"
import error from "./reducers/ErrorReducer"
import statistics from "./reducers/StatisticsReducer"
import theme from "./reducers/ThemeReducer"
import thunk from "redux-thunk"
import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

const rootReducer = combineReducers({ theme, access_token, error, statistics })

const composeEnhancers = composeWithDevTools({ trace: true })

const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(thunk)))

export type AppState = ReturnType<typeof rootReducer>
export type iStore = typeof store
export default store
