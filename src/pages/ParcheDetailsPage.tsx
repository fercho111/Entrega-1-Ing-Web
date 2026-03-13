import { Link, Navigate, useParams } from "react-router";
import EmptyState from "../components/ui/EmptyState";
import PlanCard from "../components/plans/PlanCard";
import { useAppContext } from "../context/useAppContext";
import { ParcheRoleEnum } from "../types";

export default function ParcheDetailsPage() {
  const { id } = useParams();
  const { currentUser, parches, users, plans, updateRole } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const parcheId = Number(id);
  const parche = parches.find((item) => item.id === parcheId);

  if (!parche) {
    return (
      <main className="container py-4">
        <EmptyState title="Parche not found" description="The parche does not exist or was removed." />
      </main>
    );
  }

  const currentMembership = parche.members.find((member) => member.userId === currentUser.id);
  const canManageRoles = currentMembership?.role === ParcheRoleEnum.owner;
  const parchePlans = plans.filter((plan) => plan.parcheId === parche.id);

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-0">{parche.name}</h1>
          <p className="text-muted mb-0">{parche.description}</p>
        </div>
        <Link to={`/parches/${parche.id}/plans/new`} className="btn btn-primary">Create plan</Link>
      </div>

      <section className="card p-3 mb-3 shadow-sm">
        <h2 className="h5">Members</h2>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parche.members.map((member) => {
                const user = users.find((item) => item.id === member.userId);
                const isOwner = member.role === ParcheRoleEnum.owner;
                const nextRole = member.role === ParcheRoleEnum.member ? ParcheRoleEnum.moderator : ParcheRoleEnum.member;

                return (
                  <tr key={member.userId}>
                    <td>{user?.fullName ?? "Unknown"}</td>
                    <td>{member.role}</td>
                    <td>
                      {canManageRoles && !isOwner ? (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateRole(parche.id, member.userId, nextRole)}
                        >
                          {member.role === ParcheRoleEnum.member ? "Promote" : "Demote"}
                        </button>
                      ) : (
                        <span className="text-muted small">No action</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="h5">Plans</h2>
        {parchePlans.length === 0 ? (
          <EmptyState title="No plans yet" description="Create the first plan for this parche." />
        ) : (
          parchePlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        )}
      </section>
    </main>
  );
}
