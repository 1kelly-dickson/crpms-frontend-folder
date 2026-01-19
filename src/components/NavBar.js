import React from 'react';

export default function NavBar({ onNavigate, onLogout, user }){
  return (
    <nav className="bg-white shadow p-3 flex items-center justify-between">
      <div className="flex gap-3">
        <button onClick={()=>onNavigate('services')} className="text-sm">Services</button>
        <button onClick={()=>onNavigate('cars')} className="text-sm">Car</button>
        <button onClick={()=>onNavigate('records')} className="text-sm">ServiceRecord</button>
        <button onClick={()=>onNavigate('payments')} className="text-sm">Payment</button>
        <button onClick={()=>onNavigate('reports')} className="text-sm">Reports</button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm">{user.username}</span>
        <button onClick={onLogout} className="text-sm text-red-600">Logout</button>
      </div>
    </nav>
  );
}
