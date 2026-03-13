import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

export default function CreateParchePage() {
  const { currentUser, createParche, joinParche } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [joinMessage, setJoinMessage] = useState("");

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  function handleCreateParche(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !description || !coverImageUrl) {
      return;
    }

    createParche({ name, description, coverImageUrl });
    navigate("/");
  }

  function handleJoinParche(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!inviteCode) {
      setJoinMessage("Please enter an invite code");
      return;
    }

    const result = joinParche(inviteCode);
    setJoinMessage(result.message);
  }

  return (
    <main className="container py-4">
      <div className="row g-4">
        <section className="col-12 col-lg-6">
          <div className="card shadow-sm p-4">
            <h1 className="h4">Create a parche</h1>
            <form onSubmit={handleCreateParche}>
              <div className="mb-3">
                <label className="form-label">Parche name</label>
                <input className="form-control" value={name} onChange={(event) => setName(event.target.value)} required minLength={3} maxLength={50} />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} required minLength={10} maxLength={250} />
              </div>
              <div className="mb-3">
                <label className="form-label">Cover image URL</label>
                <input className="form-control" type="url" value={coverImageUrl} onChange={(event) => setCoverImageUrl(event.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit">Create</button>
            </form>
          </div>
        </section>

        <section className="col-12 col-lg-6">
          <div className="card shadow-sm p-4">
            <h2 className="h4">Join with invite code</h2>
            <form onSubmit={handleJoinParche}>
              <div className="mb-3">
                <label className="form-label">Invite code</label>
                <input className="form-control" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} required />
              </div>
              {joinMessage && <p className="small text-info">{joinMessage}</p>}
              <button className="btn btn-outline-primary" type="submit">Join parche</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
