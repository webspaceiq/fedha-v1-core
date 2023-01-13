// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library DataTypes {
    
  struct ReserveData {
    uint16 id;
    address vaultAddr;
    address oracleAddr;
    uint40 lastUpdateTimestamp;
  }
    
  struct AssetSourceData {
    uint16 id;
    address oracleAddr;
    uint40 lastUpdateTimestamp;
  }
}