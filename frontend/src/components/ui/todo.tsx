import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/services/models";
import { completeTodo, incompleteTodo, deleteTodo } from "@/services/todos";
import { useState } from "react";
import { Trash } from "lucide-react";

const TodoComp = ({ task }: { task: Task }) => {
	const [completed, setCompleted] = useState(task.completed);

	const handleCheckboxChange = async () => {
		try {
			if (completed) {
				await incompleteTodo(task.id).then(() => setCompleted(false));
			} else {
				await completeTodo(task.id).then(() => setCompleted(true));
			}
		} catch (error) {
			console.error("Chyba při aktualizaci úkolu:", error);
		}
	};

	const handleDelete = async (id: string) => {
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
