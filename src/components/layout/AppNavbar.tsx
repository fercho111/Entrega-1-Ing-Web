import { Link } from "react-router";
import { useAppContext } from "../../context/useAppContext";

export default function AppNavbar() {
  const { currentUser, logout } = useAppContext();

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">ParchePlan U</Link>
        <div className="d-flex gap-2 align-items-center">
          {currentUser ? (
            <>
              <span className="text-light small">{currentUser.fullName}</span>
              <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
              <Link to="/register" className="btn btn-warning btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
