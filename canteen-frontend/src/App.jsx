import "./App.css";
import StockStatus from "./components/StockStatus";
import OrdersToday from "./components/OrdersToday";
import StudentOrders from "./components/StudentOrders";
import OrderForm from "./components/OrderForm";

function App() {
  return <>
  <div>
    <h1>Canteen Dashboard</h1>
    <OrdersToday />
    <StockStatus />
    <StudentOrders />
    <OrderForm />
  </div>
  </>;
}

export default App;
