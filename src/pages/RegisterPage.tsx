import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAppContext } from "../context/useAppContext";

export default function RegisterPage() {
  const { register, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!fullName || !email || !major || !password) {
      setErrorMessage("Please complete all required fields");
      return;
    }

    const result = register({ fullName, email, major, password, avatarUrl });
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    navigate("/");
  }

  return (
    <main className="container py-4">
      <section className="col-lg-7 mx-auto card shadow-sm p-4">
        <h1 className="h3 mb-3">Register</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Full name</label>
            <input className="form-control" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={5} />
          </div>
          <div className="mb-3">
            <label className="form-label">University email</label>
            <input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Program / major</label>
            <input className="form-control" value={major} onChange={(event) => setMajor(event.target.value)} required minLength={3} />
          </div>
          <div className="mb-3">
            <label className="form-label">Avatar URL (optional)</label>
            <input className="form-control" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={4} />
          </div>
          {errorMessage && <p className="text-danger small">{errorMessage}</p>}
          <button className="btn btn-success w-100" type="submit">Create account</button>
        </form>
        <p className="small mt-3 mb-0">Already have an account? <Link to="/login">Login</Link></p>
      </section>
    </main>
  );
}
