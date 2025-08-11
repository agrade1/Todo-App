import { useState } from "react";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([
    { id: 0, content: "123", done: false },
    { id: 1, content: "코딩 공부하기", done: false },
    { id: 2, content: "잠 자기", done: true },
  ]);

  return (
    <div className="app">
      <Header />
      <TodoInput todoList={todoList} setTodoList={setTodoList} />
      <TodoList todoList={todoList} setTodoList={setTodoList} />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>📝 Todo App</h1>
      <p className="sub">할 일 적고, 체크하고, 수정하고, 지우기</p>
    </header>
  );
}

function TodoInput({ todoList, setTodoList }) {
  const [value, setValue] = useState("");

  const addTodo = () => {
    const text = value.trim();
    if (!text) return;
    const newTodo = { id: Date.now(), content: text, done: false };
    setTodoList([...todoList, newTodo]);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="input-row">
      <input
        className="input"
        placeholder="할 일을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button className="btn primary" onClick={addTodo} disabled={!value.trim()}>
        추가
      </button>
    </div>
  );
}

function TodoList({ todoList, setTodoList }) {
  if (todoList.length === 0) {
    return <p className="empty">할 일이 없습니다. 추가해보세요!</p>;
  }

  return (
    <ul className="list">
      {todoList.map((todo) => (
        <TodoItem key={todo.id} todo={todo} setTodoList={setTodoList} />
      ))}
    </ul>
  );
}

function TodoItem({ todo, setTodoList }) {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(todo.content);

  const toggleDone = () => {
    setTodoList((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t))
    );
  };

  const startEdit = () => {
    setTemp(todo.content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const text = temp.trim();
    if (!text) return setIsEditing(false); // 빈 값 저장 방지(그냥 취소 느낌)
    setTodoList((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, content: text } : t))
    );
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTemp(todo.content);
    setIsEditing(false);
  };

  const remove = () => {
    setTodoList((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <li className="item">
      <label className="left">
        <input type="checkbox" checked={todo.done} onChange={toggleDone} />
        {!isEditing ? (
          <span className={`text ${todo.done ? "done" : ""}`}>{todo.content}</span>
        ) : (
          <input
            className="edit-input"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            autoFocus
          />
        )}
      </label>

      <div className="right">
        {!isEditing ? (
          <>
            <button className="btn ghost" onClick={startEdit}>수정</button>
            <button className="btn danger" onClick={remove}>삭제</button>
          </>
        ) : (
          <>
            <button className="btn success" onClick={saveEdit} disabled={!temp.trim()}>저장</button>
            <button className="btn ghost" onClick={cancelEdit}>취소</button>
          </>
        )}
      </div>
    </li>
  );
}

export default App;
