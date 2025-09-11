import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { fetchTodos } from "./store/todosSlice";
import TodoComp from "./components/ui/todo";
import { Skeleton } from "./components/ui/skeleton";
import CreateTaskDialog from "./components/blocks/addTodoForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
							{!loading && !error && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
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
									<p>Žádné dokončené úkoly k zobrazení</p>
								)}
							{!loading && !error && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
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
							{!loading && !error && todos.length === 0 && (
								<p>Žádné úkoly k zobrazení</p>
							)}
							{!loading && !error && (
								<div className="space-y-2 w-full lg:w-1/2 mx-2">
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
