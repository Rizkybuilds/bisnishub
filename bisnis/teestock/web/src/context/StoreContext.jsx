import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts } from '../services/productsApi';

const StoreContext = createContext();

const DEFAULT_STORE_SETTINGS = {
  storeWhatsapp: '085220274968',
  shopeeUrl: 'https://shopee.co.id',
  tiktokUrl: 'https://tiktok.com',
  instagramUrl: 'https://instagram.com',
  qrisMerchantName: 'TeeStock Apparel',
  qrisNmid: 'ID102609070001'
};

export function StoreProvider({ children }) {
  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('teestock_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem('teestock_store_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.storeWhatsapp === '081280000581' || !parsed.storeWhatsapp) {
          parsed.storeWhatsapp = '085220274968';
        }
        return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      } catch (e) {
        return DEFAULT_STORE_SETTINGS;
      }
    }
    return DEFAULT_STORE_SETTINGS;
  });

  useEffect(() => {
    getProducts()
      .then(prods => setCatalog(prods || []))
      .catch(err => console.warn('Failed to load store catalog:', err))
      .finally(() => setLoadingCatalog(false));
  }, []);

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
        return prev.map((item, i) => {
          if (i === existingIdx) {
            return { ...item, qty: item.qty + qty };
          }
          return item;
        });
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
      return prev
        .map((item, i) => {
          if (i !== index) return item;
          const newQty = (item.qty || 1) + delta;
          if (newQty <= 0) return null;
          return { ...item, qty: newQty };
        })
        .filter(Boolean);
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
        catalog,
        loadingCatalog,
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
