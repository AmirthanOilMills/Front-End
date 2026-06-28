import { create } from "zustand";
import { persist } from "zustand/middleware";

// -------------------------
// Cart Slice
// -------------------------
const createCartSlice = (set, get) => ({
    cart: [],

    addToCart: (product, qty = 1, selectedVariant = null) => {
        const cartId = selectedVariant
            ? `${product._id}-${selectedVariant.volume_size}`
            : product.cartId || product._id;

        const exists = get().cart.find(item => (item.cartId || item._id) === cartId);

        if (exists) {
            // Update only quantity
            set({
                cart: get().cart.map(item =>
                    (item.cartId || item._id) === cartId
                        ? { ...item, qty: item.qty + qty }
                        : item
                )
            });
        } else {
            const finalPrice = selectedVariant ? selectedVariant.selling_price : product.price;
            const finalMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
            const finalName = selectedVariant ? `${product.product_name} (${selectedVariant.volume_size})` : product.product_name;

            set({
                cart: [...get().cart, { 
                    ...product, 
                    cartId, 
                    price: finalPrice, 
                    mrp: finalMrp, 
                    product_name: finalName,
                    selectedVolume: selectedVariant ? selectedVariant.volume_size : null,
                    qty 
                }]
            });
        }
    },

    updateCartQty: (cartId, qty) => {
        set({
            cart: get().cart.map(item =>
                (item.cartId || item._id) === cartId ? { ...item, qty } : item
            )
        });
    },

    removeFromCart: (cartId) => {
        set({
            cart: get().cart.filter(item => (item.cartId || item._id) !== cartId)
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
