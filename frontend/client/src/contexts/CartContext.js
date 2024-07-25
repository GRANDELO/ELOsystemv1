import axios from 'axios';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    default:
      return state;
  }
};

const fetchCart = async (dispatch) => {
  try {
    const response = await axios.get('https://elosystemv1.onrender.com/api/cart/cart');
    dispatch({ type: 'SET_CART', payload: response.data.items });
  } catch (error) {
    console.error('Failed to fetch cart:', error);
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    fetchCart(dispatch);
  }, []);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
