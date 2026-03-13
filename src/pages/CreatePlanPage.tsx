import { useState, type SubmitEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useAppContext } from "../context/useAppContext";

type OptionInput = {
  place: string;
  time: string;
};

export default function CreatePlanPage() {
  const { id } = useParams();
  const { currentUser, parches, createPlan } = useAppContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [votingDeadline, setVotingDeadline] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [options, setOptions] = useState<OptionInput[]>([
    { place: "", time: "" },
    { place: "", time: "" },
    { place: "", time: "" },
  ]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const parcheId = Number(id);
  const parche = parches.find((item) => item.id === parcheId);

  if (!parche) {
    return <Navigate to="/" replace />;
  }

  function handleOptionChange(index: number, field: "place" | "time", value: string) {
    setOptions((previousOptions) => {
      return previousOptions.map((option, optionIndex) => {
        if (optionIndex !== index) {
          return option;
        }

        return { ...option, [field]: value };
      });
    });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!title || !description || !dateStart || !dateEnd || !votingDeadline) {
      setErrorMessage("Please complete all required fields");
      return;
    }

    const optionsWithMissingData = options.some((option) => !option.place || !option.time);
    if (optionsWithMissingData) {
      setErrorMessage("All options need place and time");
      return;
    }

    const result = createPlan({
      parcheId,
      title,
      description,
      dateStart,
      dateEnd,
      votingDeadline,
      options,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    navigate(`/parches/${parcheId}`);
  }

  return (
    <main className="container py-4">
      <section className="card shadow-sm p-4">
        <h1 className="h4">Create a new plan in {parche.name}</h1>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Title</label>
              <input className="form-control" value={title} onChange={(event) => setTitle(event.target.value)} required minLength={4} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Voting deadline</label>
              <input className="form-control" type="datetime-local" value={votingDeadline} onChange={(event) => setVotingDeadline(event.target.value)} required />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} required minLength={10} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Date start</label>
              <input className="form-control" type="date" value={dateStart} onChange={(event) => setDateStart(event.target.value)} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Date end</label>
              <input className="form-control" type="date" value={dateEnd} onChange={(event) => setDateEnd(event.target.value)} required />
            </div>
          </div>

          <h2 className="h5 mt-4">Options (minimum 3)</h2>
          {options.map((option, index) => (
            <div className="row g-2 mb-2" key={index}>
              <div className="col-12 col-md-8">
                <input
                  className="form-control"
                  placeholder={`Option ${index + 1} place`}
                  value={option.place}
                  onChange={(event) => handleOptionChange(index, "place", event.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <input
                  className="form-control"
                  type="time"
                  value={option.time}
                  onChange={(event) => handleOptionChange(index, "time", event.target.value)}
                  required
                />
              </div>
            </div>
          ))}

          {errorMessage && <p className="small text-danger">{errorMessage}</p>}

          <button type="submit" className="btn btn-primary mt-2">Create plan</button>
        </form>
      </section>
    </main>
  );
}
