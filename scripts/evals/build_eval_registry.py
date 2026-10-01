"""Build a local evidence registry from behavioral evaluation run directories."""

import argparse
import datetime as dt
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]

DEFAULT_ROOT = (
    ROOT
    / ".agent-eval-runs"
)


def utc_now():
    return (
        dt.datetime.now(
            dt.timezone.utc
        )
        .replace(
            microsecond=0
        )
        .isoformat()
        .replace(
            "+00:00",
            "Z",
        )
    )


def load_optional(path):
    if not path.is_file():
        return None

    return json.loads(
        path.read_text(
            encoding="utf-8"
        )
    )


def final_status(
    run,
    deterministic,
    semantic,
):
    if run[
        "execution_status"
    ] != "COMPLETED":
        return "BLOCKED"

    if deterministic is None:
        return "UNREVIEWED"

    if (
        deterministic[
            "overall_status"
        ]
        == "FAIL"
    ):
        return "FAIL"

    if (
        deterministic[
            "overall_status"
        ]
        == "BLOCKED"
    ):
        return "BLOCKED"

    if semantic is None:
        return "UNREVIEWED"

    if (
        semantic[
            "overall_status"
        ]
        == "FAIL"
    ):
        return "FAIL"

    if (
        semantic[
            "overall_status"
        ]
        == "BLOCKED"
    ):
        return "BLOCKED"

    if (
        semantic[
            "overall_status"
        ]
        == "PASS"
        and deterministic[
            "overall_status"
        ]
        == "PASS"
    ):
        return "PASS"

    return "UNREVIEWED"


def entry_for(
    run,
    deterministic,
    semantic,
):
    return {
        "run_id":
            run[
                "run_id"
            ],

        "case_id":
            run[
                "case_id"
            ],

        "runtime":
            run[
                "runtime"
            ],

        "provider":
            run[
                "provider"
            ],

        "runtime_version":
            run.get(
                "runtime_version"
            ),

        "model":
            run.get(
                "model"
            ),

        "repository_revision":
            run[
                "repository_revision"
            ],

        "configuration_fingerprint":
            run[
                "configuration_fingerprint"
            ][
                "id"
            ],

        "execution_status":
            run[
                "execution_status"
            ],

        "deterministic_status":
            (
                deterministic[
                    "overall_status"
                ]
                if deterministic
                else "NOT_RUN"
            ),

        "semantic_status":
            (
                semantic[
                    "overall_status"
                ]
                if semantic
                else "UNREVIEWED"
            ),

        "independence":
            (
                semantic[
                    "independence"
                ]
                if semantic
                else "NOT_REVIEWED"
            ),

        "final_status":
            final_status(
                run,
                deterministic,
                semantic,
            ),
    }


def build(root):
    root = Path(
        root
    )

    entries = []

    if not root.exists():
        return {
            "schema_version": 1,
            "generated_at":
                utc_now(),
            "entries": [],
        }

    for run_path in sorted(
        root.glob(
            "*/run.json"
        )
    ):
        run_dir = (
            run_path.parent
        )

        run = load_optional(
            run_path
        )

        deterministic = (
            load_optional(
                run_dir
                / "deterministic-grade.json"
            )
        )

        semantic = (
            load_optional(
                run_dir
                / "result.json"
            )
        )

        entries.append(
            entry_for(
                run,
                deterministic,
                semantic,
            )
        )

    return {
        "schema_version": 1,
        "generated_at":
            utc_now(),
        "entries":
            entries,
    }


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--root",
        type=Path,
        default=DEFAULT_ROOT,
    )

    parser.add_argument(
        "--output",
        type=Path,
    )

    args = parser.parse_args()

    registry = build(
        args.root
    )

    output = (
        args.output
        or args.root
        / "registry.json"
    )

    output.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    output.write_text(
        json.dumps(
            registry,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(
        json.dumps(
            {
                "entries":
                    len(
                        registry[
                            "entries"
                        ]
                    ),
                "output":
                    str(
                        output
                    ),
            }
        )
    )


if __name__ == "__main__":
    main()