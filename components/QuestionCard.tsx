import Image from "next/image";
import { PawPrint } from "lucide-react";

type QuestionCardProps = {
  question: string;
  highlight?: string;
  subtitle?: string;
};

export function QuestionCard({ question, highlight, subtitle }: QuestionCardProps) {
  const highlightIndex = highlight ? question.indexOf(highlight) : -1;

  return (
    <section
      className="rounded-[20px] border border-[#E7EEF7] bg-white px-4 py-3 text-[#101D2E] shadow-soft"
      aria-labelledby="survey-question"
    >
      <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold text-[#67A9FF]">
        <Image
          src="/images/insectal-avatar.png"
          alt=""
          width={28}
          height={28}
          className="size-7 shrink-0 rounded-full bg-[#E8F4FF] object-cover"
        />
        <span>인섹탈 가이드</span>
        <PawPrint className="size-3.5" aria-hidden="true" />
      </div>
      <h2
        id="survey-question"
        className="break-keep text-base font-extrabold leading-normal [overflow-wrap:anywhere] sm:text-[17px]"
      >
        {highlight && highlightIndex >= 0 ? (
          <>
            {question.slice(0, highlightIndex)}
            <span className="text-[#DC2626] underline decoration-2 underline-offset-4">
              {highlight}
            </span>
            {question.slice(highlightIndex + highlight.length)}
          </>
        ) : question}
      </h2>
      {subtitle ? (
        <p className="mt-2 break-keep text-[13px] font-semibold text-[#6B7B8B]">{subtitle}</p>
      ) : null}
    </section>
  );
}
