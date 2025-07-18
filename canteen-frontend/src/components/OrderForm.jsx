import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

export default function OrderForm({ onOrderPlaced }) {
  const [roll, setRoll] = useState("");
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/menu")
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleQtyChange = (itemId, qty) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: qty,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderPayload = {
      roll: roll,
      items: Object.entries(selectedItems)
        .filter(([_, qty]) => qty && parseInt(qty) > 0)
        .map(([itemId, qty]) => ({
          item_id: parseInt(itemId),
          qty: parseInt(qty),
        })),
    };
    setOrderId("order_123");

    try {
      const res = await axios.post(
        "http://localhost:5000/place_order",
        orderPayload
      );
      alert(res.data.message);
      setQrData(
        JSON.stringify({
          roll: roll,
          time: new Date().toLocaleString(),
        })
      );
      setSelectedItems({});
      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      //alert(err.response?.data?.error || "Order failed");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-lg max-w-lg mx-auto shadow"
      >
        <h2 className="text-xl font-semibold mb-2">Place Order</h2>

        <input
          type="text"
          placeholder="Enter Roll Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          className="w-full p-2 border mb-4"
          required
        />

        {Array.isArray(menu) ? (
          menu.map((item, index) => (
            <div key={index} className="form-div">
              <span className="menu-items">
                {item.name} (₹{item.price}) 
              </span>
              <input
                type="number"
                min="0"
                max={item.available_quantity}
                placeholder="0"
                value={selectedItems[item.id] || ""}
                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                className="w-16 border p-1"
              />
            </div>
          ))
        ) : (
          <div>⚠️ Menu is not an array</div>
        )}

        <button type="submit">Submit Order</button>
      </form>
      {orderId && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Scan this QR to pick up your order
          </h3>
          <QRCode value={orderId} />
        </div>
      )}
    </>
  );
}
