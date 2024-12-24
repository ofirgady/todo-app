import { todoService } from "../../services/todo.service.js";
import { ADD_TODO,SET_TODO, REMOVE_TODO, SET_IS_LOADING, SET_TODOS, UNDO_TODOS, UPDATE_TODO } from "../reducers/todo.reducer.js";
import { SET_USER } from "../reducers/user.reducer.js";
import { store } from "../store.js";

export function loadTodos(filterBy) {

    store.dispatch({ type: SET_IS_LOADING, isLoading: true });
    return todoService.query(filterBy)
        .then((todos) => {
            store.dispatch({ type: SET_TODOS, todos });
        })
        .catch((err) => {
            console.error("todo action -> Cannot load todos", err);
            throw err;
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false });
        });
}

export function loadTodo(todoId) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return todoService.get(todoId)
    .then((todo => {
        store.dispatch({ type: SET_TODO, todo })
    }))
    .catch(err => {
        console.log('todo action -> Cannot load todo', err)
        throw err
    })
    .finally(() => {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    })
}

export function removeTodo(todoId) {

    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })
            store.dispatch({ type: SET_USER, todoId })
        })
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function removeTodoOptimistic(todoId) {
    store.dispatch({ type: REMOVE_TODO, todoId })
    return todoService.remove(todoId)
        .catch(err => {
            store.dispatch({ type: UNDO_TODOS })
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todo) {
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({ type, todo: savedTodo })
            return savedTodo
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

export function toggleTodo(todo) {
    store.dispatch({ type: UPDATE_TODO, todo })
    return todoService.save(todo)
    .then((savedTodo) => {
        store.dispatch({ type: UPDATE_TODO, todo: savedTodo })
        return savedTodo
    })
    .catch(err => {
        console.log('todo action -> Cannot save todo', err)
        throw err
    })
}

