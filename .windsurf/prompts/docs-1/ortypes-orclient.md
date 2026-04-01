# Ortypes docs

Let's generate docs for ortypes.

Some key things to understand and potentially mention:
1. The whole ORDAO architecture (interdependence of modules) is inspired by the [onion architecture](https://medium.com/@shivendraodean/software-architecture-the-onion-architecture-1b235bec1dec) and ortypes (plus maybe contract modules) are the core of it (corresponds to domain model / domain services of )
2. Thanks to this architecture a lot of code can be re-used in frontend in backed. E.g.: form input validation logic and API request payload validation reuses the same code from ortypes.
3. It also provides a translation layer necessary to create ORDAO proposals from user input. Thanks to existence of this translation layer ORDAO smart contracts are simple and focused on [doing one thing and doing it well](https://en.wikipedia.org/wiki/Unix_philosophy#:~:text=monolithic%20design.-,Origin,-%5Bedit%5D) (e.g.: [transaction execution](../../../contracts/packages/orec/) or [token](../../../contracts/packages/respect1155/)), which is important for security. The complexity needed to work with other parts of fractal toolset, which are the way they are partly for historical reasosn and might change in the future).
    * [This is what I have in mind](../../../docs/OF_ORDAO_UPGRADE.md#how-will-respect-game-result-in-respect-distribution). Ortypes run by the frontend does the translation. The "respect game results" submitted there are rankings determined by [fractalgram](https://github.com/sim31/fractalgram) app. By translating rankings in ortypes we don't have to coupld smart contracts to respect game logic that might change in the future.


## Improve orlclient docs as well
This also brings to mind some things we have to mention in [orclient](../../../libs/orclient/) docs.
What orclient actually does (or why you should interact with ORDAO contracts through it, instead of directly):
* When creating proposals and voting it makes sure that necessary proposal content and metadata is uploaded to [ornode](../../services/ornode/) validating the proposal before submitting it.
    * Only proposal hashes are stored onchain.
* When creating proposals it translates user input (see point above)
* When retrieving proposals it retrieves all the necessary data from both blockchain and ornode in order to get a full proposal with all of its content, checking for consistency between onchain data and ornode




