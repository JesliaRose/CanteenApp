import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./styles.css";

const OrdersToday = ({refreshTrigger}) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/orders_today')
      .then(res => setOrders(res.data.orders))
      .catch(err => console.error(err));
  }, [refreshTrigger]);

  return (
    <div>
      <h2>📊 Orders Today</h2>
      <ul className='no-bullets'>
        {orders.map((o, idx) => (
          <li key={idx}>
            {o.item}: {o.total_ordered}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersToday;
