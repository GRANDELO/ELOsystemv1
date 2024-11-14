const initialState = {
    items: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CART':
        return {
          ...state,
          items: action.payload,
        };
      // Add other actions here
      default:
        return state;
    }
  };
  
  export default cartReducer;
  