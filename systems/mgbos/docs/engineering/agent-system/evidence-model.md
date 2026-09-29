# Evidence model

Every claim must identify its scope and revision. Use these distinct states: planned, implemented, tests-defined, locally-verified, hosted-CI-verified, deployed, operationally-accepted. Failure, blocked and not-run are valid outcomes; they are never PASS. One state does not imply the next.

Each evidence record includes:

- UTC timestamp, executor/role and review independence; runtime/provider/version for agent evals.
- Repository, base and head SHA. For uncommitted work include base SHA, scoped diff/file hashes and dirty status. Rebind evidence after changes; a report-only update does not require rerunning unrelated application checks.
- Target/environment identity without credentials, toolchain, working directory and exact command or manual procedure.
- Exit code/result, what was actually observed, sanitized artifact or hosted run URL, limitations and next owner/action.
- Risk, acceptance criterion and gate supported; unrelated test totals are not substitute evidence.

For findings include path/line, trigger, consequence, severity and a reproducer or precise reasoning. Distinguish confirmed issues, hypotheses and missing evidence. Never put tokens, environment file contents, database dumps or customer records into a report.

## Behavioral evaluation

The [eval baseline](../../../../../.agents/evals/README.md) contains prompts and observable rubric criteria. Structural CI validates the case format and references. It does not execute any LLM or prove the agent behaved correctly. Manual instruction review, executed agent evaluation and automated regression tests must be reported separately.

An executed eval record needs the baseline revision, runtime settings, case ID, transcript/artifact path, each criterion's observed evidence, forbidden behavior checks and pass/fail/blocked. Any prohibited action fails the case even if the final prose sounds correct. Do not score a case passed by matching keywords or by reading the expected answer alone.
