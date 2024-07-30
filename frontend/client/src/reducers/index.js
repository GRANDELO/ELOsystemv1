import { combineReducers } from 'redux';
import cartReducer from './cartReducer'; // Import your cart reducer here

const rootReducer = combineReducers({
  cart: cartReducer, // Add your reducers here
  // other reducers can be added here
});

export default rootReducer;
