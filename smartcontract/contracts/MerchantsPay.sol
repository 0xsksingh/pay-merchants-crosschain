// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract MerchantsPay is ERC721, Ownable, AccessControl, ReentrancyGuard {
    IPyth pyth;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    string public baseURI = "https://superhack-merchants-pay.vercel.app/token.json?id=";

    mapping(address => string) public pointers;

    event PointerSet(address indexed user, string pointer);
    event BaseURISet(string baseURI);

    constructor(address pythContract) ERC721("CrossChain MerchantsPay", "CMP") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        pyth = IPyth(pythContract);
    }

    function setPythContract(address pythContract) public onlyRole(ADMIN_ROLE) {
        pyth = IPyth(pythContract);
    }

    function setPointer(string memory pointerValue) public nonReentrant {
        require(bytes(pointerValue).length > 0, "Pointer cannot be empty");
        uint256 tokenId = uint256(uint160(msg.sender));
        pointers[msg.sender] = pointerValue;
        if (_exists(tokenId)) {
            _burn(tokenId);
        }
        _safeMint(msg.sender, tokenId);
        emit PointerSet(msg.sender, pointerValue);
    }

    function getPointer(address user) public view returns (string memory) {
        return pointers[user];
    }

    function setBaseURI(string memory newBaseURI) public onlyRole(ADMIN_ROLE) {
        baseURI = newBaseURI;
        emit BaseURISet(newBaseURI);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId), "&pointer=", pointers[ownerOf(tokenId)]));
    }

    function _transfer(address, address, uint256) internal override pure {
        revert("This token is non-transferrable");
    }

    function batchSetPointers(address[] memory users, string[] memory pointerValues) public onlyRole(ADMIN_ROLE) nonReentrant {
        require(users.length == pointerValues.length, "Users and pointer values length mismatch");
        for (uint256 i = 0; i < users.length; i++) {
            setPointerForAdmin(users[i], pointerValues[i]);
        }
    }

    function setPointerForAdmin(address user, string memory pointerValue) internal {
        require(bytes(pointerValue).length > 0, "Pointer cannot be empty");
        uint256 tokenId = uint256(uint160(user));
        pointers[user] = pointerValue;
        if (_exists(tokenId)) {
            _burn(tokenId);
        }
        _safeMint(user, tokenId);
        emit PointerSet(user, pointerValue);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getPrices(bytes32[] calldata priceFeedIds) public view returns (PythStructs.Price[] memory) {
        PythStructs.Price[] memory prices = new PythStructs.Price[](priceFeedIds.length);
        for (uint256 i = 0; i < priceFeedIds.length; i++) {
            prices[i] = pyth.getPriceNoOlderThan(priceFeedIds[i], 60);
        }
        return prices;
    }
}