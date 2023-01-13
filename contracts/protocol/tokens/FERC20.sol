// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../libraries/Errors.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

/// @custom:security-contact tech.dev@webspaceiq.com
contract FERC20 is
    ERC20,
    ERC20Burnable,
    Pausable,
    AccessControl,
    ERC20Permit,
    ERC20FlashMint
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) ERC20Permit(name_) {
        require(bytes(name_).length != 0, Errors.INVALID_TOKEN_NAME);
        require(bytes(symbol_).length != 0, Errors.INVALID_TOKEN_SYMBOL);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @notice Pauses the token.
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }


    /**
     * @notice Unpauses the token.
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Mints a certain amount of the tokens.
     * @param beneficiary_ The address that receives the minted tokens.
     * @param amount_ The amount of tokens to mint.
     */
    function mint(address beneficiary_, uint256 amount_) public virtual onlyRole(MINTER_ROLE) {
        _mint(beneficiary_, amount_);
    }

    /**
     * @notice Mints a certain amount of the tokens.
     * @param from_ The address sending tokens.
     * @param to_ The address that receives the minted tokens.
     * @param amount_ The amount of tokens to be transfered.
     */
    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256 amount_
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from_, to_, amount_);
    }
}
