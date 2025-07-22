import SearchTodo from './components/todo/SearchTodo';
import TodoCount from './components/todo/TodoCount';
import TodoFilter from './components/todo/TodoFIlter';
import TodoForm from './components/todo/TodoForm';
import TodoList from './components/todo/TodoList';
import { Theme } from './components/ui/Theme';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    filter,
    setFilter,
    search,
    setSearch,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    getTodos,
    getFilteredTodos,
    updateOrder,
  } = useTodos();

  return (
    <div className='min-h-screen w-full flex items-start justify-center bg-gray-100 dark:bg-zinc-900 p-4'>
      <div className='w-full sm:w-auto max-w-2xl bg-white dark:bg-zinc-800 text-black dark:text-white p-4 sm:p-8 rounded-lg shadow-md'>
        <Theme />
        <h1 className='text-3xl font-bold text-center mb-4'>📝 My ToDo List</h1>
        <TodoCount getTodos={getTodos} />
        <TodoFilter filter={filter} setFilter={setFilter} />
        <SearchTodo search={search} setSearch={setSearch} />
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={getFilteredTodos()}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          updateOrder={updateOrder}
        />
      </div>
    </div>
  );
}

export default App;
