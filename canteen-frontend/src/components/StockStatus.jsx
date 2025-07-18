import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockStatus = () => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/stock_status')
      .then(res => setStock(res.data.stock))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📦 Stock Status</h2>
      <ul>
        {stock.map(item => (
          <li key={item.item}>
            {item.item}: {item.available} / {item.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockStatus;
