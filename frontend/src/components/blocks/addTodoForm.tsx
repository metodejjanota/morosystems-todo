import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch } from "@/store/store";
import { addTodoOptimistic } from "@/store/todosSlice";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { createTodo } from "@/services/todos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

const CreateTaskDialog = () => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch<AppDispatch>();

	const formSchema = z.object({
		task: z
			.string()
			.min(1, "Název úkolu je povinný")
			.max(40, "Název úkolu může mít maximálně 40 znaků"),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			task: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);

		const optimisticTodo = {
			id: String(Date.now()),
			title: values.task,
			text: values.task,
			completed: false,
			createdDate: Date.now(),
		};

		dispatch(addTodoOptimistic(optimisticTodo));

		form.reset();
		setOpen(false);
		setLoading(false);

		createTodo(values.task).catch(error => {
			console.error(error);
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Plus className="h-4 w-4" />
					Přidat úkol
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-8"
					>
						<DialogHeader>
							<DialogTitle>Přidat úkol</DialogTitle>
							<DialogDescription>Zadejte název nového úkolu.</DialogDescription>
						</DialogHeader>
						<div>
							<FormField
								control={form.control}
								name="task"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Název úkolu" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" type="button">
									Zavřít
								</Button>
							</DialogClose>
							<Button type="submit" disabled={loading}>
								{loading ? <Loader2 className="animate-spin" /> : "Přidat"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTaskDialog;
