import { useEffect } from 'react';
import api from './API';
import './App.css';
import Login from './Login';
import Register from './Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewTodo from './ViewTodo';

//check token
export const checkToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      const response = await api.post('/auth/tokenCheck', { refreshToken });
      localStorage.setItem('accessToken', response?.data?.data);
    } catch (error) {
      console.error('Failed to refresh token', error);
    }
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/all-todo" element={<ViewTodo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
