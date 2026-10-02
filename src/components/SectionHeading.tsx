// Two-tone heading: the claim in full color, the follow-on in a quieter tone.
export default function SectionHeading({
  lead,
  rest,
  dark = false,
  className = "",
}: {
  lead: string;
  rest: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`max-w-[24ch] text-[clamp(30px,4.2vw,54px)] font-medium leading-[1.08] tracking-[-0.01em] text-balance ${className}`}
    >
      {lead} <span className={dark ? "text-faint-dark" : "text-faint"}>{rest}</span>
    </h2>
  );
}
