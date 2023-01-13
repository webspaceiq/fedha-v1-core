// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/**
 * @title Errors library
 * @author Aave
 * @notice Defines the error messages emitted by the different contracts of the Aave protocol
 */
library Errors {
  string public constant NOT_CONTRACT = '1'; // 'Address is not a contract'
  string public constant INVALID_MINT_AMOUNT = '2'; // 'Invalid amount to mint'
  string public constant INVALID_BURN_AMOUNT = '3'; // 'Invalid amount to burn'
  string public constant INVALID_AMOUNT = '4'; // 'Amount must be greater than 0'
  string public constant RESERVE_INACTIVE = '5'; // 'Action requires an active reserve'
  string public constant RESERVE_FROZEN = '6'; // 'Action cannot be performed because the reserve is frozen'
  string public constant RESERVE_PAUSED = '7'; // 'Action cannot be performed because the reserve is paused'
  string public constant NOT_ENOUGH_AVAILABLE_USER_BALANCE = '8'; // 'User cannot withdraw more than the available balance'
  string public constant RESERVE_ALREADY_INITIALIZED = '9'; // 'Reserve has already been initialized'
  string public constant INCONSISTENT_PARAMS_LENGTH = '10'; // 'Array parameters that should be equal length are not'
  string public constant ZERO_ADDRESS_NOT_VALID = '11'; // 'Zero address not valid'
  string public constant ZERO_NUMBER_NOT_VALID = '12'; // 'Zero number not valid'
  string public constant INVALID_SIGNATURE = '13'; // 'Invalid signature'
  string public constant OPERATION_NOT_SUPPORTED = '14'; // 'Operation not supported'
  string public constant ASSET_NOT_LISTED = '15'; // 'Asset is not listed'
  string public constant ZERO_ASSET_AMOUNT_NOT_VALID = '116'; // 'Zero address not valid'
  string public constant ZERO_TOKEN_AMOUNT_NOT_VALID = '117'; // 'Zero address not valid'
  string public constant ZERO_ASSET_ADDRESS_NOT_VALID = '16'; // 'Zero address not valid'
  string public constant ZERO_ORACLE_ADDRESS_NOT_VALID = '17'; // 'Zero address not valid'
  string public constant INCONSISTENT_PARAM_LENGTH = '18'; // 'Array parameter that should be equal greater than zero'
  string public constant INSUFFICIENT_FUNDS = '201'; // 'Amount must be greater than 0'
  string public constant ZERO_ASSET_PRICE_NOT_VALID = '202'; // 'Zero address not valid'
  string public constant INSUFFICIENT_MINT_FUNDS ='203';
  string public constant INSUFFICIENT_BURN_FUNDS = '2035';
  string public constant TRANSFER_FUNDS_TO_VAULT_FAILURE ='204';
  string public constant TRANSFER_FUNDS_FROM_VAULT_FAILURE ='205';
  string public constant ZERO_BENEFICIARY_ADDRESS_NOT_VALID = '206'; // 'Zero address not valid'
  string public constant INVALID_TOKEN_NAME = '207'; // 'Zero address not valid'
  string public constant INVALID_TOKEN_SYMBOL = '208'; // 'Zero address not valid'
  
}
