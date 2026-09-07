import RevealText from "./RevealText";

/**
 * Compact cinematic header for the dedicated /shop and /events pages —
 * enough drama to set the mood on entry without the weight (or WebGL cost)
 * of the full 3D homepage hero. `title` renders entirely in Fraunces
 * italic; pass `highlight` as a substring of `title` to render that portion
 * in antique gold instead of paper.
 */
export default function MiniHero({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
}) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <section className="relative pt-40 pb-20 sm:pt-48 sm:pb-28 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-gradient-to-b from-lime/[0.06] via-ink to-ink -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-lime/[0.03] blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 text-center">
        <RevealText>
          <p className="text-lime uppercase text-xs sm:text-sm font-semibold tracking-[0.3em] mb-6">
            {eyebrow}
          </p>
          <h1 className="font-display italic text-4xl sm:text-6xl lg:text-7xl text-paper font-light leading-[1.1] mb-6">
            {parts.length === 2 ? (
              <>
                {parts[0]}
                <span className="text-lime">{highlight}</span>
                {parts[1]}
              </>
            ) : (
              title
            )}
          </h1>
          <p className="text-paper/60 text-base sm:text-lg font-light max-w-xl mx-auto not-italic">
            {subtitle}
          </p>
        </RevealText>
      </div>
    </section>
  );
}
