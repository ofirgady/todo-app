import { todoReducer } from "./reducers/todo.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"

const { createStore, combineReducers, compose } = Redux

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
    todoModule: todoReducer,
    userModule: userReducer
})


export const store = createStore(rootReducer, composeEnhancers())
window.gStore = store

console.log('store.getState():', store)