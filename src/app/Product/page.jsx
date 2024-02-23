"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Image from 'next/image'; // Import the Image component

const Product = ({ id, imageUrl, productName, price, productDescription, longdesc, onProductAddedToCart }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/user/addCart", {
        productId: id
      });
      console.dir(response.data);

      // Call the callback function passed from the Men page
      if (onProductAddedToCart) {
        onProductAddedToCart(response);
      }
    } catch (error) {
      console.log("eroor below----")
      console.log(error);
      let response = error?.response?.data || "Something wrong";
      if (onProductAddedToCart) {
        onProductAddedToCart(response);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          {/* Use the Next.js Image component */}
          <Image
            src={imageUrl}
            alt={productName}
            width={500} // Specify the width (adjust as needed)
            height={300} // Specify the height (adjust as needed)
            objectFit="cover" // Set the object fit property
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800" onClick={() => {
              renderProduct(productName);
            }}>
              <Link href="/ProductView">{productName}</Link>
            </h2>
            <p className="text-sm text-gray-600 mb-2">{productDescription}</p>
            <div className="text-xl text-indigo-600">${price}</div>
            <div className="mt-4">
              <button
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                onClick={handleAddToCart}
              >
                {loading ?
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
                  : "Add to cart"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
