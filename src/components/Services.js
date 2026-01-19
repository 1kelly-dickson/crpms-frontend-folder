import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Services(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ ServiceCode: '', ServiceName: '', ServicePrice: ''});
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(()=>{ load(); }, []);
  async function load(){ const res = await api.get('/api/services'); setList(res.data); }
  
  function validateForm(){
    const newErrors = {};
    if(!form.ServiceCode.trim()) newErrors.ServiceCode = 'Service code is required';
    if(!form.ServiceName.trim()) newErrors.ServiceName = 'Service name is required';
    if(!form.ServicePrice || form.ServicePrice <= 0) newErrors.ServicePrice = 'Valid price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  async function submit(e){ 
    e.preventDefault(); 
    if(!validateForm()) return;
    
    try {
      if(editing){
        await api.put('/api/services/' + editing.ServiceCode, form);
        setEditing(null);
      } else {
        await api.post('/api/services', form);
      }
      setForm({ServiceCode:'',ServiceName:'',ServicePrice:''}); 
      setErrors({});
      load(); 
    } catch (error) {
      alert('Error saving service');
    }
  }
  
  async function remove(code){ 
    if(window.confirm('Delete this service?')) {
      try {
        await api.delete('/api/services/' + code); 
        load(); 
      } catch (error) {
        alert('Error deleting service');
      }
    }
  }
  
  function edit(service){
    setForm({ServiceCode: service.ServiceCode, ServiceName: service.ServiceName, ServicePrice: service.ServicePrice});
    setEditing(service);
    setErrors({});
  }
  
  function cancel(){
    setForm({ServiceCode:'',ServiceName:'',ServicePrice:''});
    setEditing(null);
    setErrors({});
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Services</h3>
      <form onSubmit={submit} className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <input placeholder="Code" value={form.ServiceCode} onChange={e=>{setForm({...form, ServiceCode:e.target.value}); if(errors.ServiceCode) setErrors({...errors, ServiceCode:''})}} className={`border p-2 w-full ${errors.ServiceCode ? 'border-red-500' : ''}`} disabled={!!editing} />
          {errors.ServiceCode && <div className="text-red-500 text-sm mt-1">{errors.ServiceCode}</div>}
        </div>
        <div>
          <input placeholder="Name" value={form.ServiceName} onChange={e=>{setForm({...form, ServiceName:e.target.value}); if(errors.ServiceName) setErrors({...errors, ServiceName:''})}} className={`border p-2 w-full ${errors.ServiceName ? 'border-red-500' : ''}`} />
          {errors.ServiceName && <div className="text-red-500 text-sm mt-1">{errors.ServiceName}</div>}
        </div>
        <div>
          <input type="number" step="0.01" placeholder="Price" value={form.ServicePrice} onChange={e=>{setForm({...form, ServicePrice:e.target.value}); if(errors.ServicePrice) setErrors({...errors, ServicePrice:''})}} className={`border p-2 w-full ${errors.ServicePrice ? 'border-red-500' : ''}`} />
          {errors.ServicePrice && <div className="text-red-500 text-sm mt-1">{errors.ServicePrice}</div>}
        </div>
        <div className="col-span-3 text-right space-x-2">
          <button className="bg-green-600 text-white px-3 py-1 rounded">{editing ? 'Update' : 'Add'} Service</button>
          {editing && <button type="button" onClick={cancel} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>}
        </div>
      </form>
      <table className="w-full text-left">
        <thead><tr><th>Code</th><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
        <tbody>{list.map(s=> (
          <tr key={s.ServiceCode}>
            <td>{s.ServiceCode}</td>
            <td>{s.ServiceName}</td>
            <td>₦{parseFloat(s.ServicePrice).toLocaleString()}</td>
            <td>
              <button onClick={()=>edit(s)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={()=>remove(s.ServiceCode)} className="text-red-600">Delete</button>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
