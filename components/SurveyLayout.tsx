import Image from "next/image";
import { ArrowLeft, Heart } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";

type SurveyLayoutProps = {
  children: React.ReactNode;
  progress: number;
  title?: string;
  singleLineTitle?: boolean;
  compactHeader?: boolean;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  showBack?: boolean;
  onBack?: () => void;
};

export function SurveyLayout({
  children,
  progress,
  title = "우리 아이 구충제, 어떻게 사용하고 계신가요?",
  singleLineTitle = false,
  compactHeader = false,
  subtitle,
  stepNumber,
  totalSteps = 4,
  showBack = false,
  onBack,
}: SurveyLayoutProps) {
  const compact = Boolean(stepNumber);

  return (
    <main className={`flex min-h-[100svh] justify-center bg-[#EEF7FF] text-[#0F345A] sm:p-1 ${compactHeader ? "completion-layout" : ""}`}>
      <div className={`relative min-h-[100svh] w-full max-w-[430px] overflow-hidden bg-[#FFFDF9] px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-[0_26px_70px_rgba(73,139,213,0.24)] min-[375px]:px-5 sm:rounded-[34px] sm:border sm:border-[#DCEEFF] sm:px-6 sm:pt-5 ${compactHeader ? "sm:min-h-[calc(100svh-8px)]" : ""}`}>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EAF5FF] to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 top-28 size-48 rounded-full bg-[#EAF5FF] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 [container-type:inline-size]">
          {!compactHeader ? (
            <div className="mb-1 flex h-11 items-center justify-between gap-2">
              {showBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="grid size-11 place-items-center rounded-full border border-[#D6E9FF] bg-white text-[#5A9BED] shadow-sm transition hover:bg-[#F3F9FF]"
                  aria-label="이전 질문으로 돌아가기"
                >
                  <ArrowLeft className="size-5" />
                </button>
              ) : (
                <span className="size-11" aria-hidden="true" />
              )}

              {compact ? (
                <Image
                  src="/images/insectal.png"
                  alt="INSECTAL"
                  width={955}
                  height={450}
                  priority
                  className="h-auto w-[120px] sm:w-[144px]"
                />
              ) : (
                <span aria-hidden="true" />
              )}

              {stepNumber ? (
                <div className="shrink-0 whitespace-nowrap rounded-full bg-[#EEF6FF] px-3 py-1.5 text-xs font-extrabold text-[#5A9BED]">
                  {stepNumber} / {totalSteps}
                </div>
              ) : (
                <div
                  className="grid size-11 place-items-center rounded-full border-2 border-[#9AC9FF] bg-white text-[#75B0F4]"
                  aria-hidden="true"
                >
                  <Heart className="size-5" />
                </div>
              )}
            </div>
          ) : null}

          <header className="text-center">
            {!compact ? (
              <Image
                src="/images/insectal.png"
                alt="INSECTAL"
                width={955}
                height={450}
                priority
                className={compactHeader
                  ? "mx-auto h-auto w-[112px]"
                  : "mx-auto h-auto w-[168px] sm:w-[236px]"}
              />
            ) : null}
            <h1
              className={[
                "font-black leading-snug tracking-tight text-[#123D67]",
                compactHeader ? "mt-2" : compact ? "mt-3" : "mt-4",
                singleLineTitle
                  ? "whitespace-nowrap text-[clamp(1rem,6cqi,1.375rem)]"
                  : "break-keep text-[1.25rem] [overflow-wrap:anywhere] sm:text-2xl",
              ].join(" ")}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className={`mx-auto max-w-[20rem] break-keep text-[13px] font-semibold leading-relaxed text-[#6B7B8B] sm:text-sm ${compactHeader ? "mt-1" : "mt-2"}`}>
                {subtitle}
              </p>
            ) : null}
          </header>

          <div className={compact || compactHeader ? "mt-3" : "mt-5"}>
            <ProgressBar progress={progress} />
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
