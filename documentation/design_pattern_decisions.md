## SMART CONTRACT DESIGN PATTERNS

### Role Based Access Control

Implemented the OpenZeppelin AccessControl library to restrict access to "Prescriber" functions including createPrescription(), cancelPrescription() and editPrescription()

### Tight packing of variables into structs

Used this in the Script struct

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

Design patterns
- OpenZeppelin - Using roles for role-based access control 
- Pull over Push payments - for Withdraw function
- Using modifiers for checks
- Tight variable packing - in struct
- Fail early and fail loud


Frontend design decisions

React framework and deployment
- Prior experience: In preparation for the course and to practice React, I built a hobby project using create-react-app and deployed it onto Github Pages. There were three big pains I had using this stack: i.) create-react-app in development mode would crash my laptop every hour or so, ii.) create-react-app seemed really 'heavy' and to come with a lot of things included that I didn't end up using, iii.) Deploying onto Github pages was painful and took a whole day (Big issues here were i.) Github Pages not supporting React BrowserRouter without what looked like tedious configuration, and ii.) Connecting Github pages to a custom domain I owned
- I knew that I would aim to deploy onto Heroku for this project. So I wanted to make sure I could deploy onto Heroku quickly and without much issues.
- I spent a few days looking at alternatives. First I considered using no React framework but found it too time-consuming to manually configure Babel and Webpack. I was guided from the official React documentation to Next.js and tried it out - it seemed to solve my three big pain points from my experience building with create-react-app and deploying to Github Pages

FRONTEND DESIGN DECISIONS
- First time integrating Metamask into a React framework - found this ++tricky
- First time using Chakra UI and useDApp frameworks - found that I loved Chakra UI especially for pre-built loading components and buttons that were really smooth to integrate
- useDApp was a mixed experience. I found using the useEthers() and shortenAddress() hooks nice. I could not get the useContractCall() hook working, and I found the documentation and examples for using this hook were lacking so I resorted to using ethers.js methods for smart contract calls. In the end I decided to remove useDApp dependencies from my project, and build my own custom hooks to provide the same functionality. This took a few days and several headaches, but I found it quite educational in understanding React and Metamask under the hood better.
- Metamask documentation was quite decent, it was frustrating though with what seemed like more than half the API methods being deprecated. 
- It's somewhat awkward integrating React and Metamask without helper libraries in my opinion. One frustrating error I encountered was that Metamask depends on a window.ethereum object in the browser environment, however window is undefined on the first page render with React. I found myself having to think carefully through what the useEffect hook does in React, as well as the Metamask Event Emitter APIs.

SOLIDITY DESIGN DECISIONS



Top 5 medications prescribed
- Cephalexin 500mg TDS
- Pantoprazole 20g nocte
- Melatonin 2g nocte
- Aspirin 100mg nocte

Pill icons
https://www.flaticon.com/free-icon/pill_595611
https://www.flaticon.com/free-icon/pills_873654
https://www.flaticon.com/free-icon/capsules_2937192
https://www.flaticon.com/free-icon/pills_647383
https://www.flaticon.com/free-icon/medicine_647349
https://www.flaticon.com/free-icon/medicine_647350
https://www.flaticon.com/free-icon/pills_647377
Or use a generic pill icon?

Truffle Test Suite
- Tested every way I can think of that the functions in the contract could be called and exploited and used
- Didn't explicitly test the existence and types of variables - felt that extensively testing the functions and expected storage states during each individual function call implicitly covered these. Surely if a variable is set wrong, it will throw an error in the test suite
- Tested that the require(...) errors activate as intended in the cases I can think of