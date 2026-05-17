# SDR-0003: Routing, State, and Data Model

## Status
Accepted

## Date
2026-05-17

## Context
The application is a small tool for managing study plans and generating cheat sheets.

## Decision
We chose a Single Page Application (SPA) architecture without a formal router, maintaining state in a global variable synced with `localStorage`.

### Data Model
```javascript
// Subject Object
{
  id: "uuid-string",
  name: "Subject Name",
  examDate: "YYYY-MM-DD",
  difficulty: 3, // 1-5
  topics: [
    { id: "uuid-string", name: "Topic 1", isStudied: false },
    { id: "uuid-string", name: "Topic 2", isStudied: true }
  ]
}
```

## Options considered
- Single view with dynamic DOM updates
- Multi-page HTML
- Client-side router (e.g. hash routing)

## Consequences
- Very simple UI transitions, no need to manage URL state.
- Entire data model is loaded in memory at startup.

## Requirements touched
- FR-1, FR-3
- BR-2 (Сортування предметів)

## Rejected options and rationale
- Multi-page HTML: Too slow to navigate, breaks SPA feel.
- Client-side router: Unnecessary for a single dashboard interface.
