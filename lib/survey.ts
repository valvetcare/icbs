import type {
  SurveyAnswers,
  SurveyChoice,
  SurveyStep,
  SurveyStepId,
} from "@/types/survey";

export const PET_TYPE_OPTIONS = ["강아지만", "고양이만", "강아지와 고양이 모두"] as const;

export const PRODUCT_TYPE_OPTIONS = [
  "먹이는 제품",
  "바르는 제품",
  "2가지 이상 제품 병용",
  "수의사 추천으로 사용 중이나 제품 종류는 잘 모르겠음",
  "구충제를 사용하지 않음",
] as const;

export const PURCHASE_PLACE_OPTIONS = [
  "동물병원",
  "가까운 약국",
  "창고형 약국",
  "구충제를 사용하지 않음",
] as const;

export const WILLINGNESS_OPTIONS = [
  "O (사용 의향 있음)",
  "X (사용 의향 없음)",
  "잘 모르겠음",
] as const;

export const PROBIOTIC_USE_OPTIONS = ["O (급여 중)", "X (급여하지 않음)"] as const;

export const PROBIOTIC_TYPE_OPTIONS = [
  "분말형 (가루)",
  "정제형 (알약)",
  "캡슐형",
  "츄어블형",
  "액상형",
  "겔·페이스트형",
  "X (급여하지 않음)",
] as const;

const PET_TYPE_STEP: SurveyStep = {
  id: "petType",
  question: "1. 현재 어떤 반려동물을 키우고 계신가요?",
  choices: createChoices(PET_TYPE_OPTIONS),
};

const DEWORMER_STEPS: SurveyStep[] = [
  {
    id: "productType",
    question: "2. 현재 어떤 형태의 구충제(심장사상충, 진드기 예방)를 사용하고 계신가요?",
    choices: createChoices(PRODUCT_TYPE_OPTIONS),
  },
  {
    id: "purchasePlace",
    question: "3. 구충제는 주로 어디에서 구매하시나요?",
    choices: createChoices(PURCHASE_PLACE_OPTIONS),
  },
  {
    id: "willingness",
    question: "4. 바르는 올인원 구충제 '인섹탈'이 출시되었습니다. 사용해 보실 의향이 있으신가요?",
    highlight: "바르는 올인원 구충제 '인섹탈'",
    choices: createWillingnessChoices(),
  },
];

const PROBIOTIC_STEPS: SurveyStep[] = [
  {
    id: "probioticUse",
    question: "5. 현재 반려동물에게 유산균을 급여하고 계신가요?",
    choices: createChoices(PROBIOTIC_USE_OPTIONS),
  },
  {
    id: "probioticType",
    question: "6. 현재 급여 중인 유산균의 제형은 무엇인가요?",
    choices: createChoices(PROBIOTIC_TYPE_OPTIONS),
  },
  {
    id: "probioticWillingness",
    question: "7. 가루 날림 없이 급여할 수 있는 겔 제형 유산균이 있다면 사용해 보실 의향이 있으신가요?",
    highlight: "겔 제형 유산균",
    choices: createWillingnessChoices(),
    cta: "제출하기",
  },
];

export const INITIAL_SURVEY_ANSWERS: SurveyAnswers = {
  petType: "",
  purchasePlace: "",
  productType: "",
  willingness: "",
  probioticUse: "",
  probioticType: "",
  probioticWillingness: "",
};

function createChoices(options: readonly string[]): SurveyChoice[] {
  return options.map((value) => ({
    value,
    label: value,
    formValue: value,
    icon: "check",
  }));
}

function createWillingnessChoices(): SurveyChoice[] {
  return WILLINGNESS_OPTIONS.map((value) => ({
    value,
    label: value === "O (사용 의향 있음)" ? "O" : value === "X (사용 의향 없음)" ? "X" : value,
    formValue: value,
    icon: value === "O (사용 의향 있음)" ? "o" : value === "X (사용 의향 없음)" ? "x" : "check",
  }));
}

function isOption<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === "string" && options.some((option) => option === value);
}

export function getSurveyBranch(answers: SurveyAnswers) {
  return answers.petType === "고양이만" ? "probiotic" : "dewormer";
}

export function getSurveySteps(answers: SurveyAnswers): SurveyStep[] {
  const dewormerSteps = getSurveyBranch(answers) === "probiotic" ? [] : DEWORMER_STEPS;

  return [PET_TYPE_STEP, ...dewormerSteps, ...PROBIOTIC_STEPS];
}

export function updateSurveyAnswer(
  answers: SurveyAnswers,
  stepId: SurveyStepId,
  value: string,
): SurveyAnswers {
  const step = getSurveySteps(answers).find((candidate) => candidate.id === stepId);

  if (!step?.choices.some((choice) => choice.value === value)) {
    return answers;
  }

  if (stepId === "petType" && isOption(value, PET_TYPE_OPTIONS)) {
    const nextAnswers = { ...answers, petType: value };

    return getSurveyBranch(answers) !== getSurveyBranch(nextAnswers)
      ? { ...INITIAL_SURVEY_ANSWERS, petType: value }
      : nextAnswers;
  }

  return { ...answers, [stepId]: value };
}

export function validateStepAnswer(stepId: SurveyStepId, answers: SurveyAnswers) {
  const activeStep = getSurveySteps(answers).find((step) => step.id === stepId);

  return activeStep?.choices.some((choice) => choice.value === answers[stepId]) ?? false;
}

export function validateAllAnswers(answers: SurveyAnswers) {
  const errors: Partial<Record<SurveyStepId, string>> = {};

  for (const step of getSurveySteps(answers)) {
    if (!validateStepAnswer(step.id, answers)) {
      errors[step.id] = "필수 응답이 누락되었습니다.";
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  };
}

export function toSurveyAnswers(body: unknown): SurveyAnswers {
  const source = typeof body === "object" && body !== null ? body : {};
  const record = source as Record<string, unknown>;

  return {
    petType: isOption(record.petType, PET_TYPE_OPTIONS) ? record.petType : "",
    purchasePlace: isOption(record.purchasePlace, PURCHASE_PLACE_OPTIONS) ? record.purchasePlace : "",
    productType: isOption(record.productType, PRODUCT_TYPE_OPTIONS) ? record.productType : "",
    willingness: isOption(record.willingness, WILLINGNESS_OPTIONS) ? record.willingness : "",
    probioticUse: isOption(record.probioticUse, PROBIOTIC_USE_OPTIONS) ? record.probioticUse : "",
    probioticType: isOption(record.probioticType, PROBIOTIC_TYPE_OPTIONS) ? record.probioticType : "",
    probioticWillingness: isOption(record.probioticWillingness, WILLINGNESS_OPTIONS)
      ? record.probioticWillingness
      : "",
  };
}
