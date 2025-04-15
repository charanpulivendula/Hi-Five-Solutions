import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "./Redux/store";
import { Provider } from "react-redux";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material";
import { addTodo, removeTodo } from "./Redux/reducer";

// Card Component
const TodoCard = ({ todos, addTask, removeTask, mode }) => {
  const [input, setInput] = useState("");

  return (
    <Card
      sx={{
        p: 2,
        m: 2,
        width: "300px",
        border: "2px solid",
        borderColor: mode === "Redux" ? "red" : "blue",
        backgroundColor: mode === "Redux" ? "#ffe5e5" : "#e5f2ff",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: mode === "Redux" ? "red" : "blue", textAlign: "center" }}>
          {mode} Mode
        </Typography>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task"
          fullWidth
          sx={{ mt: 1 }}
        />
        <Button
          variant="contained"
          color={mode === "Redux" ? "error" : "primary"}
          sx={{ mt: 2, display: "block", margin: "0 auto" }}
          onClick={() => {
            if (input.trim() !== "") {
              addTask(input);
              setInput("");
            }
          }}
        >
          Add Task
        </Button>
        <ul style={{ marginTop: "10px", padding: 0, textAlign: "center" }}>
          {todos.map((todo, index) => (
            <li key={index} style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
              {todo}
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => removeTask(index)}
              >
                ❌
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Main Component
const SharedStateExample = () => {
  const [useGlobalState, setUseGlobalState] = useState(false);

  // useState Implementation
  const [localTodos, setLocalTodos] = useState([]);
  const addLocalTodo = (task) => setLocalTodos([...localTodos, task]);
  const removeLocalTodo = (index) => setLocalTodos(localTodos.filter((_, i) => i !== index));

  // Redux Implementation
  const dispatch = useDispatch();
  const globalTodos = useSelector((state) => state.todo.list);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", textAlign: "center" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setUseGlobalState(!useGlobalState)}
      >
        Toggle Mode: {useGlobalState ? "Use useState" : "Use Redux"}
      </Button>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        <TodoCard
          todos={useGlobalState ? globalTodos : localTodos}
          addTask={useGlobalState ? (task) => dispatch(addTodo(task)) : addLocalTodo}
          removeTask={useGlobalState ? (index) => dispatch(removeTodo(index)) : removeLocalTodo}
          mode={useGlobalState ? "Redux" : "useState"}
        />
        <TodoCard
          todos={useGlobalState ? globalTodos : localTodos}
          addTask={useGlobalState ? (task) => dispatch(addTodo(task)) : addLocalTodo}
          removeTask={useGlobalState ? (index) => dispatch(removeTodo(index)) : removeLocalTodo}
          mode={useGlobalState ? "Redux" : "useState"}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <SharedStateExample />
    </Provider>
  );
}
