# BLOCKCHAIN PHARMACY 💊

A pharmacy existing as a smart contract on the blockchain

Frontend deployed on https://blockchaindeveloperbootcampfin.herokuapp.com/

## ROLES
- **Patients** can see pending prescriptions and pay for them
- **Prescribers** can create new prescriptions, and see their most recent prescriptions


## DIRECTORY STRUCTURE

The root folder has been initialised as both a Next.js app and a Truffle app (through "npx create-next-app" and "truffle init" commands), and can be deployed directly to Heroku to serve the frontend.


/client - Frontend code and assets  
  /components - Custom React components  
  /constants - Contains configuration files for the frontend to connect properly to the deployed smart contract  
  /hooks - Custom React hooks  
  /pages - As per Next.js default structure  
  /public - Static assets as per Next.js default structure  
  /styles - CSS files as per Next.js default structure  
/contracts - Smart contracts as per Truffle setup  
/documentation - Further project documentation  
/migrations - Migration scripts as per Truffle setup  
/scripts - Contains a custom Truffle script to ensure that after the smart contract is deployed, the frontend is then configured to connect with it  
/test - Test scripts as per Truffle setup  

## INSTALLATION

To install the project, first go to your directory of choice and clone the repo

    git clone https://github.com/kyzooghost/blockchain-developer-bootcamp-final-project.git

Then go into the created folder

    cd blockchain-developer-bootcamp-final-project

Then to install the required dependencies, run

    npm install

## DEPLOYING ON GANACHE

To deploy your own instance of the Pharmacy smart contract on a Ganache test blockchain, you will first need to install Ganache - https://www.trufflesuite.com/ganache

You will then need to link this project to Ganache by using Ganache's 'ADD PROJECT' feature and selecting this project's truffle-config.js file.

Then make sure the Ganache server settings are at default
- Hostname: 127.0.0.1
- Port Number: 7545

Then type

    npm run test-ganache

This will deploy the Pharmacy smart contract onto your Ganache instance, and then serve a frontend connected to the smart contract at http://localhost:3000/

## DEPLOYING ON RINKEBY

To deploy on Rinkeby, you will need to provide your own private key and Rinkeby API key. Insert them into line 43 of truffle-config.js:

    ...
    provider: () => new PrivateKeyProvider(YOUR_PRIVATE_KEY, YOUR_RINKEBY_API_KEY),
    ...

Then type

    npm run build-rinkeby

This will deploy a new instance of the Pharmacy smart contract to Rinkeby, and then serve a frontend connected to the smart contract at http://localhost:3000/

## TESTING

To run the test suite, you can use either

    truffle test

or

    npm test