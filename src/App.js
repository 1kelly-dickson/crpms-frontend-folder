import React, { useState } from 'react';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Services from './components/Services';
import Cars from './components/Cars';
import ServiceRecords from './components/ServiceRecords';
import Payments from './components/Payments';
import Reports from './components/Reports';
import api from './api';

export default function App(){
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  async function handleLogout(){
    await api.post('/auth/logout');
    setUser(null);
    setPage('login');
  }

  if(!user) return <Login onLogin={(u)=>{setUser(u); setPage('services')}} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar onNavigate={setPage} onLogout={handleLogout} user={user} />
      <main className="p-4">
        {page === 'services' && <Services />}
        {page === 'cars' && <Cars />}
        {page === 'records' && <ServiceRecords />}
        {page === 'payments' && <Payments />}
        {page === 'reports' && <Reports />}
      </main>
    </div>
  );
}
