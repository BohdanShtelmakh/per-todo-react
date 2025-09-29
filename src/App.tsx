import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/ui/NavBar';
import About from './pages/about/About';
import Login from './pages/auth/Login';
import Todo from './pages/todo/Todo';
import Protected from './routes/Protected';
import { AuthProvider } from './state/AuthContext';
import Register from './pages/auth/Register';

function App() {
  return (
    <div className='min-h-screen w-full flex items-start justify-center bg-gray-100 dark:bg-zinc-900 p-4'>
      <AuthProvider>
        <BrowserRouter>
          <div className='w-full sm:w-auto max-w-2xl bg-white dark:bg-zinc-800 text-black dark:text-white p-4 sm:p-8 rounded-lg shadow-md'>
            <Routes>
              <Route path='/' element={<NavBar />}>
                <Route element={<Protected />}>
                  <Route index path='/' element={<Todo />} />
                </Route>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<div>404 Not Found</div>} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
