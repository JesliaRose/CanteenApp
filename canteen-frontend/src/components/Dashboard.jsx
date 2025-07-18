import React, { useState } from "react";
import OrderForm from "./OrderForm";
import OrdersToday from "./OrdersToday";
import StockStatus from "./StockStatus";
import StudentOrders from "./StudentOrders";

export default function Dashboard() {
  const [role, setRole] = useState("student");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderPlaced = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 mx-2 rounded ${
            role === "student" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setRole("student")}
        >
          Student
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            role === "staff" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
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
