import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
function Registration() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    age: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        navigate("/profile");
      } else {
        setStatus("error");
        throw new Error("error");
      }

      setStatus("success");
      setForm({ username: "", name: "", age: "", email: "", password: "" });
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  }

  return (
    <>
      <NavBar />
      <h3 className="auth-header">Create Account</h3>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-item"
          type="text"
          name="username"
          value={form.username}
          onChange={(e) => handleChange(e)}
          placeholder="Username"
        />
        <input
          className="auth-item"
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => handleChange(e)}
          placeholder="Name"
        />
        <input
          className="auth-item"
          type="number"
          name="age"
          value={form.age}
          onChange={(e) => handleChange(e)}
          placeholder="Age"
        />
        <input
          className="auth-item"
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => handleChange(e)}
          placeholder="Email"
        />
        <input
          className="auth-item"
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => handleChange(e)}
          placeholder="Password"
        />
        <input
          className="auth-submit"
          type="submit"
          disabled={status === "loading"}
          value="Create Account"
        />
      </form>
    </>
  );
}

export default Registration;
