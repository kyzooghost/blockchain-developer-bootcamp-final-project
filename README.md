![](https://raw.githubusercontent.com/kyzooghost/blockchain-developer-bootcamp-final-project/main/images/homepage.png)

# BLOCKCHAIN PHARMACY 💊

A pharmacy existing as a smart contract on the blockchain

Screencast - https://youtu.be/F1P_L6te9iY

App available on https://blockchaindeveloperbootcampfin.herokuapp.com/

Deployed on Rinkeby at 0x4a0C38Fe6Ec84EE72Fa4f4cE67bA6Ac356d13fD7

## ROLES
- **Patients** can see pending prescriptions and pay for them, and also see previously purchased prescriptions
- **Prescribers** can check the prescription history for a patient, create new prescriptions for a specified patient, and see their own most recent prescriptions


## DIRECTORY STRUCTURE

The root folder has been initialised as both a Next.js app and a Truffle app (through `npx create-next-app` => `truffle init` commands), and can be deployed directly to Heroku to serve the frontend.

```text
/client - Frontend code and assets
  /components - Custom React components
  /constants - Contains configuration files for the frontend to connect properly to the deployed smart contract
  /hooks - Custom React hooks
  /pages - As per Next.js default structure
  /public - Static assets as per Next.js default structure
  /styles - CSS files as per Next.js default structure
/contracts - Smart contracts as per Truffle setup
/documentation - Further project documentation
/images - Image files for README.md
/migrations - Migration scripts as per Truffle setup
/scripts - Contains a custom Truffle script to ensure that after the smart contract is deployed, the frontend is then configured to connect with it
/test - Test scripts as per Truffle setup
```

## INSTALLATION

**Prerequisites**
- Node.js >= v14 (https://nodejs.org/en/)
- Truffle `npm install -g truffle`
- Ganache `npm install -g ganache-cli`


**Instructions**

To install the project, first go to your directory of choice and clone the repo

    git clone https://github.com/kyzooghost/blockchain-developer-bootcamp-final-project.git

Then go into the created folder

    cd blockchain-developer-bootcamp-final-project

Then to install the required dependencies, run

    npm install

## DEPLOYING ON GANACHE TESTNET

To deploy your own instance of the Pharmacy smart contract on a Ganache testnet blockchain, you will first need to install Ganache - https://www.trufflesuite.com/ganache

You will then need to link this project to Ganache by creating a new workspace in Ganache, clicking 'ADD PROJECT' feature and then selecting this project's truffle-config.js file.

Then make sure the Ganache server settings are at default
- Hostname: 127.0.0.1
- Port Number: 7545

Then type

    npm run test-ganache

This will deploy the Pharmacy smart contract onto your Ganache instance, and then serve a frontend connected to the smart contract at http://localhost:3000/

Note that you do need to add Ganache as a custom network to Metamask to interact with this frontend. See https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask - The custom network needs a "New RPC URL" value of `http://127.0.0.1:8545`

## DEPLOYING ON RINKEBY

To deploy on Rinkeby, you will need to provide your own private key and Rinkeby API key. Insert them into line 43 of truffle-config.js:

    ...
    provider: () => new PrivateKeyProvider(YOUR_PRIVATE_KEY, YOUR_RINKEBY_API_KEY),
    ...

Then type

    npm run build-rinkeby

This will deploy a new instance of the Pharmacy smart contract to Rinkeby, and then serve a frontend connected to the smart contract at http://localhost:3000/

## TESTING

To run the test suite 

`npx truffle test`

## .env FILE

To deploy to Rinkeby (or public testnet of your choice), you will need to provide your own private key and Rinkeby API URL.

To programatically verify the smart contract on Etherscan with Truffle, you will need to provide your own Etherscan API key.

To provide these, create a .env file in the root directory with the following contents:

```text
ETHERSCAN_API_KEY = ...
PRIVATE_KEY = ...
RINKEBY_API_URL = ...
```

## Public Ethereum address (For NFT certification)

0x1D3BaEDd71E597982D686379F90d91ab23181956