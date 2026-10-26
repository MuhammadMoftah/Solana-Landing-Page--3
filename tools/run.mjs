// Runs Astro commands for this project: `node tools/run.mjs dev|build|preview|sync [astro args]`.
//
// Vite/Tailwind cannot run inside a folder whose path contains '#' (e.g. "Solana Landing Page #3"):
// '#' is treated as a URL fragment and the module path is cut off. When the project path contains
// '#', this script mirrors src/, public/ and astro.config.mjs into a '#'-free sibling folder
// (default: "solana-east-build", override with SOLANA_MIRROR), keeps it in sync while `dev` runs,
// and runs Astro there. In a normal path it simply runs Astro in place.
//
// Permanent fix: rename the project folder without '#'.
import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [command = 'dev', ...rest] = process.argv.slice(2);
const needsMirror = root.includes('#');
const mirror = process.env.SOLANA_MIRROR ?? join(dirname(root), 'solana-east-build');
const shell = process.platform === 'win32';

function sync() {
  mkdirSync(mirror, { recursive: true });
  for (const file of ['package.json', 'package-lock.json', 'tsconfig.json', 'astro.config.mjs']) {
    if (existsSync(join(root, file))) copyFileSync(join(root, file), join(mirror, file));
  }
  for (const dir of ['src', 'public']) {
    if (process.platform === 'win32') {
      // /MIR mirrors deletions too; robocopy exit codes below 8 mean success.
      spawnSync('robocopy', [join(root, dir), join(mirror, dir), '/MIR', '/NFL', '/NDL', '/NJH', '/NJS', '/NP'], { stdio: 'ignore' });
    } else {
      rmSync(join(mirror, dir), { recursive: true, force: true });
      cpSync(join(root, dir), join(mirror, dir), { recursive: true });
    }
  }
}

function runAstro(cwd, args) {
  return spawn('npx', ['astro', ...args], { cwd, stdio: 'inherit', shell });
}

if (!needsMirror) {
  if (command === 'sync') {
    console.log('Project path has no "#"; nothing to sync.');
    process.exit(0);
  }
  runAstro(root, [command, ...rest]).on('exit', (code) => process.exit(code ?? 0));
} else {
  console.log(`Project path contains "#" — running Astro from the mirror: ${mirror}`);
  sync();
  if (!existsSync(join(mirror, 'node_modules'))) {
    console.log('Installing dependencies in the mirror (first run)…');
    const install = spawnSync('npm', ['ci'], { cwd: mirror, stdio: 'inherit', shell });
    if (install.status !== 0) process.exit(install.status ?? 1);
  }
  if (command === 'sync') {
    console.log('Synced.');
    process.exit(0);
  }

  const timer = command === 'dev' ? setInterval(sync, 1000) : undefined;
  const child = runAstro(mirror, [command, ...rest]);
  const stop = () => {
    if (timer) clearInterval(timer);
    child.kill();
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  child.on('exit', (code) => {
    if (timer) clearInterval(timer);
    if (command === 'build' && code === 0 && process.platform === 'win32') {
      // Bring the production build back next to the source.
      spawnSync('robocopy', [join(mirror, 'dist'), join(root, 'dist'), '/MIR', '/NFL', '/NDL', '/NJH', '/NJS', '/NP'], { stdio: 'ignore' });
      console.log(`Build copied to ${join(root, 'dist')}`);
    }
    process.exit(code ?? 0);
  });
}
