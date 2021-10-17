// DESIGN DOCUMENTS

Pharmacy.sol deployed and verified at 0x40ab96e4612be5a1176F5F49787076DD79da0eba on Rinkeby

# TO-DOS

Start the frontend
- Detect MetaMask presence ✔️
- Connect to current account ✔️
- Display information from your smart contract ✔️
- Allow user to submit transaction to update smart contract state ✔️
- Update frontend if the transaction is successful or not ✔️

Hosting
- How to set up a React environment? How to then host that environment on React? ✔️
- Host on Heroku or Netlify ✔️

Truffle scripts
- Test compilation of Pharmacy.sol ✔️
- Write unit tests script/s - at least 4 unit tests✔️, Test that should work, that should fail, and complete mess // Write more test code than Solidity code lol ✔️
- https://github.com/ConsenSys-Academy-Github-Classroom/supply-chain-exercise-RasenGUY/tree/master/test // Check here for tests
- Write migration scripts ✔️

Pharmacy.sol
- Test run of user flow with Remix IDE ✔️
- Comment to NatSpec Format ✔️

Files
- .env ✔️
- .gitignore ✔️

Documentation
- design_pattern_decisions.md - include 2x design patterns from "Smart Contracts"
- avoiding_common_attacks.md - include 2x attack vectors with SWC number
- deployed_address.txt - Testnet address and network
- Screencast of walking through project, including submitting transaction and seeing updated state

scripts Folder
- scripts/bootstrap - Build or check for dependencies of your project ?npm install should do this
- scripts/server - Spins up a local testnet and server to serve decentralised application locally ?npm run dev
- scripts/tests - Run through test suite for your project 

- Test suite for React?

## BLOCKCHAIN PHARMACY 💊

# WHY A PHARMACY ON THE BLOCKCHAIN?

**To have an immutable database of prescriptions provided by authorized healthcare providers**

Where the current healthcare system has issues:
- **Healthcare data is siloed within each healthcare organisation.** A doctor, Alice, working at the Royal Satoshi Hospital cannot easily find out what drugs their patient, Bob, was given while they were staying at the St Buterin Hospital. This is critical information that Alice needs stat (meaning immediately),  especially since Bob is a severely-ill and medically complicated patient that has just come flying through the ER doors. 

In 2021, a world where people can fly to space for fun, you would imagine that healthcare data such as what medications Bob had and at what time, would be available at the Alice's fingertips. In fact most patients come into the hospital expecting this... Unfortunately they're out of luck if, like Bob, the patient has been treated at multiple hospitals. To obtain information about what happened to Bob at St Buterin Hospital, poor Alice will have to call the medical records department at the St Buterin Hospital, fax over a "Request for medical information" form, and wait until the St Buterin Hospital faxes the information over.

If Alice is lucky she will get the information she is looking for within the hour, meanwhile she is hoping that the drugs she is ordering for Bob won't have disastrous side-effect in combination with the drugs Bob just had at the St Buterin hospital. More commonly it will take half the day for the information to be faxed over, and sometimes it will be the weekend or the early morning and the medical records department is closed.

Hospitals pay out of their own pocket to implement a Electronic Medical Record (EMR) software suite of their choice. Different hospitals implement their own EMR suite and make it difficult for healthcare providers from external hospitals to access their data. This siloed, "each hospital is their own nation" approach to data management betrays common sense.

One solution is using a consortium blockchain to store patient data in an immutable database that is trusted by a local hospitals within a specified region. This blockchain would grant write privileges only to actors with a 'healthcare provider' private key, and read privileges would be similarly restricted. In this way, the question "Do I trust Alice to access the patient data on Bob created at the St Buterin Hospital?", is delegated to the magic of cryptographic algorithms, rather than a overloaded and fallible human in the medical records department.

Additional use cases
- David seeking a script for some painkillers, visits Dr Carol the local GP. David complains that he is in a lot of pain and that Panadol and Voltaren from the supermarket aren't doing a thing. Carol while sympathetic, is also suspicious that David is acting to score himself a prescription for some oxycodone tablets. Carol would access the blockchain with her private key and check if David is a 'doctor shopper' - someone goes from doctor to doctor to accummulate prescriptions for often addictive medications.
- Carol's next patient is Elon, who has just has left hospital after a one-week stay for a nasty chest infection. Carol would like to confirm the prescriptions that Elon was discharged from hospital with. Carol again accesses the blockchain for this information.
- Elon lost his paper script for antibiotics that he was prescribed when he was discharged from the hospital. No worries, he can log into the pharmacy smart contract frontend with his private key and view his pending prescriptions online. With a click of a few buttons, he can purchase the script and have it delivered to his home. Dr Carol, as well as the doctors who have treated Elon as the hospital, can check whether or not naughty Elon has claimed his prescription.

Edge cases (?Malicious healthcare provider ?Malicious patient ?Malicious pharmacy admin)
- Build basic functionality, then consider if have time to implement for these edge cases

**Roles and workflows**

Doctors
- Log-in with Metamask -> Can choose to i.) See scripts they have prescribed, or ii.) Create new prescriptions, iii.) Delete pending prescriptions
- Cannot prescribe to themselves

Patients
- Log-in with Metamask -> Can choose to i.) See their pending scripts and pay for (using DAI in this app) pending scripts, ii.) Shop for non-prescription items at the pharmacy iii.) See scripts they have previously paid for

Pharmacy Admin
- Log-in with Metamask -> i.) See recent purchases, ii.) See total balance of pharmacy smart contract, iii.) Recover ERC20 and ERC721 tokens sent mistakenly to the contract, iv.) Send ETH from the smart contract to a whitelisted address

**Technical details**

SOLIDITY BACKEND

# Libraries
- SafeMaths
- ERC20 - To deal with ERC20 token transfers
- AccessControl, for role-based access control

# Data structures and variables
struct Script { 
    uint256 prescriptionId;
    address prescriber;
    address patient;
    bytes32 medication; // Store medication name as a bytes32, because typically a medication name is 20 characters or less
    uint32 timePrescribed; // uses single storage slot (currently 153 out of 256 bits used)
    uint32 timeDispensed; // uses single storage slot
    bool dispensed; // uses single storage slot
    uint32 dose; // uses single storage slot
    bytes4 unit; // uses single storage slot
    uint8 repeats; // uses single storage slot
    uint16 quantity: // uses single storage slot
    uint256 price; // Debated whether to include uint96 into above storage slot, but the maximum value this would permit would be ~8 trillion, which is too close to reality
    bytes32 route;
    bytes32 indication;
    bytes32[] instructions;
}

Script[] public scripts;

uint public prescriptionCount; //How many total prescriptions are there?
mapping(address => uint) private prescriberPrescriptionCount //How many prescriptions does a prescriber have?
mapping(address => uint) private patientPrescriptionCount //How many prescriptions does a patient have?
mapping(address => uint[]) private prescriberPrescriptions //What presciptions has this doctor creater?
mapping(address => uint[]) private patientPrescriptions //What prescriptions has this patient been prescribed?

Data structure questions
- Should we instead store medication names as an array, and we can only select from the array? Probably on the JS frontend.
- How to stop junk input as prescriptions?
- Should I have a struct for non-prescription meds?
- How to set up mapping (address => role)

# Functions

// Allow onlyPrescriber to access the function
function createPrescription(
    address _patient, 
    bytes32 _medication,
    uint32 _dose;
    bytes4 _unit;
    uint8 _repeats;
    uint16 _quantity:
    bytes32 _route;
    bytes32 _indication;
    bytes32[] _instructions;
    ) public onlyPrescriber returns (bool) {

        uint256 prescriptionId = prescriptionCount++

        scripts.push(Script(
            prescriptionId,
            msg.sender,
            _patient,
            _medication,
            uint32(now), 
            0, //If I declare 0 here, is it a uint32 or a uint256?
            _dose,
            _unit,
            _repeats,
            _quantity,
            10**16, // Set default price of 0.01 ETH, deciding price mechanism for later
            _route,
            _indication,
            _instructions
        ))

        prescriberPrescriptionCount[msg.sender]++;
        patientPrescriptionCount[_patient]++;
        prescriberPrescriptions[msg.sender].push(prescriptionId)
        private patientPrescriptions[_patient].push(prescriptionId)

        emit NewScript(prescriptionId, msg.sender, _patient, _medication)

        return true;
    }

function deletePrescription(uint256 _prescriptionId) onlyPrescriber {
    require()
}

  /**
    @notice Provide accidental token retrieval. 
    @dev Sourced from synthetix/contracts/StakingRewards.sol
   */
  function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyAdmin {

    IERC20(tokenAddress).safeTransfer(_msgSender(), tokenAmount);
    emit Recovered(tokenAddress, tokenAmount);
  }

# Events

event NewScript(uint256 indexed prescriptionId, address indexed prescriber, address indexed patient, bytes32 indexed medication);
event ScriptDeleted(uint256 indexed prescriptionId, address indexed prescriber, address indexed patient, bytes32 indexed medication);
event ScriptDispensed(uint256 indexed prescriptionId, address indexed prescriber, address indexed patient, bytes32 indexed medication);

# Modifers

// Modifier onlyDoctor

// Modifier onlyPharmacyAdmin

// Modifier verifyPatient

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
- Contain smart contract/s
    - Commented to NatSpec Format
    - At least two design patterns from "Smart Contracts" section
    - Protect against at least two attack vectors from the "Smart contracts" section with its SWC number
    - Inherit from at least one library or interface
    - Can be easily compiled, migrated and tested (Use Truffle)
- design_pattern_decisions.md - Describe design patterns
- avoiding_common_attacks.md - Security measures
- At least 5 (five) unit tests for smart contract to pass. Include sentence or two explaining what the tests are covering with their expected behaviour
- deployed_address.txt - Testnet address and network
- Frontend that
    - Detect MetaMask presence
    - Connect to current account
    - Display information from your smart contract
    - Allow a user to submit transaction to update smart contract state
    - Update frontend if the transaction is successful or not
- Hosted on Heroku, Netlify or some other frontend service that gives users a public interface to your decentralised application. Address should be in README.md. 
- Folder called scripts
    - scripts/bootstrap - Build or check for dependencies of your project
    - scripts/server - Spins up a local testnet and server to serve decentralised application locally
    - scripts/tests - Run through test suite for your project
- Screencast of you walking through your project, including submitting transactions and seeing the updated state. Share link to recording in README.md
- Use .env and .gitignore for security
- Emphasise functionality and security over style
- Due time on November 30th, 11:59PM AoE time

**Additional features to consider**
- Should medicines be an NFT minted to the patient once purchased?
- Should there be a pharmacy owner multisig, that can transfer?
- Who can assign the doctor role? Can the doctor role be taken away?

// IDEA 1

Thoughts
- Need to create or access index of ETH mainnet transactions for a time period (Will this require a crapload of API calls? This is the pivotal part of this project)
- Need to filter above index for smart contract created in the last week
- Need to create table for "smart contracts created in the last week" and add colums for "Transactions", "Date created", "Gas used", "Unique users"

Data sorting thoughts
- I want to have the option to blacklist or remove certain smart contracts from my dashbaord
- How does Etherscan mark whether an address is a smart contract?
- Is there anyway to trace what from what frontend are contract calls coming from?
- If I enable Metamask to connect to it, what would the point of this feature be? Why would someone need to connect to their MM account to use my app?

Create a UI
- Probably going to cost too much API calls to make the page auto-refresh every 1-5 seconds, so make it a manual refresh button
- Have options to view by "Most transactions", "most gas used", "most unique active addresses"

Beyond-MVP thoughts
- Make the dashboard work for Polygon, Avalanche, BSC Chain, Fantom, Solana

APIs?
- Alchemy
- Covalent
- Etherscan
- Cryptosheets
- The Graph

Random relevant notes on studying the course
- A contract contains EVM code and storage, and has a corresponding code hash and storage hash; an EOA doesn't
- Any transaction without a 'to' field is assumed to be a contract creation?

UPDATE 10 SEP 2021
- Can I integrate a smart contract into this? Nansen Hot contracts doesn't have a contract
