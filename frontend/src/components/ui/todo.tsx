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
	const completed = task.completed;

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

	const handleDelete = async (id: string) => {
		dispatch(removeTodoOptimistic(id));
		try {
			await deleteTodo(id);
		} catch (error) {
			console.error(error);
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
			console.error(error);
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
						className="mr-4"
						checked={completed}
						onCheckedChange={async () => {
							const newCompleted = !completed;
							dispatch(
								updateTodoOptimistic({
									...task,
									completed: newCompleted,
									completedDate: newCompleted ? Date.now() : undefined,
								})
							);
							try {
								if (completed) await incompleteTodo(task.id);
								else await completeTodo(task.id);
							} catch (err) {
								console.error(err);
							}
						}}
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
