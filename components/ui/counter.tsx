"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${Number(latest).toFixed(value % 1 ? 1 : 0)}${suffix}`);

  useEffect(() => {
    if (inView) animate(count, value, { duration: 1.1, ease: "easeOut" });
  }, [count, inView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
