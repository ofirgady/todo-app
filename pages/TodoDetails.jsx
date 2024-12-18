import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodo } from "../store/actions/todo.actions.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function TodoDetails() {

    const todo = useSelector(storeState => storeState.todoModule.todo)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(params.todoId) {
        loadTodo(params.todoId)
        .then(() => {
            showSuccessMsg('Todo loaded successfully')
        })
            .catch(err => {
                showErrorMsg('Cannot load todo')
                navigate('/todo')
            })
        }
    }, [params.todoId])



    function onBack() {
        // If nothing to do here, better use a Link
        navigate('/todo')
        // navigate(-1)
    }

    if (isLoading) return <div>Loading...</div>
    return (
        <section className="todo-details">
            <h1 className={(todo.isDone)? 'done' : ''}>{todo.txt}</h1>
            <h2>{(todo.isDone)? 'Done!' : 'In your list'}</h2>

            <h1>Todo importance: {todo.importance}</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>
            <button onClick={onBack}>Back to list</button>
            <div>
                <Link to={`/todo/${todo.nextTodoId}`}>Next Todo</Link> |
                <Link to={`/todo/${todo.prevTodoId}`}>Previous Todo</Link>
            </div>
        </section>
    )
}