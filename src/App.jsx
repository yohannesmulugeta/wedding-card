import { useEffect, useMemo, useState } from "react";
import { wedding } from "./content";
import RsvpModal from "./RsvpModal";
import TibebDivider from "./components/TibebDivider";
import SectionHeading from "./components/SectionHeading";

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
        ["Days", "--"],
        ["Hours", "--"],
        ["Minutes", "--"],
        ["Seconds", "--"],
      ];
    }

    const remaining = Math.max(0, target - now);
    return [
      ["Days", Math.floor(remaining / 86400000)],
      ["Hours", Math.floor((remaining / 3600000) % 24)],
      ["Minutes", Math.floor((remaining / 60000) % 60)],
      ["Seconds", Math.floor((remaining / 1000) % 60)],
    ];
  }, [now, target]);

  return (
    <div className="countdown-grid" aria-label="Wedding countdown">
      {values.map(([label, value]) => (
        <div className="countdown-grid__item" key={label}>
          <strong>
            {typeof value === "number" ? String(value).padStart(2, "0") : value}
          </strong>
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
      <span aria-hidden="true">✦</span>
      <strong>PHOTO</strong>
      <small>Image will be added here</small>
    </div>
  );
}

function App() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const nodes = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
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

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="wedding-page">
      <section className="hero">
        <img
          className="hero__image"
          src={wedding.photos.hero}
          alt="Mena and Ermiyas"
        />
        <div className="hero__overlay" />

        <div className="hero__topline">
          <span className="hero__cross" aria-hidden="true">✝</span>
          <span>{wedding.couple.monogram}</span>
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">{wedding.hero.eyebrow}</p>
          <p className="hero__faith-line">{wedding.hero.welcome}</p>

          <h1>
            <span>{wedding.couple.bride}</span>
            <em>&amp;</em>
            <span>{wedding.couple.groom}</span>
          </h1>

          <div className="hero__date-block">
            <strong>{wedding.date.gregorian}</strong>
            <span>{wedding.date.ethiopian}</span>
          </div>

          <a className="hero__scroll" href="#invitation">
            SCROLL TO EXPLORE
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero__divider">
          <TibebDivider dark />
        </div>
      </section>

      <section className="invitation section reveal" id="invitation">
        <div className="invitation__cross" aria-hidden="true">✝</div>
        <SectionHeading
          kicker={wedding.invitation.headingAm}
          title={wedding.invitation.heading}
          subtitle={wedding.invitation.body}
        />

        <div className="invitation__verse">
          <blockquote>“{wedding.scripture.text}”</blockquote>
          <span>{wedding.scripture.reference}</span>
        </div>

        <p className="invitation__signature">
          {wedding.couple.bride} <em>&amp;</em> {wedding.couple.groom}
        </p>
      </section>

      <section className="big-day reveal">
        <div className="big-day__inner">
          <div className="big-day__date">
            <p className="section-heading__kicker">THE BIG DAY · ታላቁ ቀን</p>
            <strong>{wedding.date.gregorian}</strong>
            <span>{wedding.date.ethiopian}</span>
          </div>

          <div className="big-day__countdown">
            <p className="big-day__label">COUNTDOWN TO OUR WEDDING</p>
            <Countdown />
            <p className="big-day__note">God’s timing is always perfect.</p>
          </div>
        </div>
      </section>

      <section className="journey section reveal">
        <div className="journey__copy">
          <SectionHeading
            kicker={wedding.story.headingAm}
            title={wedding.story.heading}
            subtitle={wedding.story.body}
            align="left"
          />
          <blockquote className="journey__quote">
            “{wedding.story.quote}”
            <span>{wedding.story.reference}</span>
          </blockquote>
        </div>

        <div className="journey__visual">
          <div className="journey__frame">
            <Photo
              src={wedding.photos.story}
              alt="Mena and Ermiyas together"
              className="journey__image"
            />
          </div>
          <span className="journey__mark" aria-hidden="true">ፍቅር</span>
        </div>
      </section>

      <section className="faith reveal">
        <TibebDivider dark />
        <div className="faith__inner">
          <SectionHeading
            kicker={wedding.faith.headingAm}
            title={wedding.faith.heading}
            subtitle={wedding.faith.intro}
            light
          />

          <div className="faith__items">
            {wedding.faith.items.map((item) => (
              <article className="faith__item" key={item.title}>
                <span className="faith__icon" aria-hidden="true">{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.titleAm}</small>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        <TibebDivider dark />
      </section>

      <section className="program section reveal">
        <SectionHeading
          kicker="የዕለቱ መርሐ ግብር · OUR WEDDING DAY"
          title="A Day Centered on God"
          subtitle="Worship, the Word, covenant prayer and joyful fellowship."
        />

        <div className="program__timeline">
          {wedding.events.map((event, index) => (
            <article className="program__item" key={event.title}>
              <div className="program__rail">
                <span>{index + 1}</span>
              </div>
              <div className="program__content">
                <time>{event.time}</time>
                <h3>{event.title}</h3>
                <p className="program__amharic">{event.titleAm}</p>
                <p>{event.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="program__glory">All for His glory.</p>
      </section>

      <section className="venue reveal">
        <div className="venue__inner">
          <div className="venue__visual" aria-hidden="true">
            <span className="venue__monogram">S</span>
            <span className="venue__city">ADDIS ABABA</span>
          </div>

          <div className="venue__card">
            <p className="section-heading__kicker">ቦታው · THE VENUE</p>
            <h2>{wedding.venue.name}</h2>
            <p className="venue__address">{wedding.venue.address}</p>
            <p className="venue__note">{wedding.venue.note}</p>

            <a
              className="button button--gold"
              href={wedding.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              VIEW ON MAP →
            </a>
          </div>
        </div>
      </section>

      <section className="moments section reveal">
        <SectionHeading
          kicker="የማይረሱ ጊዜያት · OUR MOMENTS"
          title="Moments That Matter"
          subtitle="A few glimpses from a love rooted in faith."
        />

        <div className="moments__grid">
          {wedding.photos.gallery.map((image, index) => (
            <figure
              className={"moments__item moments__item--" + (index + 1)}
              key={image + index}
            >
              <Photo
                src={image}
                alt={"Mena and Ermiyas wedding moment " + (index + 1)}
                className="moments__image"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="details section reveal">
        <SectionHeading
          kicker="ማወቅ ያለብዎት · IMPORTANT DETAILS"
          title="A Few Loving Details"
          align="left"
        />

        <div className="details__list">
          {wedding.details.map((detail) => (
            <article className="details__item" key={detail.title}>
              <span aria-hidden="true">{detail.icon}</span>
              <div>
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rsvp reveal">
        <TibebDivider dark compact />
        <div className="rsvp__inner">
          <p className="section-heading__kicker">ከእኛ ጋር ይሆናሉ? · KINDLY RSVP</p>
          <h2>Will You Be Our Guest?</h2>
          <p>
            Your love, prayers and presence mean the world to us. Kindly let us
            know if you’ll be joining us for this special day.
          </p>
          <button
            className="button button--gold"
            type="button"
            aria-haspopup="dialog"
            aria-controls="rsvp-dialog"
            onClick={() => setRsvpOpen(true)}
          >
            RSVP NOW →
          </button>
          <small>{wedding.rsvp.deadline}</small>
        </div>
        <TibebDivider dark compact />
      </section>

      <footer className="closing reveal">
        <div className="closing__cross" aria-hidden="true">✝</div>
        <p className="section-heading__kicker">A FINAL BLESSING · መጨረሻ በረከት</p>
        <blockquote>“{wedding.closing.verse}”</blockquote>
        <span>{wedding.closing.reference}</span>
        <p className="closing__glory">{wedding.closing.glory}</p>
        <h2>
          {wedding.couple.bride} <em>&amp;</em> {wedding.couple.groom}
        </h2>
        <p className="closing__amharic">{wedding.closing.amharic}</p>
        <TibebDivider />
      </footer>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </main>
  );
}

export default App;
