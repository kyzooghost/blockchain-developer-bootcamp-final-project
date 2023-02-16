// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "forge-std/Script.sol";
import "../contracts/Pharmacy.sol";

contract PharmacyDeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        Pharmacy pharmacy = new Pharmacy();
        vm.stopBroadcast();
    }
}