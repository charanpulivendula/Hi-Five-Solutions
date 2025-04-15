import { createSlice } from "@reduxjs/toolkit";
const todoSlice = createSlice({
    name: "todo",
    initialState: { list: [] },
    reducers: {
      addTodo: (state, action) => {
        state.list.push(action.payload);
      },
      removeTodo: (state, action) => {
        state.list = state.list.filter((_, index) => index !== action.payload);
      },
    },
  });
  export const { addTodo, removeTodo } = todoSlice.actions;
  export default todoSlice

