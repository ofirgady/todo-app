import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodo } from "../store/actions/todo.actions.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function UserDetails() {

    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(params.todoId) {
        loadActivities(params.userId) // define and create
        .then(() => {
            showSuccessMsg('User loaded successfully')
        })
            .catch(err => {
                showErrorMsg('Cannot load user')
                navigate('/')
            })
        }
    }, [])


    if (isLoading) return <div>Loading...</div>
    return (
        <section className="todo-details">

        </section>
    )
}