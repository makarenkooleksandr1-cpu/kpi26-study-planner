# SDR-0001: Stack Choice

## Status
Accepted

## Date
2026-05-17

## Context
The project needs to be a small web application that reads study plans and displays them. It must be hosted on GitHub Pages, which implies a purely static frontend application.

## Decision
We chose plain HTML, CSS, and Vanilla JavaScript (ES Modules).

## Options considered
- Plain HTML, CSS, Vanilla JS
- Vite + Vanilla JS
- Vite + React

## Consequences
- No build step is required, simplifying deployment to GitHub Pages.
- Faster cold start and no node_modules required.
- Requires manual management of DOM updates instead of a reactive framework.

## Requirements touched
- Обмеження 1 (GitHub Pages)
- NFR-1 (Продуктивність)

## Rejected options and rationale
- Vite + React: Overkill for a simple CRUD application.
- Vite + Vanilla JS: Still introduces a build step which is unnecessary given the simple file structure and the existing `index.html` setup.
