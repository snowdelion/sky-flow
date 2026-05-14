[![Русский](https://img.shields.io/badge/Change_language-Русский-61a2d4?style=for-the-badge&logo=googletranslate&logoColor=white)](README.ru.md)

# SkyFlow - weather forecast app

[![Next.js](https://img.shields.io/badge/Next.js-15.1-0081c2?logo=next.js&logoColor=white&style=for-the-badge)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0-0081c2?logo=react&logoColor=white&style=for-the-badge)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-0081c2?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-0081c2?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![FSD](https://img.shields.io/badge/Architecture-FSD-0081c2?logo=blueprint&logoColor=white&style=for-the-badge)](https://feature-sliced.design)

[![Vitest](https://img.shields.io/badge/Vitest-4.0-4a8f4b?logo=vite&logoColor=white&style=for-the-badge)](https://vitest.dev)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel-4a8f4b?logo=vercel&logoColor=white&style=for-the-badge)](https://sky-flow-weather.vercel.app/)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-4a8f4b?logo=github-actions&logoColor=white&style=for-the-badge)](https://github.com/snowicide/sky-flow/actions)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-f43e01?style=for-the-badge&logo=stackblitz&logoColor=white)](https://groq.com)
[![Code Style](https://img.shields.io/badge/Code%20Style-Prettier-6c757d?logo=prettier&logoColor=white&style=for-the-badge)](https://prettier.io)
[![Commitlint](https://img.shields.io/badge/Commitlint-Conventional-6c757d?logo=commitlint&logoColor=white&style=for-the-badge)](https://commitlint.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-ff8c00.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

![Main Screen](./preview/preview.jpg)

**A weather tracking app with a modern stack and a focus on performance**

[**_Live Demo_**](https://sky-flow-weather.vercel.app/)

## Stack:

- _**Framework:** Next.js 15_
- _**Styling:** Tailwind CSS ^4, Recharts_
- _**Data Fetching:** TanStack Query (React Query) v5_
- _**State Management:** Zustand_
- _**API:** Open-Meteo (Geocoding and Forecast)_
- _**AI:** Groq (llama 3.3 70B) + Vercel AI SDK (streaming)_
- _**Testing:** Vitest, MSW (Mock Service Worker)_
- _**Code Quality:** TypeScript, Eslint, Commitlint, Husky, Zod_
- _**Infrastructure:** Upstash Redis (Ratelimit)_

## Features:

- _**Smart Search:** city search with error handling_
- _**Settings:** the ability to change units of measurement_
- _**Detailed forecast:** current weather, hourly and weekly forecast with chart_
- _**Data storage:** storing history and favorite cities, unit settings in localStorage_
- _**UX/UI:** responsive design and using pulsating skeleton components_
- _**Reliability:** full typing, zod-validation of external API and related types, protected URL parameters_
- _**Testing:** unit and integration test coverage: ~90% (Statements) and ~80% (Branches)_
- _**Github Actions:** automatic checking of secret keys, TS errors, linting, test coverage, and final build upon pull request_
- _**FSD validation:** strict adherence to the FSD architecture with automatic checking via ESlint plugins_
- _**Performance:** memoized hooks and components_
- _**AI assistant:** generating unique location facts and weather tips. Response streaming for UX, spam protection via Upstash Redis_

## Structure:

[**_More about architecture_**](ARCHITECTURE.MD)

<details>
<summary><b>Feature-Sliced Design (FSD) structure</b></summary>

- `src/app/` - Next.js App Router - routing only. Imports pages from `pages-flat/`

- `src/pages-flat/` - page components. Combines `widgets/` and `features/`

- `src/widgets/` - self-contained UI blocks

- `src/features/` - interactive features

- `src/entities/` - core logic. API requests, DTO's, mappers, domain types

- `src/shared/` - reusable code: UI-components, utilities, types, config

</details>

## Starting the server:

### 1. Clone the repository:

```bash
git clone https://github.com/snowdelion/sky-flow.git .
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Set up environment variables:

_Copy the file template and add your API keys by following the links inside the file:_

```bash
cp .env.example .env.local
```

### 4. Start the development server:

```bash
npm run dev
```

**_Open [http://localhost:3000](http://localhost:3000) in your browser_**

## Available scripts:

<details>
<summary><b>View all commands</b></summary>

### Production build

#### _Build and start the production server:_

```bash
npm run build
npm run start
```

### Testing (Vitest)

#### _Run tests once:_

```bash
npm run test:run
```

#### _Run tests with final coverage report:_

```bash
npm run test:cov
```

### Code quality

#### _Run TypeScript type checking, Prettier format checking and ESLint linting:_

```bash
npm run validate
```

</details>

---

- Project - solving a task with a prepared design and adding new ideas and details
- Design: https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49
