import { Link } from "react-router";
import { PlanStateEnum, type Plan } from "../../types";

type Props = {
  plan: Plan;
};

export default function PlanCard({ plan }: Props) {
  const stateClassName =
    plan.state === PlanStateEnum.scheduled
      ? "bg-success"
      : plan.state === PlanStateEnum.votingOpen
        ? "bg-primary"
        : plan.state === PlanStateEnum.votingClosed
          ? "bg-secondary"
          : "bg-warning text-dark";

  return (
    <article className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <h3 className="h6 mb-1">{plan.title}</h3>
            <p className="text-muted small mb-1">{plan.description}</p>
          </div>
          <span className={`badge ${stateClassName}`}>{plan.state}</span>
        </div>
        <p className="small mb-2"><strong>Window:</strong> {plan.dateStart} to {plan.dateEnd}</p>
        <Link to={`/plans/${plan.id}`} className="btn btn-outline-primary btn-sm">Open details</Link>
      </div>
    </article>
  );
}
