import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ServiceRecords(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ RecordNumber:'', PlateNumber:'', ServiceCode:'', ServiceDate:''});
  const [editing, setEditing] = useState(null);

  useEffect(()=>load(),[]);
  async function load(){ const res = await api.get('/api/records'); setList(res.data); }
  async function submit(e){ 
    e.preventDefault(); 
    if(editing){
      await api.put('/api/records/' + editing.RecordNumber, form);
      setEditing(null);
    } else {
      await api.post('/api/records', form);
    }
    setForm({ RecordNumber:'', PlateNumber:'', ServiceCode:'', ServiceDate:''}); 
    load(); 
  }
  async function remove(id){ 
    if(window.confirm('Delete this service record?')) {
      await api.delete('/api/records/'+id); 
      load(); 
    }
  }
  function edit(record){
    setForm({...record});
    setEditing(record);
  }
  function cancel(){
    setForm({ RecordNumber:'', PlateNumber:'', ServiceCode:'', ServiceDate:''});
    setEditing(null);
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Service Records</h3>
      <form onSubmit={submit} className="grid grid-cols-4 gap-2 mb-4">
        <input placeholder="Record#" value={form.RecordNumber} onChange={e=>setForm({...form, RecordNumber:e.target.value})} className="border p-2" disabled={!!editing} />
        <input placeholder="Plate" value={form.PlateNumber} onChange={e=>setForm({...form, PlateNumber:e.target.value})} className="border p-2" />
        <input placeholder="ServiceCode" value={form.ServiceCode} onChange={e=>setForm({...form, ServiceCode:e.target.value})} className="border p-2" />
        <input type="date" value={form.ServiceDate} onChange={e=>setForm({...form, ServiceDate:e.target.value})} className="border p-2" />
        <div className="col-span-4 text-right space-x-2">
          <button className="bg-green-600 text-white px-3 py-1 rounded">{editing ? 'Update' : 'Add'} Record</button>
          {editing && <button type="button" onClick={cancel} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr><th>Record</th><th>Date</th><th>Plate</th><th>Service</th><th>Actions</th></tr></thead>
          <tbody>{list.map(s=> (
            <tr key={s.RecordNumber}>
              <td>{s.RecordNumber}</td>
              <td>{s.ServiceDate}</td>
              <td>{s.PlateNumber}</td>
              <td>{s.ServiceName}</td>
              <td>
                <button onClick={()=>edit(s)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={()=>remove(s.RecordNumber)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
