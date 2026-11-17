import { getSurveySteps } from "@/lib/survey";
import type { SurveyAnswers, SurveyStepId } from "@/types/survey";

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd3q1b_6xB2aBzd42yrf4hLrZTD9ceceRDZH5NbsuXMCUIhVA/formResponse";

const GOOGLE_FORM_ENTRIES = {
  petType: "entry.2116723398",
  purchasePlace: "entry.741415276",
  productType: "entry.1685194752",
  willingness: "entry.421156545",
} as const satisfies Record<SurveyStepId, string>;

export async function submitToGoogleForm(answers: SurveyAnswers) {
  const formData = new URLSearchParams();

  const steps = getSurveySteps(answers);

  for (const step of steps) {
    const answer = answers[step.id];
    const choice = step.choices.find((candidate) => candidate.value === answer);

    if (!choice) {
      throw new Error(`Invalid answer for ${step.id}`);
    }

    formData.append(GOOGLE_FORM_ENTRIES[step.id], choice.formValue);
  }

  formData.append("fvv", "1");
  formData.append(
    "pageHistory",
    steps.some((step) => step.id === "purchasePlace") ? "0,1,2" : "0,2",
  );

  const response = await fetch(GOOGLE_FORM_ACTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    redirect: "follow",
  });

  if (response.status >= 200 && response.status < 400) {
    return;
  }

  throw new Error(`Google Form responded with status ${response.status}`);
}
