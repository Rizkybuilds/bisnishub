import { describe, it, expect } from 'vitest';
import { lintMigrations } from './lint-migrations.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

function tempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe('SQL migration linter', () => {
  it('passes on clean bigint migrations', () => {
    const dir = tempDir('clean-');
    fs.writeFileSync(
      path.join(dir, '001_clean.sql'),
      `create table app.orders (
        id uuid primary key,
        subtotal bigint not null,
        discount_total bigint not null default 0,
        shipping_fee bigint not null default 0,
        grand_total bigint not null,
        amount_paid bigint not null default 0,
        balance_due bigint not null
      );`,
    );
    expect(lintMigrations(dir)).toHaveLength(0);
  });

  it('detects column definitions using forbidden money types', () => {
    const dir = tempDir('bad-cols-');
    fs.writeFileSync(
      path.join(dir, '001_bad.sql'),
      `create table app.bad_table (
        amount numeric not null,
        unit_price decimal(10,2),
        total_cost real,
        shipping_fee float,
        subtotal money
      );`,
    );
    const violations = lintMigrations(dir);
    expect(violations.length).toBeGreaterThanOrEqual(5);
  });

  it('allows ::numeric cast expressions in CHECK constraints', () => {
    const dir = tempDir('cast-');
    fs.writeFileSync(
      path.join(dir, '001_cast.sql'),
      `create table app.quotes (
        subtotal bigint not null,
        discount_total bigint not null,
        grand_total bigint not null,
        check(grand_total::numeric = subtotal::numeric - discount_total)
      );`,
    );
    expect(lintMigrations(dir)).toHaveLength(0);
  });

  it('allows ::numeric casts in view calculations', () => {
    const dir = tempDir('view-');
    fs.writeFileSync(
      path.join(dir, '001_view.sql'),
      `create view app.margin_dashboard as
      select
        round((estimated_gross_profit::numeric / (subtotal - discount_total)::numeric) * 100, 2) as margin_pct
      from app.orders;`,
    );
    expect(lintMigrations(dir)).toHaveLength(0);
  });

  it('allows numeric variables in PL/pgSQL DECLARE blocks', () => {
    const dir = tempDir('declare-');
    fs.writeFileSync(
      path.join(dir, '001_func.sql'),
      `create function app.calculate_total() returns void as $$
declare
  cost numeric := 0;
  total numeric;
begin
  -- logic here
end; $$ language plpgsql;`,
    );
    expect(lintMigrations(dir)).toHaveLength(0);
  });

  it('passes on existing MGBOS migrations', () => {
    const mgbosDir = path.join(__dirname, '..', 'supabase', 'migrations');
    const violations = lintMigrations(mgbosDir);
    expect(violations).toHaveLength(0);
  });

  it('returns empty array for nonexistent directory', () => {
    expect(lintMigrations('/tmp/does-not-exist-xyz')).toHaveLength(0);
  });
});
