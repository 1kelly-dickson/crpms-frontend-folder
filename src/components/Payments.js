import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Payments(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ PaymentNumber:'', RecordNumber:'', AmountPaid:'', PaymentDate:'', ReceivedBy:''});
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);
  async function load(){
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/payments');
      setList(res.data);
    } catch (err) {
      setError('Failed to load payments. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function submit(e){ 
    e.preventDefault();
    if (!form.PaymentNumber || !form.RecordNumber || !form.AmountPaid || !form.PaymentDate || !form.ReceivedBy) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if(editing){
        await api.put('/api/payments/' + editing.PaymentNumber, form);
        setEditing(null);
      } else {
        await api.post('/api/payments', form);
      }
      setForm({ PaymentNumber:'', RecordNumber:'', AmountPaid:'', PaymentDate:'', ReceivedBy:''}); 
      load();
    } catch (err) {
      setError('Failed to save payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function remove(number){ 
    if(window.confirm('Delete this payment?')) {
      setLoading(true);
      setError('');
      try {
        await api.delete('/api/payments/' + number); 
        load();
      } catch (err) {
        setError('Failed to delete payment. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }
  function edit(payment){
    setForm({...payment});
    setEditing(payment);
  }
  function cancel(){
    setForm({ PaymentNumber:'', RecordNumber:'', AmountPaid:'', PaymentDate:'', ReceivedBy:''});
    setEditing(null);
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Payments</h3>
      
      {error && <div className="mb-4 text-red-600">{error}</div>}
      
      <form onSubmit={submit} className="grid grid-cols-2 gap-2 mb-4">
        <input placeholder="Payment#" value={form.PaymentNumber} onChange={e=>setForm({...form, PaymentNumber:e.target.value})} className="border p-2" disabled={!!editing} />
        <input placeholder="Record#" value={form.RecordNumber} onChange={e=>setForm({...form, RecordNumber:e.target.value})} className="border p-2" />
        <input placeholder="Amount" value={form.AmountPaid} onChange={e=>setForm({...form, AmountPaid:e.target.value})} className="border p-2" />
        <input type="datetime-local" value={form.PaymentDate} onChange={e=>setForm({...form, PaymentDate:e.target.value})} className="border p-2" />
        <input placeholder="ReceivedBy" value={form.ReceivedBy} onChange={e=>setForm({...form, ReceivedBy:e.target.value})} className="border p-2" />
        <div className="col-span-2 text-right space-x-2">
          <button disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50">{editing ? 'Update' : 'Save'} Payment</button>
          {editing && <button type="button" onClick={cancel} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr><th>Payment#</th><th>Date</th><th>Record</th><th>Plate</th><th>Service</th><th>Amount</th><th>ReceivedBy</th><th>Actions</th></tr></thead>
          <tbody>{list.map(p=> (
            <tr key={p.PaymentNumber}>
              <td>{p.PaymentNumber}</td>
              <td>{p.PaymentDate}</td>
              <td>{p.RecordNumber}</td>
              <td>{p.PlateNumber}</td>
              <td>{p.ServiceName}</td>
              <td>RWF {p.AmountPaid}</td>
              <td>{p.ReceivedBy}</td>
              <td>
                <button onClick={()=>edit(p)} disabled={loading} className="text-blue-600 mr-2 disabled:opacity-50">Edit</button>
                <button onClick={()=>remove(p.PaymentNumber)} disabled={loading} className="text-red-600 disabled:opacity-50">Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}