import React, { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  async function submit(e){
    e.preventDefault();
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const res = await api.post(endpoint, { username, password }).catch(()=>null);
    if(res && res.data && res.data.ok) {
      if(isRegistering) {
        alert('Registration successful! Please login.');
        setIsRegistering(false);
      } else {
        onLogin(res.data.user || { username });
      }
    } else {
      alert(isRegistering ? 'Registration failed' : 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit}>
        <label className="block mb-2">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full border p-2 mb-3" />
        <label className="block mb-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 mb-3" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2">{isRegistering ? 'Register' : 'Login'}</button>
        <button type="button" onClick={()=>setIsRegistering(!isRegistering)} className="text-blue-600 text-sm w-full">
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
}
