import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const validatePassword = (e) => {
    const password = e.target.value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!regex.test(password)) {
      e.target.setCustomValidity(
        "Password must contain uppercase, lowercase, number, and symbol.",
      );
    } else {
      e.target.setCustomValidity("");
    }
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePassChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER}/login`,
      data,
    );
    console.log(username, password);
    if (response.body.admin) {
      navigate("/Dashboard");
    } else {
      setMessage(request.body.message);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-2xl font-bold mb-6 text-gray-800">Login</header>
      <form className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          onChange={handleUsernameChange}
          value={username}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={handlePassChange}
          value={password}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onInput={validatePassword}
          required
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
