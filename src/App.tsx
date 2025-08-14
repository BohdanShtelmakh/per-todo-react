import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './components/about';
import Todo from './components/todo';
import NavBar from './components/ui/NavBar';

function App() {
  return (
    <div className='min-h-screen w-full flex items-start justify-center bg-gray-100 dark:bg-zinc-900 p-4'>
      <BrowserRouter>
        <div className='w-full sm:w-auto max-w-2xl bg-white dark:bg-zinc-800 text-black dark:text-white p-4 sm:p-8 rounded-lg shadow-md'>
          <Routes>
            <Route path='/' element={<NavBar />}>
              <Route index path='/' element={<Todo />} />
              <Route path='/about' element={<About />} />
              <Route path='*' element={<div>404 Not Found</div>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
