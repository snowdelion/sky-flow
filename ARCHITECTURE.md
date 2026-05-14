# SkyFlow Architecture

<pre>
src/
├── app/                 # Next.js App Router (routing only)
├── pages-flat/          # Page components
├── widgets/             # Self-contained UI blocks
├── features/            # Interactive features
├── entities/            # Core logic
└── shared/              # Reusable code
</pre>

## Overview

SkyFlow is a weather forecast application built with Next.js 15, following Feature-Sliced Design (FSD) architecture

## Feature-Sliced Design Layers

### Layers:

- `src/app/` - routing, which is imported from `pages-flat/`
- `src/shared/` - reusable shared hooks, helper functions, global mock factories and MSW (`lib/`), types and schemas (`types/`), `public/` image exports (`assets/`), shared UI components (`ui/`), shared error handling, raw request, custom AppError (`api/`), global constants (`config/`)
- `src/entities/` - the heart of the application with API requests along with DTO's (`api/`), local helper functions (`lib/`), core hooks, mappers, types/schemas (`model/`)
- `src/features/` - interactive features with which the user actively interacts
- `src/widgets/` - self-contained widgets
- `src/pages-flat/` - main pages

### Segments:

- `api/` - external requests
- `assets/` - images exported directly from `public/`
- `config/` - configuration files
- `lib/` - helper functions
- `types/` - types and schemas
- `model/` - data model
- `ui/` - UI components

## API Routes

| Route            | Method | Purpose                                          |
| ---------------- | ------ | ------------------------------------------------ |
| `/api/ai`        | _POST_ | Groq AI description (streaming)                  |
| `/api/geocoding` | _GET_  | City search (proxied)                            |
| `/api/forecast`  | _GET_  | Weather data (proxied)                           |
| `/api/search`    | _GET_  | Search results with short weather data (proxied) |

## Testing Strategy

| Type            | Tool                             | Coverage              |
| --------------- | -------------------------------- | --------------------- |
| **Unit**        | _Vitest_                         | 90% Statements        |
| **Integration** | _Vitest + React Testing Library_ | 80% Branches          |
| **API mocking** | _Mock Service Worker_            | All external requests |

## Performance Optimizations

| Optimization      | Where                       | Impact              |
| ----------------- | --------------------------- | ------------------- |
| Memoized hooks    | _widgets, features, shared_ | Prevents re-renders |
| React Query cache | _API responses_             | 5min stale time     |
| Debounced search  | _search-city feature_       | 500ms delay         |
| Streaming AI      | _ai-description feature_    | Instant UX          |

## Security

- _Rate limiting via Upstash Redis (5 req/10s, 10 req/1m, 50 req/1d)_
- _Zod schema validation for external API's_
- _Protected URL parameters_
