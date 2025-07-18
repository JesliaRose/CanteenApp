import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./styles.css";

const StockStatus = ({refreshTrigger}) => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/stock_status')
      .then(res => setStock(res.data.stock))
      .catch(err => console.error(err));
  }, [refreshTrigger]);

  return (
    <div>
      <h2>📦 Stock Status</h2>
      <ul className='no-bullets'>
        {stock.map(item => (
          <li key={item.item}>
            {item.item}: {item.available}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockStatus;
