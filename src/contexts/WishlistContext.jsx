import React, { createContext, useContext, useReducer } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const existingItem = state.items.find(item => item.product.id === action.product.id);

      if (existingItem) {
        return state;
      }

      const newItems = [...state.items, { id: Date.now().toString(), product: action.product }];

      return { items: newItems };
    }

    case 'REMOVE_FROM_WISHLIST': {
      const newItems = state.items.filter(item => item.product.id !== action.productId);
      return { items: newItems };
    }

    case 'CLEAR_WISHLIST':
      return { items: [] };

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, { items: [] });

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId) => {
    return wishlist.items.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        dispatch,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
