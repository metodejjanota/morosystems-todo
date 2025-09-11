import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { fetchTodos } from "./store/todosSlice";
import { Loader2Icon } from "lucide-react";

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
			<h1 className="text-5xl font-bold text-center">Morosystems To-Do</h1>

			<div className="flex justify-center items-center mt-10">
				{loading && <Loader2Icon className="animate-spin h-10 w-10" />}
				{error && <p className="text-red-500">Chyba: {error}</p>}
				{!loading && !error && todos.length === 0 && (
					<p>Žádné úkoly k zobrazení</p>
				)}
				{!loading && !error && (
					<ul>
						{todos.map(todo => (
							<li key={todo.id}>{todo.text}</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default App;
