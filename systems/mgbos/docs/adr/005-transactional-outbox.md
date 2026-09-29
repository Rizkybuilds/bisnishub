# Transactional outbox

Date: 2026-09-23
Status: ACCEPTED

## Context

Decision already established by MGBOS 0.4, 0.5.3 and 0.5.4; see the source index.

## Decision

When business events gain a consumer, commit canonical mutations and outbox records atomically.

## Alternatives and consequences

Delivery is retryable and integrations must be idempotent. No event tables before the relevant slice.
