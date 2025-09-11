import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Task } from "@/services/models";
import {
	completeTodo,
	incompleteTodo,
	deleteTodo,
	updateTodo,
} from "@/services/todos";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { removeTodoOptimistic, updateTodoOptimistic } from "@/store/todosSlice";
import { Trash } from "lucide-react";

const TodoComp = ({ task }: { task: Task }) => {
	const [completed, setCompleted] = useState(task.completed);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(task.text);
	const dispatch = useDispatch<AppDispatch>();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	const handleCheckboxChange = async () => {
		const newCompleted = !completed;
		const newCompletedDate = newCompleted ? Date.now() : undefined;
		setCompleted(newCompleted);
		dispatch(
			updateTodoOptimistic({
				id: task.id,
				completed: newCompleted,
				text: task.text,
				createdDate: task.createdDate,
				completedDate: newCompletedDate,
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
					createdDate: task.createdDate,
					completedDate: completed ? task.completedDate : undefined,
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

	const handleDoubleClick = () => {
		setIsEditing(true);
		setEditText(task.text);
	};

	const handleSaveEdit = async () => {
		if (editText.trim() === "") {
			setEditText(task.text);
			setIsEditing(false);
			return;
		}

		if (editText.trim() === task.text) {
			setIsEditing(false);
			return;
		}

		dispatch(
			updateTodoOptimistic({
				id: task.id,
				completed: task.completed,
				text: editText.trim(),
				createdDate: task.createdDate,
				completedDate: task.completedDate,
			})
		);

		try {
			await updateTodo(task.id, editText.trim());
			setIsEditing(false);
		} catch (error) {
			dispatch(
				updateTodoOptimistic({
					id: task.id,
					completed: task.completed,
					text: task.text,
					createdDate: task.createdDate,
					completedDate: task.completedDate,
				})
			);
			setEditText(task.text);
			setIsEditing(false);
			console.error("Chyba při aktualizaci textu úkolu:", error);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSaveEdit();
		} else if (e.key === "Escape") {
			setEditText(task.text);
			setIsEditing(false);
		}
	};

	const handleBlur = () => {
		handleSaveEdit();
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
				<div className="flex-1">
					{isEditing ? (
						<Input
							ref={inputRef}
							value={editText}
							onChange={e => setEditText(e.target.value)}
							onKeyDown={handleKeyDown}
							onBlur={handleBlur}
							className="mb-2"
						/>
					) : (
						<AlertTitle
							className={`cursor-pointer ${completed ? "line-through" : ""}`}
							onDoubleClick={handleDoubleClick}
						>
							{task.text}
						</AlertTitle>
					)}
					<AlertDescription>
						<div className="flex gap-2">
							<Label className="text-sm">
								Vytvořeno:{" "}
								{new Date(task.createdDate).toLocaleDateString("cs-CZ", {
									day: "2-digit",
									month: "2-digit",
									year: "2-digit",
								})}
							</Label>
							{completed && (
								<Label className="text-sm">
									| Dokončeno{" "}
									{new Date(task.completedDate || 0).toLocaleDateString(
										"cs-CZ",
										{
											day: "2-digit",
											month: "2-digit",
											year: "2-digit",
										}
									)}
								</Label>
							)}
						</div>
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
