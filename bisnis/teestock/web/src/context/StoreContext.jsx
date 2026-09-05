import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const DEFAULT_STORE_SETTINGS = {
  storeWhatsapp: '081280000581',
  shopeeUrl: 'https://shopee.co.id',
  tiktokUrl: 'https://tiktok.com',
  instagramUrl: 'https://instagram.com'
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('teestock_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem('teestock_store_settings');
    return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STORE_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('teestock_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('teestock_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  const updateStoreSettings = (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addToCart = (product, garment, color, size, qty = 1, customPrice) => {
    setCart(prev => {
      const garmentName = garment?.name || product.name;
      const existingIdx = prev.findIndex(
        item => item.sku === product.sku && item.garment === garmentName && item.color === color && item.size === size
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].qty += qty;
        return updated;
      }

      const effectivePrice = customPrice !== undefined 
        ? customPrice 
        : (product.priceRetail || product.price_retail || 99000);

      return [
        ...prev,
        {
          sku: product.sku,
          name: product.name,
          series: product.series,
          filePath: product.filePath || product.file_path,
          garment: garmentName,
          color,
          size,
          price: effectivePrice,
          qty
        }
      ];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].qty + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      updated[index].qty = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        totalCartItems,
        totalCartAmount,
        storeSettings,
        updateStoreSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
