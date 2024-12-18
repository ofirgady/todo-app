import { utilService } from "./util.service.js";
import { storageService } from "./async-storage.service.js";

const TODO_KEY = "todoDB";
_createTodos();

export const todoService = {
	query,
	get,
	remove,
	save,
	getEmptyTodo,
	getDefaultFilter,
	getFilterFromSearchParams,
	getImportanceStats,
};
// For Debug (easy access from console):
window.cs = todoService;

function query(filterBy = {}) {
	return storageService.query(TODO_KEY).then((todos) => {
		if (filterBy.txt) {
			const regExp = new RegExp(filterBy.txt, "i");
			todos = todos.filter((todo) => regExp.test(todo.txt));
		}

		if (filterBy.importance) {
			todos = todos.filter((todo) => todo.importance >= filterBy.importance);
		}

		return todos;
	});
}

function get(todoId) {
	return storageService.get(TODO_KEY, todoId).then((todo) => {
		todo = _setNextPrevTodoId(todo);
		return todo;
	});
}

function remove(todoId) {
	return storageService.remove(TODO_KEY, todoId);
}

function save(todo) {
	todo.color = _getColorByImportance(todo.importance);
	if (todo._id) {
		todo.updatedAt = Date.now();
		return storageService.put(TODO_KEY, todo);
	} else {
		todo.createdAt = todo.updatedAt = Date.now();
		return storageService.post(TODO_KEY, todo);
	}
}

function getEmptyTodo(txt = "", importance = 5) {
	return {
		txt,
		importance,
		isDone: false,
		color: _getColorByImportance(importance),
	};
}

function getDefaultFilter() {
	return { txt: "", importance: 0 };
}

function getFilterFromSearchParams(searchParams) {
	const defaultFilter = getDefaultFilter();
	const filterBy = {};
	for (const field in defaultFilter) {
		filterBy[field] = searchParams.get(field) || "";
	}
	return filterBy;
}

function getImportanceStats() {
	return storageService.query(TODO_KEY).then((todos) => {
		const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos);
		const data = Object.keys(todoCountByImportanceMap).map((speedName) => ({
			title: speedName,
			value: todoCountByImportanceMap[speedName],
		}));
		return data;
	});
}

function _createTodos() {
	let todos = utilService.loadFromStorage(TODO_KEY);
	if (!todos || !todos.length) {
		todos = [];
		const txts = ["Learn React", "Master CSS", "Practice Redux"];
		for (let i = 0; i < 20; i++) {
			const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)];
			const importance = utilService.getRandomIntInclusive(1, 10);
			todos.push(_createTodo(txt + (i + 1), importance));
		}
		utilService.saveToStorage(TODO_KEY, todos);
	}
}

function _createTodo(txt, importance) {
	const todo = getEmptyTodo(txt, importance);
	todo._id = utilService.makeId();
	todo.createdAt = todo.updatedAt =
		Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24);
	todo.color = _getColorByImportance(importance);
	return todo;
}

function _setNextPrevTodoId(todo) {
	return storageService.query(TODO_KEY).then((todos) => {
		const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id);
		const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0];
		const prevTodo = todos[todoIdx - 1]
			? todos[todoIdx - 1]
			: todos[todos.length - 1];
		todo.nextTodoId = nextTodo._id;
		todo.prevTodoId = prevTodo._id;
		return todo;
	});
}

function _getTodoCountByImportanceMap(todos) {
	const todoCountByImportanceMap = todos.reduce(
		(map, todo) => {
			if (todo.importance < 3) map.low++;
			else if (todo.importance < 7) map.normal++;
			else map.urgent++;
			return map;
		},
		{ low: 0, normal: 0, urgent: 0 }
	);
	return todoCountByImportanceMap;
}

function _getColorByImportance(importance) {
    const colors = [
        '#98FB98', // 1: Pale Green
        '#90EE90', // 2: Light Green
        '#9ACD32', // 3: Yellow-Green
        '#ADFF2F', // 4: Lime Green
        '#F0E68C', // 5: Light Yellow
        '#FFFF99', // 6: Yellow
        '#FFD700', // 7: Light Orange
        '#FFA07A', // 8: Orange
        '#FF7F50', // 9: Coral
        '#FF6961', // 10: Red
    ];
    return colors[importance - 1];
}

// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690,
//     color: "#FF0000" // Based on importance
// }
