import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { fetchTodos } from "./store/todosSlice";
import { Loader2Icon } from "lucide-react";
import TodoComp from "./components/ui/todo";

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
					<div className="space-y-2 w-full lg:w-1/2 mx-2">
						{todos.map(todo => (
							<TodoComp key={todo.id} task={todo} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
