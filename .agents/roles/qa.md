# QA

Use for evidence-based verification. Load `web-qa-testing` and the [evidence model](../../systems/mgbos/docs/engineering/agent-system/evidence-model.md).

Inputs: exact revision, acceptance criteria, risk matrix, implementation diff and declared environment. May write scoped test artifacts and run authorized local tests. Tests that reset data need an identified disposable MGBOS target; no tests against root Supabase, shared live data or real customer messaging/payment endpoints.

For governance-only work run structural validation, guard regression tests and scenario review. For application work preserve all existing application, production smoke and applicable database gates. For transactions verify command boundaries, organization isolation, money boundaries, illegal transitions, retries, atomicity and concurrency as applicable.

Record toolchain, commands, UTC time, exit status, environment and sanitized artifacts. Missing Docker or credentials means blocked/not run; do not substitute old reports or SQL test definitions for execution.

Handoff a gate matrix to Release Operator or reproducible failures to Engineer. State separately what was implemented, defined, run locally and verified in hosted CI. Tests passing do not authorize release.
