"use client";

import Image from "next/image";
import { ArrowRight, Gift, ShieldCheck } from "lucide-react";
import { SurveyLayout } from "@/components/SurveyLayout";

type KakaoChannelScreenProps = {
  isSubmitting: boolean;
  submitError: string;
  onBack: () => void;
  onSubmit: () => void;
};

export function KakaoChannelScreen({
  isSubmitting,
  submitError,
  onBack,
  onSubmit,
}: KakaoChannelScreenProps) {
  return (
    <SurveyLayout
      progress={98}
      title="설문지 제출을 누르시면 참여가 완료됩니다 감사합니다 :)"
      subtitle="설문 제출 후 카카오톡 채널 추가를 완료하시면 웰케어 데일리 5일치 체험팩을 드립니다!"
      showBack={!isSubmitting}
      onBack={onBack}
    >
      <section className="mt-5 space-y-4">
        <div className="rounded-[20px] border border-[#E7EEF7] bg-white p-4 shadow-soft">
          <div className="flex items-start gap-3 text-sm font-bold leading-relaxed text-[#4F5F70]">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#67A8F2] text-white">
              <Gift className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 break-keep">아래 버튼을 눌러 설문 제출을 완료해주세요.</span>
          </div>
          <div className="mt-4 flex items-start gap-3 text-sm font-bold leading-relaxed text-[#4F5F70]">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#67A8F2] text-white">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 break-keep">응답은 Google Form으로 제출되고, 완료 화면에서 사은품 안내를 확인할 수 있어요.</span>
          </div>
        </div>

        <Image
          src="/images/welcare-pets.png"
          alt=""
          width={420}
          height={210}
          className="mx-auto h-auto w-full max-w-[160px] rounded-[18px] object-contain"
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
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[18px] bg-[#67A8F2] px-4 text-lg font-black text-white shadow-button transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span className="whitespace-nowrap">{isSubmitting ? "제출 중..." : "설문 제출 완료하기"}</span>
          <ArrowRight className="size-6 shrink-0" aria-hidden="true" />
        </button>
      </section>
    </SurveyLayout>
  );
}
