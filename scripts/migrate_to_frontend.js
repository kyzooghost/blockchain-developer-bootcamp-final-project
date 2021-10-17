const Pharmacy = artifacts.require("./Pharmacy.sol");
const fs = require("fs");
const ethers = require('ethers');

module.exports = async function(callback) {
    const contract = await Pharmacy.deployed();
    const provider = new ethers.providers.Web3Provider(Pharmacy.currentProvider)
    let CHAIN_ID = ethers.utils.hexlify((await provider.getNetwork()).chainId);
    CHAIN_ID = ethers.utils.hexStripZeros(CHAIN_ID)
    console.log(contract.address)
    console.log(CHAIN_ID);

    const script_code = `const ADDRESS = "${contract.address}";\n` + 
    `const DEPLOYED_CHAIN_ID = "${CHAIN_ID}";\n` + 
    'export { ADDRESS, DEPLOYED_CHAIN_ID };'

    fs.writeFileSync("./client/constants/chain_config.js", script_code);

    callback();
}

// truffle exec ./scripts/migrate_to_frontend.js --network rinkeby