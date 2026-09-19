import { useEffect, useRef, useState } from "react";

export default function RsvpModal({ open, onClose }) {
  const closeRef = useRef(null);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    const next = {};

    if (!name.trim()) next.name = "Please enter your name.";
    if (!attendance) next.attendance = "Please choose an attendance option.";
    if (!Number.isFinite(Number(guests)) || Number(guests) < 1 || Number(guests) > 7) {
      next.guests = "Guests must be between 1 and 7.";
    }

    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      window.localStorage.setItem(
        "wedding-card-rsvp-preview",
        JSON.stringify({
          name: name.trim(),
          attendance,
          guests: Number(guests),
          note,
          submittedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Preview still works if browser storage is unavailable.
    }

    setSubmitted(true);
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="rsvp-modal"
        id="rsvp-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
      >
        <button
          ref={closeRef}
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close RSVP form"
        >
          ×
        </button>

        {submitted ? (
          <div className="rsvp-success" role="status">
            <div className="success-mark">✦</div>
            <p className="section-kicker">እናመሰግናለን</p>
            <h2 id="rsvp-title">Thank you, {name.trim()}.</h2>
            <p>
              Your RSVP is saved only in this browser for now. We can connect it
              to a database later.
            </p>
            <button className="button" type="button" onClick={onClose}>
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="section-kicker">CONFIRM YOUR PLACE</p>
            <h2 id="rsvp-title">RSVP for our celebration</h2>
            <p className="modal-intro">
              Frontend preview only — nothing is sent online yet.
            </p>

            <label htmlFor="guest-name">Your name</label>
            <input
              id="guest-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}

            <fieldset>
              <legend>Will you come?</legend>
              <label className="radio-option">
                <input
                  type="radio"
                  name="attendance"
                  checked={attendance === "yes"}
                  onChange={() => setAttendance("yes")}
                />
                Yes, joyfully
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="attendance"
                  checked={attendance === "no"}
                  onChange={() => setAttendance("no")}
                />
                I cannot attend
              </label>
            </fieldset>
            {errors.attendance && <p className="field-error">{errors.attendance}</p>}

            <label htmlFor="guest-count">Number of guests</label>
            <input
              id="guest-count"
              type="number"
              min="1"
              max="7"
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
            />
            {errors.guests && <p className="field-error">{errors.guests}</p>}

            <label htmlFor="guest-note">Food allergies or a message</label>
            <textarea
              id="guest-note"
              rows="4"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Optional"
            />

            <button className="button button--submit" type="submit">
              SEND RSVP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
