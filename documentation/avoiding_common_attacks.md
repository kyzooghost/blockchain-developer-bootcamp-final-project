Ran a MythX Quick Analysis with promotion code supplied by Consensys Academy 🍻

As promoted at https://mythx.io/detectors/ - this detects most SWCs found in the [SWC Registry](https://swcregistry.io/)

### SWC-100 Function Default Visibility

Explicitly specified function visibilities

### SWC-101 Integer Overflow and Underflow

Implemented the OpenZeppelin SafeMath library

### SWC-102 Outdated Compiler Version

Used Solidity ^0.8.0

### SWC-103 Floating Pragma

Set `pragma solidity 0.8.9;`

### SWC-106 Unprotected SELFDESTRUCT Instruction

No selfdestruct() function

### SWC-107 Reentrancy

Only the withdrawFunds() and sendFunds() functions involve external interactions and are hence susceptible to reentrancy attacks. Both of these functions fit the Checks-Effects-Interaction pattern to these

### SWC-115 Authorization through tx.origin

tx.origin not used

### SWC-131 Presence of unused variables

No unused variables