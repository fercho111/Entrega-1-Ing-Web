import { Link, Navigate } from "react-router";
import { useAppContext } from "../context/useAppContext";
import { AttendanceStatusEnum, PlanStateEnum } from "../types";

type RankingRow = {
  userId: number;
  fullName: string;
  organizerScore: number;
  ghostScore: number;
};

export default function RankingsPage() {
  const { currentUser, users, parches, plans, attendance } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userParcheIds = parches
    .filter((parche) => parche.members.some((member) => member.userId === currentUser.id))
    .map((parche) => parche.id);

  const rows: RankingRow[] = users.map((user) => {
    const userPlansInMyParches = plans.filter((plan) => plan.createdBy === user.id && userParcheIds.includes(plan.parcheId));

    const plansCreated = userPlansInMyParches.length;
    const plansScheduled = userPlansInMyParches.filter((plan) => plan.state === PlanStateEnum.scheduled).length;
    const organizerScore = plansCreated + plansScheduled;

    const yesAttendance = attendance.filter(
      (item) =>
        item.userId === user.id &&
        item.status === AttendanceStatusEnum.yes &&
        userParcheIds.includes(plans.find((plan) => plan.id === item.planId)?.parcheId ?? -1),
    );
    const ghostScore = yesAttendance.filter((item) => !item.checkedIn).length;

    return { userId: user.id, fullName: user.fullName, organizerScore, ghostScore };
  });

  const rowsWithActivity = rows.filter((row) => row.organizerScore > 0 || row.ghostScore > 0);

  return (
    <main className="container py-4">
      <Link to="/" className="btn btn-link ps-0">← Back home</Link>
      <section className="card shadow-sm p-4">
        <h1 className="h4">Parche ranking</h1>
        <p className="text-muted">Organizer score = plans created + plans scheduled. Ghost score = said yes but no check-in.</p>

        {rowsWithActivity.length === 0 ? (
          <p className="mb-0">No ranking data available yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Organizer score</th>
                  <th>Ghost score</th>
                </tr>
              </thead>
              <tbody>
                {rowsWithActivity.map((row) => (
                  <tr key={row.userId}>
                    <td>{row.fullName}</td>
                    <td>{row.organizerScore}</td>
                    <td>{row.ghostScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
