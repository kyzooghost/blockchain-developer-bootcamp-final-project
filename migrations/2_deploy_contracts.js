const Pharmacy = artifacts.require("./Pharmacy.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Pharmacy);
  const contract = await Pharmacy.deployed();
};
