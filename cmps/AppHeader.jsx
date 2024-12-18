const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

import { userService } from '../services/user.service.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'
import { SET_USER } from '../store/reducers/user.reducer.js'


export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.loggedInUser)
    const dispatch = useDispatch()
    
    function onLogout() {
        logout()
            .then(() => {
                navigate('/')
                showSuccessMsg('logged out successfully')
            })
            .catch((err) => {
                showErrorMsg('Oops try again')
            })
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section >

                        <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                        <button onClick={onLogout}>Logout</button>
                        <p>Current Balance: {user.balance}</p>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
