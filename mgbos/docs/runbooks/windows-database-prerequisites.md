# Windows prerequisites for local Supabase

## Verified host state, 2026-09-23

- Docker and Podman are absent from PATH; Docker Desktop is not installed according to winget.
- Windows reports VirtualizationFirmwareEnabled=False and HypervisorPresent=False.
- CPU reports SecondLevelAddressTranslationExtensions=True.
- Both VirtualMachinePlatform and Microsoft-Windows-Subsystem-Linux report InstallState=2 (disabled).
- The current process does not have administrator rights.

Installing Docker alone will not resolve this host's blocker. Do not restart the computer automatically or change firmware from an agent task.

## Steps requiring the computer owner

1. Save open work. Enable hardware virtualization in BIOS/UEFI using the device manufacturer's instructions. Windows Task Manager's CPU page should then report Virtualization: Enabled.
2. Install/enable current WSL 2 and Virtual Machine Platform using an administrator terminal. Microsoft's standard command is `wsl --install --no-distribution`. Restart when Windows requires it.
3. Install Docker Desktop for Windows using its WSL 2 backend and complete its first-run setup. Keep it running.
4. Verify `wsl --version` and `docker version`; the latter must show a server, not just a client.
5. From the MGBOS workspace, run `pnpm db:start`, `pnpm db:reset`, `pnpm db:test` and `pnpm db:types` using the pinned Node/pnpm versions in README.

Reset is only for the new local MGBOS development database. Do not use the enclosing repository's legacy Supabase link or any hosted project.

The firmware step and restart require direct computer-owner interaction. They cannot be completed within the current non-administrator process.

## Independent CI route

The prepared GitHub Actions database job uses an ephemeral Linux runner and needs no production database secrets. It can validate the migration chain even while this Windows host is blocked.

The repository Rizkybuilds/bisnishub is **public**. Publishing the prepared branch exposes its code and technical documentation publicly. The ten original business blueprint notes in catatan/sesi remain local and are excluded from the prepared branch. Their links in docs are intentionally local references until a separate publication decision is made.

Hosted CI success proves the runner's database setup; it does not mean this Windows machine can run Docker. Record these results separately.

## Official instructions

- [Enable virtualization on Windows](https://support.microsoft.com/en-us/windows/experience/enable-virtualization-on-windows)
- [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Install Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
