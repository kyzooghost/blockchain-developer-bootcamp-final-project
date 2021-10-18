// DESIGN DOCUMENTS

**Roles and workflows**

Doctors
- Log-in with Metamask -> Can choose to i.) See scripts they have prescribed, or ii.) Create new prescriptions, iii.) Delete pending prescriptions
- Cannot prescribe to themselves

Patients
- Log-in with Metamask -> Can choose to i.) See their pending scripts and pay for (using DAI in this app) pending scripts, ii.) Shop for non-prescription items at the pharmacy iii.) See scripts they have previously paid for

Pharmacy Admin
- Log-in with Metamask -> i.) See recent purchases, ii.) See total balance of pharmacy smart contract, iii.) Recover ERC20 and ERC721 tokens sent mistakenly to the contract, iv.) Send ETH from the smart contract to a whitelisted address

## ADDITIONAL FEATURES TO CONSIDER IF TIME ALLOWING OR IF CRITICAL
- Add feature to allow prescriber to search the scripts that a patient has
- React tests
- Should there be a pharmacy owner multisig, that can transfer smart contract funds and change prices?

# Solidity notes to consider

Solidity notes

- Events - Log event for every state change in the contract
- assert - You shouldn't reach this in functioning contract
- Fallback function - in case trapped ETH?
- Use memory for intermediate calculations, storage to store the final result
- Use Pausable design pattern - freeze contract
- Commit/reveal to protect privacy in voting? See https://medium.com/swlh/exploring-commit-reveal-schemes-on-ethereum-c4ff5a777db8

- Use hashes to conceal patient data?
- Remove script.patient as a field, and store a hash instead that requires script.patient to obtain?
- Doing this removes the ability for a patient to see their scripts, 

Using bytes32 rather than strings
- Use bytes32, not string - use less gas. String is a dynamically sized-type which has limitations in Solidity.
- Strings cannot be returned from a function
- Bytes32 can fit 32 characters

Variable packing, or creating a tightly packed struct
- Each storage slot is 32-bytes or 256-bit, EVM can pack multiple smaller data types in a 32-byte slot
- It is not automatically achieved by the optimizer
- Only changes how data will be stored
- uint16 can hold numbers until 2^16 - 1
- bool = 1-byte
- uint8 - 1-byte
- uint16 - 2-bytes
- uint32 - 4-bytes
- Save lots of gas, because not using extra SSTORE operations

**Final Project Submission specs**
- README.md which describes the project, describes the directory structure, and where the frontend project can be accessed
    - Inherit from at least one library or interface