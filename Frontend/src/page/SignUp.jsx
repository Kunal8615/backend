import React, { useState } from "react";
import { API_URL } from "../constant";
import { Link ,useNavigate} from "react-router-dom";
const SignUp = () => {
  const [user, setUser] = useState({
    fullname: "",
    username: "", // Added username to state
    email: "",
    password: "",
    avatar: null,
    coverimage: null,
  });

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

    const formData = new FormData();
    formData.append("fullname", user.fullname);
    formData.append("username", user.username); // Added username to formData
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
    } catch (error) {
      console.error("Error during submission:", error);
    }
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enter your Fullname</label>
          <input
            type="text"
            name="fullname"
            placeholder="Enter your Fullname"
            value={user.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Enter your Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your Username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Enter your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Enter your Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Avatar</label>
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            name="coverimage"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
