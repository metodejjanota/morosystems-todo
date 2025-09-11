import type { Task } from "./models";

const getTodos = async (): Promise<Task[]> => {
	const res = await fetch(
		`${import.meta.env.VITE_DB_URL + import.meta.env.VITE_DB_PORT}/tasks`,
		{
			cache: "no-store",
		}
	);
	if (!res.ok) {
		throw new Error("Failed to fetch todos");
	}
	return res.json() as Promise<Task[]>;
};

export { getTodos };
