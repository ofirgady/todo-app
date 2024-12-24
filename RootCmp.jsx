import { store } from "./store/store.js"
import { AppHeader } from "./cmps/AppHeader.jsx"
import { Home } from "./pages/Home.jsx"
import { About } from "./pages/About.jsx"
import { TodoIndex } from "./pages/TodoIndex.jsx"
import { TodoDetails } from "./pages/TodoDetails.jsx"
import { TodoEdit } from "./pages/TodoEdit.jsx"
import { AboutTeam } from "./cmps/AboutTeam.jsx"
import { AboutVision } from "./cmps/AboutVision.jsx"
import { Dashboard } from "./pages/Dashboard.jsx"
import { UserDetails } from "./pages/UserDetails.jsx"

const Router = ReactRouterDOM.HashRouter
const { Routes, Route } = ReactRouterDOM
const { Provider, useSelector } = ReactRedux
const { useEffect } = React

function RootCmpWithPrefs() {
    const prefs = ReactRedux.useSelector((storeState) => storeState.layoutModule.prefs)

    useEffect(() => {
        // Update CSS variables dynamically
        document.documentElement.style.setProperty('--user-color', prefs.color)
        document.documentElement.style.setProperty('--user-bg-color', prefs.bgColor)
    }, [prefs])

    return (
        <Router>
            <section style={{color: prefs.color, backgroundColor: prefs.bgColor}} className="app main-layout">
                <AppHeader />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />}>
                            <Route path="team" element={<AboutTeam />} />
                            <Route path="vision" element={<AboutVision />} />
                        </Route>
                        <Route path="/todo/:todoId" element={<TodoDetails />} />
                        <Route path="/todo/edit/:todoId" element={<TodoEdit />} />
                        <Route path="/todo/edit" element={<TodoEdit />} />
                        <Route path="/todo" element={<TodoIndex />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/user/:userId" element={<UserDetails />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
}

export function RootCmp() {
    return (
        <Provider store={store}>
            <RootCmpWithPrefs />
        </Provider>
    )
}