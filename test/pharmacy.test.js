const ethers = require('ethers');
const Pharmacy = artifacts.require("Pharmacy");
let catchRevert = require("./exceptions.js").catchRevert;

contract('Pharmacy', async (accounts) => {
  let pharmacyInstance;
  const [deployer, prescriber, patient, patient2] = accounts;
  const PRESCIBER_ROLE = ethers.utils.id("PRESCRIBER_ROLE"); // Does the same as keccak256("PRESCRIBER_ROLE") in Solidity

  beforeEach(async () => {
    pharmacyInstance = await Pharmacy.deployed();
    await pharmacyInstance.grantRole(PRESCIBER_ROLE, prescriber);
  })

  /* TESTING ACCESS CONTROL */

  describe("Access Control", () => {

    it('Should assign DEFAULT_ADMIN_ROLE to the deployer', async () => {
      const status = await pharmacyInstance.hasRole("0x0000000000000000000000000000000000000000000000000000000000000000", deployer);
      assert.equal(status, true, "The deployer address has not been set as the DEFAULT_ADMIN_ROLE");
    });

    it('Should assign PRESCRIBER_ROLE to the prescriber', async () => {
      const status = await pharmacyInstance.hasRole(PRESCIBER_ROLE, prescriber);
      assert.equal(status, true, "The prescriber address has not been set as the PRESCRIBER_ROLE");
    });

    it('Should not assign PRESCRIBER_ROLE to the patient', async () => {
      const status = await pharmacyInstance.hasRole(PRESCIBER_ROLE, patient);
      assert.equal(status, false, "The patient has been set as the PRESCRIBER_ROLE");
    });

    it('Should not assign PRESCRIBER_ROLE to the deployer', async () => {
      const status = await pharmacyInstance.hasRole(PRESCIBER_ROLE, deployer);
      assert.equal(status, false, "The deployer has been set as the PRESCRIBER_ROLE");
    });

    it ('Should not allow patient to use prescribe function', async() => {
      await catchRevert(pharmacyInstance.createPrescription(patient, "aspirin", 100, "100mg mane for one week", {from: patient}));
    })

    it ('Should not allow deployer to use prescribe function', async() => {
      await catchRevert(pharmacyInstance.createPrescription(patient, "aspirin", 100, "100mg mane for one week", {from: deployer}));
    })

    it ('Should not allow patient to buy a non-existent script', async() => {
      await catchRevert(pharmacyInstance.purchase(3, {from: patient}));
    })

    it ('Should not allow the deployer to buy a non-existent script', async() => {
      await catchRevert(pharmacyInstance.purchase(4, {from: deployer}));
    })

  })

  /* TESTING PRESCRIBER AND PATIENT FUNCTIONS AND WORKFLOWS */ 

  describe("Prescriber and patient functions", () => {

    it ('Should allow prescriber to prescribe a prescription assigned to patient, and patient to purchase this prescription.', async() => {
      let event_NewScript = false;
      let event_ScriptDispensed = false;

      await catchRevert(pharmacyInstance.createPrescription(prescriber, "aspirin", 100, "100mg mane for one week", {from: prescriber}), "Prescriber has been able to prescribe for themselves");
      const NewScriptTx = await pharmacyInstance.createPrescription(patient, "aspirin", 100, "100mg mane for one week", {from: prescriber});
      await catchRevert(pharmacyInstance.cancelPrescription(0, {from: patient}), "Patient has been able to cancel the prescription");
      await catchRevert(pharmacyInstance.editPrescription(0, "Melatonin", 2, "2mg nocte prn", {from: patient}), "Patient has been able to edit a prescription");
      await catchRevert(pharmacyInstance.purchase(0, {from: patient}), "Patient has been able to get the prescription for free");
      const PurchaseTx = await pharmacyInstance.purchase(0, {from: patient, value: 10**16});
      await catchRevert(pharmacyInstance.purchase(0, {from: patient, value: 10**16}), "Patient has been able to buy the same prescription twice");    
      await catchRevert(pharmacyInstance.editPrescription(0, "Melatonin", 2, "2mg nocte prn", {from: prescriber}), "Prescriber has been able to edit a completed prescription");

      if (NewScriptTx.logs[0].event == "NewScript") {event_NewScript = true;}
      if (PurchaseTx.logs[0].event == "ScriptDispensed") {event_ScriptDispensed = true;}
      assert.equal(event_NewScript, true, "NewScript event was not emitted")
      assert.equal(event_ScriptDispensed, true, "ScriptDispensed event was not emitted")
    })

    it ('Should allow prescriber to create a prescription, cancel it and throw an error if the patient to purchase this prescription', async() => {
      let event_ScriptCancelled = false;
      
      await pharmacyInstance.createPrescription(patient, "aspirin", 100, "100mg mane for one week", {from: prescriber});
      const CancelTx = await pharmacyInstance.cancelPrescription(1, {from: prescriber});
      await catchRevert(pharmacyInstance.purchase(1, {from: patient, value: 10**16}))

      if (CancelTx.logs[0].event == "ScriptCancelled") {event_ScriptCancelled = true}
      assert.equal(event_ScriptCancelled, true, "ScriptCancelled event was not emitted")
    })

    it ('Should allow prescriber to create a prescription and edit it successfully', async() => {
      let event_ScriptEdited = false;
      
      await pharmacyInstance.createPrescription(patient2, "aspirin", 100, "100mg mane for one week", {from: prescriber});
      const EditTx = await pharmacyInstance.editPrescription(2, "Melatonin", 2, "2mg nocte prn", {from: prescriber});
      await catchRevert(pharmacyInstance.purchase(2, {from: patient, value: 10**16}), "Patient has been able to purchase a script that is not theirs")
      await catchRevert(pharmacyInstance.purchase(2, {from: prescriber, value: 10**16}), "Prescriber has been able to purchase a script that they created, but did not mark as for them")
      await pharmacyInstance.purchase(2, {from: patient2, value: 10**16})

      if(EditTx.logs[0].event == "ScriptEdited") {event_ScriptEdited = true}
      assert.equal(event_ScriptEdited, true, "ScriptEdited event was not emitted")
    })

  })

  /* TESTING GETTER FUNCTIONS */ 
  describe("Getter functions", () => {

    it ('Should have a working getScriptInformation() getter function', async() => {
      await catchRevert(pharmacyInstance.getScriptInformation(0, {from: patient2}), "Patient is able to view a prescription that is not theirs")
      const script = await pharmacyInstance.getScriptInformation.call((0), {from: patient});
      assert.equal(script.prescriber, prescriber, "The genesis script has the prescriber information");
      assert.equal(script.patient, patient, "The genesis script has the patient information");
      assert.equal(script.medication, "aspirin", "The genesis script has the medication information");
      assert.isAtLeast(Number(script.timeDispensed), Number(script.timePrescribed), "The genesis script has timeDispensed earlier than timePrescribed");
      assert.equal(script.prescriptionValid, false, "The genesis script is incorrectly valid");
      assert.equal(script.dispensed, true, "The genesis script is incorrectly marked as not dispensed");
      assert.equal(script.dose, 100, "The genesis script has the wrong dose");
      assert.equal(script.price, 10**16, "The genesis script has the wrong price");
      assert.equal(script.instructions, "100mg mane for one week", "The genesis script has the wrong instructions");
    })

    it('should have a working get_prescriberActivePrescriptionCount() getter function', async() => {
      await catchRevert(pharmacyInstance.get_prescriberActivePrescriptionCount(prescriber, {from: patient}), "Patient is able to use get_prescriberPrescriptionCount() getter function")
      await catchRevert(pharmacyInstance.get_prescriberActivePrescriptionCount(prescriber, {from: deployer}), "Deployer is able to use get_prescriberPrescriptionCount() getter function")
      const prescriptionCount = await pharmacyInstance.get_prescriberActivePrescriptionCount.call(prescriber, {from: prescriber});
      assert.equal(prescriptionCount, 2, "get_prescriberActivePrescriptionCount() does not return the right number")
    })

    it('should have a working get_patientActivePrescriptionCount getter function', async() => {
      await catchRevert(pharmacyInstance.get_patientActivePrescriptionCount(patient, {from: patient2}), "Patient2 is able to use get_patientPrescriptionCount(patient) getter function")
      const prescriptionCount_patient = await pharmacyInstance.get_patientActivePrescriptionCount.call(patient, {from: prescriber});
      assert.equal(prescriptionCount_patient, 1, "get_patientActivePrescriptionCount() does not return the right number for patient")
      const prescriptionCount_patient2 = await pharmacyInstance.get_patientActivePrescriptionCount.call(patient2, {from: prescriber});
      assert.equal(prescriptionCount_patient2, 1, "get_patientActivePrescriptionCount() does not return the right number for patient2")
    })

    it('should have a working get_prescriberPrescriptions getter function', async() => {
      await catchRevert(pharmacyInstance.get_prescriberPrescriptions(prescriber, {from: deployer}), "Deployer is able to use working get_prescriberPrescriptions getter function")
      await catchRevert(pharmacyInstance.get_prescriberPrescriptions(prescriber, {from: patient}), "Patient is able to use working get_prescriberPrescriptions getter function")
      const prescriptions = await pharmacyInstance.get_prescriberPrescriptions.call(prescriber, {from: prescriber});
      assert.equal(prescriptions[0].words[0], 0, "get_prescriberPrescriptions is not getting the correct number");
      assert.equal(prescriptions[1].words[0], 1, "get_prescriberPrescriptions is not getting the correct number");
      assert.equal(prescriptions[2].words[0], 2, "get_prescriberPrescriptions is not getting the correct number");
    })

    it('should have a working get_patientPrescriptions getter function', async() => {
      await catchRevert(pharmacyInstance.get_patientPrescriptions(patient, {from: patient2}), "Patient2 is able to use get_patientPrescriptions(patient)");
      const prescriptions = await pharmacyInstance.get_patientPrescriptions.call(patient, {from: prescriber});
      assert.equal(prescriptions[0].words[0], 0, "get_patientPrescriptions is not getting the correct script IDs for patient")
      assert.equal(prescriptions[1].words[0], 1, "get_patientPrescriptions is not getting the correct script IDs for patient")
      const prescriptions2 = await pharmacyInstance.get_patientPrescriptions.call(patient2, {from: prescriber});
      assert.equal(prescriptions2[0].words[0], 2, "get_patientPrescriptions is not getting the correct script IDs for patient2")
    })

  })

  describe("Pharmacy Admin Functions", () => {

    it ('Should only allow DEFAULT_ADMIN_ROLE to call withdrawFunds()', async() => {
      await catchRevert(pharmacyInstance.withdrawFunds(ethers.utils.parseUnits("0.01", "ether"), {from: prescriber}), "Prescriber was able to call withdrawFunds");
      await catchRevert(pharmacyInstance.withdrawFunds(ethers.utils.parseUnits("0.01", "ether"), {from: patient}), "Patient was able to call withdrawFunds");
      await pharmacyInstance.withdrawFunds(ethers.utils.parseUnits("0.01", "ether"), {from: deployer});
    })

    it ('Should only allow DEFAULT_ADMIN_ROLE to call sendFunds()', async() => {
      await catchRevert(pharmacyInstance.sendFunds(prescriber, ethers.utils.parseUnits("0.01", "ether"), {from: prescriber}), "Prescriber was able to call sendFunds");
      await catchRevert(pharmacyInstance.sendFunds(patient, ethers.utils.parseUnits("0.01", "ether"), {from: patient}), "Patient was able to call sendFunds");
      await pharmacyInstance.sendFunds(prescriber, ethers.utils.parseUnits("0.01", "ether"), {from: deployer});
    })

    it ('Should not allow DEFAULT_ADMIN_ROLE to withdraw or send more funds than is in the contract', async() => {
      await catchRevert(pharmacyInstance.withdrawFunds(ethers.utils.parseUnits("1.00", "ether"), {from: deployer}), "Deployer was able to withdraw more funds than was on the contract");
      await catchRevert(pharmacyInstance.sendFunds(patient, ethers.utils.parseUnits("1.00", "ether"), {from: deployer}), "Deployer was able to send more funds than was on the contract");
    })
  })
});