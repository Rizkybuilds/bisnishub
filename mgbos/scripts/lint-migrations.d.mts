interface Violation {
  file: string;
  line: number;
  content: string;
}
export function lintMigrations(dir: string): Violation[];
