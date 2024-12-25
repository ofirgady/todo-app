import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import {removeTodoOptimistic,toggleTodo,saveTodo,loadTodos} from "../store/actions/todo.actions.js"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"
import { SET_USER } from "../store/reducers/user.reducer.js"
import { updateUser } from "../store/actions/user.actions.js"
import { todoService } from "../services/todo.service.js"
const { useState, useEffect, Fragment } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux
export function TodoIndex() {
	const todos = useSelector((storeState) => storeState.todoModule.todos)
	const totalTodos = useSelector(
		(storeState) => storeState.todoModule.totalTodos
	)
	const user = useSelector((storeState) => storeState.userModule.loggedInUser)
	const isLoading = useSelector((storeState) => storeState.todoModule.isLoading)
	const filterBy = useSelector((storeState) => storeState.todoModule.filterBy)
	const currentPage = filterBy.pagination.currentPage
	const itemsPerPage = filterBy.pagination.itemsPerPage

	const maxPages = Math.ceil(totalTodos / itemsPerPage)

	const [todoToRemove, setTodoToRemove] = useState(null)
	const dialogRef = React.useRef(null)
	const dispatch = useDispatch()

	useEffect(() => {
		loadTodos(filterBy).catch((err) => {
			showErrorMsg("Cannot load todos")
		})
	}, [filterBy])

	function onSetFilter(filterBy) {
		dispatch({ type: SET_FILTER_BY, filterBy })
	}

	function handleOpenDialog(todoId) {
		setTodoToRemove(todoId)
		dialogRef.current.showModal()
	}

	function handleCloseDialog() {
		dialogRef.current.close()
		setTodoToRemove(null)
	}

	// Update the current page
	function onPageChange(newPage) {
		if (newPage < 1 || newPage > maxPages) return
		const updatedFilterBy = {
			...filterBy,
			pagination: { ...filterBy.pagination, currentPage: newPage },
		}
		dispatch({ type: SET_FILTER_BY, filterBy: updatedFilterBy })
	}

	// Update items per page
	function onItemsPerPageChange(newItemsPerPage) {
		const updatedFilterBy = {
			...filterBy,
			pagination: { ...filterBy.pagination, itemsPerPage: newItemsPerPage },
		}
		dispatch({ type: SET_FILTER_BY, filterBy: updatedFilterBy })
	}

	function onSortChange(field) {
		const newOrder = filterBy.sortBy.order === "asc" ? "desc" : "asc"
		const updatedFilterBy = { ...filterBy, sortBy: { field, order: newOrder } }
		dispatch({ type: SET_FILTER_BY, filterBy: updatedFilterBy })
	}

	function handleConfirmRemove() {
		if (todoToRemove) {
			removeTodoOptimistic(todoToRemove)
				.then(() => {
					updateUser({
						...user,
						activities: [
							...user.activities,
							{ txt: "Removed a Todo", at: Date.now() },
						],
					})
					handleCloseDialog()
					showSuccessMsg(`Todo removed`)
					console.log(user)
				})
				.catch((err) => {
					showErrorMsg("Cannot remove todo " + todoToRemove)
				})
		}
	}

	function onToggleTodo(todo) {
		const todoToSave = { ...todo, isDone: !todo.isDone }
		if (todoToSave.isDone) {
			updateUser({
				...user,
				balance: user.balance + 10,
				activities: [
					...user.activities,
					{ txt: "Finished a Todo", at: Date.now() },
				],
			})
		}
		saveTodo(todoToSave)
			.then((savedTodo) => {
				showSuccessMsg(
					`Todo is ${savedTodo.isDone ? "done" : "back on your list"}`
				)
			})
			.catch((err) => {
				showErrorMsg("Cannot toggle todo")
			})
	}

	return (
		<section className='todo-index'>
			<TodoFilter
				filterBy={filterBy}
				onSetFilterBy={onSetFilter}
			/>
			<div>
				<Link
					to='/todo/edit'
					className='btn'>
					Add Todo
				</Link>
			</div>
			<h2>Todos List</h2>
			{!isLoading ? (
				<Fragment>
					<div className='sorting-controls'>
						<button onClick={() => onSortChange("importance")}>
							Sort by Importance
						</button>
						<button onClick={() => onSortChange("createdAt")}>
							Sort by Date
						</button>
						<button onClick={() => onSortChange("txt")}>Sort by Text</button>
					</div>
					<TodoList
						todos={todos}
						onRemoveTodo={handleOpenDialog}
						onToggleTodo={onToggleTodo}
					/>
					<div className='pagination-controls'>
						<button
							disabled={filterBy.pagination.currentPage === 1}
							onClick={() => onPageChange(filterBy.pagination.currentPage - 1)}>
							Previous
						</button>
						<button
							disabled={currentPage === maxPages || totalTodos === 0}
							onClick={() => onPageChange(filterBy.pagination.currentPage + 1)}>
							Next
						</button>
						<select
							value={filterBy.pagination.itemsPerPage}
							onChange={(e) => onItemsPerPageChange(+e.target.value)}>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={20}>20</option>
						</select>
					</div>
					<hr />
					<h2>Todos Table</h2>
					<div style={{ width: "60%", margin: "auto" }}>
						<DataTable
							todos={todos}
							onRemoveTodo={handleOpenDialog}
						/>
					</div>
				</Fragment>
			) : (
				<div className='loading-container'>
					<div className='loading'></div>
				</div>
			)}

			{/* Dialog Element */}
			<dialog
				ref={dialogRef}
				className='dialog'>
				<p>Are you sure you want to delete this todo?</p>
				<div>
					<button onClick={handleConfirmRemove}>Yes</button>
					<button onClick={handleCloseDialog}>No</button>
				</div>
			</dialog>
		</section>
	)
}
