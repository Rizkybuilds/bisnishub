"""Integration-style tests for the governed engineering gateway core."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

GATEWAY_PATH = (
    ROOT
    / "tools/engineering_gateway/"
    "gateway.py"
)

SESSION_FIXTURE = (
    ROOT
    / ".agents/gateway/fixtures/"
    "engineer-session.json"
)

spec = (
    importlib.util
    .spec_from_file_location(
        "engineering_gateway",
        GATEWAY_PATH,
    )
)

if (
    spec is None
    or spec.loader
    is None
):
    raise RuntimeError(
        (
            "Unable to load "
            "engineering gateway"
        )
    )

gateway_module = (
    importlib.util
    .module_from_spec(
        spec
    )
)

spec.loader.exec_module(
    gateway_module
)

EngineeringGateway = (
    gateway_module
    .EngineeringGateway
)


class EngineeringGatewayTests(
    unittest.TestCase
):
    def setUp(
        self,
    ) -> None:
        self.temp = (
            tempfile
            .TemporaryDirectory(
                prefix=
                    "engineering-gateway-test-"
            )
        )

        self.addCleanup(
            self.temp.cleanup
        )

        self.output_root = (
            Path(
                self.temp.name
            )
            / "runs"
        )

    def session_copy(
        self,
        *,
        work_package_ref:
            str
            | None = "WP-fixture",
    ) -> Path:
        value = json.loads(
            SESSION_FIXTURE
            .read_text(
                encoding="utf-8"
            )
        )

        value[
            "work_package_ref"
        ] = work_package_ref

        value[
            "workspace"
        ][
            "path"
        ] = str(
            ROOT
        )

        path = (
            Path(
                self.temp.name
            )
            / (
                "session-"
                f"{work_package_ref or 'none'}"
                ".json"
            )
        )

        path.write_text(
            json.dumps(
                value,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

        return path

    def gateway(
        self,
        *,
        work_package_ref:
            str
            | None = "WP-fixture",
    ) -> EngineeringGateway:
        return EngineeringGateway(
            root=ROOT,
            session_path=
                self.session_copy(
                    work_package_ref=
                        work_package_ref,
                ),
            output_root=
                self.output_root,
        )

    def test_lists_only_fixed_profiles(
        self,
    ) -> None:
        profiles = (
            self.gateway()
            .list_profiles()
        )

        ids = {
            item[
                "id"
            ]
            for item
            in profiles
        }

        self.assertEqual(
            ids,
            {
                "governance.validate",
                "governance.tests",
                "mgbos.pr-scope-tests",
                (
                    "mgbos."
                    "migration-immutability-tests"
                ),
                "mgbos.check",
            },
        )

    def test_engineer_with_work_package_can_preflight_local_check(
        self,
    ) -> None:
        decision = (
            self.gateway()
            .preflight_profile(
                "governance.validate"
            )
        )

        self.assertEqual(
            decision[
                "decision"
            ],
            "ALLOW",
        )

        self.assertTrue(
            decision[
                "tool_execution_allowed"
            ]
        )

        self.assertEqual(
            decision[
                "principal_id"
            ],
            (
                "engineering."
                "runtime.primary"
            ),
        )

        self.assertEqual(
            decision[
                "current_autonomy"
            ],
            "L2",
        )

    def test_missing_work_package_blocks_preflight(
        self,
    ) -> None:
        decision = (
            self.gateway(
                work_package_ref=None
            )
            .preflight_profile(
                "governance.validate"
            )
        )

        self.assertEqual(
            decision[
                "decision"
            ],
            "BLOCK",
        )

        self.assertFalse(
            decision[
                "tool_execution_allowed"
            ]
        )

    def test_blocked_preflight_never_dispatches_process(
        self,
    ) -> None:
        instance = self.gateway(
            work_package_ref=None
        )

        with patch.object(
            gateway_module.subprocess,
            "run",
        ) as mocked_run:
            receipt = (
                instance
                .execute_profile(
                    "governance.validate"
                )
            )

        mocked_run.assert_not_called()

        self.assertEqual(
            receipt[
                "execution_status"
            ],
            "NOT_EXECUTED",
        )

        self.assertEqual(
            receipt[
                "verification_status"
            ],
            "NOT_RUN",
        )

        self.assertEqual(
            receipt[
                "preflight_decision"
            ],
            "BLOCK",
        )

    def test_allowed_profile_dispatches_exact_registered_argv(
        self,
    ) -> None:
        instance = self.gateway()

        completed = (
            subprocess.CompletedProcess(
                args=[
                    "python",
                    (
                        "scripts/governance/"
                        "validate-agent-governance.py"
                    ),
                ],
                returncode=0,
                stdout="PASS\n",
                stderr="",
            )
        )

        with patch.object(
            gateway_module.subprocess,
            "run",
            return_value=completed,
        ) as mocked_run:
            receipt = (
                instance
                .execute_profile(
                    "governance.validate"
                )
            )

        mocked_run.assert_called_once()

        call_args = (
            mocked_run.call_args
        )

        self.assertEqual(
            call_args.args[
                0
            ],
            [
                "python",
                (
                    "scripts/governance/"
                    "validate-agent-governance.py"
                ),
            ],
        )

        self.assertIs(
            call_args.kwargs[
                "shell"
            ],
            False,
        )

        self.assertEqual(
            receipt[
                "execution_status"
            ],
            "SUCCEEDED",
        )

        self.assertEqual(
            receipt[
                "verification_status"
            ],
            "PASS",
        )

        self.assertEqual(
            receipt[
                "exit_code"
            ],
            0,
        )

    def test_nonzero_exit_is_failed_not_pass(
        self,
    ) -> None:
        instance = self.gateway()

        completed = (
            subprocess.CompletedProcess(
                args=[
                    "python",
                    (
                        "scripts/governance/"
                        "validate-agent-governance.py"
                    ),
                ],
                returncode=1,
                stdout="",
                stderr="failed\n",
            )
        )

        with patch.object(
            gateway_module.subprocess,
            "run",
            return_value=completed,
        ):
            receipt = (
                instance
                .execute_profile(
                    "governance.validate"
                )
            )

        self.assertEqual(
            receipt[
                "execution_status"
            ],
            "FAILED",
        )

        self.assertEqual(
            receipt[
                "verification_status"
            ],
            "FAIL",
        )

        self.assertEqual(
            receipt[
                "exit_code"
            ],
            1,
        )

    def test_unknown_profile_is_rejected(
        self,
    ) -> None:
        with self.assertRaisesRegex(
            ValueError,
            "Unknown gateway profile",
        ):
            (
                self.gateway()
                .preflight_profile(
                    "raw.shell"
                )
            )


if __name__ == "__main__":
    unittest.main()