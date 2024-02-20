// Profile.js
// Profile.js
"use client"
// Profile.js
// Profile.js
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoutDisabled, setLogoutDisabled] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/user/profile", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUserProfile(data.data);

      toast.success("Profile data fetched successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      toast.error(`Failed to fetch profile data: ${error.message}`, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutDisabled(true);

      const response = await fetch("/api/user/logout", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000, // Adjust the delay (in milliseconds) as needed
      });

      setTimeout(() => {
        // Redirect to the login page after a delay
        router.push("/login");
      }, 2000); // Adjust the delay to match the autoClose value
    } catch (error) {
      console.error(error);
      toast.error(`Failed to log out: ${error.message}`, {
        position: "top-right",
      });
    } finally {
      setLogoutDisabled(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-900 text-white min-h-screen">
        <button
          onClick={fetchUserProfile}
          className={`bg-blue-500 text-white p-5 m-8 rounded hover:bg-blue-600 transition duration-300 glow`}
          disabled={loading || userProfile}
        >
          {loading ? "Loading..." : "Click me"}
        </button>

        {loading && (
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
        )}

        {userProfile && !loading && (
          <div className="text-center">
            <img
              src={userProfile.avtar}
              alt="no image"
              className="rounded-lg mx-auto mb-4 border-4 border-blue-500 p-2 transition duration-300 hover:glow"
            />
            <div>
              <p className="text-2xl font-bold mb-2">Name: {userProfile.Name}</p>
              <p className="text-xl font-bold">Username: {userProfile.username}</p>
              <p>Email: {userProfile.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed top-4 right-4">
        <button
          onClick={handleLogout}
          className={`bg-red-500 text-white p-3 rounded hover:bg-red-600 transition duration-300 ${
            logoutDisabled ? "opacity-50 cursor-not-allowed" : "glow"
          }`}
          disabled={logoutDisabled}
        >
          Logout
        </button>
      </div>

      <ToastContainer />
    </>
  );
}
