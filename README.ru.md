[![English](https://img.shields.io/badge/Change_language-English-61a2d4?style=for-the-badge&logo=googletranslate&logoColor=white)](README.md)

# SkyFlow - приложение прогноза погоды

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

**Приложение для отслеживания погоды с современным стеком и фокусом на производительность**

[**_Live Demo_**](https://sky-flow-weather.vercel.app/)

## Стек:

- _**Фреймворк:** Next.js 15_
- _**Стиль:** Tailwind CSS ^4, Recharts_
- _**Data Fetching:** TanStack Query (React Query) v5_
- _**Управление состоянием:** Zustand_
- _**API:** Open-Meteo (Geocoding and Forecast)_
- _**AI:** Groq (llama 3.3 70B) + Vercel AI SDK (streaming)_
- _**Тестирование:** Vitest, MSW (Mock Service Worker)_
- _**Качество кода:** TypeScript, Eslint, Commitlint, Husky, Zod_
- _**Инфраструктура:** Upstash Redis (Ratelimit)_

## Особенности:

- _**Умный поиск:** поиск городов с обработкой ошибок_
- _**Настройки:** возможность изменять единицы измерений_
- _**Детальный прогноз:** текущая погода, почасовой и недельный прогноз с графиком_
- _**Сохранение данных:** хранение истории и избранных городов, настроек единиц измерений в localStorage_
- _**UX/UI:** адаптивный дизайн и использование пульсирующих skeleton-компонентов_
- _**Надёжность:** полная типизация, zod-валидация внешнего API и связанных с ним типами, защищенные URL-параметры_
- _**Тестирование:** покрытие unit и интеграционными тестами: ~90% (Statements) и ~80% (Branches)_
- _**Github Actions:** автоматическая проверка секретных ключей, TS ошибок, линтинг, тестов с покрытием (coverage) и итоговая сборка при `pull_request`_
- _**FSD валидация:** строгое соблюдение архитектуры FSD с автоматической проверкой через ESlint-плагины_
- _**Производительность:** мемоизированные хуки и компоненты_
- _**AI помощник:** генерация уникальных фактов о локации и советов по погоде. Стриминг ответов для UX, защита от спама через `Upstash Redis`_

## Структура:

[**_Больше про архитектуру_**](ARCHITECTURE.MD)

<details>
<summary><b>Feature-Sliced Design (FSD) структура</b></summary>

- `src/app/` - Next.js App Router - только роутинг. Импортируются страницы из `pages-flat/`

- `src/pages-flat/` - страничные компоненты. Объединяет `widgets/` и `features/`

- `src/widgets/` - самодостаточные UI блоки

- `src/features/` - интерактивные фичи

- `src/entities/` - внутренняя логика. API запросы, DTO's, мапперы, внутренние типы

- `src/shared/` - переиспользумый код: UI-компоненты, вспомогательные функции, типы, конфиги

</details>

## Запуск сервера:

### 1. Клонируйте репозиторий:

```bash
git clone https://github.com/snowdelion/sky-flow.git
cd sky-flow
```

### 2. Установите зависимости:

```bash
npm install
```

### 3. Настройте переменные окружения:

_скопируйте шаблон файла и добавьте свои API-ключи, следуя ссылкам внутри файла:_

```bash
cp .env.example .env.local
```

### 4. Запустите сервер:

```bash
npm run dev
```

**_Откройте [http://localhost:3000](http://localhost:3000) в браузере._**

## Доступные скрипты:

<details>
<summary><b>Показать все команды</b></summary>

### Сборка для production

#### _Собрать проект и запустить оптимизированный production-сервер:_

```bash
npm run build
npm run start
```

### Тестирование (Vitest)

#### _Однократно запустить тесты:_

```bash
npm run test:run
```

#### _Запустить тесты с итоговым отчетом о покрытии кода (coverage):_

```bash
npm run test:cov
```

### Качество кода

#### _Запустить проверку типов TypeScript, проверку формата Prettier и линтинг ESLint:_

```bash
npm run validate
```

</details>

---

- проект - решение задания с заготовленным дизайном и добавления новых идей и деталей
- дизайн: https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49
