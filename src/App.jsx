import { useEffect, useMemo, useState } from "react";
import { wedding } from "./content";
import RsvpModal from "./RsvpModal";

function Countdown() {
  const [now, setNow] = useState(Date.now());
  const target = wedding.date.iso ? new Date(wedding.date.iso).getTime() : null;

  useEffect(() => {
    if (!target || Number.isNaN(target)) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const values = useMemo(() => {
    if (!target || Number.isNaN(target)) {
      return [
        ["DAYS", "--"],
        ["HOURS", "--"],
        ["MINUTES", "--"],
        ["SECONDS", "--"],
      ];
    }

    const remaining = Math.max(0, target - now);
    return [
      ["DAYS", Math.floor(remaining / 86400000)],
      ["HOURS", Math.floor((remaining / 3600000) % 24)],
      ["MINUTES", Math.floor((remaining / 60000) % 60)],
      ["SECONDS", Math.floor((remaining / 1000) % 60)],
    ];
  }, [now, target]);

  return (
    <div className="countdown">
      {values.map(([label, value]) => (
        <div className="countdown__item" key={label}>
          <strong>{typeof value === "number" ? String(value).padStart(2, "0") : value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Photo({ src, alt, className = "" }) {
  if (src) {
    return <img className={className} src={src} alt={alt} loading="lazy" />;
  }

  return (
    <div className={"image-placeholder " + className} role="img" aria-label={alt}>
      <div className="placeholder-cross">✦</div>
      <span>COUPLE PHOTO</span>
      <small>Real image will be added here</small>
    </div>
  );
}

function App() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="wedding-page">
      <section className={"hero " + (!wedding.photos.hero ? "hero--fallback" : "")}>
        {wedding.photos.hero ? (
          <img
            className="hero__image"
            src={wedding.photos.hero}
            alt="Wedding couple"
          />
        ) : (
          <div className="hero__image hero__image--placeholder" aria-hidden="true">
            <div className="hero-silhouette hero-silhouette--left" />
            <div className="hero-silhouette hero-silhouette--right" />
          </div>
        )}

        <div className="hero__shade" />

        <div className="hero__content">
          <p className="eyebrow">{wedding.hero.eyebrow}</p>
          <p className="hero__amharic">{wedding.hero.welcome}</p>

          <h1 id="couple-names">
            <span>{wedding.couple.bride}</span>
            <span className="ampersand">&amp;</span>
            <span>{wedding.couple.groom}</span>
          </h1>

          <p className="hero__date">{wedding.date.gregorian}</p>
          <p className="hero__ethiopian-date">{wedding.date.ethiopian}</p>

          <a className="scroll-cue" href="#invitation">
            DISCOVER OUR DAY <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="invitation section reveal" id="invitation">
        <div className="ornament" aria-hidden="true" />
        <p className="section-kicker">{wedding.invitation.headingAm}</p>
        <h2>{wedding.invitation.heading}</h2>
        <p className="section-copy">{wedding.invitation.body}</p>

        <div className="scripture">
          <span className="scripture__cross">✝</span>
          <blockquote>“{wedding.scripture.text}”</blockquote>
          <small>{wedding.scripture.reference}</small>
        </div>

        <p className="signature-amharic">{wedding.couple.amharic}</p>
      </section>

      <section className="countdown-section section reveal">
        <p className="section-kicker">ቀኑ እየቀረበ ነው</p>
        <h2>Until we say “I do”</h2>
        <Countdown />
      </section>

      <section className="story section reveal">
        <div className="story__image-wrap">
          <Photo
            src={wedding.photos.story}
            alt="Couple story"
            className="story__image"
          />
          <span className="image-mark" aria-hidden="true">ፍቅር</span>
        </div>

        <div className="story__content">
          <p className="section-kicker">{wedding.story.headingAm}</p>
          <h2>{wedding.story.heading}</h2>
          <p className="section-copy">{wedding.story.body}</p>
          <p className="story__quote">“{wedding.story.quote}”</p>
        </div>
      </section>

      <section className="timeline-section section reveal">
        <p className="section-kicker">የዕለቱ መርሐ ግብር</p>
        <h2>Wedding timeline</h2>

        <div className="timeline">
          {wedding.events.map((event, index) => (
            <article className="timeline__event" key={event.title}>
              <div className="timeline__number">0{index + 1}</div>
              <time>{event.time}</time>
              <h3>{event.title}</h3>
              <p className="timeline__amharic">{event.titleAm}</p>
              <p>{event.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="venue section reveal">
        <div className="venue__card">
          <p className="section-kicker">ቦታው</p>
          <h2>Meet us in Addis</h2>
          <p className="venue__name">{wedding.venue.name}</p>
          <p>{wedding.venue.address}</p>
          <p className="demo-note">{wedding.venue.note}</p>

          {wedding.venue.mapUrl ? (
            <a
              className="button button--light"
              href={wedding.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              OPEN MAP
            </a>
          ) : (
            <button className="button button--light" type="button" disabled>
              MAP WILL BE ADDED
            </button>
          )}
        </div>
      </section>

      <section className="gallery section reveal">
        <p className="section-kicker">የእኛ ትዝታዎች</p>
        <h2>A glimpse of us</h2>

        <div className="gallery__grid">
          {wedding.photos.gallery.map((image, index) => (
            <figure
              className={"gallery__item gallery__item--" + (index + 1)}
              key={index}
            >
              <Photo
                src={image}
                alt={"Wedding gallery image " + (index + 1)}
                className="gallery__image"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="details section reveal">
        <div>
          <p className="section-kicker">GOOD TO KNOW</p>
          <h2>A few loving details</h2>
        </div>

        <div className="details__grid">
          {wedding.details.map((detail) => (
            <article key={detail.title}>
              <span aria-hidden="true">{detail.icon}</span>
              <h3>{detail.title}</h3>
              <p>{detail.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rsvp-section section reveal">
        <p className="section-kicker">ከእኛ ጋር ይሆናሉ?</p>
        <h2>Will you celebrate with us?</h2>
        <p>{wedding.rsvp.deadline}</p>

        <button
          className="button"
          type="button"
          aria-haspopup="dialog"
          aria-controls="rsvp-dialog"
          onClick={() => setRsvpOpen(true)}
        >
          RSVP
        </button>
      </section>

      <footer className="closing">
        <div className="ornament ornament--small" aria-hidden="true" />
        <p>{wedding.closing.amharic}</p>
        <h2>
          {wedding.couple.bride} <span>&amp;</span> {wedding.couple.groom}
        </h2>
        <blockquote>“{wedding.closing.verse}”</blockquote>
        <small>{wedding.closing.reference}</small>
      </footer>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </main>
  );
}

export default App;
