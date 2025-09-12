import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { fetchTodos } from "./store/todosSlice";
import TodoComp from "./components/ui/todo";
import { Skeleton } from "./components/ui/skeleton";
import CreateTaskDialog from "./components/blocks/addTodoForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "./components/ui/checkbox";
import { CheckSquare2, Trash } from "lucide-react";
import { updateTodoOptimistic, removeTodoOptimistic } from "./store/todosSlice";
import { completeTodo, incompleteTodo, deleteTodo } from "./services/todos";

function App() {
	const dispatch = useDispatch<AppDispatch>();
	const {
		items: todos,
		loading,
		error,
	} = useSelector((state: RootState) => state.todos);

	useEffect(() => {
		document.title = "Morosystems To-Do";
		dispatch(fetchTodos());
	}, [dispatch]);

	const handleCheckEvery = async () => {
		try {
			for (const todo of todos.filter(t => !t.completed)) {
				dispatch(
					updateTodoOptimistic({
						...todo,
						completed: true,
						completedDate: Date.now(),
					})
				);
				await completeTodo(todo.id);
			}
		} catch (error) {
			console.error(error);
			dispatch(fetchTodos());
		}
	};

	const handleUncheckEvery = async () => {
		try {
			for (const todo of todos.filter(t => t.completed)) {
				dispatch(
					updateTodoOptimistic({
						...todo,
						completed: false,
						completedDate: undefined,
					})
				);
				await incompleteTodo(todo.id);
			}
		} catch (error) {
			console.error(error);
			dispatch(fetchTodos());
		}
	};

	const handleDeleteEvery = async (
		type: "all" | "completed" | "incomplete"
	) => {
		try {
			const toDelete =
				type === "all"
					? todos
					: type === "completed"
					? todos.filter(t => t.completed)
					: todos.filter(t => !t.completed);

			for (const todo of toDelete) {
				dispatch(removeTodoOptimistic(todo.id));
				await deleteTodo(todo.id);
			}
		} catch (error) {
			console.error(error);
			dispatch(fetchTodos());
		}
	};

	return (
		<div>
			<h1 className="font-bold text-3xl sm:text-5xl text-center">
				Morosystems To-Do
			</h1>
			<div className="flex justify-center mt-4 sm:mt-10 w-full">
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="justify-center mx-auto">
						<div className="hidden sm:block">
							<CreateTaskDialog />
						</div>
						<TabsTrigger value="all">Vše</TabsTrigger>
						<TabsTrigger value="completed">Dokončené</TabsTrigger>
						<TabsTrigger value="incomplete">Nedokončené</TabsTrigger>
					</TabsList>
					<div className="block sm:hidden mb-2 text-center">
						<CreateTaskDialog />
					</div>
					<TabsContent value="all">
						<div className="flex justify-center items-center mt-1 sm:mt-10 w-full">
							{loading && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
								</div>
							)}
							{error && <p className="text-red-500">Chyba: {error}</p>}
							{!loading && !error && todos.length === 0 && (
								<p>Žádné úkoly k zobrazení</p>
							)}
							{!loading && !error && todos.length > 0 && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
									<div className="flex mx-4 mb-2 items-center gap-4 justify-between">
										<Checkbox
											onCheckedChange={
												todos.every(todo => todo.completed)
													? handleUncheckEvery
													: handleCheckEvery
											}
											className="cursor-pointer"
											checked={todos.every(todo => todo.completed)}
										/>

										<label className="select-none flex gap-1 items-center">
											{todos.filter(todo => todo.completed).length}
											<CheckSquare2 size={20} />
										</label>

										<Trash
											className="cursor-pointer"
											size={20}
											onClick={() => handleDeleteEvery("all")}
										/>
									</div>
									<hr />
									{todos.map(todo => (
										<TodoComp key={todo.id} task={todo} />
									))}
								</div>
							)}
						</div>
					</TabsContent>
					<TabsContent value="completed">
						<div className="flex justify-center items-center mt-1 sm:mt-10 w-full">
							{loading && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
								</div>
							)}
							{error && <p className="text-red-500">Chyba: {error}</p>}
							{!loading &&
								!error &&
								todos.filter(todo => todo.completed).length === 0 && (
									<p className="text-center">
										Žádné dokončené úkoly k zobrazení
									</p>
								)}
							{!loading && !error && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
									{todos.filter(todo => todo.completed).length !== 0 && (
										<div>
											<div className="flex mx-4 mb-2 items-center gap-4 justify-between">
												<Checkbox
													checked
													onCheckedChange={handleUncheckEvery}
													className="cursor-pointer"
												/>

												<label className="select-none flex gap-1 items-center">
													{todos.filter(todo => todo.completed).length}
													<CheckSquare2 className="" size={20} />
												</label>

												<Trash
													className="cursor-pointer"
													size={20}
													onClick={() => handleDeleteEvery("completed")}
												/>
											</div>
											<hr />
										</div>
									)}
									{todos
										.filter(todo => todo.completed)
										.map(todo => (
											<TodoComp key={todo.id} task={todo} />
										))}
								</div>
							)}
						</div>
					</TabsContent>
					<TabsContent value="incomplete">
						<div className="flex justify-center items-center mt-1 sm:mt-10 w-full">
							{loading && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
								</div>
							)}
							{error && <p className="text-red-500">Chyba: {error}</p>}
							{!loading &&
								!error &&
								todos.filter(todo => !todo.completed).length === 0 && (
									<p className="w-full text-center">
										Žádné nedokončené úkoly k zobrazení
									</p>
								)}
							{!loading && !error && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
									{todos.filter(todo => !todo.completed).length !== 0 && (
										<div>
											<div className="flex mx-4 mb-2 items-center gap-4 justify-between">
												<Checkbox
													onCheckedChange={handleCheckEvery}
													className="cursor-pointer"
												/>

												<label className="select-none flex gap-1 items-center">
													{todos.filter(todo => todo.completed).length}
													<CheckSquare2 className="" size={20} />
												</label>

												<Trash
													size={20}
													className="cursor-pointer"
													onClick={() => handleDeleteEvery("incomplete")}
												/>
											</div>
											<hr />
										</div>
									)}
									{todos
										.filter(todo => !todo.completed)
										.map(todo => (
											<TodoComp key={todo.id} task={todo} />
										))}
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default App;
