import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Cars(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ PlateNumber:'', type:'', Model:'', ManufacturingYear:'', DriverPhone:'', MechanicName:''});
  const [editing, setEditing] = useState(null);

  useEffect(() => { load(); }, []);  // Fixed: Call load() inside the callback without returning it
  async function load(){ const res = await api.get('/api/cars'); setList(res.data); }
  async function submit(e){ 
    e.preventDefault(); 
    if(editing){
      await api.put('/api/cars/' + editing.PlateNumber, form);
      setEditing(null);
    } else {
      await api.post('/api/cars', form);
    }
    setForm({ PlateNumber:'', type:'', Model:'', ManufacturingYear:'', DriverPhone:'', MechanicName:''}); 
    load(); 
  }
  async function remove(plate){ 
    if(window.confirm('Delete this car?')) {
      await api.delete('/api/cars/' + plate); 
      load(); 
    }
  }
  function edit(car){
    setForm({...car});
    setEditing(car);
  }
  function cancel(){
    setForm({ PlateNumber:'', type:'', Model:'', ManufacturingYear:'', DriverPhone:'', MechanicName:''});
    setEditing(null);
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Cars</h3>
      <form onSubmit={submit} className="grid grid-cols-2 gap-2 mb-4">
        <input placeholder="PlateNumber" value={form.PlateNumber} onChange={e=>setForm({...form, PlateNumber:e.target.value})} className="border p-2" disabled={!!editing} />
        <input placeholder="Type" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="border p-2" />
        <input placeholder="Model" value={form.Model} onChange={e=>setForm({...form, Model:e.target.value})} className="border p-2" />
        <input placeholder="Year" value={form.ManufacturingYear} onChange={e=>setForm({...form, ManufacturingYear:e.target.value})} className="border p-2" />
        <input placeholder="DriverPhone" value={form.DriverPhone} onChange={e=>setForm({...form, DriverPhone:e.target.value})} className="border p-2" />
        <input placeholder="MechanicName" value={form.MechanicName} onChange={e=>setForm({...form, MechanicName:e.target.value})} className="border p-2" />
        <div className="col-span-2 text-right space-x-2">
          <button className="bg-green-600 text-white px-3 py-1 rounded">{editing ? 'Update' : 'Add'} Car</button>
          {editing && <button type="button" onClick={cancel} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr><th>Plate</th><th>Type</th><th>Model</th><th>Year</th><th>Driver Phone</th><th>Mechanic</th><th>Actions</th></tr></thead>
          <tbody>{list.map(s=> (
            <tr key={s.PlateNumber}>
              <td>{s.PlateNumber}</td>
              <td>{s.type}</td>
              <td>{s.Model}</td>
              <td>{s.ManufacturingYear}</td>
              <td>{s.DriverPhone}</td>
              <td>{s.MechanicName}</td>
              <td>
                <button onClick={()=>edit(s)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={()=>remove(s.PlateNumber)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}