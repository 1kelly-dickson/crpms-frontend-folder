import React, { useState } from 'react';
import api from '../api';

export default function Reports(){
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [dailyRows, setDailyRows] = useState([]);
  const [monthlyRows, setMonthlyRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadDaily(){ 
    if (!date) {
      setError('Please select a date.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ date });
      const res = await api.get(`/api/payments/reports/daily?${params}`);
      setDailyRows(res.data);
      setMonthlyRows([]);
      setSummary(null);
    } catch (err) {
      setError('Failed to load daily report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMonthly(){ 
    if (!month) {
      setError('Please select a month.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ month });
      const res = await api.get(`/api/payments/reports/monthly?${params}`);
      setMonthlyRows(res.data);
      setDailyRows([]);
      setSummary(null);
    } catch (err) {
      setError('Failed to load monthly report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSummary(){ 
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/payments/reports/summary'); 
      setSummary(res.data);
      setDailyRows([]);
      setMonthlyRows([]);
    } catch (err) {
      setError('Failed to load summary report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalDaily = dailyRows.reduce((sum, r) => sum + parseFloat(r.AmountPaid || 0), 0);
  const totalMonthly = monthlyRows.reduce((sum, r) => sum + parseFloat(r.AmountPaid || 0), 0);

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Reports</h3>
      
      {error && <div className="mb-4 text-red-600">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h4 className="font-semibold mb-2">Daily Report</h4>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border p-2 w-full mb-2" />
          <button onClick={loadDaily} disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded w-full disabled:opacity-50">Load Daily</button>
        </div>
        
        <div className="border p-4 rounded">
          <h4 className="font-semibold mb-2">Monthly Report</h4>
          <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="border p-2 w-full mb-2" />
          <button onClick={loadMonthly} disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded w-full disabled:opacity-50">Load Monthly</button>
        </div>
        
        <div className="border p-4 rounded">
          <h4 className="font-semibold mb-2">Summary Report</h4>
          <button onClick={loadSummary} disabled={loading} className="bg-purple-600 text-white px-3 py-1 rounded w-full disabled:opacity-50">Load Summary</button>
        </div>
      </div>

      {dailyRows.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Daily Report for {date}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border">
              <thead><tr className="bg-gray-50"><th className="p-2">Payment#</th><th className="p-2">Date</th><th className="p-2">Plate</th><th className="p-2">Service</th><th className="p-2">Amount</th><th className="p-2">ReceivedBy</th></tr></thead>
              <tbody>{dailyRows.map(r=> (<tr key={r.PaymentNumber} className="border-t"><td className="p-2">{r.PaymentNumber}</td><td className="p-2">{r.PaymentDate}</td><td className="p-2">{r.PlateNumber}</td><td className="p-2">{r.ServiceName}</td><td className="p-2">RWF {r.AmountPaid}</td><td className="p-2">{r.ReceivedBy}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="mt-2 text-right font-semibold">Total: RWF {totalDaily.toLocaleString()}</div>
        </div>
      )}

      {monthlyRows.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Monthly Report for {month}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border">
              <thead><tr className="bg-gray-50"><th className="p-2">Payment#</th><th className="p-2">Date</th><th className="p-2">Plate</th><th className="p-2">Service</th><th className="p-2">Amount</th><th className="p-2">ReceivedBy</th></tr></thead>
              <tbody>{monthlyRows.map(r=> (<tr key={r.PaymentNumber} className="border-t"><td className="p-2">{r.PaymentNumber}</td><td className="p-2">{r.PaymentDate}</td><td className="p-2">{r.PlateNumber}</td><td className="p-2">{r.ServiceName}</td><td className="p-2">RWF {r.AmountPaid}</td><td className="p-2">{r.ReceivedBy}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="mt-2 text-right font-semibold">Total: RWF {totalMonthly.toLocaleString()}</div>
        </div>
      )}

      {summary && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Summary Report</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border p-4 rounded text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.totalPayments || 0}</div>
              <div className="text-sm text-gray-600">Total Payments</div>
            </div>
            <div className="border p-4 rounded text-center">
              <div className="text-2xl font-bold text-green-600">RWF {(summary.totalAmount || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
            <div className="border p-4 rounded text-center">
              <div className="text-2xl font-bold text-purple-600">{summary.totalServices || 0}</div>
              <div className="text-sm text-gray-600">Services</div>
            </div>
            <div className="border p-4 rounded text-center">
              <div className="text-2xl font-bold text-orange-600">{summary.totalCars || 0}</div>
              <div className="text-sm text-gray-600">Cars</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}