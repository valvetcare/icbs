"use client";

import Image from "next/image";
import { Check, ExternalLink, HeartPulse, MessageCircle, Pipette, Sparkles, UserRoundPlus } from "lucide-react";
import { SurveyLayout } from "@/components/SurveyLayout";

const KAKAO_COUPON_URL =
  process.env.NEXT_PUBLIC_KAKAO_COUPON_URL?.trim() || "https://pf.kakao.com/_fJZab/coupons/_Qukjo45n";
const WELCARE_MALL_SIGNUP_URL = "https://www.welcaremall.com/member/login.html#none";

const benefitCards = [
  { label: "구충 관리", Icon: HeartPulse },
  { label: "인섹탈 콤보", Icon: Pipette },
  { label: "5일치 체험팩", Icon: Sparkles },
];

export function CompletionScreen() {
  return (
    <SurveyLayout
      progress={100}
      title="참여해 주셔서 감사합니다 :)"
      subtitle="아래 사은품 안내를 확인해 주세요!"
      compactHeader
    >
      <section className="completion-screen mt-3 grid gap-2.5">
        <div className="completion-actions grid gap-2">
          <a
            href={KAKAO_COUPON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] border border-[#F7DF7C] bg-[#FFE75A] px-3 py-2.5 text-sm font-black text-[#2B2110] shadow-soft transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67A8F2] min-[360px]:text-[15px]"
          >
            <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">사은품 쿠폰 발급</span>
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          </a>

          <a
            href={WELCARE_MALL_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] border border-[#C0DFAF] bg-[#DDF2D1] px-3 py-2.5 text-sm font-black text-[#264B2D] shadow-soft transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81B96F] min-[360px]:text-[15px]"
          >
            <UserRoundPlus className="size-5 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">웰케어몰 회원가입하기</span>
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <div className="completion-reward flex items-start gap-2.5 rounded-[20px] border border-[#E7EEF7] bg-white p-3 shadow-soft">
          <Image
            src="/images/insectal-avatar.png"
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <p className="min-w-0 flex-1 break-keep text-sm font-extrabold leading-[1.5] text-[#101D2E]">
            사은품으로 웰케어 데일리 5일치 체험팩을 드립니다!
          </p>
        </div>

        <div className="completion-confirmation rounded-[20px] border border-[#E7EEF7] bg-white p-3 shadow-soft">
          <div className="flex items-center gap-2.5 text-[13px] font-bold leading-relaxed text-[#4F5F70]">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#67A8F2] text-white">
              <Check className="size-4" strokeWidth={3} aria-hidden="true" />
            </span>
            <div className="min-w-0 break-keep">
              <p>응답이 정상적으로 제출되었습니다.</p>
              <p>감사합니다.</p>
            </div>
          </div>
        </div>

        <Image
          src="/images/welcare-pets.png"
          alt=""
          width={480}
          height={240}
          className="completion-pets mx-auto h-auto w-full max-w-[112px] rounded-[16px] object-contain"
        />

        <div className="completion-benefits grid grid-cols-3 gap-2">
          {benefitCards.map(({ label, Icon }) => (
            <div
              key={label}
              className="rounded-[18px] border border-[#E7EEF7] bg-white px-1.5 py-2.5 text-center shadow-soft"
            >
              <div className="mx-auto grid size-8 place-items-center rounded-full bg-[#E7F3FF] text-[#4D8CDC]">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <p className="mt-1.5 whitespace-nowrap text-[11px] font-black leading-snug text-[#101D2E]">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </SurveyLayout>
  );
}
