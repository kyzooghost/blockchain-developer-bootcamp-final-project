## SMART CONTRACT DESIGN PATTERNS

### Check Effects Interactions

Only the withdrawFunds() and sendFunds() functions involve external interactions and are hence susceptible to reentrancy attacks. Both of these functions fit the Checks-Effects-Interaction pattern to these

### Role Based Access Control

Implemented the OpenZeppelin AccessControl library to restrict access to "Prescriber" functions including createPrescription(), cancelPrescription() and editPrescription()

### Tight packing of variables into structs

Used this in the Script struct in Pharmacy.sol as described by the comments

```
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
```

### Guard Check

Liberally sprinkled 'require()' into functions, most often to validate that the appropriate user was accessing the function

### Pull over Push

withdrawFunds() function is written so that the caller needs to 'pull' the payment

### Using modifiers for checks

Modifier functions - onlyPrescriber(), onlyAdmin(), isPrescriptionValid() - only contain require(...) statements 

### Using events to record EVM world state changes

The createPrescription(), editPrescription(), cancelPrescription() and purchase() functions emit corresponding events

## FRONTEND DESIGN DECISIONS

React framework and deployment
- Prior experience: In preparation for the course and to practice React, I built a hobby project using create-react-app and deployed it onto Github Pages. There were three big pains I had using this stack: i.) create-react-app in development mode would crash my laptop every hour or so, ii.) create-react-app seemed really 'heavy' and to come with a lot of things included that I didn't end up using, iii.) Deploying onto Github pages was painful and took a whole day. Big issues here were i.) Github Pages not natively supporting React BrowserRouter, and ii.) Connecting Github pages to a custom domain
- I knew that I would aim to deploy onto Heroku for this project. So I wanted to make sure I could deploy onto Heroku quickly and without much issues.
- I spent a few days looking at alternatives. First I considered using no React framework but found it too time-consuming to manually configure Babel and Webpack. I was guided from the official React documentation to Next.js and tried it out - it seemed to solve my three big pain points mentioned above

FRONTEND DESIGN DECISIONS
- First time integrating Metamask into a React framework - found this quite tricky
- First time using Chakra UI and useDApp frameworks - found that I loved Chakra UI especially for pre-built loading components and buttons that were really smooth to integrate
- useDApp was a mixed experience. I found using the useEthers() and shortenAddress() hooks nice. I could not get the useContractCall() hook working, and I found the documentation and examples for using this hook were lacking so I resorted to using ethers.js methods for smart contract calls. In the end I decided to remove useDApp dependencies from my project, and built my own custom hooks to provide the same functionality. This took a few days and several headaches, but I found it quite educational in understanding React and Metamask under the hood.
- Metamask documentation was quite decent, but it was frustrating with more than half the API methods being seemingly deprecated. 
- I found it somewhat awkward integrating Next.js and Metamask without helper libraries. One frustrating error I encountered was that Metamask depends on a window.ethereum object in the browser environment, however window is undefined on the first page render in Next.js. I found myself having to think carefully through what the useEffect hook does in React, as well as the Metamask Event Emitter APIs.

## TRUFFLE TEST SUITE

- Tested every way I could think of, that the contract functions could be called and exploited and used
- Didn't explicitly test the existence and types of variables - felt that extensively testing the functions and expected storage states during each individual function call implicitly covered these. Surely if a variable is set wrong, it will throw an error in the test suite
- Tested that the require(...) errors throw when intended