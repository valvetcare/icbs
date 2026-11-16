"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";
import { ChoiceButton } from "@/components/ChoiceButton";
import { CompletionScreen } from "@/components/CompletionScreen";
import { QuestionCard } from "@/components/QuestionCard";
import { SurveyLayout } from "@/components/SurveyLayout";
import {
  getSurveySteps,
  INITIAL_SURVEY_ANSWERS,
  updateSurveyAnswer,
  validateAllAnswers,
  validateStepAnswer,
} from "@/lib/survey";
import type { SurveyAnswers, SurveyStep, SurveyStepId } from "@/types/survey";

const FORM_TITLE = "2026년 11월 메가주 설문조사";

export function SurveyApp() {
  const [answers, setAnswers] = useState<SurveyAnswers>(INITIAL_SURVEY_ANSWERS);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const surveySteps = useMemo(() => getSurveySteps(answers), [answers]);
  const currentStep = surveySteps[stepIndex];
  const totalSteps = surveySteps.length;
  const canContinue = useMemo(
    () => validateStepAnswer(currentStep.id, answers),
    [answers, currentStep.id],
  );
  const isLastStep = stepIndex === surveySteps.length - 1;
  const progress = Math.round(10 + ((stepIndex + 1) / totalSteps) * 85);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stepIndex, hasStarted, isCompleted]);

  function updateAnswer(stepId: SurveyStepId, value: string) {
    setAnswers((current) => updateSurveyAnswer(current, stepId, value));
    setSubmitError("");
  }

  function goBack() {
    if (isSubmitting || stepIndex === 0) {
      return;
    }

    setStepIndex((current) => current - 1);
    setSubmitError("");
  }

  async function submitSurvey() {
    const validation = validateAllAnswers(answers);

    if (!validation.ok) {
      setSubmitError("필수 문항을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error("Survey submission failed.");
      }

      setIsCompleted(true);
    } catch {
      setSubmitError("제출에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue || isSubmitting) {
      return;
    }

    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      setSubmitError("");
      return;
    }

    await submitSurvey();
  }

  if (!hasStarted) {
    return <IntroScreen onStart={() => setHasStarted(true)} />;
  }

  if (isCompleted) {
    return <CompletionScreen />;
  }

  return (
    <SurveyLayout
      progress={progress}
      title={FORM_TITLE}
      singleLineTitle
      stepNumber={stepIndex + 1}
      totalSteps={totalSteps}
      showBack={stepIndex > 0}
      onBack={goBack}
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <QuestionCard
          question={currentStep.question}
          highlight={currentStep.highlight}
          subtitle={currentStep.subtitle}
        />

        <ChoiceQuestion
          step={currentStep}
          selectedValue={answers[currentStep.id]}
          onSelect={(value) => updateAnswer(currentStep.id, value)}
        />

        {submitError ? (
          <div
            role="alert"
            className="rounded-[22px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold leading-relaxed text-orange-700"
          >
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canContinue || isSubmitting}
          className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[18px] bg-[#67A8F2] px-5 text-lg font-black text-white shadow-button transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span>{isSubmitting ? "제출 중..." : currentStep.cta ?? "다음"}</span>
          <ArrowRight className="size-6" aria-hidden="true" />
        </button>
      </form>
    </SurveyLayout>
  );
}

type IntroScreenProps = {
  onStart: () => void;
};

function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <SurveyLayout progress={10} title={FORM_TITLE} singleLineTitle>
      <section className="mt-5 space-y-4">
        <GuideBubble>
          <span>안녕하세요, 웰케어입니다 :)</span>
          <span>반려동물 구충제와 유산균 사용 경험에 대한 간단한 설문입니다.</span>
          <span>응답해주신 내용은 제품 및 시장 조사 목적으로만 활용됩니다.</span>
          <span>※ 작성해주신 개인정보는 응답 확인 및 안내 목적으로만 사용됩니다.</span>
        </GuideBubble>

        <GuideBubble compact trailingIcon={<Clock3 className="size-5 text-[#67A8F2]" />}>
          <span>약 1분 정도 걸려요.</span>
        </GuideBubble>

        <div className="mx-auto max-w-[240px] pt-2">
          <Image
            src="/images/welcare-pets.png"
            alt="하얀 강아지와 크림색 고양이"
            width={620}
            height={310}
            priority
            className="h-auto w-full rounded-[20px] object-contain"
          />
        </div>

        <button
          type="button"
          onClick={onStart}
          className="flex min-h-[52px] w-full items-center justify-center gap-4 rounded-[18px] bg-[#67A8F2] px-5 text-lg font-black text-white shadow-button transition hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>설문 시작하기</span>
          <ArrowRight className="size-6" aria-hidden="true" />
        </button>
      </section>
    </SurveyLayout>
  );
}

type GuideBubbleProps = {
  children: ReactNode;
  compact?: boolean;
  trailingIcon?: ReactNode;
};

function GuideBubble({ children, compact = false, trailingIcon }: GuideBubbleProps) {
  return (
    <div className="flex gap-2">
      <div className="mt-2 grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#E8F4FF]">
        <Image
          src="/images/insectal-avatar.png"
          alt=""
          width={32}
          height={32}
          className="size-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 text-[11px] font-extrabold text-[#67A9FF]">인섹탈 가이드</div>
        <div
          className={[
            "flex items-center gap-3 rounded-[20px] border border-[#E7EEF7] bg-white px-4 text-[#101D2E] shadow-soft",
            compact ? "min-h-11 py-2.5 text-sm font-extrabold" : "py-4 text-sm font-semibold leading-relaxed",
          ].join(" ")}
        >
          <div className={compact ? "break-keep" : "flex flex-col gap-1 break-keep"}>{children}</div>
          {trailingIcon ? <span className="ml-auto shrink-0">{trailingIcon}</span> : null}
        </div>
      </div>
    </div>
  );
}

type ChoiceQuestionProps = {
  step: SurveyStep;
  selectedValue: string;
  onSelect: (value: string) => void;
};

function ChoiceQuestion({ step, selectedValue, onSelect }: ChoiceQuestionProps) {
  const useTiles = step.id === "willingness" || step.id === "probioticWillingness";

  return (
    <div className={useTiles ? "grid grid-cols-3 gap-2" : "space-y-2"}>
      {step.choices.map((choice) => (
        <ChoiceButton
          key={choice.value}
          choice={choice}
          selected={selectedValue === choice.value}
          layout={useTiles ? "tile" : "list"}
          onClick={() => onSelect(choice.value)}
        />
      ))}
    </div>
  );
}
