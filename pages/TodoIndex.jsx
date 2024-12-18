import { TodoFilter } from "../cmps/TodoFilter.jsx";
import { TodoList } from "../cmps/TodoList.jsx";
import { DataTable } from "../cmps/data-table/DataTable.jsx";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { loadTodos,	removeTodoOptimistic,toggleTodo } from "../store/actions/todo.actions.js";
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js";

const { useState, useEffect, Fragment } = React;
const { Link, useSearchParams } = ReactRouterDOM;
const { useSelector, useDispatch } = ReactRedux;

export function TodoIndex() {
	const todos = useSelector((storeState) => storeState.todoModule.todos);
	const isLoading = useSelector(
		(storeState) => storeState.todoModule.isLoading
	);
	const filterBy = useSelector((storeState) => storeState.todoModule.filterBy);

	const [isDialogOpen, setDialogOpen] = useState(false);
	const [todoToRemove, setTodoToRemove] = useState(null);

	const dispatch = useDispatch();

	useEffect(() => {
		loadTodos(filterBy).catch((err) => {
			showErrorMsg("Cannot load todos");
		});
	}, [filterBy]);

	function onSetFilter(filterBy) {
		dispatch({ type: SET_FILTER_BY, filterBy });
	}

	function handleOpenDialog(todoId) {
		setTodoToRemove(todoId);
		setDialogOpen(true);
	}

	function handleCloseDialog() {
		setDialogOpen(false);
		setTodoToRemove(null);
	}

// TODO check the satate to remove todo and list todo_id
	function handleConfirmRemove() {
		if (todoToRemove) {
			removeTodoOptimistic(todoToRemove)
				.then(() => {
					handleCloseDialog();
					showSuccessMsg(`Todo removed`);
				})
				.catch((err) => {
					showErrorMsg("Cannot remove todo " + todoToRemove);
				});
		}
	}

	function onToggleTodo(todo) {
		const todoToSave = { ...todo, isDone: !todo.isDone };
		toggleTodo(todoToSave)
			.then((savedTodo) => {
				showSuccessMsg(
					`Todo is ${savedTodo.isDone ? "done" : "back on your list"}`
				);
			})
			.catch((err) => {
				showErrorMsg("Cannot toggle todo");
			});
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
					<TodoList
						todos={todos}
						onRemoveTodo={handleOpenDialog}
						onToggleTodo={onToggleTodo}
					/>
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
				<div>Loading..</div>
			)}
            {/* check on dialog element */}
            {/*  <dialog></dialog> */}
			{isDialogOpen && (
				<div className='dialog-overlay'>
					<div className='dialog'>
						<p>Are you sure you want to delete this todo?</p>
						<button onClick={handleConfirmRemove}>Yes</button>
						<button onClick={handleCloseDialog}>No</button>
					</div>
				</div>
			)}
		</section>
	);
}
