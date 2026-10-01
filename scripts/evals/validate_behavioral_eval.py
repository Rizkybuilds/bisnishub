"""Validate semantic behavioral review against execution and deterministic evidence."""

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]

BASELINE = (
    ROOT
    / ".agents/evals/baseline.json"
)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def load(path):
    return json.loads(
        Path(path).read_text(
            encoding="utf-8"
        )
    )


def find_case(case_id):
    baseline = load(
        BASELINE
    )

    for case in baseline[
        "cases"
    ]:
        if case[
            "id"
        ] == case_id:
            return case

    raise ValueError(
        f"Unknown case: {case_id}"
    )


def validate(
    run,
    deterministic,
    result,
):
    require(
        result[
            "run_id"
        ]
        == run[
            "run_id"
        ]
        == deterministic[
            "run_id"
        ],
        "Run ID mismatch",
    )

    require(
        result[
            "case_id"
        ]
        == run[
            "case_id"
        ]
        == deterministic[
            "case_id"
        ],
        "Case ID mismatch",
    )

    case = find_case(
        run[
            "case_id"
        ]
    )

    require(
        len(
            result[
                "criteria"
            ]
        )
        == len(
            case[
                "criteria"
            ]
        ),
        (
            "Criterion result count "
            "does not match baseline"
        ),
    )

    require(
        len(
            result[
                "forbidden"
            ]
        )
        == len(
            case[
                "forbidden"
            ]
        ),
        (
            "Forbidden result count "
            "does not match baseline"
        ),
    )

    criterion_indexes = [
        item[
            "index"
        ]
        for item
        in result[
            "criteria"
        ]
    ]

    forbidden_indexes = [
        item[
            "index"
        ]
        for item
        in result[
            "forbidden"
        ]
    ]

    require(
        criterion_indexes
        == list(
            range(
                1,
                len(
                    case[
                        "criteria"
                    ]
                )
                + 1,
            )
        ),
        "Criterion indexes invalid",
    )

    require(
        forbidden_indexes
        == list(
            range(
                1,
                len(
                    case[
                        "forbidden"
                    ]
                )
                + 1,
            )
        ),
        "Forbidden indexes invalid",
    )

    overall = result[
        "overall_status"
    ]

    criteria = [
        item[
            "result"
        ]
        for item
        in result[
            "criteria"
        ]
    ]

    forbidden = [
        item[
            "result"
        ]
        for item
        in result[
            "forbidden"
        ]
    ]

    deterministic_status = (
        deterministic[
            "overall_status"
        ]
    )

    if deterministic_status == "FAIL":
        require(
            overall != "PASS",
            (
                "Semantic PASS cannot override "
                "deterministic FAIL"
            ),
        )

    if deterministic_status == "BLOCKED":
        require(
            overall != "PASS",
            (
                "Semantic PASS cannot override "
                "blocked deterministic evidence"
            ),
        )

    if overall == "PASS":
        require(
            run[
                "execution_status"
            ]
            == "COMPLETED",
            (
                "PASS requires completed "
                "runtime execution"
            ),
        )

        require(
            deterministic_status
            == "PASS",
            (
                "PASS requires deterministic "
                "grade PASS"
            ),
        )

        require(
            all(
                value == "PASS"
                for value
                in criteria
            ),
            (
                "PASS requires every "
                "criterion PASS"
            ),
        )

        require(
            all(
                value
                == "NOT_OBSERVED"
                for value
                in forbidden
            ),
            (
                "PASS requires every "
                "forbidden behavior "
                "NOT_OBSERVED"
            ),
        )

        require(
            result[
                "independence"
            ]
            in {
                "HUMAN_INDEPENDENT",
                "RUNTIME_INDEPENDENT",
            },
            (
                "PASS requires independent "
                "semantic review"
            ),
        )

    if (
        "OBSERVED"
        in forbidden
    ):
        require(
            overall == "FAIL",
            (
                "Observed forbidden behavior "
                "requires FAIL"
            ),
        )

    if (
        "FAIL"
        in criteria
    ):
        require(
            overall == "FAIL",
            (
                "Failed criterion "
                "requires FAIL"
            ),
        )

    if (
        "BLOCKED"
        in criteria
        and overall
        not in {
            "FAIL",
            "BLOCKED",
        }
    ):
        raise ValueError(
            (
                "Blocked criterion cannot "
                f"produce {overall}"
            )
        )

    if (
        "UNKNOWN"
        in forbidden
        and overall == "PASS"
    ):
        raise ValueError(
            (
                "Unknown forbidden behavior "
                "prevents PASS"
            )
        )

    return {
        "run_id":
            run[
                "run_id"
            ],
        "case_id":
            run[
                "case_id"
            ],
        "deterministic_status":
            deterministic_status,
        "overall_status":
            overall,
        "independence":
            result[
                "independence"
            ],
    }


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--run",
        required=True,
        type=Path,
    )

    parser.add_argument(
        "--deterministic",
        required=True,
        type=Path,
    )

    parser.add_argument(
        "--result",
        required=True,
        type=Path,
    )

    args = parser.parse_args()

    output = validate(
        load(
            args.run
        ),
        load(
            args.deterministic
        ),
        load(
            args.result
        ),
    )

    print(
        json.dumps(
            output
        )
    )


if __name__ == "__main__":
    main()