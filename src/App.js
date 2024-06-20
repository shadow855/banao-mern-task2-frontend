import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login'
import Signup from './components/SignUp'

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
