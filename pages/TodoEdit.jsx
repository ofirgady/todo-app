import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodo, saveTodo } from "../store/actions/todo.actions.js"
import { SET_IS_LOADING } from "../store/reducers/todo.reducer.js"
import { store } from "../store/store.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoEdit() {

    const todo = useSelector(storeState => storeState.todoModule.todo)
    const [todoToEdit, setTodoToEdit] = useState(todo)
    const navigate = useNavigate()
    const params = useParams()
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)

    useEffect(() => {
        if (params.todoId) {
            loadTodo(params.todoId)
            .then(() => {
                showSuccessMsg(`Todo loaded successfully`)
            })
            .catch(err => {
                showErrorMsg('Cannot load todo')
            })
        }
    }, [])

    useEffect(() => {
        setTodoToEdit(todo)
    }, [todo]);

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setTodoToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        saveTodo(todoToEdit)
            .then((savedTodo) => {
                navigate('/todo')
                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
            })
    }

    const { txt, importance, isDone } = todoToEdit
    if (isLoading) return <div>loading...</div>
    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} placeholder={todo.text} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} value={isDone} type="checkbox" name="isDone" id="isDone" />


                <button>Save</button>
            </form>
            </section>
        )
}