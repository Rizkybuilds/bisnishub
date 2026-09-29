-- Infrastructure only. Business entities belong to later slices.
create schema if not exists app;
create schema if not exists internal;
revoke all on schema app from public, anon, authenticated;
revoke all on schema internal from public, anon, authenticated;
