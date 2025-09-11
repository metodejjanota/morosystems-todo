import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import type { Task } from "../services/models";
import { getTodos } from "../services/todos";

interface TodosState {
	items: Task[];
	loading: boolean;
	error: string | null;
}

const initialState: TodosState = {
	items: [],
	loading: false,
	error: null,
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
	return await getTodos();
});

const todosSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
		addTodoOptimistic: (state, action: PayloadAction<Task>) => {
			state.items.push(action.payload);
		},
		removeTodoOptimistic: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(item => item.id !== action.payload);
		},
		updateTodoOptimistic: (state, action: PayloadAction<Task>) => {
			const index = state.items.findIndex(
				item => item.id === action.payload.id
			);
			if (index !== -1) {
				state.items[index] = action.payload;
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchTodos.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTodos.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchTodos.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? "Chyba při načítání";
			});
	},
});

export const { addTodoOptimistic, removeTodoOptimistic, updateTodoOptimistic } =
	todosSlice.actions;
export default todosSlice.reducer;
