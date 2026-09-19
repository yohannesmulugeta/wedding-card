import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Cross,
  Heart,
  MapPin,
  Music2,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { wedding } from "./content";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.24 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
};

function Photo({ src, label, className = "" }) {
  return (
    <div className={`photo-shell ${className}`}>
      {src ? (
        <img src={src} alt={label} loading="lazy" />
      ) : (
        <div className="photo-placeholder" role="img" aria-label={label}>
          <span className="placeholder-orbit" />
          <Heart size={22} strokeWidth={1.3} />
          <small>{label}</small>
        </div>
      )}
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  const target = wedding.date.iso ? new Date(wedding.date.iso).getTime() : null;

  useMemo(() => {
    if (!target) return undefined;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!target || Number.isNaN(target)) {
    return <p className="date-note">The wedding date will be announced soon.</p>;
  }

  const distance = Math.max(0, target - now);
  const units = [
    ["Days", Math.floor(distance / 86400000)],
    ["Hours", Math.floor((distance / 3600000) % 24)],
    ["Minutes", Math.floor((distance / 60000) % 60)],
    ["Seconds", Math.floor((distance / 1000) % 60)],
  ];

  return (
    <div className="countdown">
      {units.map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const invitationRef = useRef(null);
  const audioRef = useRef(null);

  const openInvitation = () => {
    setOpened(true);
    window.setTimeout(
      () => invitationRef.current?.scrollIntoView({ behavior: "smooth" }),
      180,
    );
  };

  const toggleMusic = async () => {
    if (!wedding.musicUrl || !audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const handleRSVP = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      {wedding.musicUrl && (
        <>
          <audio
            ref={audioRef}
            src={wedding.musicUrl}
            loop
            onEnded={() => setPlaying(false)}
          />
          <button className="music-button" onClick={toggleMusic} aria-label="Toggle music">
            {playing ? <Pause size={17} /> : <Play size={17} />}
            <span>{playing ? "Pause" : "Music"}</span>
          </button>
        </>
      )}

      <section className="cover">
        <div className="grain" />
        <motion.div
          className="cover-cross"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.25 }}
        >
          <Cross size={28} strokeWidth={1.15} />
        </motion.div>

        <motion.div
          className="cover-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
        >
          <p className="eyebrow">{wedding.eyebrow}</p>
          <div className="cover-names">
            <span>{wedding.couple.bride}</span>
            <em>&</em>
            <span>{wedding.couple.groom}</span>
          </div>
          <p className="cover-line">{wedding.headline}</p>
          <button className="open-button" onClick={openInvitation}>
            Open invitation
            <ChevronDown size={17} />
          </button>
        </motion.div>

        <div className="cover-foot">
          <span>{wedding.scripture.reference}</span>
          <span className="dot" />
          <span>With God, always</span>
        </div>
      </section>

      <AnimatePresence>
        {opened && (
          <motion.div
            ref={invitationRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65 }}
          >
            <section className="hero-photo-section">
              <Photo src={wedding.photos.hero} label="Couple hero photo" className="hero-photo" />
              <div className="hero-overlay" />
              <motion.div className="hero-caption" {...reveal}>
                <p>Save the date</p>
                <h1>
                  {wedding.couple.bride}
                  <span>&</span>
                  {wedding.couple.groom}
                </h1>
              </motion.div>
            </section>

            <section className="scripture-section section">
              <motion.div className="scripture-card" {...reveal}>
                <div className="mini-cross"><Cross size={18} strokeWidth={1.15} /></div>
                <p>“{wedding.scripture.text}”</p>
                <span>{wedding.scripture.reference}</span>
              </motion.div>
            </section>

            <section className="invitation section">
              <motion.div {...reveal}>
                <p className="section-kicker">BY THE GRACE OF GOD</p>
                <h2>We are getting married</h2>
                <p className="body-copy">{wedding.invitation}</p>
              </motion.div>

              <motion.div className="portrait-wrap" {...reveal}>
                <Photo src={wedding.photos.portrait} label="Couple portrait" className="portrait-photo" />
                <div className="monogram">{wedding.couple.monogram}</div>
              </motion.div>
            </section>

            <section className="date-section section">
              <motion.div className="date-panel" {...reveal}>
                <CalendarDays size={24} strokeWidth={1.25} />
                <p className="section-kicker">OUR WEDDING DAY</p>
                <div className="date-display">
                  <span>{wedding.date.day}</span>
                  <strong>{wedding.date.month}</strong>
                  <span>{wedding.date.year}</span>
                </div>
                <p className="time">{wedding.date.time}</p>
                <Countdown />
              </motion.div>
            </section>

            <section className="details-section section">
              <motion.div className="section-heading" {...reveal}>
                <p className="section-kicker">CELEBRATE WITH US</p>
                <h2>Wedding details</h2>
              </motion.div>

              <div className="details-grid">
                {[wedding.ceremony, wedding.reception].map((item, index) => (
                  <motion.article className="detail-card" key={item.title} {...reveal}>
                    <span className="detail-number">0{index + 1}</span>
                    <MapPin size={23} strokeWidth={1.25} />
                    <h3>{item.title}</h3>
                    <p>{item.venue}</p>
                    <small>{item.address}</small>
                    {item.mapUrl ? (
                      <a href={item.mapUrl} target="_blank" rel="noreferrer">
                        View location
                      </a>
                    ) : (
                      <span className="muted-link">Location will be added</span>
                    )}
                  </motion.article>
                ))}
              </div>

              <motion.div className="dress-code" {...reveal}>
                <Sparkles size={17} />
                <span>Dress code</span>
                <strong>{wedding.dressCode}</strong>
              </motion.div>
            </section>

            <section className="gallery-section section">
              <motion.div className="section-heading" {...reveal}>
                <p className="section-kicker">OUR MOMENTS</p>
                <h2>A glimpse of us</h2>
                <p>Real photos will replace these frames.</p>
              </motion.div>
              <div className="gallery-grid">
                {wedding.photos.gallery.map((photo, index) => (
                  <motion.div key={index} {...reveal}>
                    <Photo
                      src={photo}
                      label={`Gallery photo ${index + 1}`}
                      className={index === 0 ? "gallery-photo tall" : "gallery-photo"}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="rsvp-section section">
              <motion.div className="rsvp-card" {...reveal}>
                <Heart size={24} strokeWidth={1.2} />
                <p className="section-kicker">KINDLY RESPOND</p>
                <h2>Will you join us?</h2>
                <p>
                  This is the frontend preview. RSVP data is not stored until we connect a database.
                </p>

                {submitted ? (
                  <div className="success-state">
                    <span><Check size={20} /></span>
                    <h3>Thank you</h3>
                    <p>Your response UI is working. Database connection comes later.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRSVP}>
                    <label>
                      Your name
                      <input required placeholder="Full name" />
                    </label>
                    <label>
                      Attendance
                      <select defaultValue="">
                        <option value="" disabled>Select response</option>
                        <option>Joyfully attending</option>
                        <option>Unable to attend</option>
                      </select>
                    </label>
                    <label>
                      Message
                      <textarea rows="3" placeholder="A prayer or message for the couple" />
                    </label>
                    <button type="submit">Send response</button>
                  </form>
                )}
              </motion.div>
            </section>

            <section className="closing-section section">
              <motion.div className="closing-content" {...reveal}>
                <Cross size={22} strokeWidth={1.2} />
                <p className="section-kicker">BLESSED TOGETHER</p>
                <h2>{wedding.closing.title}</h2>
                <p>{wedding.closing.message}</p>
                <blockquote>“{wedding.closing.verse}”</blockquote>
                <span>{wedding.closing.reference}</span>
                <div className="closing-monogram">{wedding.couple.monogram}</div>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
