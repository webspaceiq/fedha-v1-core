FROM ethereum/solc:0.8.17 as build-deps

FROM node:18

USER node

COPY --from=build-deps /usr/bin/solc /usr/bin/solc
