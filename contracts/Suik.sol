// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Suik {
    mapping(address => mapping(address => uint256)) _balances;
    mapping(address => mapping(bytes32 => bool)) executedTxs;

    function topup(address _asset, address _account, uint256 _amount) public {
        _adjustBalance(_asset, _account, _amount, true);
    }

    function _adjustBalance(
        address _asset,
        address _account,
        uint256 _amount,
        bool increase
    ) internal {
        if (increase) {
            _balances[_asset][_account] += _amount;
        } else {
            require(
                _balances[_asset][_account] > _amount,
                "Insufficient balance"
            );
            _balances[_asset][_account] -= _amount;
        }
    }

    function getAccountAssetBalance(
        address _asset,
        address _account
    ) public view returns (uint256) {
        return _balances[_asset][_account];
    }

    function spend(
        address _asset,
        uint256 _amount,
        uint256 _exp,
        bytes memory signature,
        address _to
    ) public {
        require(_exp >= block.timestamp, "Expired Tx");

        bytes32 messageHash = getMessageHash(_asset, _amount, _exp);
        address signer = getSignerAddress(messageHash, signature);

        require(!executedTxs[signer][messageHash], "Tx already executed");

        _adjustBalance(_asset, signer, _amount, false);
        _adjustBalance(_asset, _to, _amount, true);

        executedTxs[signer][messageHash] = true;
    }

    function getSignerAddress(
        bytes32 messageHash,
        bytes memory signature
    ) internal pure returns (address) {
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature);
    }

    function getMessageHash(
        address _asset,
        uint256 _amount,
        uint256 _exp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_asset, _amount, _exp));
    }

    function getEthSignedMessageHash(
        bytes32 messageHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    messageHash
                )
            );
    }

    function recoverSigner(
        bytes32 ethSignedMessageHash,
        bytes memory signature
    ) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (r, s, v);
    }
}
