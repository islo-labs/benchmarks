export interface ProviderConfig {
  /** Provider name */
  name: string;
  /** Optional run correlation ID */
  runId?: string;
  /** Number of iterations (default: 10) */
  iterations?: number;
  /** Timeout per iteration in ms (default: 120000) */
  timeout?: number;
  /** Environment variables that must all be set to run this benchmark */
  requiredEnvVars: string[];
  /** Creates a compute instance — either direct SDK or gateway-based */
  createCompute: () => any;
}

export interface TimingResult {
  /** Total time from start to first successful code execution */
  ttiMs: number;
  /** Correlation ID for this iteration */
  requestId?: string;
  /** ISO-8601 timestamp when iteration started */
  startedAt?: string;
  /** Error message if this iteration failed */
  error?: string;
}

export interface Stats {
  min: number;
  max: number;
  median: number;
  avg: number;
}

export interface BenchmarkResult {
  provider: string;
  runId?: string;
  iterations: TimingResult[];
  summary: {
    ttiMs: Stats;
  };
  skipped?: boolean;
  skipReason?: string;
}

export interface RunMetadata {
  runId: string;
  mode: 'single' | 'matrix';
  providerFilter?: string;
  iterations: number;
  timeoutMs: number;
}
