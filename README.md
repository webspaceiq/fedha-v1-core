
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=flat&logo=Ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=flat&logo=solidity&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![Build workflow](https://github.com/webspaceiq/fedha-v1-core/actions/workflows/node.js.yml/badge.svg)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/webspaceiq/fedha-v1-core/@webspaceiq/fedha-v1-core?label=NPM)
![Github issues](https://img.shields.io/github/issues/webspaceiq/fedha-v1-core)
![Github last-commit](https://img.shields.io/github/last-commit/webspaceiq/fedha-v1-core)

# FEDHA

Simple native asset backed ERC20 tokens and their associated price oracles. This project is heavy inspired by AAVE V3 platform. The repository uses Docker Compose and Hardhat as development environment for compilation, testing and deployment tasks.


## Getting Started

You can clone this repo:

`git clone https://github.com/webspaceiq/fedha-v1-core.git`


Install packages:

`npm install`


## Setup

The repository uses Docker Compose to manage sensitive keys and load the configuration. Prior to any action like test or deploy, you must run `docker-compose up` to start the `contracts-env` container, and then connect to the container console via `docker-compose exec contracts-env bash`.

Follow the next steps to setup the repository:

- Install `docker` and `docker-compose`
- Create an environment file named `.env` and fill the next environment variables

```
# Add Alchemy or Infura provider keys, alchemy takes preference at the config level
ALCHEMY_KEY=""
INFURA_KEY=""


# Optional, if you plan to use Tenderly scripts
TENDERLY_PROJECT=""
TENDERLY_USERNAME=""

```
## Test

You can run the full test suite with the following commands:

```
# In one terminal
docker-compose up

# Open another tab or terminal
docker-compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run test
```