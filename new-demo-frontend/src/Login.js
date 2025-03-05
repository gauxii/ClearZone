// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Use the API URL from the environment variable
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      alert(response.data.message); // Handle response
    } catch (error) {
      alert(error.response.data.error); // Handle error
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
