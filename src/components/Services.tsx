import { services } from "@/data/content";
import ApiLog from "./ApiLog";
import DitherField from "./DitherField";
import DotIcon from "./DotIcon";
import HalftoneFade from "./HalftoneFade";
import Reveal from "./Reveal";
import ResponsiveDemo from "./ResponsiveDemo";
import SectionHeading from "./SectionHeading";

export default function Services() {
  const { interfaces, apis, data, deploys } = services;

  return (
    <section id="services" data-nav="about" data-nav-theme="light" className="bg-paper pb-36 pt-8">
      <div className="shell">
        <Reveal>
          <SectionHeading lead="What I build," rest="from the first schema to the deploy." />
        </Reveal>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Reveal className="flex min-h-[540px] flex-col rounded-[20px] bg-paper-2 p-6 md:p-8 lg:row-span-2">
            <ResponsiveDemo />
            <div className="mt-auto pt-10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[26px] font-medium leading-tight">{interfaces.title}</h3>
                <DotIcon name="browser" size={80} className="-my-2 text-ink" />
              </div>
              <p className="mt-3 max-w-[40ch] text-mute">{interfaces.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {interfaces.tags.map((t) => (
                  <li key={t} className="rounded-[8px] bg-paper px-3 py-1.5 text-[14px]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal
            delay={80}
            className="flex min-h-[540px] flex-col overflow-hidden rounded-[20px] bg-ink p-6 text-paper md:p-8 lg:row-span-2"
          >
            <h3 className="text-[26px] font-medium leading-tight">{apis.title}</h3>
            <p className="mt-3 max-w-[40ch] text-mute-dark">{apis.body}</p>
            <ApiLog className="mt-8" />
            <p aria-hidden className="mt-auto pt-10 font-display text-[clamp(72px,8vw,104px)] font-bold leading-none">
              /api
            </p>
            <HalftoneFade className="-mx-6 -mb-6 mt-4 block h-24 w-[calc(100%+3rem)] text-paper md:-mx-8 md:-mb-8 md:w-[calc(100%+4rem)]" />
          </Reveal>

          <Reveal delay={160} className="flex flex-col rounded-[20px] bg-paper-2 p-3">
            <DitherField
              className="aspect-[16/10] w-full rounded-[14px]"
              label="Dithered pattern of slowly shifting shapes, standing in for data"
            />
            <div className="flex items-start justify-between gap-4 p-3 pt-5">
              <div>
                <h3 className="text-[26px] font-medium leading-tight">{data.title}</h3>
                <p className="mt-3 max-w-[38ch] text-mute">{data.body}</p>
              </div>
              <DotIcon name="database" size={72} className="text-ink" />
            </div>
          </Reveal>

          <Reveal delay={240} className="flex flex-col justify-between gap-10 rounded-[20px] bg-paper-3 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <p aria-hidden className="font-display text-[clamp(56px,6vw,76px)] font-bold leading-none">
                v1.0
              </p>
              <DotIcon name="rocket" size={112} className="-mr-2 -mt-2 text-ink" />
            </div>
            <div>
              <h3 className="text-[26px] font-medium leading-tight">{deploys.title}</h3>
              <p className="mt-3 max-w-[40ch] text-mute">{deploys.body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
