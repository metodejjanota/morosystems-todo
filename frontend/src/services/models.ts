interface Task {
	id: string;
	text: string;
	completed: boolean;
	createdDate: number;
	completedDate?: number;
}

export type { Task };
