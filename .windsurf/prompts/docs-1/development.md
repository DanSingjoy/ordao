# Development docs


Now add a section that explains how to run ordao components or the whole ordao app locally for development and testing. Everything is in package.json scripts.

Typical pattern that I use for developing ordao fractal apps:
1. Open 1 terminal. Run `npm run dev:chain`
2. Open another terminal. Run `npm run dev:cdeploy` (see also alternative `cdeploy` versions)
3. Run `npm run dev:ornode-clean`
4. Open another terminal. Run `npm run dev:gui`
5. If you are changing code and want the changed parts of ordao to be rebuilt automatically use `npm run dev:watch` in another terminal

Also mention build commands and any other scripts that you think are worth mentioning.