"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useAnimate, useInView } from "framer-motion";
import { BackpackIcon, CursorIcon, HeadphonesIcon, ShoppingBagIcon, SneakerMoveIcon } from "@phosphor-icons/react/ssr";
import { easeInOut, easeOut, prefersReducedMotion, wait } from "@/lib/motion";

const PRODUCTS = [
  { name: "Runner", price: 89, Icon: SneakerMoveIcon },
  { name: "Daypack", price: 64, Icon: BackpackIcon },
  { name: "Studio", price: 120, Icon: HeadphonesIcon },
];

// A cursor shops: adds two items, the bag count ticks up, checkout slides in.
export default function ShopVignette() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { once: true, margin: "-20% 0px" });
  const [added, setAdded] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const play = useCallback(async () => {
    const root = scope.current;
    if (!root) return;
    const reduce = prefersReducedMotion();
    setAdded([]);
    setDone(false);
    const box = root.getBoundingClientRect();
    const target = (i: number) => {
      const b = root.querySelector<HTMLElement>(`[data-add="${i}"]`)!.getBoundingClientRect();
      return `translate(${b.left - box.left + b.width * 0.55}px, ${b.top - box.top + b.height * 0.45}px)`;
    };
    await animate("[data-cursor]", { transform: `translate(${box.width * 0.9}px, ${box.height * 0.95}px)`, opacity: 0 }, { duration: 0 });
    await animate("[data-cursor]", { opacity: 1 }, { duration: 0.2 });
    for (const i of [1, 2]) {
      await animate("[data-cursor]", { transform: target(i) }, { duration: reduce ? 0 : 0.8, ease: easeInOut });
      await animate(`[data-add="${i}"]`, { transform: "scale(0.94)" }, { duration: 0.1, ease: easeOut });
      setAdded((a) => [...a, i]);
      await animate(`[data-add="${i}"]`, { transform: "scale(1)" }, { duration: 0.16, ease: easeOut });
      await wait(250);
    }
    await animate("[data-cursor]", { opacity: 0 }, { duration: 0.25 });
    setDone(true);
  }, [animate, scope]);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(play, 200);
    return () => clearTimeout(t);
  }, [inView, play]);

  const total = added.reduce((sum, i) => sum + PRODUCTS[i].price, 0);

  return (
    <div
      ref={scope}
      className="relative flex h-full min-h-[320px] flex-col overflow-hidden p-5 text-paper md:p-7"
      onPointerEnter={() => done && play()}
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium">storefront</span>
        <span className="relative grid size-10 place-items-center rounded-[10px] bg-ink-3">
          <ShoppingBagIcon size={22} weight="bold" />
          {added.length > 0 && (
            <motion.span
              key={added.length}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-[6px] bg-signal text-[12px] font-semibold text-ink"
            >
              {added.length}
            </motion.span>
          )}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {PRODUCTS.map((p, i) => (
          <div key={p.name} className="flex flex-col">
            <div className="grid aspect-square place-items-center rounded-[12px] bg-ink-3">
              <p.Icon size={52} weight="duotone" />
            </div>
            <p className="mt-2.5 text-[14px]">{p.name}</p>
            <p className="text-[14px] text-mute-dark">${p.price}</p>
            <span
              data-add={i}
              className={`mt-2.5 rounded-[8px] px-2 py-1.5 text-center text-[13px] font-medium transition-colors duration-200 ${
                added.includes(i) ? "bg-paper text-ink" : "bg-ink-3 text-paper"
              }`}
            >
              {added.includes(i) ? "Added" : "Add"}
            </span>
          </div>
        ))}
      </div>

      <motion.div
        initial={false}
        animate={{ transform: done ? "translateY(0%)" : "translateY(140%)" }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="mt-auto flex items-center justify-between rounded-[12px] bg-paper px-4 py-3 text-ink"
      >
        <span className="text-[14px]">
          {added.length} items · ${total}.00
        </span>
        <span className="rounded-[8px] bg-signal px-3 py-1.5 text-[13px] font-semibold">Checkout</span>
      </motion.div>

      <span data-cursor className="pointer-events-none absolute left-0 top-0 opacity-0">
        <CursorIcon size={26} weight="fill" className="text-paper drop-shadow-[0_2px_4px_rgb(0_0_0/0.5)]" />
      </span>
    </div>
  );
}
