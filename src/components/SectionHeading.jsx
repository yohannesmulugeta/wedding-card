export default function SectionHeading({
  kicker,
  title,
  subtitle,
  light = false,
  align = "center",
}) {
  return (
    <div
      className={
        "section-heading section-heading--" +
        align +
        (light ? " section-heading--light" : "")
      }
    >
      {kicker ? <p className="section-heading__kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
    </div>
  );
}
