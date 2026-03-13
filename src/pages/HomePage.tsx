import { Link, Navigate } from "react-router";
import ParcheCard from "../components/parches/ParcheCard";
import EmptyState from "../components/ui/EmptyState";
import { useAppContext } from "../context/useAppContext";

export default function HomePage() {
  const { currentUser, parches } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userParches = parches.filter((parche) => parche.members.some((member) => member.userId === currentUser.id));

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-0">Your parches</h1>
          <p className="text-muted mb-0">Create groups, vote plans, and confirm attendance.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/parches/new" className="btn btn-primary">Create parche</Link>
          <Link to="/rankings" className="btn btn-outline-secondary">Rankings</Link>
        </div>
      </div>

      {userParches.length === 0 ? (
        <EmptyState title="No parches yet" description="Create your first parche or join one with an invite code." />
      ) : (
        <div className="row g-3">
          {userParches.map((parche) => (
            <div className="col-12 col-md-6 col-xl-4" key={parche.id}>
              <ParcheCard parche={parche} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
