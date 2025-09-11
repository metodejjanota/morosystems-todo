import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/services/models";

const TodoComp = ({ task }: { task: Task }) => {
	const handleCheckboxChange = () => {
		console.log("test");
	};

	return (
		<Alert className="flex">
			<div>
				<Checkbox
					checked={task.completed}
					className="mr-4"
					onCheckedChange={handleCheckboxChange}
				/>
			</div>
			<div>
				<AlertTitle className={task.completed ? "line-through" : ""}>
					{task.text}
				</AlertTitle>
				<AlertDescription>
					<Label className="text-sm">date</Label>
				</AlertDescription>
			</div>
		</Alert>
	);
};

export default TodoComp;
