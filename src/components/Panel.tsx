import type { ReactNode } from "react";

// The light sheet that slides over a dark page header, like the home page.
export default function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-nav-theme="light" className={`relative z-10 -mt-7 rounded-t-[28px] bg-paper pb-36 pt-20 md:pt-28 ${className}`}>
      {children}
    </div>
  );
}

// A titled block inside a page. Headings get more space above than below.
export function Block({
  id,
  title,
  rest,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  rest?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={`shell mt-28 first:mt-0 md:mt-36 ${className}`}>
      <h2
        id={id ? `${id}-title` : undefined}
        className="max-w-[26ch] text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.01em] text-balance"
      >
        {title} {rest ? <span className="text-faint">{rest}</span> : null}
      </h2>
      <div className="mt-10 md:mt-12">{children}</div>
    </section>
  );
}
