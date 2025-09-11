import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/services/models";
import { completeTodo, incompleteTodo, deleteTodo } from "@/services/todos";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { removeTodoOptimistic, updateTodoOptimistic } from "@/store/todosSlice";
import { Trash } from "lucide-react";

const TodoComp = ({ task }: { task: Task }) => {
	const [completed, setCompleted] = useState(task.completed);
	const dispatch = useDispatch<AppDispatch>();

	const handleCheckboxChange = async () => {
		const newCompleted = !completed;

		setCompleted(newCompleted);
		dispatch(
			updateTodoOptimistic({
				id: task.id,
				completed: newCompleted,
				text: task.text,
				createdDate: 0,
			})
		);

		try {
			if (completed) {
				await incompleteTodo(task.id);
			} else {
				await completeTodo(task.id);
			}
		} catch (error) {
			setCompleted(completed);
			dispatch(
				updateTodoOptimistic({
					id: task.id,
					completed: completed,
					text: task.text,
					createdDate: 0,
				})
			);
			console.error("Chyba při aktualizaci úkolu:", error);
		}
	};

	const handleDelete = async (id: string) => {
		dispatch(removeTodoOptimistic(id));

		try {
			await deleteTodo(id);
		} catch (error) {
			console.error("Chyba při mazání úkolu:", error);
		}
	};

	return (
		<Alert className="flex items-center justify-between">
			<div className="flex items-center">
				<div>
					<Checkbox
						checked={completed}
						className="mr-4"
						onCheckedChange={handleCheckboxChange}
					/>
				</div>
				<div>
					<AlertTitle className={completed ? "line-through" : ""}>
						{task.text}
					</AlertTitle>
					<AlertDescription>
						<Label className="text-sm">date</Label>
					</AlertDescription>
				</div>
			</div>
			<div>
				<Trash
					className="cursor-pointer"
					size={20}
					onClick={() => handleDelete(task.id)}
				/>
			</div>
		</Alert>
	);
};

export default TodoComp;
