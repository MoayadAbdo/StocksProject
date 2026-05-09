import { motion } from "framer-motion";

const toneClasses = {
  neutral:
    "border-zinc-200/80 bg-zinc-50/80 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100",
  accent:
    "border-accent-100 bg-accent-50 text-zinc-900 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-zinc-100",
  gain:
    "border-emerald-200 bg-emerald-50 text-zinc-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-zinc-100",
  loss: "border-rose-200 bg-rose-50 text-zinc-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-zinc-100"
};

export default function MetricCard({ label, value, detail, tone = "neutral" }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-xl border p-4 ${toneClasses[tone] ?? toneClasses.neutral}`}
    >
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {detail ? <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{detail}</p> : null}
    </motion.article>
  );
}
