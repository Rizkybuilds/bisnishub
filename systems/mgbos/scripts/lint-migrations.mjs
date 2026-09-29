import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

/**
 * SQL Migration Linter — Mencegah Tipe Floating-Point pada Kolom Moneter
 *
 * Mendeteksi definisi kolom (CREATE TABLE / ALTER TABLE ADD COLUMN) yang
 * menggunakan decimal, numeric, real, float, double precision, atau money
 * pada kolom yang berhubungan dengan uang.
 *
 * TIDAK mendeteksi:
 * - Cast expressions (::numeric) di CHECK constraint, view, atau prosedur
 * - Variabel lokal di dalam PL/pgSQL (DECLARE blocks)
 * - Komentar SQL (-- atau multi-line)
 */
export function lintMigrations(dir) {
  const violations = [];
  if (!fs.existsSync(dir)) return violations;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql'));

  // Tipe yang terlarang untuk kolom moneter
  const badTypes = [
    'decimal',
    'numeric',
    'real',
    'float',
    'double\\s+precision',
    'money',
  ];

  // Konteks nama kolom moneter
  const moneyContexts = [
    'amount',
    'price',
    'cost',
    'total',
    'fee',
    'subtotal',
    'discount',
    'margin',
    'revenue',
    'profit',
    'balance',
    'paid',
    'due',
    'shipping',
    'escrow',
    'valuation',
  ];

  const contextRegex = new RegExp(`(?:${moneyContexts.join('|')})`, 'i');

  // Deteksi definisi kolom: "column_name type_name" — bukan cast (::type)
  // Pola: identifier yang mengandung kata konteks uang, diikuti spasi lalu tipe terlarang
  const columnDefRegex = new RegExp(
    `(?:^|\\s)\\w*(?:${moneyContexts.join('|')})\\w*\\s+(?:${badTypes.join('|')})\\b`,
    'i',
  );

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let inDeclareBlock = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Skip komentar SQL
      if (trimmed.startsWith('--')) return;

      // Track PL/pgSQL DECLARE blocks (variabel lokal boleh pakai numeric)
      if (/\bdeclare\b/i.test(trimmed)) inDeclareBlock = true;
      if (/\bbegin\b/i.test(trimmed)) inDeclareBlock = false;
      if (inDeclareBlock) return;

      // Skip cast expressions (::numeric, ::decimal etc.) — ini valid di CHECK/views
      // Kita hanya cari definisi kolom, bukan cast
      if (!contextRegex.test(line)) return;

      // Cek apakah ada definisi kolom dengan tipe terlarang
      if (columnDefRegex.test(line)) {
        // Pastikan bukan cast expression (::type)
        const castRemoved = line.replace(/::\w+/g, '');
        if (columnDefRegex.test(castRemoved)) {
          violations.push({
            file: filePath,
            line: index + 1,
            content: trimmed,
          });
        }
      }
    });
  }
  return violations;
}

const isMain =
  typeof process !== 'undefined' &&
  process.argv?.[1] === url.fileURLToPath(import.meta.url);

if (isMain) {
  const violations = lintMigrations(migrationsDir);
  if (violations.length > 0) {
    console.error(
      '❌ Found monetary columns using floating-point or money types:',
    );
    violations.forEach((v) => {
      console.error(`  ${path.basename(v.file)}:${v.line} → ${v.content}`);
    });
    console.error(
      `\n${violations.length} violation(s) found. Use bigint for monetary columns.`,
    );
    process.exit(1);
  } else {
    console.log(
      '✅ No floating-point money columns found. All monetary columns use bigint.',
    );
    process.exit(0);
  }
}
