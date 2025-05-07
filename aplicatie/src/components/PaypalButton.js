// aplicatie/src/components/PaypalButton.js
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();

  const createOrderPayload = () => ({
    products: cartItems.map(item => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
    })),
    totalPrice: amount,
    orderStatus: "Plătită",
    shippingAddress: {
      street: "Str. Exemplu 1",
      city: "București",
      state: "B",
      zip: "010101",
      country: "RO"
    },
    paymentMethod: "PayPal",
    paymentStatus: "Finalizat"
  });

  return (
    <PayPalScriptProvider options={{ "client-id": "ASdt6M6hAWxehR69lfBKqwMP4j1qY5wsJTIFSIv985CoY13r6S_n4kVT-Ax577mtB6UuZjrO5DKXKzJ1" }}>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() } }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(async (details) => {
            try {
              const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(createOrderPayload())
              });

              if (!response.ok) throw new Error("Eroare la salvarea comenzii");

              localStorage.removeItem("cart");
              clearCart();
              onSuccess(); // ex: afișare modal succes

            } catch (err) {
              console.error("Eroare salvare comandă:", err);
              if (onError) onError("Comanda nu a putut fi salvată.");
            }
          });
        }}
        onError={(err) => {
          console.error("Eroare PayPal:", err);
          if (onError) onError("A apărut o eroare la procesarea plății.");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
