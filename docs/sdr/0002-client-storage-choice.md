# SDR-0002: Client Storage Choice

## Status
Accepted

## Date
2026-05-17

## Context
The application needs to persist study plans, subjects, and topics between sessions without a backend server, as it's hosted purely on GitHub Pages.

## Decision
We chose `localStorage` for primary persistence.

## Options considered
- `localStorage`
- `sessionStorage`
- `IndexedDB`
- In-memory only

## Consequences
- Data is persistent across browser sessions.
- Data is vulnerable to clearing cache or site data (Обмеження 2).
- Data size is limited, but sufficient for a simple text-based coursework CRUD app.

## Requirements touched
- FR-5 (Збереження даних)
- Обмеження 1, Обмеження 2

## Rejected options and rationale
- `sessionStorage`: Fails FR-5 as data would be lost upon closing the tab.
- `IndexedDB`: Too complex for the simple single-user data schema described in the requirements.
- In-memory: Fails FR-5.
