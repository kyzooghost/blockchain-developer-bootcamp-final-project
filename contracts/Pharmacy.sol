pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Pharmacy is AccessControl{
    using SafeMath for uint256;
    using SafeMath for uint144;
    using SafeMath for uint32;

    /// @dev The contract deployer is assigned the DEFAULT_ADMIN_ROLE as per AccessControl.sol
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    bytes32 public constant PRESCRIBER_ROLE = keccak256("PRESCRIBER_ROLE");

    /// @dev Modifier to restrict access to accounts that DEFAULT_ADMIN_ROLE has granted the PRESCRIBER_ROLE
    modifier onlyPrescriber() {
      require(hasRole(PRESCRIBER_ROLE, msg.sender), "You are not a prescriber");
      _;
    }

    /// @dev Modifier to restrict access to DEFAULT_ADMIN_ROLE
    modifier onlyAdmin() {
      require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "You are not a pharmacy admin");
      _;
    }

    /// @dev Modifier to check that a prescriptionId is valid as a function input
    /// @param _prescriptionId The prescription ID number
    modifier isPrescriptionValid(uint256 _prescriptionId) {
      require(prescriptionCount >= _prescriptionId, "This prescription doesn't exist yet");
      require(scripts[_prescriptionId].prescriptionValid == true, "This script is invalid");
      require(scripts[_prescriptionId].dispensed == false, "This prescription has already been purchased");
      _;
    }
    
    event NewScript(uint256 indexed prescriptionId, address indexed patient, string indexed medication);
    event ScriptCancelled(uint256 indexed prescriptionId);
    event ScriptEdited(uint256 indexed prescriptionId);
    event ScriptDispensed(uint256 indexed prescriptionId, address indexed patient, string indexed medication);

    /// @dev struct to represent a script
    struct Script { 
        uint256 prescriptionId;
        address prescriber;
        address patient;
        string medication; // Tried declaring as a "bytes32" first, but decided it was simpler for the dev and user experience to use "string", even if gas costs are higher
        // Pack the following variables into a single 256-bit storage slot
        uint32 timePrescribed; // uses single storage slot - 32 bits
        uint32 timeDispensed; // uses single storage slot - 32 bits
        bool prescriptionValid; // uses single storage slot - 8 bits
        bool dispensed; // uses single storage slot - 8 bits
        uint32 dose; // uses single storage slot - 32 bits
        uint144 price; // uses single storage slot - 144 bits
        // 32 + 32 + 8 + 8 + 32 + 144 = 256 bits 
        string instructions; // Store unit, repeats, quantity, indication, route here
    }

    /// @dev For a public array of structs, Solidity has a limitation of 12 properties or else it calls a "Stack Too Deep" error
    Script[] private scripts;

    uint public prescriptionCount; //How many total prescriptions are there?
    mapping(address => uint256) private prescriberActivePrescriptionCount; //How many active prescriptions does a prescriber have?
    mapping(address => uint256) private patientActivePrescriptionCount; //How many active prescriptions does a patient have?
    mapping(address => uint256[]) private prescriberPrescriptions; //What presciptions has this prescriber created?
    mapping(address => uint256[]) private patientPrescriptions; //What prescriptions has this patient been prescribed?
  
    /* PRESCRIBER FUNCTIONS */

    /** @notice Create a prescription - PRESCRIBER ONLY
      * @param _patient Patient address
      * @param _medication Medication as a string
      * @param _dose Dose
      * @param _instructions Prescription instructions as a string
      * @return uint256 Returns the prescriptionId of the newly created prescription
      */
    function createPrescription(
        address _patient, 
        string memory _medication,
        uint32 _dose,
        string memory _instructions
        ) public onlyPrescriber returns (uint256) {
            require (msg.sender != _patient, "You are not allowed to prescribe for yourself");

            uint256 prescriptionId = prescriptionCount++;

            scripts.push(Script(
                prescriptionId,
                msg.sender,
                _patient,
                _medication,
                uint32(block.timestamp), 
                0, //If I declare 0 here, is it a uint32 or a uint256?
                true,
                false,
                _dose,
                10**16, // Set default price of 0.01 ETH, deciding price mechanism for later
                _instructions
            ));

            prescriberActivePrescriptionCount[msg.sender]++;
            patientActivePrescriptionCount[_patient]++;
            prescriberPrescriptions[msg.sender].push(prescriptionId);
            patientPrescriptions[_patient].push(prescriptionId);

            emit NewScript(prescriptionId, _patient, _medication);

            return prescriptionId;
        }

    /** @notice Cancel a prescription - CAN ONLY BE USED BY THE PRESCRIBER FOR THEIR OWN CREATED PRESCRIPTIONS
      * @param _prescriptionId Prescription ID number
      * @return bool Return 'true' if the function is successful
      */
    function cancelPrescription(uint256 _prescriptionId) public onlyPrescriber isPrescriptionValid(_prescriptionId) returns (bool) {
      require(scripts[_prescriptionId].prescriber == msg.sender, "You did not create this prescription");
      scripts[_prescriptionId].prescriptionValid = false;
      patientActivePrescriptionCount[scripts[_prescriptionId].patient]--;
      prescriberActivePrescriptionCount[scripts[_prescriptionId].prescriber]--;
      emit ScriptCancelled(_prescriptionId);
      return true;
    }

    /** @notice Edit a prescription - CAN ONLY BE USED BY THE PRESCRIBER FOR THEIR OWN CREATED AND ACTIVE PRESCRIPTIONS
      * @param _prescriptionId Prescription ID number of the script we want to edit
      * @param _medication What we want to change the medication to
      * @param _dose What we want to change the medication to
      * @param _dose What we want to change the dose to
      * @param _instructions What we want to change the instructions to
      * @return bool Return 'true' if the function is successful
      */
    function editPrescription(
        uint256 _prescriptionId,
        string memory _medication,
        uint32 _dose,
        string memory _instructions
        ) public onlyPrescriber isPrescriptionValid(_prescriptionId) returns (bool) {
      require(scripts[_prescriptionId].prescriber == msg.sender, "You did not create this prescription");
      
      scripts[_prescriptionId].medication = _medication;
      scripts[_prescriptionId].dose = _dose;
      scripts[_prescriptionId].instructions = _instructions;

      emit ScriptEdited(_prescriptionId); 

      return true;
    }

    /* GETTER FUNCTIONS */

    /** @notice Get the details for a specific script
      * @dev Starting in Solidity 0.8.0, functions can return structs
      * @param _prescriptionId Prescription ID number of the script we want details for
      * @return struct Script with corresponding prescription ID
      */
    function getScriptInformation(uint256 _prescriptionId) public view returns (Script memory) {
        require(hasRole(PRESCRIBER_ROLE, msg.sender) || msg.sender == scripts[_prescriptionId].patient || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "You are not allowed to view this script");
        return scripts[_prescriptionId];
    }

    /** @notice Get the number of active scripts for a prescriber - A prescriber can only call this for themselves
      * @param _prescriber Prescriber address
      * @return prescriptionCount
      */
    function get_prescriberActivePrescriptionCount(address _prescriber) public view returns (uint256 prescriptionCount) {
      require(hasRole(PRESCRIBER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "You are not allowed to use this getter function");  
      require(msg.sender == _prescriber, "You can only see your own prescription count");
      prescriptionCount = prescriberActivePrescriptionCount[_prescriber];
    }

    /** @notice Get the number of active scripts for a patient - A patient can only call this themselves
      * @param _patient Patient address
      * @return prescriptionCount
      */
    function get_patientActivePrescriptionCount(address _patient) public view returns (uint256 prescriptionCount) {
      require(hasRole(PRESCRIBER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || msg.sender == _patient, "You are not allowed to use this getter function");  
      prescriptionCount = patientActivePrescriptionCount[_patient];
    }

    // We allow prescribers only to see their own prescriptions, or the DEFAULT_ADMIN_ROLE

    /** @notice Get the scripts that a prescriber has created - A prescriber can only call this for themselves, and patients cannot use this function
      * @param _prescriber Prescriber address
      * @return prescriptionIds Dynamic array containing prescription IDs that the prescriber was created
      */
    function get_prescriberPrescriptions(address _prescriber) public view returns (uint256[] memory prescriptionIds) {
      require(hasRole(PRESCRIBER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "You are not allowed to use this getter function");  
      require(msg.sender == _prescriber, "You can only see your own prescription count");
      prescriptionIds = prescriberPrescriptions[_prescriber];
    }

    /** @notice Get the scripts that a prescriber has created - A prescriber can only call this for themselves, and patients cannot use this function
      * @param _patient Patient address
      * @return prescriptionIds Dynamic array containing prescription IDs of the scripts that the patient has been assigned
      */
    function get_patientPrescriptions(address _patient) public view returns (uint256[] memory prescriptionIds) {
      require(hasRole(PRESCRIBER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || msg.sender == _patient, "You are not allowed to use this getter function");  
      prescriptionIds = patientPrescriptions[_patient];
    }

    /* PATIENT FUNCTIONS */

    /** @notice Purchase a script - requires sending ETH as payment
      * @param _prescriptionId Prescription ID of the script we want to purchase
      * @return bool true if the function is successful
      */
    function purchase (uint256 _prescriptionId) payable public isPrescriptionValid(_prescriptionId) returns (bool) {
      require(msg.sender == scripts[_prescriptionId].patient, "This is not your script");
      require(msg.value >= scripts[_prescriptionId].price, "You did not pay enough");

      scripts[_prescriptionId].timeDispensed = uint32(block.timestamp);
      scripts[_prescriptionId].prescriptionValid = false;
      scripts[_prescriptionId].dispensed = true;

      emit ScriptDispensed(_prescriptionId, scripts[_prescriptionId].patient, scripts[_prescriptionId].medication);

      return true;
    }

    /* PHARMACY ADMIN FUNCTIONS */

    /** @notice Withdraw ETH from the Pharmacy smart contract
      * @param _amount Amount of ETH desired for withdrawal
      */
    function withdrawFunds (uint256 _amount) external onlyAdmin {
        require(address(this).balance >= _amount);
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    /** @notice Send ETH from the Pharmacy smart contract to a desired address
      * @param _target Desired target address for sending funds
      * @param _amount Amount of ETH desired to send
      */
    function sendFunds (address _target, uint256 _amount) external onlyAdmin {
        require(address(this).balance >= _amount);
        (bool success, ) = _target.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    /* BACKDOOR FUNCTIONS FOR BOOTCAMP ASSESSMENT PURPOSES */

    /** @notice Become a prescriber
      * @dev This function is only included for demonstration purposes so the assessor can have easy access to both the prescriber and patient UIs
      * @dev This function should be deleted for actual use
      * @dev We are using _setupRole() outside of the constructor function, which is circumventing the admin system imposed by AccessControl.sol
      */
    function becomePrescriber() public {
        _setupRole(PRESCRIBER_ROLE, msg.sender);
    }
}