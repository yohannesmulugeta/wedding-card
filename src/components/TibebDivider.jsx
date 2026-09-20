export default function TibebDivider({ dark = false, compact = false }) {
  return (
    <div
      className={
        "tibeb-divider" +
        (dark ? " tibeb-divider--dark" : "") +
        (compact ? " tibeb-divider--compact" : "")
      }
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
