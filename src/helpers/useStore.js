import { create } from "zustand";
import { persist } from "zustand/middleware";

// -------------------------
// Cart Slice
// -------------------------
const createCartSlice = (set, get) => ({
    cart: [],

    addToCart: (product, qty = 1) => {
        const exists = get().cart.find(item => item._id === product._id);

        if (exists) {
            // Update only quantity
            set({
                cart: get().cart.map(item =>
                    item._id === product._id
                        ? { ...item, qty: item.qty + qty }
                        : item
                )
            });
        } else {
            set({
                cart: [...get().cart, { ...product, qty }]
            });
        }
    },

    updateCartQty: (_id, qty) => {
        set({
            cart: get().cart.map(item =>
                item._id === _id ? { ...item, qty } : item
            )
        });
    },

    removeFromCart: (_id) => {
        set({
            cart: get().cart.filter(item => item._id !== _id)
        });
    },

    clearCart: () => set({ cart: [] }),
});

// -------------------------
// Wishlist Slice
// -------------------------
const createWishlistSlice = (set, get) => ({
    wishlist: [],

    addToWishlist: (product) => {
        const exists = get().wishlist.find(item => String(item.id) === String(product.id));
        if (!exists) {
            set({ wishlist: [...get().wishlist, product] });
        }
    },

    removeFromWishlist: (id) => {
        set({ wishlist: get().wishlist.filter(item => String(item.id) !== String(id)) });
    },


    clearWishlist: () => set({ wishlist: [] }),
});

// -------------------------
// Buy Products Slice
// -------------------------
const createBuyProductsSlice = (set) => ({
    buyProducts: [],

    addToBuyProducts: (products) => {
        set({
            buyProducts: Array.isArray(products) ? products : [products]
        });
    },

    clearBuyProducts: () => {
        set({ buyProducts: [] });
    },
});

// -------------------------
// Orders Slice
// -------------------------
const createOrdersSlice = (set, get) => ({
  orders: [],

  addOrder: (order) => {
    set({
      orders: [...get().orders, order]
    });
  },

  clearOrders: () => set({ orders: [] }),
});


// -------------------------
// MAIN STORE (PERSISTED)
// -------------------------
const useStore = create(
    persist(
        (set, get) => ({
            ...createCartSlice(set, get),
            ...createWishlistSlice(set, get),
            ...createBuyProductsSlice(set),
              ...createOrdersSlice(set, get), 
        }),
        {
            name: "shop-store", // localStorage key
            getStorage: () => localStorage,
        }
    )
);

export default useStore;
