import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Clock3,
  Cross,
  Heart,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import { wedding } from "./content";

const ease = [0.22, 1, 0.36, 1];

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.8, ease },
};

function Floral({ className = "", flip = false }) {
  return (
    <svg
      className={"floral " + className + (flip ? " floral-flip" : "")}
      viewBox="0 0 220 260"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M112 252c-6-53 6-103 33-145" strokeWidth="2.2" />
        <path d="M143 110c20-10 36-30 42-55-24 4-42 20-49 43" strokeWidth="1.8" />
        <path d="M128 147c-24-12-45-33-54-61 26 5 47 22 57 47" strokeWidth="1.8" />
        <path d="M120 185c22-6 43-22 55-44-25 0-46 13-58 34" strokeWidth="1.8" />
        <path d="M119 205c-22-3-43-15-58-34 24-4 47 6 62 25" strokeWidth="1.8" />
        <path d="M156 91c-9-16-9-36 0-52 8 7 13 17 13 28 0 11-5 19-13 24Z" strokeWidth="2" />
        <path d="M157 89c16-8 36-8 52 1-10 17-29 25-48 19" strokeWidth="2" />
        <path d="M156 91c-6 17-21 31-40 36-5-20 4-39 22-49" strokeWidth="2" />
        <circle cx="155" cy="91" r="7" strokeWidth="2" />
        <path d="M79 79c-8-14-8-31-1-45 13 8 21 22 20 38" strokeWidth="1.8" />
        <path d="M79 80c14-9 31-11 46-5-7 16-23 26-40 26" strokeWidth="1.8" />
        <path d="M79 80c-14 7-31 6-44-2 8-14 23-22 39-20" strokeWidth="1.8" />
        <circle cx="79" cy="80" r="5" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

function PhotoFrame({ src, label, className = "", rotate = 0 }) {
  return (
    <div className={"photo-frame " + className} style={{ "--rotate": rotate + "deg" }}>
      <div className="photo-paper">
        {src ? (
          <img src={src} alt={label} loading="lazy" />
        ) : (
          <div className="photo-placeholder" role="img" aria-label={label}>
            <Heart size={25} strokeWidth={1.15} />
            <span>{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState(Date.now());
  const target = wedding.date.iso ? new Date(wedding.date.iso).getTime() : null;

  useEffect(() => {
    if (!target || Number.isNaN(target)) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const values = !target || Number.isNaN(target)
    ? [["DAYS", "--"], ["HOURS", "--"], ["MINUTES", "--"], ["SECONDS", "--"]]
    : (() => {
        const left = Math.max(0, target - now);
        return [
          ["DAYS", Math.floor(left / 86400000)],
          ["HOURS", Math.floor((left / 3600000) % 24)],
          ["MINUTES", Math.floor((left / 60000) % 60)],
          ["SECONDS", Math.floor((left / 1000) % 60)],
        ];
      })();

  return (
    <div className="countdown">
      {values.map(([label, value]) => (
        <div className="count-box" key={label}>
          <strong>{typeof value === "number" ? String(value).padStart(2, "0") : value}</strong>
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
  const contentRef = useRef(null);
  const audioRef = useRef(null);

  const openInvitation = () => {
    setOpened(true);
    window.setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 720);
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

  const submitRsvp = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className={opened ? "is-open" : ""}>
      {wedding.musicUrl && (
        <>
          <audio ref={audioRef} src={wedding.musicUrl} loop />
          <button className="music-button" onClick={toggleMusic} aria-label="Toggle music">
            {playing ? <Pause size={16} /> : <Play size={16} />}
            <span>{playing ? "Pause" : "Music"}</span>
          </button>
        </>
      )}

      <section className="opening">
        <div className="opening-paper">
          <Floral className="opening-floral opening-floral-top" />
          <Floral className="opening-floral opening-floral-bottom" flip />

          <motion.div
            className="opening-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <p className="micro">WEDDING INVITATION</p>
            <h1 className="opening-names">
              <span>{wedding.couple.bride}</span>
              <em>&</em>
              <span>{wedding.couple.groom}</span>
            </h1>
            <p className="opening-date">{wedding.date.display}</p>
          </motion.div>

          <motion.button
            className="open-invitation"
            onClick={openInvitation}
            whileTap={{ scale: 0.97 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
          >
            <span>CLICK TO OPEN</span>
            <ChevronDown size={15} />
          </motion.button>
        </div>

        <AnimatePresence>
          {opened && (
            <>
              <motion.div
                className="opening-door opening-door-left"
                initial={{ x: 0 }}
                animate={{ x: "-102%" }}
                transition={{ duration: 0.9, ease }}
              />
              <motion.div
                className="opening-door opening-door-right"
                initial={{ x: 0 }}
                animate={{ x: "102%" }}
                transition={{ duration: 0.9, ease }}
              />
            </>
          )}
        </AnimatePresence>
      </section>

      <div ref={contentRef} className="invitation-site">
        <section className="hero-section section-shell">
          <Floral className="hero-floral hero-floral-left" />
          <Floral className="hero-floral hero-floral-right" flip />

          <motion.div className="hero-intro" {...reveal}>
            <p className="micro wine">SAVE THE DATE</p>
            <h2 className="display-names">
              {wedding.couple.bride}
              <span>&</span>
              {wedding.couple.groom}
            </h2>
            <p className="hero-date">{wedding.date.display}</p>
          </motion.div>

          <motion.div className="photo-composition" {...reveal}>
            <PhotoFrame
              src={wedding.photos.hero}
              label="Main couple photo"
              className="photo-main"
              rotate={-2.4}
            />
            <PhotoFrame
              src={wedding.photos.secondary}
              label="Second couple photo"
              className="photo-small"
              rotate={4.5}
            />
            <div className="wax-seal">{wedding.couple.monogram}</div>
          </motion.div>

          <motion.div className="scroll-note" {...reveal}>
            <span>SCROLL TO DISCOVER</span>
            <ChevronDown size={14} />
          </motion.div>
        </section>

        <section className="letter-section section-shell">
          <motion.div className="letter-card" {...reveal}>
            <p className="micro wine">DEAR FAMILY & FRIENDS</p>
            <h2>We would love to celebrate this day with you.</h2>
            <p>{wedding.invitation}</p>

            <div className="scripture-line">
              <Cross size={17} strokeWidth={1.4} />
              <div>
                <blockquote>“{wedding.scripture.text}”</blockquote>
                <span>{wedding.scripture.reference}</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="letter-photos" {...reveal}>
            <PhotoFrame src={wedding.photos.portrait} label="Couple portrait" rotate={2.8} />
          </motion.div>
        </section>

        <section className="countdown-section section-shell">
          <motion.div className="section-title" {...reveal}>
            <p className="micro">UNTIL OUR DAY</p>
            <h2>We can’t wait to see you</h2>
          </motion.div>
          <motion.div {...reveal}>
            <Countdown />
          </motion.div>
          <motion.p className="countdown-date" {...reveal}>
            {wedding.date.display}
          </motion.p>
        </section>

        <section className="schedule-section section-shell">
          <motion.div className="section-title" {...reveal}>
            <p className="micro wine">WEDDING DAY</p>
            <h2>Our celebration</h2>
          </motion.div>

          <div className="timeline">
            {wedding.schedule.map((item, index) => (
              <motion.article className="timeline-item" key={item.title} {...reveal}>
                <div className="timeline-time">
                  <span>{item.time}</span>
                </div>
                <div className="timeline-marker">
                  <i />
                </div>
                <div className="timeline-copy">
                  <span className="timeline-index">{"0" + (index + 1)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="location-section section-shell">
          <Floral className="location-floral" />
          <motion.div className="section-title" {...reveal}>
            <p className="micro wine">LOCATION</p>
            <h2>Where we’ll say “I do”</h2>
          </motion.div>

          <motion.div className="location-card" {...reveal}>
            <div className="location-icon">
              <MapPin size={24} strokeWidth={1.4} />
            </div>
            <p className="micro wine">{wedding.ceremony.title}</p>
            <h3>{wedding.ceremony.venue}</h3>
            <p>{wedding.ceremony.address}</p>
            <div className="location-time">
              <Clock3 size={16} />
              <span>{wedding.ceremony.time}</span>
            </div>
            {wedding.ceremony.mapUrl ? (
              <a href={wedding.ceremony.mapUrl} target="_blank" rel="noreferrer">
                OPEN MAP
              </a>
            ) : (
              <button type="button" className="ghost-button" disabled>
                MAP WILL BE ADDED
              </button>
            )}
          </motion.div>
        </section>

        <section className="dress-section section-shell">
          <motion.div className="section-title" {...reveal}>
            <p className="micro wine">DRESS CODE</p>
            <h2>We’d love to see you dressed beautifully</h2>
            <p className="section-copy">{wedding.dressCode.text}</p>
          </motion.div>

          <motion.div className="swatches" {...reveal}>
            {wedding.dressCode.colors.map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </motion.div>

          <motion.div className="dress-note" {...reveal}>
            <Heart size={17} strokeWidth={1.25} />
            <p>{wedding.dressCode.note}</p>
          </motion.div>
        </section>

        <section className="details-section section-shell">
          <motion.div className="section-title" {...reveal}>
            <p className="micro wine">A FEW DETAILS</p>
            <h2>Before the celebration</h2>
          </motion.div>

          <div className="details-list">
            {wedding.details.map((item, index) => (
              <motion.article className="detail-row" key={item.title} {...reveal}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="gallery-section section-shell">
          <motion.div className="section-title" {...reveal}>
            <p className="micro wine">OUR STORY</p>
            <h2>A little glimpse of us</h2>
          </motion.div>

          <div className="gallery-collage">
            {wedding.photos.gallery.map((photo, index) => (
              <motion.div className={"gallery-item gallery-item-" + (index + 1)} key={index} {...reveal}>
                <PhotoFrame
                  src={photo}
                  label={"Gallery photo " + (index + 1)}
                  rotate={index % 2 ? 2.5 : -2.5}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rsvp-section section-shell">
          <Floral className="rsvp-floral rsvp-floral-one" />
          <Floral className="rsvp-floral rsvp-floral-two" flip />

          <motion.div className="rsvp-card" {...reveal}>
            <p className="micro">PLEASE RESPOND</p>
            <h2>Will you be there?</h2>
            <p className="rsvp-intro">
              We would be grateful if you could let us know whether you can join us.
            </p>

            {submitted ? (
              <div className="success">
                <span><Check size={20} /></span>
                <h3>Thank you</h3>
                <p>Your response is shown in this frontend preview. Database storage will be connected later.</p>
              </div>
            ) : (
              <form onSubmit={submitRsvp}>
                <label>
                  <span>YOUR NAME</span>
                  <input required placeholder="Full name" />
                </label>

                <label>
                  <span>WILL YOU ATTEND?</span>
                  <select required defaultValue="">
                    <option value="" disabled>Select an option</option>
                    <option>Yes, joyfully attending</option>
                    <option>Sadly, I can’t attend</option>
                  </select>
                </label>

                <label>
                  <span>MESSAGE FOR THE COUPLE</span>
                  <textarea rows="4" placeholder="Your prayer or message..." />
                </label>

                <button type="submit">SEND RESPONSE</button>
              </form>
            )}
          </motion.div>
        </section>

        <section className="closing-section section-shell">
          <Floral className="closing-floral closing-floral-left" />
          <Floral className="closing-floral closing-floral-right" flip />

          <motion.div className="closing-copy" {...reveal}>
            <Cross size={21} strokeWidth={1.3} />
            <p className="micro wine">WITH LOVE</p>
            <h2>{wedding.closing.title}</h2>
            <p>{wedding.closing.message}</p>
            <blockquote>“{wedding.closing.verse}”</blockquote>
            <span>{wedding.closing.reference}</span>
            <div className="closing-names">
              {wedding.couple.bride} <em>&</em> {wedding.couple.groom}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default App;
