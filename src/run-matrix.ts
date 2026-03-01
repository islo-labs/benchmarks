import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runBenchmark } from './benchmark.js';
import { printResultsTable, writeResultsJson } from './table.js';
import { providers } from './providers.js';
import type { BenchmarkResult, RunMetadata } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../.env') });

const args = process.argv.slice(2);
const providerFilter = getArgValue(args, '--provider');
const iterationsListArg = getArgValue(args, '--iterations-list') || '1,5,10,25';
const timeoutMs = parseInt(getArgValue(args, '--timeout-ms') || '120000', 10);
const matrixId = getArgValue(args, '--matrix-id') || `matrix-${Date.now()}`;

function getArgValue(argv: string[], flag: string): string | undefined {
  const idx = argv.indexOf(flag);
  return idx !== -1 && idx + 1 < argv.length ? argv[idx + 1] : undefined;
}

function parseIterationsList(value: string): number[] {
  const parsed = value
    .split(',')
    .map(v => parseInt(v.trim(), 10))
    .filter(v => Number.isFinite(v) && v > 0);

  const dedup = Array.from(new Set(parsed));
  if (dedup.length === 0) {
    throw new Error(`Invalid --iterations-list value: ${value}`);
  }
  return dedup;
}

function buildMedianMatrix(runs: Array<{ iterations: number; results: BenchmarkResult[] }>) {
  const matrix: Record<string, Record<string, number | null>> = {};
  for (const run of runs) {
    for (const result of run.results) {
      if (!matrix[result.provider]) {
        matrix[result.provider] = {};
      }
      matrix[result.provider][String(run.iterations)] = result.skipped ? null : result.summary.ttiMs.median;
    }
  }
  return matrix;
}

async function main() {
  const iterationsList = parseIterationsList(iterationsListArg);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  const toRun = providerFilter
    ? providers.filter(p => p.name === providerFilter)
    : providers;

  if (toRun.length === 0) {
    console.error(`Unknown provider: ${providerFilter}`);
    console.error(`Available: ${providers.map(p => p.name).join(', ')}`);
    process.exit(1);
  }

  console.log('ComputeSDK Benchmark Validation Matrix');
  console.log(`Matrix ID: ${matrixId}`);
  console.log(`Iterations sets: ${iterationsList.join(', ')}`);
  console.log(`Date: ${new Date().toISOString()}\n`);

  const matrixRuns: Array<{ iterations: number; runId: string; results: BenchmarkResult[]; file: string }> = [];

  for (const iterations of iterationsList) {
    const runId = `${matrixId}-i${iterations}`;
    console.log(`\n=== Matrix run: ${runId} ===`);
    const results: BenchmarkResult[] = [];

    for (const providerConfig of toRun) {
      const result = await runBenchmark({ ...providerConfig, iterations, timeout: timeoutMs, runId });
      results.push(result);
    }

    printResultsTable(results);

    const runFile = `${timestamp}-${runId}.json`;
    const runPath = path.resolve(__dirname, `../results/${runFile}`);
    const metadata: RunMetadata = {
      runId,
      mode: 'matrix',
      providerFilter,
      iterations,
      timeoutMs,
    };
    await writeResultsJson(results, runPath, metadata);
    matrixRuns.push({ iterations, runId, results, file: runFile });
  }

  const summary = {
    version: '1.0',
    matrixId,
    timestamp: new Date().toISOString(),
    providerFilter: providerFilter || null,
    timeoutMs,
    iterationsList,
    runFiles: matrixRuns.map(r => ({ runId: r.runId, iterations: r.iterations, file: r.file })),
    medianMatrix: buildMedianMatrix(matrixRuns),
  };

  const matrixOut = path.resolve(__dirname, `../results/matrix-${timestamp}.json`);
  fs.writeFileSync(matrixOut, JSON.stringify(summary, null, 2));
  console.log(`\nMatrix summary written to ${matrixOut}`);
}

main().catch(err => {
  console.error('Matrix benchmark failed:', err);
  process.exit(1);
});
