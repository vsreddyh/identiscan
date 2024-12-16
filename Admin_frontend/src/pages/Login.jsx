import React from "react";

const Login = () => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-2xl font-bold mb-6 text-gray-800">Login</header>
      <form className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onInput={validatePassword}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
