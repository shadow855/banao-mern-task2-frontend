import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login'
import Signup from './components/SignUp'
import Posts from './components/Posts';
import Navbar from './components/Navbar';

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/posts' element={<Posts />} />
      </Routes>
    </>
  );
}

export default App;
