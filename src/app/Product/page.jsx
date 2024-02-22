"use client"
import React, { useContext, useState } from 'react';
// Import ProductView component
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const Product = ({ id, imageUrl, productName, price, productDescription ,longdesc}) => {
  
  
  const handleAddToCart =  async() => {
        
    try {
      
      const response = await axios.post("/api/user/addCart", {
        productId:id

      }
      );
      console.dir(response)
      
    toast.success('Added to Cart!', {
      position: "top-right",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    } catch (error) {
      console.log(error)
    }

 





   










  }

  return (
    <>
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <img src={imageUrl} alt={productName} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800" onClick={()=>{
            renderProduct(productName)
          }}><Link href="/ProductView">{productName}</Link></h2>
          <p className="text-sm text-gray-600 mb-2">{productDescription}</p>
          <div className="text-xl text-indigo-600">${price}</div>
          <div className="mt-4">
            <button
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
        
      </div>
    
      {/* {showNotification && <Notification message={notificationMessage} />} */}
     
    </div><ToastContainer
    position="top-right"
    autoClose={1200}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    /></>
  );
};

export default Product;

