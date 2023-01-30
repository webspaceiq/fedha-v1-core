// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import {Errors} from '@aave/core-v3/contracts/protocol/libraries/helpers/Errors.sol';
import {IACLManager} from '@aave/core-v3/contracts/interfaces/IACLManager.sol';
import {IPoolAddressesProvider} from '@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol';
import {IPriceOracleGetter} from '@aave/core-v3/contracts/interfaces/IPriceOracleGetter.sol';
import {IAaveOracle} from '@aave/core-v3/contracts/interfaces/IAaveOracle.sol';
import "../../interfaces/ITokenOracle.sol";

/**
 * @title AaveOracle
 * @author Aave
 * @notice Contract to get asset prices, manage price sources and update the fallback oracle
 * - Use of Chainlink Aggregators as first source of price
 * - If the returned price by a Chainlink aggregator is <= 0, the call is forwarded to a fallback oracle
 * - Owned by the Aave governance
 */
contract FedhaOracle is IAaveOracle {
  IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;

  // Map of asset price sources (asset => priceSource)
  mapping(address => ITokenOracle) private assetsSources;

  address public immutable override BASE_CURRENCY;
  uint256 public immutable override BASE_CURRENCY_UNIT;

  /**
   * @dev Only asset listing or pool admin can call functions marked by this modifier.
   **/
  modifier onlyAssetListingOrPoolAdmins() {
    _onlyAssetListingOrPoolAdmins();
    _;
  }

  /**
   * @notice Constructor
   * @param provider The address of the new PoolAddressesProvider
   * @param assets The addresses of the assets
   * @param sources The address of the source of each asset
   *        aggregator is not consistent
   * @param baseCurrency The base currency used for the price quotes. If USD is used, base currency is 0x0
   * @param baseCurrencyUnit The unit of the base currency
   */
  constructor(
    IPoolAddressesProvider provider,
    address[] memory assets,
    address[] memory sources,
    address baseCurrency,
    uint256 baseCurrencyUnit
  ) {
    ADDRESSES_PROVIDER = provider;
    _setAssetsSources(assets, sources);
    BASE_CURRENCY = baseCurrency;
    BASE_CURRENCY_UNIT = baseCurrencyUnit;
    emit BaseCurrencySet(baseCurrency, baseCurrencyUnit);
  }

  /// @inheritdoc IAaveOracle
  function setAssetSources(address[] calldata assets, address[] calldata sources)
    external
    override
    onlyAssetListingOrPoolAdmins
  {
    _setAssetsSources(assets, sources);
  }

  /// @inheritdoc IAaveOracle
  function setFallbackOracle(address fallbackOracle)
    external
    override
    onlyAssetListingOrPoolAdmins
  {
  }

  /**
   * @notice Internal function to set the sources for each asset
   * @param assets The addresses of the assets
   * @param sources The address of the source of each asset
   */
  function _setAssetsSources(address[] memory assets, address[] memory sources) internal {
    require(assets.length == sources.length, Errors.INCONSISTENT_PARAMS_LENGTH);
    for (uint256 i = 0; i < assets.length; i++) {
      assetsSources[assets[i]] = ITokenOracle(sources[i]);
      emit AssetSourceUpdated(assets[i], sources[i]);
    }
  }

  /// @inheritdoc IPriceOracleGetter
  function getAssetPrice(address asset) public view override returns (uint256) {
    require(address(assetsSources[asset]) != address(0), "INVALID ASSET");
    ITokenOracle source = assetsSources[asset];

    if (asset == BASE_CURRENCY) {
      return BASE_CURRENCY_UNIT;
    } else {
      return source.getPrice();
    }
  }

  /// @inheritdoc IAaveOracle
  function getAssetsPrices(address[] calldata assets)
    external
    view
    override
    returns (uint256[] memory)
  {
    uint256[] memory prices = new uint256[](assets.length);
    for (uint256 i = 0; i < assets.length; i++) {
      prices[i] = getAssetPrice(assets[i]);
    }
    return prices;
  }

  /// @inheritdoc IAaveOracle
  function getSourceOfAsset(address asset) external view override returns (address) {
    return address(assetsSources[asset]);
  }

  /// @inheritdoc IAaveOracle
  function getFallbackOracle() external view returns (address) {
    return address(0);
  }

  function _onlyAssetListingOrPoolAdmins() internal view {
    IACLManager aclManager = IACLManager(ADDRESSES_PROVIDER.getACLManager());
    require(
      aclManager.isAssetListingAdmin(msg.sender) || aclManager.isPoolAdmin(msg.sender),
      Errors.CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN
    );
  }
}
