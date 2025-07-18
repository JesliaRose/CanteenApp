import React, { useState } from "react";
import OrderForm from "./OrderForm";
import OrdersToday from "./OrdersToday";
import StockStatus from "./StockStatus";
import StudentOrders from "./StudentOrders";
import "./styles.css";

export default function Dashboard() {
  const [role, setRole] = useState("student");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderPlaced = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <div className="role-btn">
        <button
          onClick={() => setRole("student")}
        >
          Student
        </button>
        <button
          onClick={() => setRole("staff")}
        >
          Canteen Staff
        </button>
      </div>

      {role === "student" && (
        <>
          <OrderForm onOrderPlaced={handleOrderPlaced} />
          <StockStatus refreshTrigger={refreshTrigger} />
        </>
      )}

      {role === "staff" && (
        <>
          <OrdersToday />
          <StockStatus />
          <StudentOrders />  
        </>
      )}
    </div>
  );
}
