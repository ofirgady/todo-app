import { userService } from '../services/user.service.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'
import { UPDATE_LAYOUT_PREFS } from "../store/reducers/layout.reducer.js"
import { todoService } from '../services/todo.service.js'
import { ProgressBar } from './ProgressBar.jsx'
const { useState, useEffect } = React
const { Link, NavLink, useNavigate } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux;



export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector((storeState) => storeState.userModule.loggedInUser)
    const dispatch = useDispatch()
    const todos = useSelector((storeState) => storeState.todoModule.todos);
    const [completionPercentage, setCompletionPercentage] = useState(0);

    useEffect(() => {
        if (todos) {
            todoService.getCompletionPercentage().then((percentage) => {
                setCompletionPercentage(+percentage);
            });
        }
    }, [todos]);

    useEffect(() => {
        if (user) {
            dispatch({type: UPDATE_LAYOUT_PREFS, prefs: user.prefs})
        }
    }, [user])

    
    function onLogout() {
        navigate('/')
        logout()
            .then(() => {
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
                   <section>
                   <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                   <button onClick={onLogout}>Logout</button>
                   <p>Current Balance: {user.balance}</p>
                   <ProgressBar value={completionPercentage} />
               </section>
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
