import { useTodos } from '../../hooks/useTodos';
import SearchTodo from './components/SearchTodo';
import TodoCount from './components/TodoCount';
import TodoFilter from './components/TodoFIlter';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default function Todo() {
  const {
    filter,
    setFilter,
    search,
    setSearch,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    getTodosCount,
    getFilteredTodos,
    updateOrder,
    loading,
    error,
  } = useTodos();

  return (
    <div>
      <h1 className='text-3xl font-bold text-center mb-4'>📝 My ToDo List</h1>
      <TodoCount getTodosCount={getTodosCount} />
      <TodoFilter filter={filter} setFilter={setFilter} />
      <SearchTodo search={search} setSearch={setSearch} />
      <TodoForm addTodo={addTodo} />
      {loading && <p className='text-center text-gray-500'>Loading...</p>}
      {error && <p className='text-center text-red-500'>{error}</p>}
      <TodoList
        todos={getFilteredTodos()}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
        updateOrder={updateOrder}
      />
    </div>
  );
}
