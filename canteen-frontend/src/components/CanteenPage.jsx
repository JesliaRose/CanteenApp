import React, { useState } from 'react';
import OrderForm from './OrderForm';
import OrdersToday from './OrdersToday';
import StockStatus from './StockStatus';

const CanteenPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderPlaced = () => {
    // Increment trigger to notify OrdersToday to refetch
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <OrderForm onOrderPlaced={handleOrderPlaced} />
      <OrdersToday refreshTrigger={refreshTrigger} />
      <StockStatus refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default CanteenPage;
