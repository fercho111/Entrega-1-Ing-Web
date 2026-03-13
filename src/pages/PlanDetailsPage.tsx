import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router";
import EmptyState from "../components/ui/EmptyState";
import { useAppContext } from "../context/useAppContext";
import { AttendanceStatusEnum, ParcheRoleEnum, PlanStateEnum, type Plan } from "../types";

export default function PlanDetailsPage() {
  const { id } = useParams();
  const {
    currentUser,
    users,
    parches,
    plans,
    votes,
    attendance,
    movePlanState,
    voteForOption,
    removeVote,
    setAttendance,
    setCheckIn,
    closeVotingIfTimePassed,
  } = useAppContext();

  useEffect(() => {
    closeVotingIfTimePassed();
    const interval = setInterval(() => {
      closeVotingIfTimePassed();
    }, 20000);

    return () => clearInterval(interval);
  }, [closeVotingIfTimePassed]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const planId = Number(id);
  const plan = plans.find((item) => item.id === planId);

  if (!plan) {
    return (
      <main className="container py-4">
        <EmptyState title="Plan not found" description="The plan was removed or does not exist." />
      </main>
    );
  }

  const parche = parches.find((item) => item.id === plan.parcheId);
  const member = parche?.members.find((item) => item.userId === currentUser.id);
  const canManageState = member?.role === ParcheRoleEnum.owner || member?.role === ParcheRoleEnum.moderator;

  const totalVotes = votes.filter((vote) => vote.planId === plan.id).length;
  const myAttendance = attendance.find((item) => item.planId === plan.id && item.userId === currentUser.id);
  const myVote = votes.find((vote) => vote.planId === plan.id && vote.userId === currentUser.id);

  function getPercentage(optionVotes: number): number {
    if (totalVotes === 0) {
      return 0;
    }

    return Math.round((optionVotes / totalVotes) * 100);
  }

  function getNextStateButtonText(plan: Plan): string {
    if (plan.state === PlanStateEnum.draft) return "Open voting";
    if (plan.state === PlanStateEnum.votingOpen) return "Close voting";
    if (plan.state === PlanStateEnum.votingClosed) return "Schedule plan";
    return "No more actions";
  }


  const checkInNow = new Date();
  const checkInStart = new Date(plan.checkInStart);
  const checkInEnd = new Date(plan.checkInEnd);
  const canCheckInNow = checkInNow >= checkInStart && checkInNow <= checkInEnd;

  return (
    <main className="container py-4">
      <Link to={`/parches/${plan.parcheId}`} className="btn btn-link ps-0">← Back to parche</Link>

      <section className="card shadow-sm p-4 mb-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h1 className="h4 mb-1">{plan.title}</h1>
            <p className="text-muted mb-1">{plan.description}</p>
            <p className="small mb-0"><strong>State:</strong> {plan.state}</p>
          </div>
          {canManageState && plan.state !== PlanStateEnum.scheduled && (
            <button className="btn btn-outline-dark" onClick={() => movePlanState(plan.id)}>{getNextStateButtonText(plan)}</button>
          )}
        </div>
      </section>

      <section className="card shadow-sm p-4 mb-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h5 mb-0">Voting options</h2>
          {myVote && <span className="badge bg-primary">You already voted</span>}
        </div>

        {plan.options.map((option) => {
          const optionVotes = votes.filter(
            (vote) => vote.planId === plan.id && vote.optionId === option.id
          ).length;

          const percentage = getPercentage(optionVotes);
          const isVotingOpen = plan.state === PlanStateEnum.votingOpen;
          const isMyVote = myVote?.optionId === option.id;

          return (
            <div
              key={option.id}
              className={`border rounded p-3 mb-2 ${isMyVote ? "border-primary bg-primary-subtle shadow-sm" : ""}`}
            >
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                <div>
                  <p className="mb-1">
                    <strong>{option.place}</strong> at {option.time}
                  </p>
                  <p className="small text-muted mb-2">
                    {optionVotes} votes ({percentage}%)
                  </p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                  {isMyVote && <span className="badge bg-primary">Your vote</span>}
                  {plan.winningOptionId === option.id && (
                    <span className="badge bg-success">Winner</span>
                  )}
                </div>
              </div>

              {isVotingOpen && (
                <button
                  className={`btn btn-sm ${isMyVote ? "btn-outline-danger" : "btn-primary"}`}
                  onClick={() =>
                    isMyVote
                      ? removeVote(plan.id)
                      : voteForOption(plan.id, option.id)
                  }
                >
                  {isMyVote ? "Undo vote" : "Vote"}
                </button>
              )}
            </div>
          );
        })}
      </section>

      <section className="card shadow-sm p-4 mb-3">
        <h2 className="h5">Attendance</h2>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-success btn-sm" onClick={() => setAttendance(plan.id, AttendanceStatusEnum.yes)}>Yes</button>
          <button className="btn btn-danger btn-sm" onClick={() => setAttendance(plan.id, AttendanceStatusEnum.no)}>No</button>
          <button className="btn btn-warning btn-sm" onClick={() => setAttendance(plan.id, AttendanceStatusEnum.maybe)}>Maybe</button>
        </div>

        <p className="small mb-2">Your current status: <strong>{myAttendance?.status ?? "Not set"}</strong></p>

        <h3 className="h6">Attendance list</h3>
        <ul className="list-group">
          {attendance
            .filter((item) => item.planId === plan.id)
            .map((item) => {
              const user = users.find((u) => u.id === item.userId);
              return (
                <li
                  key={`${item.planId}-${item.userId}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        width={32}
                        height={32}
                        className="rounded-circle"
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                        style={{ width: 32, height: 32, fontSize: 12 }}
                      >
                        {user?.fullName?.charAt(0) ?? "?"}
                      </div>
                    )}

                    <span>{user?.fullName ?? "Unknown"}</span>
                  </div>

                  <span>
                    {item.status} {item.checkedIn ? "✅" : ""}
                  </span>
                </li>
              );
            })}
        </ul>
      </section>

      <section className="card shadow-sm p-4">
        <h2 className="h5">Check-in</h2>
        <p className="small text-muted">Window: {plan.checkInStart} to {plan.checkInEnd}</p>
        <button className="btn btn-outline-success" disabled={!canCheckInNow} onClick={() => setCheckIn(plan.id)}>Check in now</button>
        {!canCheckInNow && <p className="small text-muted mt-2 mb-0">Check-in button activates only during the plan window.</p>}
      </section>
    </main>
  );
}
