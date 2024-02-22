"use client"
import React, { useState, useEffect } from 'react';
import Product from '../Product/page';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Men = () => {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState('none'); // 'none', 'lowToHigh', 'highToLow'
  const [loading, setLoading] = useState(true);

  const menProductsApi = "/api/user/getMensWear";

  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        const response = await fetch(menProductsApi, { method: "GET" });
        const data = await response.json();
        setOriginalProducts(data.products);
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching men's products:", error);
        setLoading(false);
      }
    };

    fetchMenProducts();
  }, [menProductsApi]);

  const sortProductsByPrice = () => {
    if (sortBy === 'lowToHigh') {
      const sortedProducts = [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      setProducts(sortedProducts);
    } else if (sortBy === 'highToLow') {
      const sortedProducts = [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      setProducts(sortedProducts);
    }
  };

  const handlePriceSliderChange = (event, newValue) => {
    setPriceRange({ min: parseFloat(newValue[0]), max: parseFloat(newValue[1]) });
  };

  const handleProductAddedToCart = (r) => {
    // You can handle any actions or state updates here
    // For example, update the cart count or show a confirmation message
    console.log('response data is below')
    console.dir(r)
    
   let status = r?.status||"400"
   let message = r?.message||"something wrong"
   if(status==200){
  toast.success(r.data.message)
   }
   else{
    toast.error(message)
   }
  };

  return (
    <div className="container mx-auto p-4 pt-28">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-6xl">
        Men's Products
      </h2>
      {loading ? (
        <div className="text-center mt-8 h-screen w-screen flex flex-col justify-center items-center">
          <div className="animate-spin loader ease-linear border-t-4 border-blue-500 border-solid rounded-full h-12 w-12"></div>
          <p className="mt-4 text-2xl">Loading...</p>
        </div>
      ) : (
        <div>
          {/* ... (existing code) */}
          <div className="flex flex-wrap drop-shadow-2xl shadow-2xl">
            {products.map((product, index) => (
              <Product
                key={index}
                id={product._id}
                imageUrl={product.images[0]}
                productName={product.name}
                price={product.price}
                productDescription={product.description}
                longdesc={product.longdesc}
                onProductAddedToCart={handleProductAddedToCart} // Pass the callback function
              />
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Men;
