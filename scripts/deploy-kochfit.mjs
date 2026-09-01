#!/usr/bin/env node
/**
 * Деплой static export на nginx-хост.
 *
 * Subpath /kochfit/ (общий хост):
 *   npm run build:server
 *   KOCHFIT_SSH_KEY=~/Downloads/key.pem npm run deploy:server
 *
 * Корень сайта (dedicated VPS):
 *   rm -rf .next out && npm run build:root
 *   KOCHFIT_REMOTE=/var/www/html KOCHFIT_SSH=ubuntu@IP KOCHFIT_SSH_KEY=~/key.pem npm run deploy:server
 *
 * Переменные:
 *   KOCHFIT_SSH      — SSH target (по умолчанию ubuntu@212.233.93.151)
 *   KOCHFIT_SSH_KEY  — путь к PEM-ключу (опционально)
 *   KOCHFIT_REMOTE   — каталог на сервере (/var/www/kochfit или /var/www/html)
 *   KOCHFIT_DRY_RUN  — 1 = только показать rsync, без заливки
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");
const ssh = process.env.KOCHFIT_SSH ?? "ubuntu@212.233.93.151";
const sshKey = process.env.KOCHFIT_SSH_KEY ?? "";
const remote = process.env.KOCHFIT_REMOTE ?? "/var/www/kochfit";
const dryRun = process.env.KOCHFIT_DRY_RUN === "1";

if (!fs.existsSync(outDir)) {
  console.error("Нет папки out/. Сначала: npm run build:server или npm run build:root");
  process.exit(1);
}

const sshCmd = sshKey
  ? `ssh -i ${path.resolve(sshKey.replace(/^~/, os.homedir()))} -o StrictHostKeyChecking=no`
  : "ssh -o StrictHostKeyChecking=no";

const args = [
  "-az",
  "--delete",
  "--progress",
  "-e",
  sshCmd,
  "--rsync-path=sudo rsync",
  ...(dryRun ? ["--dry-run"] : []),
  `${outDir}/`,
  `${ssh}:${remote}/`,
];

console.log(`rsync → ${ssh}:${remote}/`);
const result = spawnSync("rsync", args, { stdio: "inherit" });
process.exit(result.status ?? 1);
