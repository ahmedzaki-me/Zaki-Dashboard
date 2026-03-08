import { useState, useEffect } from "react";

export default function Cart() {
  const cartItemsInLS = JSON.parse(localStorage.getItem("cartItemsInLS")) || [];
  const [cartItems, setCartItems] = useState(cartItemsInLS || []);
  const countOfItems = cartItems.reduce((total, item) => total + item.count, 0);
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.count,
    0,
  );

  useEffect(() => {
    localStorage.setItem("cartItemsInLS", JSON.stringify(cartItems));
  }, [cartItems]);

  function increaseCount(itemtId) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemtId ? { ...item, count: item.count + 1 } : item,
      ),
    );
  }

  function addNotes(itemtId, notes) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemtId ? { ...item, notes } : item,
      ),
    );
  }

  function decreaseCount(itemtId) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemtId && item.count > 1
          ? { ...item, count: item.count - 1 }
          : item,
      ),
    );
  }

  function removeFromCart(itemtId) {
    setCartItems((prev) =>
      prev.filter((item) => {
        return item.id !== itemtId;
      }),
    );
  }

  return {
    cartItems,
    setCartItems,
    countOfItems,
    subTotal,
    increaseCount,
    decreaseCount,
    removeFromCart,
    addNotes,
  };
}
