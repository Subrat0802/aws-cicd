// page.tsx
import {prismaClient} from "@repo/db/client";
import { TodoList } from "./components/TodoList";


export default async function Home() {
  const todos = await prismaClient.todo.findMany();

  return (
    <div>
      <h1>All Todos</h1>
      <TodoList todos={todos} />
    </div>
  );
}