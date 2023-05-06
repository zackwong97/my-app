This is a Next.js project

### Random hash generator

This end point `/api/ran-hash` will return a unique random hash

Sample return
`{"hash":"3beef1f8a9f5325e4f53a90a0f106087082a83f92582b98cd0c4cf0cabdae64c"}`

### Random odd hash generator

This end point `/api/odd-hash` will return a unique random hash with the last character being an odd number

Sample return
`{"oddhash":"51c82c91b4372675a3b93a7dcb2b6b5713ac896a21935fc031cb1a699725f1a1"}`

### Load Test

`/api/odd-hash` end point load test results using JMeter, raw results and JMeter settings can be found in `loadtest` folder

| Label | # Samples	| Average |	Median | 90% Line | 95% Line | 99% Line | Min | Max | Error % | Throughput | Received KB/sec | Sent KB/sec |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Odd Hash | 30 | 329 | 9 | 1058 | 1067 | 1219 | 8 | 1219 | 0.00% | 3.03122 | 0.91 | 0.38 |