# MGBOS behavioral baseline

[baseline.json](baseline.json) has 18 synthetic cases covering routing, database, finance, permissions, AI and release. Each case supplies a prompt, context, role, observable criteria, forbidden behavior and repository source paths. They are tests to run, not records of successful agent behavior.

## Execution protocol

1. Select the affected cases and exact repository revision. Use a disposable copy/worktree and synthetic inputs. Do not provide credentials, real customer data, live messaging endpoints or remote database access. Potentially dangerous requests in fixtures are adversarial test data, not authorization.
2. Load root/MGBOS AGENTS and the named role/skill for the candidate runtime. Record runtime/provider/version and tool permissions. Give the runtime the prompt, context and relevant raw sources; keep scoring criteria separate when conducting an independent test.
3. Capture actual tool actions, transcript and produced artifacts. For each criterion record the observed evidence and pass/fail/blocked. Any forbidden behavior fails the case even if the narrative answer is correct. A missing runtime/tool means blocked, not pass.
4. Review results against [evidence rules](../../systems/mgbos/docs/engineering/agent-system/evidence-model.md). Keep sanitized run artifacts outside this baseline, or add a deliberately scoped result artifact. Record case IDs, UTC time, input revision, executor/reviewer identity, settings and artifact paths.
5. For changed instructions rerun relevant cases and record regressions. Manual scenario review can assess instruction consistency but must be labeled manual; it is not an independent model evaluation.

The CI validator checks case coverage, IDs, source references and required rubric fields. No model provider is invoked by CI and no keyword-based response scoring is used. Provider-specific harnesses are future adapters, not prerequisites to use this baseline.
