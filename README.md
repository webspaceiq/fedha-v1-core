<p align="center">
    
![Build workflow](https://github.com/webspaceiq/fedha-v1-core/actions/workflows/integrate.yml/badge.svg)
![Github last-commit](https://img.shields.io/github/last-commit/webspaceiq/fedha-v1-core?label=Last%20commit)
![Github issues](https://img.shields.io/github/issues/webspaceiq/fedha-v1-core?label=Issues)
[![Version](https://img.shields.io/npm/v/@webspaceiq/fedha-v1-core?label=NPM)](https://www.npmjs.com/package/@webspaceiq/fedha-v1-core)
[![Docker pulls](https://badgen.net/docker/pulls/webspaceiq/fedha-v1-core?icon=docker&label=Docker%20pulls)](https://hub.docker.com/r/webspaceiq/fedha-v1-core/)
[![Docker image size](https://badgen.net/docker/size/webspaceiq/fedha-v1-core?icon=docker&label=Image%20size)](https://hub.docker.com/r/webspaceiq/fedha-v1-core/)
</p>

<div id="top"></div>

- [Fedha Protocol V1](#fedha-protocol-v1)
  - [Features](#features)
- [Getting Started](#getting-started)
  - [Development setup](#development-setup)
  - [NPM Installation](#npm-installation)
- [Contributing](#contributing)
- [License](#license)
- [Maintainers](#maintainers)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

<!-- FEDHA PROTOCOL V1 -->
# Fedha Protocol

Fedha is a decentralized finance (DeFi) platform that allows users to exhange, borrow, lend, and earn interest on a variety of digital assets.

## What does Fedha mean?
Fedha is the Swahili word for money. Swahili is the most widely spoken language in Africa. 

<!-- FEATURES -->
## Features

- Multi-collateral lending and borrowing: Users can lend and borrow multiple digital assets, including stablecoins and cryptocurrencies.
- Multi-token exchange: Fedha supports trading of any ERC-20 token, allowing for a wide range of assets to be traded on the platform.
- Interest rates: Users can earn interest on their deposited assets and pay interest on borrowed assets. Interest rates are determined by the supply and demand of each asset.
- Automated market maker (AMM) model: Fedha currency exhange uses a liquidity pool system to provide fair and efficient trading.
- Liquidity provision: Users can provide liquidity to the Fedha market and earn a portion of the trading fees.
- Flash loans: Users can take out a loan for a short period of time and pay it back in the same time period.
- Stablecoins: Fedha supports a variety of stablecoins, including USDC, DAI, and USDT.
- Decentralized governance: Fedha is governed by its community of users, allowing for decentralized decision making on the future development and direction of the protocol.

<!-- Getting started -->
# Getting Started
<!-- LOCAL DEVELOPMENT -->
## Development setup
### Clone repo

You can clone this repo:

`git clone https://github.com/webspaceiq/fedha-v1-core.git`

The following assumes the use of `node@>=10`.

### Install Dependencies

`npm install`

### Compile Contracts

`npm run compile`

### Run Tests

`npm run test`

<!-- NPM INSTALL -->
## NPM Installation

You can install `@webspaceiq/fedha-v1-core` as an NPM package in your solidity project to import the contracts and interfaces:

`npm install @webspaceiq/fedha-v1-core`

Import at Solidity files:

```
import {ITreasury} from "@webspaceiq/fedha-v1-core/contracts/interfaces/ITreasury.sol";

contract GetLit {

  function mint(address user, uint256 amount) public {
    ITreasury(treasury).mint(user, amount);
  }
}
```

The JSON artifacts with the ABI and Bytecode are also included in the bundled NPM package at `artifacts/` directory.

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<!-- MAINTAINERS -->
## Maintainers
Edward Banfa - [@ebanfa](https://github.com/ebanfa)

<!-- CONTACT -->
## Contact
Fedha - [@FedhaDefi](https://twitter.com/FedhaDefi)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

- [Aave](https://docs.openzeppelin.com/contracts/4.x/governance)
- [Uniswap](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/governance)
