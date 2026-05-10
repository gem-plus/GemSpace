import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

function Auth() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    age: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/profile");
      } else {
        setError("invalid Email or Password");
        setForm({ email: "", password: "" });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        navigate("/profile");
      }

      if (data.message === "duplicate user") setError("Email already exist");
      else setError("Something went wrong");

      setForm({ username: "", name: "", age: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
    }
  }

  const login = (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} id="form-login">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => handleChange(e)}
                  placeholder="aman@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" form="form-login" className="w-full">
            Login
          </Button>
          <a  href={`${import.meta.env.VITE_API_URL}/auth/google`}   className="w-full">
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );

  const register = (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Get started with your account.</CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              Login
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleRegister}
            id="form-register"
            className="w-full max-w-sm"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Name</FieldLabel>
                <Input
                  id="form-name"
                  type="text"
                  placeholder="Aman"
                  name="name"
                  value={form.name}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-email">Email</FieldLabel>
                <Input
                  id="form-email"
                  type="email"
                  placeholder="aman@example.com"
                  name="email"
                  value={form.email}
                  onChange={(e) => handleChange(e)}
                  required
                />
                <FieldDescription>
                  We&apos;ll never share your email with anyone.
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="form-username">Username</FieldLabel>
                  <Input
                    id="form-username"
                    type="text"
                    placeholder="aman67"
                    name="username"
                    value={form.username}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="form-age">Age</FieldLabel>
                  <Input
                    id="form-age"
                    type="number"
                    min="18"
                    max="100"
                    placeholder="Between 18-100"
                    name="age"
                    value={form.age}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="form-password">Password</FieldLabel>
                <Input
                  id="form-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </Field>
            </FieldGroup>
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" form="form-register" className="w-full">
            Create account
          </Button>
          <a href={`${import.meta.env.VITE_API_URL}/auth/google`}  className="w-full">
          <Button variant="outline" className="w-full">
            Signup with Google
          </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );

  return <>{isLogin ? login : register}</>;
}

export default Auth;
