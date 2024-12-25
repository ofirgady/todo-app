import { todoService } from '../services/todo.service.js';
import { ProgressBar } from './ProgressBar.jsx';
const { useSelector, useDispatch } = ReactRedux;
const { useState, useEffect } = React

export function AppFooter() {
    const todos = useSelector((storeState) => storeState.todoModule.todos);
    const [completionPercentage, setCompletionPercentage] = useState(0);

    useEffect(() => {
        if (todos) {
            todoService.getCompletionPercentage().then((percentage) => {
                setCompletionPercentage(parseFloat(percentage));
            });
        }
    }, [todos]);

    return (
        <footer className="app-footer full main-layout">
            <div>
                <h4>Todo Progress</h4>
                <ProgressBar value={completionPercentage} />
            </div>
        </footer>
    );
}