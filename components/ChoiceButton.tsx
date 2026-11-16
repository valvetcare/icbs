"use client";

import { Check, Circle, X } from "lucide-react";
import type { SurveyChoice } from "@/types/survey";

type ChoiceButtonProps = {
  choice: SurveyChoice;
  selected: boolean;
  onClick: () => void;
  layout?: "list" | "tile";
  multiple?: boolean;
};

export function ChoiceButton({
  choice,
  selected,
  onClick,
  layout = "list",
  multiple = false,
}: ChoiceButtonProps) {
  const MarkIcon = choice.icon === "x" ? X : choice.icon === "o" ? Circle : Check;
  const isTile = layout === "tile";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "group relative min-w-0 w-full border bg-white text-left text-[#102B4D] shadow-soft transition",
        "hover:-translate-y-0.5 hover:border-[#67A8F2]/80 active:translate-y-0",
        selected
          ? "border-[#67A8F2] bg-[#F3F9FF] ring-2 ring-[#67A8F2]/20"
          : "border-[#E7EEF7]",
        isTile
          ? "flex min-h-24 flex-col items-center justify-center gap-2 rounded-[18px] px-2 py-3 text-center"
          : "flex min-h-[52px] items-center gap-2.5 rounded-[16px] px-3 py-2.5",
      ].join(" ")}
    >
      <span
        className={[
          "grid shrink-0 place-items-center border transition",
          selected
            ? "border-[#67A8F2] bg-[#67A8F2] text-white"
            : "border-[#DCE9F6] bg-[#F0F7FF] text-[#67A8F2]",
          multiple ? "rounded-xl" : "rounded-full",
          isTile ? "size-10" : "size-7",
        ].join(" ")}
        aria-hidden="true"
      >
        {multiple && !selected ? null : (
          <MarkIcon className={isTile ? "size-6" : "size-4"} strokeWidth={selected ? 3 : 2.4} />
        )}
      </span>

      <span
        className={[
          "min-w-0 font-extrabold leading-[1.45]",
          isTile
            ? "whitespace-nowrap text-sm"
            : "flex-1 break-keep text-sm [overflow-wrap:anywhere] min-[360px]:text-[15px]",
        ].join(" ")}
      >
        {choice.label}
      </span>
    </button>
  );
}
