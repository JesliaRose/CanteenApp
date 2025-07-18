import React, { useState } from 'react';
import axios from 'axios';
import "./styles.css";

const StudentOrders = () => {
  const [roll, setRoll] = useState('');
  const [orders, setOrders] = useState([]);
  const [student, setStudent] = useState(null);

  const fetchOrders = () => {
    axios.get(`http://localhost:5000/student_orders/${roll}`)
      .then(res => {
        setStudent(res.data.student);
        setOrders(res.data.orders);
      })
      .catch(() => {
        setStudent(null);
        setOrders([]);
        alert("Student not found");
      });
  };

  return (
    <div>
      <h2>🎓 Student Orders</h2>
      <input type="text" placeholder="Enter roll number" value={roll} onChange={(e) => setRoll(e.target.value)} />
      <button onClick={fetchOrders}>Check</button>

      {student && (
        <div>
          <h3>Orders by {student}:</h3>
          <ul className='no-bullets'>
            {orders.map((o, i) => (
              <li key={i}>{o.item}: {o.quantity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentOrders;
