import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/profile");
        setStatus("success");
      } else {
        setStatus("error");
      }

      setForm({ email: "", password: "" });
    } catch (err) {
      setStatus("Error:");
      console.error(err);
    }
  }

  return (
    <>
      <NavBar />
      <h3 className="auth-header">Login</h3>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-item"
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => handleChange(e)}
          placeholder="Email "
        />
        <input
          className="auth-item"
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => handleChange(e)}
          placeholder="Password"
        ></input>
        <input
          className="auth-submit"
          type="submit"
          value="login"
          disabled={status === "loading"}
        ></input>
      </form>
    </>
  );
}

export default Login;
