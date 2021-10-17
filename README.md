# BLOCKCHAIN PHARMACY 💊

Building frontend on https://ma-button.herokuapp.com/ before integrating into project

## SUMMARY
A pharmacy existing as a smart contract on the blockchain

## ROLES
- **Patients** can log in, see available scripts that their doctor has prescribed them, and pay for them
- **Doctors** can log in, see pending prescriptions, and create new prescriptions

---

## ROLE WORKFLOW

**Doctor** 
- Log in with Metamask (or web3 wallet of choice)
- UI renders to show the scripts they have prescribed, and whether the patient has claimed them and when
- UI also allows doctors to create new prescriptions
- Doctors cannot prescribe to themselves

**Patient**
- Log in with Metamask (or web3 wallet of choice)
- UI renders to show outstanding scripts that their doctor has prescribed them
- Patients can click 'PURCHASE' on those outstanding scripts, and this will transfer the corresponding USDT price from their wallet to the pharmacy smart contract

---

## ADDITIONAL FEATURES TO CONSIDER IF TIME ALLOWING OR IF CRITICAL
- Should medicines be an NFT minted to the patient once purchased?
- Should there be a pharmacy owner multisig, that can transfer smart contract funds and change prices?
- Who can assign the doctor role? Can the doctor role be taken away?