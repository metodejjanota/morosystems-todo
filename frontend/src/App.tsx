import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { fetchTodos } from "./store/todosSlice";

function App() {
	const dispatch = useDispatch<AppDispatch>();
	const {
		items: todos,
		loading,
		error,
	} = useSelector((state: RootState) => state.todos);

	useEffect(() => {
		dispatch(fetchTodos());
	}, [dispatch]);

	return (
		<div>
			<h1 className="text-5xl font-bold">Morosystems To-Do</h1>

			{loading && <p>Načítání...</p>}
			{error && <p className="text-red-500">Chyba: {error}</p>}

			<ul>
				{todos.map(todo => (
					<li key={todo.id}>{todo.text}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
