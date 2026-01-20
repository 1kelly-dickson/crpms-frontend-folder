import React, { useState } from 'react';
// import api from '../api';

export default function Login({ onLogin }){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const users = [
  { username: "kelly", password: "kelly12345" }
];


  async function submit(e){
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if(user) {
      onLogin({ username });
    } else {
      alert('Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit}>
        <label className="block mb-2">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full border p-2 mb-3" />
        <label className="block mb-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 mb-3" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2">Login</button>
      </form>
    </div>
  );
}
