import { Link } from "react-router";
import type { Parche } from "../../types";

type Props = {
  parche: Parche;
};

export default function ParcheCard({ parche }: Props) {
  return (
    <article className="card h-100 shadow-sm">
      <img src={parche.coverImageUrl} className="card-img-top card-cover" alt={parche.name} />
      <div className="card-body d-flex flex-column">
        <h3 className="h5">{parche.name}</h3>
        <p className="text-muted small">{parche.description}</p>
        <p className="small mb-2"><strong>Invite:</strong> {parche.inviteCode}</p>
        <Link className="btn btn-primary mt-auto" to={`/parches/${parche.id}`}>View parche</Link>
      </div>
    </article>
  );
}
