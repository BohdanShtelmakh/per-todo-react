import { useTodos } from '../../hooks/useTodos';
import SearchTodo from './SearchTodo';
import TodoCount from './TodoCount';
import TodoFilter from './TodoFIlter';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

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
    getTodos,
    getFilteredTodos,
    updateOrder,
    loading,
    error,
  } = useTodos();

  return (
    <div>
      <h1 className='text-3xl font-bold text-center mb-4'>📝 My ToDo List</h1>
      <TodoCount getTodos={getTodos} />
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
