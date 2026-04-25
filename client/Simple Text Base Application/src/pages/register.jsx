
function Registration(){

    return (<>
    <h3 className="auth-header">Create Account</h3>
    <div className="auth-form">
        <input className="auth-item" type="text" placeholder="Username" />
        <input className="auth-item" type="text" placeholder="Name" />
        <input className="auth-item" type="number" placeholder="Age" />
        <input className="auth-item" type="email" placeholder="Email" />
        <input className="auth-item" type="password" placeholder="Password" />
        <input className="auth-submit" type="submit" value="Create Account" />
    </div>
        </>)
}

export default Registration