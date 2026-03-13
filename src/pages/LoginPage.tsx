import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

export default function LoginPage() {
  const { login, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please complete all required fields");
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    navigate("/");
  }

  return (
    <main className="container py-4">
      <section className="col-lg-6 mx-auto card shadow-sm p-4">
        <h1 className="h3 mb-3">Login</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">University email</label>
            <input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={4} />
          </div>
          {errorMessage && <p className="text-danger small">{errorMessage}</p>}
          <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>
        <p className="small mt-3 mb-0">Need an account? <Link to="/register">Register</Link></p>
      </section>
    </main>
  );
}
