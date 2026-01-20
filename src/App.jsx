import { useState, useEffect } from 'react'
import { fetchTransactions } from './mockApi,js';
import { calculatePoints, processRewards } from './utils';


// HomeWork for UI:
//     A retailer offers a rewards program to its customers, awarding points based on each recorded purchase. 
//  
//     A customer receives 2 points for every dollar spent over $100 in each transaction, plus 1 point for every dollar spent between $50 and $100 in each     transaction.
//     (e.g. a $120 purchase = 2x$20 + 1x$50 = 90 points).
//  
//     Given a record of every transaction during a three month period, calculate the reward points earned for each customer per month and total.


function App() {
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("All");


  // fetching the transactions
  useEffect(() => {
    fetchTransactions().then(data => {
      setTransactions(data);
      setRewards(processRewards(data));
    });
  }, []);


  // months array for the filter
  const months = useMemo(() => {
    const set = new Set();

    transactions.forEach(tx => {
      set.add(new Date(tx.date).toLocaleString("default", { month: "long" }));
    });

    return ["All", ...Array.from(set)];   
  }, [transactions]);


  return (
    <div style={{ padding: 20 }}>
      <h1>Account Transactions and Reward Points</h1>

      <h2>Total Points by Account</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginBottom: 50 }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rewards).map(customer => (
            <tr key={customer}>
              <td>{customer}</td>
              <td>{rewards[customer].Total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Filter by month*/}
      <label>
        Filter by Month:
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          {months.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>

      {/* All Transactions */}
      <h2>All Transactions</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Month</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .filter(tx => {
              const month = new Date(tx.date).toLocaleString("default", { month: "long" });
              return selectedMonth === "All" || month === selectedMonth;
            })
            .map(tx => (
              <tr key={tx.id}>
                <td>{tx.transactionId}</td>
                <td>{tx.name}</td>
                <td>{tx.date}</td>
                <td>{new Date(tx.date).toLocaleString("default", { month: "long" })}</td>
                <td>{tx.category}</td>
                <td>{tx.amount}</td>
                <td><b>{calculatePoints(tx.amount)}</b></td>
              </tr>
            ))}
        </tbody>
      </table>

      <h2>Reward Points by Account and month</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Month</th>
            <th>Accumulated Points by month</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rewards).map(customer => (
            Object.keys(rewards[customer])
              .filter(month => month !== "Total")
              .filter(month => selectedMonth === "All" || month === selectedMonth)
              .map(month => (
                <tr key={`${customer}-${month}`}>
                  <td>{customer}</td>
                  <td>{month}</td>
                  <td><b>{rewards[customer][month]}</b></td>
                </tr>
              ))
          ))}
        </tbody>
      </table>

      
    </div>
  );
}

export default App
