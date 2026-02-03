'use client'

interface TodoProps {
    id: string,
    done: boolean,
    todo: string
}

export function TodoList({ todos }: { todos: TodoProps[] }) {


  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>
            {todo.todo}
          </span>
          <span>{todo.done ? '✅' : '⏳'}</span>
        </li>
      ))}
    </ul>
  );
}