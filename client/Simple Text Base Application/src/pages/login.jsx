function Login() {
  return (
    <>
      <h3 className="auth-header">Login</h3>
      <div className="auth-form">
        <input className="auth-item" type="email" placeholder="Email " />
        <input className="auth-item" type="password" placeholder="Password"></input>
        <input className="auth-submit" type="submit" value="login"></input>
      </div>
    </>
  );
}

export default Login;
