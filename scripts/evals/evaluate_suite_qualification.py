"""Evaluate behavioral suite qualification from local evidence registry."""

import argparse
import json
from collections import defaultdict
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]

SUITES = (
    ROOT
    / ".agents/evals/suites.yaml"
)

POLICY = (
    ROOT
    / ".agents/evals/qualification-policy.yaml"
)

DEFAULT_REGISTRY = (
    ROOT
    / ".agent-eval-runs/registry.json"
)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def load_json(path):
    return json.loads(
        Path(path).read_text(
            encoding="utf-8"
        )
    )


def load_yaml(path):
    return yaml.safe_load(
        Path(path).read_text(
            encoding="utf-8"
        )
    )


def required_cases(
    suite,
    runtime,
    baseline,
):
    if suite.get(
        "include_all_baseline_cases"
    ):
        cases = {
            case[
                "id"
            ]
            for case
            in baseline[
                "cases"
            ]
            if (
                not case.get(
                    "runtime_targets"
                )
                or runtime
                in case[
                    "runtime_targets"
                ]
            )
        }

    else:
        cases = set(
            suite.get(
                "required_cases",
                []
            )
        )

    cases.update(
        suite.get(
            "runtime_specific_cases",
            {}
        ).get(
            runtime,
            [],
        )
    )

    return cases


def qualification(
    *,
    runtime,
    suite_id,
    purpose,
    proposed_level,
    fingerprint,
    registry,
    suites,
    policy,
    baseline,
):
    suite = suites[
        "suites"
    ][
        suite_id
    ]

    require(
        runtime
        in suite[
            "runtimes"
        ],
        (
            f"{runtime} is not "
            f"eligible for {suite_id}"
        ),
    )

    cases = required_cases(
        suite,
        runtime,
        baseline,
    )

    if purpose == "regression":
        required_runs = (
            policy[
                "regression"
            ][
                "ordinary_required_case"
            ][
                "minimum_current_runs"
            ]
        )

    elif purpose == "promotion":
        key = {
            "L1":
                "L0_to_L1",
            "L2":
                "L1_to_L2",
            "L3":
                "L2_to_L3",
            "L4":
                "L3_to_L4",
        }[
            proposed_level
        ]

        required_runs = (
            policy[
                "promotion_evidence"
            ][
                key
            ][
                "minimum_distinct_runs_per_required_case"
            ]
        )

    else:
        raise ValueError(
            f"Unknown purpose: {purpose}"
        )

    matching = [
        entry
        for entry
        in registry[
            "entries"
        ]
        if (
            entry[
                "runtime"
            ]
            == runtime
            and entry[
                "case_id"
            ]
            in cases
            and entry[
                "configuration_fingerprint"
            ]
            == fingerprint
        )
    ]

    by_case = defaultdict(
        list
    )

    for entry in matching:
        by_case[
            entry[
                "case_id"
            ]
        ].append(
            entry
        )

    blocking_cases = (
        set(
            suite.get(
                "blocking_cases",
                []
            )
        )
        & cases
    )

    case_results = {}

    suite_failed = False
    suite_blocked = False
    suite_incomplete = False

    for case_id in sorted(
        cases
    ):
        runs = by_case.get(
            case_id,
            [],
        )

        passing = [
            entry
            for entry
            in runs
            if entry[
                "final_status"
            ]
            == "PASS"
        ]

        failing = [
            entry
            for entry
            in runs
            if entry[
                "final_status"
            ]
            == "FAIL"
        ]

        blocked = [
            entry
            for entry
            in runs
            if entry[
                "final_status"
            ]
            == "BLOCKED"
        ]

        if failing:
            state = "FAILED"
            suite_failed = True

        elif (
            case_id
            in blocking_cases
            and any(
                entry[
                    "final_status"
                ]
                != "PASS"
                for entry
                in runs
            )
        ):
            state = "BLOCKED"
            suite_blocked = True

        elif len(
            passing
        ) >= required_runs:
            state = "QUALIFIED"

        elif blocked:
            state = "BLOCKED"
            suite_blocked = True

        else:
            state = "INCOMPLETE"
            suite_incomplete = True

        case_results[
            case_id
        ] = {
            "required_runs":
                required_runs,
            "observed_runs":
                len(
                    runs
                ),
            "passing_runs":
                len(
                    passing
                ),
            "status":
                state,
            "run_ids": [
                entry[
                    "run_id"
                ]
                for entry
                in runs
            ],
        }

    if suite_failed:
        status = "FAILED"

    elif suite_blocked:
        status = "BLOCKED"

    elif suite_incomplete:
        status = "INCOMPLETE"

    else:
        status = "QUALIFIED"

    return {
        "suite_id":
            suite_id,
        "suite_version":
            suite[
                "version"
            ],
        "runtime":
            runtime,
        "configuration_fingerprint":
            fingerprint,
        "purpose":
            purpose,
        "proposed_level":
            proposed_level,
        "status":
            status,
        "cases":
            case_results,
    }


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--runtime",
        required=True,
        choices=[
            "codex",
            "antigravity",
        ],
    )

    parser.add_argument(
        "--suite",
        required=True,
    )

    parser.add_argument(
        "--purpose",
        choices=[
            "regression",
            "promotion",
        ],
        default="regression",
    )

    parser.add_argument(
        "--proposed-level",
        choices=[
            "L1",
            "L2",
            "L3",
            "L4",
        ],
    )

    parser.add_argument(
        "--fingerprint",
        required=True,
    )

    parser.add_argument(
        "--registry",
        type=Path,
        default=DEFAULT_REGISTRY,
    )

    args = parser.parse_args()

    if (
        args.purpose
        == "promotion"
        and not args.proposed_level
    ):
        parser.error(
            "--proposed-level is required "
            "for promotion"
        )

    output = qualification(
        runtime=args.runtime,
        suite_id=args.suite,
        purpose=args.purpose,
        proposed_level=(
            args.proposed_level
        ),
        fingerprint=args.fingerprint,
        registry=load_json(
            args.registry
        ),
        suites=load_yaml(
            SUITES
        ),
        policy=load_yaml(
            POLICY
        ),
        baseline=load_json(
            ROOT
            / ".agents/evals/"
            "baseline.json"
        ),
    )

    print(
        json.dumps(
            output,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()