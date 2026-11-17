# 2026년 11월 메가주 설문조사

박람회 부스의 QR 코드로 접속하는 모바일 설문 웹앱입니다. Next.js 15 App Router, React, TypeScript, Tailwind CSS를 사용합니다. 사용자가 답변을 제출하면 `/api/submit`이 답변을 검증하고 연결된 Google Form의 `formResponse`로 서버에서 POST 요청을 보냅니다. 별도 데이터베이스는 사용하지 않습니다.

## 설치 및 실행

로컬 빌드를 확인한 Node.js 24.x 사용을 권장합니다. 저장소의 `package-lock.json`에 맞춰 의존성을 설치합니다.

```bash
npm ci
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다. 개발 서버는 `.next-dev`, 프로덕션 빌드는 `.next` 폴더를 사용합니다.

Windows PowerShell에서 스크립트 실행 정책으로 `npm` 실행이 차단되면 `npm.cmd ci`, `npm.cmd run dev`처럼 `npm.cmd`를 사용합니다.

## 설문 흐름

시작 화면에서 `설문 시작하기`를 누르고, 반려동물 종류를 단일 선택합니다. 강아지만, 고양이만, 강아지와 고양이 모두 같은 구충제 문항에 응답하며, 구충제 사용 여부에 따라 구매처 문항의 표시 여부가 달라집니다.

| 구충제 사용 여부 | 문항 순서 | 총 문항 수 |
| --- | --- | --- |
| 사용 중 (제품 종류를 잘 모르는 경우 포함) | 반려동물 종류 → 구충제 사용 형태 → 구매처 → 인섹탈 사용 의향 | 4문항 |
| 구충제를 사용하지 않음 | 반려동물 종류 → 구충제 사용 형태 → 인섹탈 사용 의향 | 3문항 |

- 표시되는 모든 문항은 필수·단일 선택입니다.
- 질문 번호와 상단 진행 표시는 실제 표시되는 문항에 맞춰 연속으로 표시됩니다. 구충제를 사용하지 않으면 마지막 문항은 `3 / 3`입니다.
- 이전 문항으로 돌아가 `구충제를 사용하지 않음`으로 변경하면 기존 구매처 답변을 초기화합니다. 이후 사용 중인 제품으로 다시 변경하면 구매처를 다시 선택해야 합니다.
- 마지막 문항의 `제출하기`를 누르면 제출 API를 호출합니다. API가 성공하면 완료 화면으로 이동하고, 실패하면 설문 화면에 재시도 안내를 표시합니다.

## 완료 화면

제출 성공 후 사은품 안내와 다음 두 버튼을 표시합니다. 두 링크 모두 새 탭으로 열립니다.

- `사은품 쿠폰 발급`: 카카오톡 쿠폰 페이지로 이동합니다.
- `웰케어몰 회원가입하기`: 현재 연결 주소는 `https://www.welcaremall.com/member/login.html#none`이며, 웰케어몰 로그인 페이지로 이동합니다.

앱은 외부 페이지에서의 카카오톡 채널 추가, 쿠폰 발급, 회원가입 완료 여부를 확인하지 않습니다.

## Google Form 연결

Google Form 주소와 문항별 entry ID는 [lib/googleForm.ts](lib/googleForm.ts)에 설정되어 있습니다. Google Form용 환경 변수, API 키, OAuth 설정은 필요하지 않습니다.

선택한 분기의 답변만 제출하며, `pageHistory`는 구충제 사용 중일 때 `0,1,2`, 사용하지 않을 때 `0,2`로 전송합니다. 사용하지 않는 경우 구매처 entry는 전송하지 않습니다. 선택지의 전체 문자열을 Google Form에 보내므로, 화면에서 `O`, `X`로 줄여 표시하는 선택지도 실제 전송 값은 `O (사용 의향 있음)`, `X (사용 의향 없음)`입니다.

설문 문항이나 Google Form을 변경할 때는 [lib/survey.ts](lib/survey.ts)의 문항·선택지와 `lib/googleForm.ts`의 폼 주소, entry ID, `pageHistory`가 실제 Google Form과 일치하는지 함께 확인해야 합니다.

## 환경 변수

현재 앱이 읽는 환경 변수는 `NEXT_PUBLIC_KAKAO_COUPON_URL` 하나이며, 선택 사항입니다. 값을 설정하지 않거나 빈 값이면 아래 기본 쿠폰 주소를 사용합니다.

```bash
NEXT_PUBLIC_KAKAO_COUPON_URL=https://pf.kakao.com/_fJZab/coupons/_Qukjo45n
```

- 로컬에서 변경하려면 [.env.local.example](.env.local.example)을 참고해 프로젝트 루트의 `.env.local`에 설정하고 개발 서버를 다시 시작합니다. `.env.local`은 Git 제외 대상입니다.
- Vercel에서는 Project Settings → Environment Variables에 설정합니다. `.env.local`을 Git에 올릴 필요는 없습니다.
- `NEXT_PUBLIC_` 변수는 빌드할 때 브라우저 코드에 반영되므로, Vercel에서 값을 바꾼 뒤에는 재배포해야 합니다. [공식 환경 변수 안내](https://vercel.com/docs/environment-variables)
- 이전 변수명인 `NEXT_PUBLIC_KAKAO_CHANNEL_URL`은 현재 코드에서 사용하지 않습니다. 웰케어몰 링크는 [components/CompletionScreen.tsx](components/CompletionScreen.tsx)의 상수로 관리합니다.

## 검증

```bash
npm run build
```

프로덕션 빌드 중 린트와 TypeScript 검사도 수행합니다. 빌드한 앱을 로컬에서 실행하려면 다음 명령을 사용합니다.

```bash
npm run start
```

빌드 성공과 실제 Google Form 응답 저장 여부는 별도로 확인해야 합니다. 배포 후 강아지만, 고양이만, 강아지와 고양이 모두에 대해 구충제 사용 중 / 사용하지 않음의 두 경우를 각각 제출하고 연결된 Google Form의 응답에서 저장된 값을 확인합니다. 완료 화면의 쿠폰 버튼과 웰케어몰 버튼도 휴대폰에서 확인합니다.

## Vercel 배포

1. 배포할 코드와 README 변경사항을 커밋하고 GitHub `valvetcare/icbs` 저장소의 `main` 브랜치에 푸시합니다.
2. Vercel에서 Add New → Project를 선택하고 해당 GitHub 저장소를 가져옵니다.
3. 아래 설정을 확인합니다.

| 항목 | 설정 |
| --- | --- |
| Framework Preset | `Next.js` |
| Root Directory | 저장소 루트 (`.`) |
| Production Branch | `main` |
| Node.js Version | 로컬에서 빌드를 확인한 `24.x` |
| Install Command | 자동 설정 유지 또는 `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Next.js 자동 설정 유지 (`.next`) |

4. 기본 쿠폰 주소를 변경하는 경우 `NEXT_PUBLIC_KAKAO_COUPON_URL`을 Production 환경에 등록합니다. Preview에서도 같은 링크를 확인하려면 Preview 환경에도 등록합니다. Google Form용 환경 변수는 추가하지 않습니다.
5. Deploy를 실행하고 위 검증 절차에 따라 휴대폰에서 설문 제출, Google Form 응답 저장, 완료 화면 링크를 확인합니다.
6. 확인이 끝난 프로덕션 주소를 부스 QR 코드의 접속 주소로 사용합니다.

화면과 `/api/submit`을 같은 Next.js 프로젝트로 배포합니다. 별도 API 서버나 `vercel.json` 추가 없이 배포할 수 있습니다. Git 연동 후 `main`에 새 커밋을 푸시하면 프로덕션 배포가 자동으로 실행됩니다. [공식 Git 배포 안내](https://vercel.com/docs/git) · [Node.js 버전 설정](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
