"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
const AddCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/api/user/getCart");
        console.log("Cart data from server:", response.data.cart);
        setCart(response.data.cart);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/api/user/removeFromCart/${productId}`);
      console.log("Product removed from cart:", response.data);

      setCart((prevCart) => prevCart.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const renderCart = cart.map((product) => (
    <div className="w-screen md:h-48 bg-slate-200 p-4 sm:p-0 m-3 shadow-2xl drop-shadow-2xl" key={product._id}>
      <div className="flex bg-slate-200 md:flex-row flex-col p-2 h-full ml-9 justify-center ">
        <div className="flex bg-slate-200 md:flex-row flex-col p-2 h-full ml-9 justify-center ">
          <div className="flex flex-col md:w-1/4 justify-center items-center ">
          <Image src={product.images[0]} alt={product.name} className="product-image h-48 object-fit rounded-lg" width={200} height={200} /></div>
          <div className="px-3 sm:w-2/4 flex flex-col sm:h-full sm:ml-14 p-2 text-center  ">
            <div className="font-semibold text-xl text-blue-600 pb-1 mb-4 px-3 pt-4">{product.name}</div>
            <div className="p-3">{/* Use the correct property for product description, e.g., product.description */}</div>
            <div className="p-1 px-3 text-lg text-emerald-700">Price - {product.price}</div>
          </div>
          <div className="w-full p-3 flex flex-col md:flex-row justify-center items-center">
            <div className="w-1/2 flex flex-col justify-center items-center">
              <div className="font-medium font-sans mt-0 mb-3 text-xl">Quantity</div>
              <div>
                <div className="flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse mb-4">
                  <div className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base sm:px-6  hover-bg-gray-100">
                    {product.quantity}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex md:w-1/4 md:flex-col flex-row items-center ml-0 pl-0 w-full justify-evenly">
              <button
                className="ml-4 md:px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus-outline-none focus-ring focus-ring-blue-300 focus-ring-opacity-80 w-full text-center md:my-3 p-6"
              >
                Buy Now
              </button>
              <div className="ml-3 flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
                <button
                  className="md:px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm-text-base sm-px-6  hover:bg-gray-100 p-5"
                  onClick={() => handleRemoveFromCart(product._id)}
                >
                  remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="mt-14">
      <div>HI you are in add cart</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {cart.length === 0 ? (
            <div>No products found in the cart</div>
          ) : (
            <div>{renderCart}</div>
          )}
        </>
      )}
    </div>
  );
};

export default AddCart;
