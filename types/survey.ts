export type PetType = "강아지만" | "고양이만" | "강아지와 고양이 모두";

export type ProductType =
  | "먹이는 제품"
  | "바르는 제품"
  | "2가지 이상 제품 병용"
  | "수의사 추천으로 사용 중이나 제품 종류는 잘 모르겠음"
  | "구충제를 사용하지 않음"
  | "";

export type Willingness = "O (사용 의향 있음)" | "X (사용 의향 없음)" | "잘 모르겠음" | "";

export type SurveyAnswers = {
  petType: PetType | "";
  purchasePlace: string;
  productType: ProductType;
  willingness: Willingness;
};

export type SurveyStepId = keyof SurveyAnswers;

export type SurveyChoice = {
  value: string;
  label: string;
  formValue: string;
  icon: "o" | "x" | "check";
};

export type SurveyStep = {
  id: SurveyStepId;
  question: string;
  highlight?: string;
  subtitle?: string;
  choices: SurveyChoice[];
  cta?: string;
};
