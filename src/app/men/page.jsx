"use client"
import React, { useState, useEffect } from 'react';
import Product from '../Product/page';

const Men = () => {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState('none'); // 'none', 'lowToHigh', 'highToLow'
  const [loading, setLoading] = useState(true);

  const menProductsApi = "/api/user/getMensWear"; // Adjust the API endpoint

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

  useEffect(() => {
    const filteredProducts = originalProducts.filter(
      (product) => parseFloat(product.price) >= priceRange.min && parseFloat(product.price) <= priceRange.max
    );
    setProducts(filteredProducts);
  }, [priceRange]);

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
          <div className="w-full px-6 mb-4 bg-gray-100 shadow-2xl rounded-xl py-5">
            <div className="mr-4">
              <label className="mr-3">Sort by Price:</label>
              <select
                className="border rounded p-2"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="none">None</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High To Low</option>
              </select>
              <button
                className="bg-blue-500 text-white p-3 hover:bg-blue-600 mt-2 transition duration-300 ml-3 rounded-lg"
                onClick={sortProductsByPrice}
              >
                Sort
              </button>
            </div>
            <div>
              <label>Price Range:</label>
              <div className="flex items-center">
                <p className="mr-2">${priceRange.min}</p>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: +e.target.value })}
                  className="w-full"
                />
                <p className="ml-2">${priceRange.max}</p>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: +e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap drop-shadow-2xl shadow-2xl">
            {products.map((product, index) => (
              <Product
                key={index}
                imageUrl={product.images[0]}
                productName={product.name}
                price={product.price}
                productDescription={product.description}
                longdesc={product.longdesc}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Men;
