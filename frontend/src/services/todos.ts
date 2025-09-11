import type { Task } from "./models";

const API_URL = `${import.meta.env.VITE_API_URL}${
	import.meta.env.VITE_API_PORT
}`;

const getTodos = async (): Promise<Task[]> => {
	const res = await fetch(`${API_URL}/tasks`, { cache: "no-store" });
	if (!res.ok) throw new Error("Nepodařilo se načíst úkoly");
	return res.json();
};

const getCompletedTodos = async (): Promise<Task[]> => {
	const res = await fetch(`${API_URL}/tasks/completed`);
	if (!res.ok) throw new Error("Nepodařilo se načíst dokončené úkoly");
	return res.json();
};

const createTodo = async (text: string): Promise<Task> => {
	const res = await fetch(`${API_URL}/tasks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text }),
	});
	if (!res.ok) throw new Error("Nepodařilo se vytvořit úkol");
	return res.json();
};

const updateTodo = async (id: string, text: string): Promise<Task> => {
	const res = await fetch(`${API_URL}/tasks/${id}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text }),
	});
	if (!res.ok) throw new Error("Nepodařilo se aktualizovat úkol");
	return res.json();
};

const deleteTodo = async (id: string): Promise<void> => {
	const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Nepodařilo se smazat úkol");
};

const completeTodo = async (id: string): Promise<Task> => {
	const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
		method: "POST",
	});
	if (!res.ok) throw new Error("Nepodařilo se označit úkol jako hotový");
	return res.json();
};

const incompleteTodo = async (id: string): Promise<Task> => {
	const res = await fetch(`${API_URL}/tasks/${id}/incomplete`, {
		method: "POST",
	});
	if (!res.ok) throw new Error("Nepodařilo se označit úkol jako nehotový");
	return res.json();
};

export {
	getTodos,
	getCompletedTodos,
	createTodo,
	updateTodo,
	deleteTodo,
	completeTodo,
	incompleteTodo,
};
