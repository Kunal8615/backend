import React, { useState } from "react";
import { API_URL } from "../constant";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverimage: null,
  });

  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" || name === "coverimage") {
      setUser({
        ...user,
        [name]: files[0],
      });
    } else {
      setUser({
        ...user,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    const formData = new FormData();
    formData.append("fullname", user.fullname);
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (user.avatar) {
      formData.append("avatar", user.avatar);
    }
    if (user.coverimage) {
      formData.append("coverimage", user.coverimage);
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Form submitted:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Registration failed! Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="bg-blue-950">
      <div className="max-w-lg mx-auto p-6 border-4 border-slate-700 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Enter your Fullname
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your Fullname"
              value={user.fullname}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Enter your Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your Username"
              value={user.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Enter your Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Enter your Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={user.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Cover Image
            </label>
            <input
              type="file"
              name="coverimage"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition duration-200"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
