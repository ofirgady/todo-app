import { userService } from "../../services/user.service.js";
import { initialLayoutState, UPDATE_LAYOUT_PREFS } from "../reducers/layout.reducer.js";
import { SET_IS_LOADING } from "../reducers/todo.reducer.js";
import { SET_USER } from "../reducers/user.reducer.js";
import { store } from "../store.js";


export function login(credentials) {
    return userService.login(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot login', err)
            throw err
        })
}


export function signup(credentials) {
    return userService.signup(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot signup', err)
            throw err
        })
}


export function logout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
            store.dispatch({ type: UPDATE_LAYOUT_PREFS, prefs: {...initialLayoutState.prefs} })
        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
            throw err
        })
}

export function updateUserPrefs(user) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return userService.updateLoggedInUser(user)
    .then((updatedUser) => {
        store.dispatch({ type: SET_USER, user: updatedUser })
        store.dispatch({ type: UPDATE_LAYOUT_PREFS, prefs: updatedUser.prefs})
    })
    .catch((err) => {
        console.log('user actions -> Cannot update user preferences', err)
        throw err
    })
    .finally(() => {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    })
}

export function updateUser(user) {
    return userService.updateLoggedInUser(user)
    .then((updatedUser) => {
        store.dispatch({ type: SET_USER, user: updatedUser })
    })
    .catch((err) => {
        console.log('user actions -> Cannot update user', err)
        throw err
    })
    // .finally(() => {
    //     store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    // })
}

