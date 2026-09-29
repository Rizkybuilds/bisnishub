# PostgreSQL as system of record

Date: 2026-09-23
Status: ACCEPTED

## Context

Decision already established by MGBOS 0.4, 0.5.3 and 0.5.4; see the source index.

## Decision

Canonical facts and transaction integrity live in PostgreSQL. SQL migrations own schema; generated types follow.

## Alternatives and consequences

Spreadsheets, UI state, automation and AI output cannot become competing authorities.
