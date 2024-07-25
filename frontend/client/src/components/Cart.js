import React from 'react';

const Cart = ({ cartItems, onRemoveItem, onCheckout }) => {
  const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.productId}>
            <p>{item.name} - {item.quantity} x ${item.price}</p>
            <button onClick={() => onRemoveItem(item.productId)}>Remove</button>
          </div>
        ))
      )}
      <h3>Total: ${totalAmount.toFixed(2)}</h3>
      <button onClick={onCheckout} disabled={cartItems.length === 0}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
