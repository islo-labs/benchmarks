![ComputeSDK Benchmarks](./results.svg)

[![Benchmarks](https://github.com/computesdk/benchmarks/actions/workflows/benchmarks.yml/badge.svg)](https://github.com/computesdk/benchmarks/actions/workflows/benchmarks.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**TTI (Time to Interactive)** = API call to first command execution. Lower is better.

<br>

## What We Measure

**Daily: Time to Interactive (TTI)**

```
API Request → Provisioning → Boot → Ready → First Command
└───────────────────── TTI ─────────────────────┘
```

Each benchmark creates a fresh sandbox, runs `echo "benchmark"`, and records wall-clock time. 10 iterations per provider, every day, fully automated.

**Powered by ComputeSDK** — We use [ComputeSDK](https://github.com/computesdk/computesdk), a multi-provider SDK, to test all sandbox providers with the same code. One API, multiple providers, fair comparison. Interested in multi-provider failover, sandbox packing, and warm pooling? [Check out ComputeSDK](https://github.com/computesdk/computesdk).

**Sponsor-only tests coming soon:** Stress tests, warm starts, multi-region, and more. [See roadmap →](#roadmap)

[Full methodology →](./METHODOLOGY.md)

<br>

## Evaluate ISLO.dev

Set `ISLO_API_URL` and `ISLO_BEARER_TOKEN` in `.env` (see `env.example`), then run:

```bash
npm run bench:islo -- --iterations 5
```

If the token is operator/admin scoped, set `ISLO_PUBLIC_TENANT_ID` (and optionally `ISLO_PUBLIC_USER_ID`) to scope requests to a tenant.

<br>

## Transparency

- 📖 **Open source** — All benchmark code is public
- 📊 **Raw data** — Every result committed to repo
- 🔁 **Reproducible** — Anyone can run the same tests
- ⚙️ **Automated** — Daily at 5pm Pacific (00:00 UTC) via GitHub Actions on Namespace runners
- 🛡️ **Independent** — Sponsors cannot influence results

<br>

## Sponsors

Sponsors fund large-scale infrastructure tests. **Sponsors cannot influence methodology or results.**

[Become a sponsor →](./SPONSORSHIP.md)

<br>

## Roadmap

- [ ] benchmarks.computesdk.com
- [ ] 10,000 concurrent sandbox stress test
- [ ] Cold start vs warm start metrics
- [ ] Multi-region testing
- [ ] Cost-per-sandbox-minute

<br>

---

MIT License
