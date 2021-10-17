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

Design patterns
- OpenZeppelin - Using roles for role-based access control 
- Pull over Push payments - for Withdraw function
- Using modifiers for checks
- Tight variable packing - in struct
- Fail early and fail loud

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

Metamask Button issues
- Lag in detecting Metamask "Log off" and "Log in" events sometimes
    - Tested out - https://private-redemption.avalaunch.app/ - Has similar issues so let's work on something else
- 

React Components needed (Ensure only work if connect to Rinkeby and logged-into Metamask)
- Error Component, telling to log into Rinkeby?
- Bought/Pending Prescription Component
- Past Prescription Component
- Purchase Button Component - linked to purchase()
- Buy Button Component - linked to buy()
- Buttons for Pharm admin?

Security
- Use SafeMath to avoid Integer Over/Underflow (SWC-101)
- Avoid txOrigin attack (SWC-115)
- Using new Solidity (SWC-102)

- Get protection against SWC-136 - Unencrypted Private Data On-Chain

Truffle Test Suite
- Tested every way I can think of that the functions in the contract could be called and exploited and used
- Didn't explicitly test the existence and types of variables - felt that extensively testing the functions and expected storage states during each individual function call implicitly covered these. Surely if a variable is set wrong, it will throw an error in the test suite
- Tested that the require(...) errors activate as intended in the cases I can think of