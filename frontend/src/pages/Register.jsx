import { useState, useEffect } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }
}, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/auth/register",
        formData
      );

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-4">
        Register
      </h1>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 max-w-md"
      >
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2"
        />

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
          className="bg-green-600 text-white p-2">
          Register
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;