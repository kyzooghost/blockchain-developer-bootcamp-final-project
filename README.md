# BLOCKCHAIN PHARMACY 💊

A pharmacy existing as a smart contract on the blockchain

## ROLES
- **Patients** can see pending prescriptions and pay for them
- **Prescribers** can create new prescriptions, and see their most recent prescriptions

## DEPLOYED APP
- Smart contract deployed on Rinkeby at 0x4a0C38Fe6Ec84EE72Fa4f4cE67bA6Ac356d13fD7
- Frontend deployed on https://blockchaindeveloperbootcampfin.herokuapp.com/

## INSTALLATION

To install the project, first go to your directory of choice and clone the repo

    git clone https://github.com/kyzooghost/blockchain-developer-bootcamp-final-project.git

Then go into the created folder

    cd blockchain-developer-bootcamp-final-project

Then to install the required dependencies, run

    npm install

## DEPLOYING ON GANACHE TEST BLOCKCHAIN

To deploy your own instance of the Pharmacy smart contract on a Ganache test blockchain, you will first need to install Ganache - https://www.trufflesuite.com/ganache

You will then need to link this project to Ganache by using Ganache's 'ADD PROJECT' feature and selecting this project's truffle-config.js file.

Then make sure the Ganache server settings are at default
- Hostname: 127.0.0.1
- Port Number: 7545

Then type

    npm run test-ganache

This will deploy the Pharmacy smart contract onto your Ganache instance, as well as a frontend connected to the smart contract at http://localhost:3000/

## DEPLOYING ON RINKEBY

## TESTING

To run the test suite, you can use either

    truffle test

or

    npm test