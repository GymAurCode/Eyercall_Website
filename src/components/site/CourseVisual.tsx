import type { ReactElement } from "react";
import { Check, MousePointer2, Play, type LucideIcon } from "lucide-react";
import { courseIcons } from "@/lib/course-icons";
import type { Course, CourseIcon } from "@/lib/courses";

function IconTile({ Icon, size = 22 }: { Icon: LucideIcon; size?: number }) {
  return (
    <span className="grid h-14 w-14 place-items-center rounded-2xl glass-strong text-primary-text">
      <Icon size={size} aria-hidden />
    </span>
  );
}

function SecurityMotif({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative grid h-36 w-36 place-items-center sm:h-40 sm:w-40">
      <span className="absolute inset-0 rounded-full border border-teal-border" />
      <span className="absolute inset-[14%] rounded-full border border-dashed border-teal-border-strong" />
      <span className="absolute inset-[30%] rounded-[1.6rem] bg-primary/10" />
      <div className="relative">
        <IconTile Icon={Icon} size={26} />
      </div>
      <span className="absolute right-2 top-5 h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="absolute bottom-7 left-2 h-1 w-1 rounded-full bg-primary/60" />
      <span className="absolute bottom-10 right-4 h-1 w-4 rounded-full bg-primary/25" />
    </div>
  );
}

function CodeMotif({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative h-36 w-full max-w-[17rem]">
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-teal-border bg-background/60">
        <div className="flex items-center gap-1.5 border-b border-teal-border/70 px-3 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/55" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/35" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
          <span className="ml-2 h-1.5 flex-1 rounded-full bg-muted" />
        </div>
        <div className="space-y-2.5 px-4 py-4">
          <span className="block h-1.5 w-2/3 rounded-full bg-primary/35" />
          <span className="block h-1.5 w-1/2 rounded-full bg-muted-foreground/20" />
          <span className="block h-1.5 w-4/5 rounded-full bg-muted-foreground/15" />
          <span className="block h-1.5 w-2/5 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
      <span className="absolute -bottom-4 right-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-(--shadow-cta)">
        <Icon size={22} aria-hidden />
      </span>
    </div>
  );
}

function ServicesMotif({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative h-36 w-full max-w-[15rem]">
      <span className="absolute inset-x-6 top-0 h-28 rounded-2xl border border-teal-border bg-background/35" />
      <span className="absolute inset-x-3 top-3 h-28 rounded-2xl border border-teal-border bg-background/55" />
      <div className="absolute inset-x-0 top-6 h-28 rounded-2xl glass-strong p-3.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-soft text-primary-text">
            <Icon size={14} aria-hidden />
          </span>
          <span className="h-1.5 w-16 rounded-full bg-primary/30" />
        </div>
        <div className="mt-3 space-y-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-2">
              <Check size={11} className="shrink-0 text-primary-text" aria-hidden />
              <span
                className="h-1.5 rounded-full bg-muted-foreground/15"
                style={{ width: `${[72, 56, 64][row]}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesignMotif({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative grid h-36 w-36 place-items-center sm:h-40 sm:w-40">
      <span className="absolute h-32 w-32 rounded-full border border-teal-border" />
      <span className="absolute h-24 w-24 rounded-full border border-teal-border-strong/70" />
      <span className="absolute h-14 w-14 rounded-full bg-primary/15" />
      <div className="relative">
        <IconTile Icon={Icon} />
      </div>
      <span className="absolute -left-1 bottom-0 h-9 w-9 rounded-xl border border-teal-border bg-background/50" />
      <div className="absolute -right-1 bottom-1 flex gap-1">
        <span className="h-3.5 w-3.5 rounded-full bg-primary/20" />
        <span className="h-3.5 w-3.5 rounded-full bg-primary/40" />
        <span className="h-3.5 w-3.5 rounded-full bg-primary/60" />
        <span className="h-3.5 w-3.5 rounded-full bg-primary" />
      </div>
    </div>
  );
}

function VideoMotif({ Icon }: { Icon: LucideIcon }) {
  const bars = [7, 12, 18, 9, 14, 6];
  return (
    <div className="relative h-36 w-full max-w-[17rem] rounded-2xl border border-teal-border bg-background/60 p-3">
      <div className="flex justify-between px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="h-1.5 w-3 rounded-[2px] bg-primary/15" />
        ))}
      </div>
      <div className="my-2.5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-(--shadow-cta)">
          <Play size={18} fill="currentColor" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <span className="block h-1.5 w-4/5 rounded-full bg-muted-foreground/20" />
          <span className="block h-1.5 w-3/5 rounded-full bg-muted-foreground/15" />
        </div>
        <Icon size={20} className="shrink-0 text-primary-text" aria-hidden />
      </div>
      <div className="flex h-5 items-end gap-1 px-1">
        {bars.map((height, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm ${i === 2 ? "bg-primary" : "bg-primary/25"}`}
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
}

function ComputerMotif({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative h-36 w-full max-w-[16rem]">
      <div className="grid h-27 grid-cols-3 gap-1.5 rounded-2xl border border-teal-border bg-background/60 p-3">
        <span className="rounded-lg bg-muted" />
        <span className="rounded-lg bg-muted" />
        <span className="rounded-lg bg-muted" />
        <span className="rounded-lg bg-muted" />
        <span className="grid place-items-center rounded-lg bg-primary-soft text-primary-text">
          <Icon size={16} aria-hidden />
        </span>
        <span className="rounded-lg bg-muted" />
      </div>
      <span className="mx-auto mt-1.5 block h-2 w-24 rounded-b-lg bg-primary/15" />
      <span className="absolute right-1 top-[5.6rem] grid h-9 w-9 place-items-center rounded-xl glass-strong text-primary-text">
        <MousePointer2 size={15} aria-hidden />
      </span>
    </div>
  );
}

const motifs: Record<CourseIcon, (props: { Icon: LucideIcon }) => ReactElement> = {
  security: SecurityMotif,
  code: CodeMotif,
  services: ServicesMotif,
  design: DesignMotif,
  video: VideoMotif,
  computer: ComputerMotif,
};

export function CourseVisual({ course }: { course: Course }) {
  const Icon = courseIcons[course.icon];
  const Motif = motifs[course.icon];

  return (
    <div className="relative h-full overflow-hidden rounded-[1.25rem] border border-teal-border bg-secondary/70">
      <div
        aria-hidden
        className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-2xl"
      />
      <div aria-hidden className="course-visual-grid absolute inset-0" />
      <div className="relative flex h-full flex-col justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/55" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/15" />
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-teal-border bg-background/50 text-primary-text">
            <Icon size={16} aria-hidden />
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Motif Icon={Icon} />
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {course.topics.slice(0, 2).map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-teal-border bg-background/60 px-2.5 py-1 text-[11px] leading-tight text-muted-foreground"
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
