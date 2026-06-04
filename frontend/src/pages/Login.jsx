import { useState, useEffect } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }
}, []);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-4">
        Login
      </h1>

      <form
  onSubmit={handleLogin}
  className="flex flex-col gap-4 max-w-md"
>
  <input
    name="email"
    placeholder="Email"
    onChange={handleChange}
    className="border p-2"
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    className="border p-2"
  />

  <button
    className="bg-blue-600 text-white p-2"
  >
    Login
  </button>

  <p className="text-center">
    Don't have an account?{" "}
    <Link
      to="/register"
      className="text-blue-600 font-semibold"
    >
      Register
    </Link>
  </p>
</form>
    </div>
  );
}

export default Login;