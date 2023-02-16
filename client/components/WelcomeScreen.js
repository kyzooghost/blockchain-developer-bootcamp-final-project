import { Flex, Text, Button, chakra } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Prescriber from './Prescriber'
import Patient from './Patient'
import { useMetamask } from '../hooks/useMetamask'
import { usePharmacy } from '../hooks/usePharmacy'

const PRESCIBER_ROLE = ethers.utils.id("PRESCRIBER_ROLE")

export default function WelcomeScreen({ children } ) {
    const [isPrescriber, setIsPrescriber] = useState(null)
    const [prescriberMode, setPrescriberMode] = useState(false)
    const [patientMode, setPatientMode] = useState(false)
    const [becomingPrescriber, setBecomingPrescriber] = useState(false)

    const { accounts, provider } = useMetamask();
    const { pharmacyContract, pharmacyConnected } = usePharmacy();

    useEffect(() => {
        if(accounts[0]) {
            (async () => {
                const status = await pharmacyContract.hasRole(PRESCIBER_ROLE, accounts[0])
                setIsPrescriber(status)
            })();
        }    
    })

    /* BUTTON CLICK HANDLERS */

    async function handleBecomePrescriber() {
        try {
            // Turn on event listener for "error", although not sure how to active this and what the message looks like
            provider.on("error", (tx) => {alert(tx)})

            // Sending the transaction
            const tx = await pharmacyConnected.becomePrescriber()
            setBecomingPrescriber(true)
            
            // Await transaction confirmation
            const status = await provider.waitForTransaction(tx.hash)
            setBecomingPrescriber(false)
            alert("Congratulations, you are now a legal drug dealer 🙌")

        } catch(err) {
            alert(err.message)
        }
    }

    function enterPatientMode() {
        setPatientMode(true);
    }

    function enterPrescriberMode() {
        setPrescriberMode(true);
    }

    function handleHomeClick() {
        setPatientMode(false);
        setPrescriberMode(false);
    }

    /* CONDITIONAL RENDERS */

    if (isPrescriber == null) {
        return (
            <Flex mt = "-330px" direction="column" align="center">
                <WelcomeText>Loading...</WelcomeText>
            </Flex>
        )
    }

    if (prescriberMode) {
        return (
            <Flex direction="column" justify = "space-evenly" align = "center" width = "70vw">
                <Prescriber/>
                <HomeButton onClick={handleHomeClick} width="55vw">
                    Return to home page
                </HomeButton>
            </Flex>   
        )
    }

    if (patientMode) {
        return (
            <Flex direction="column" justify = "space-evenly" align = "center" width = "70vw">
                <Patient/>
                <Flex>
                    <HomeButton onClick={handleHomeClick} width="52.5vw">
                        Return to home page
                    </HomeButton>
                </Flex>
            </Flex>   
        )
    }

    return (
        <Flex mt = "-330px" direction="column" align="center">
            <WelcomeText>Welcome to the Blockchain Pharmacy 💊</WelcomeText>
            <br/>
            <br/>
            <Flex justify = "space-evenly" align = "center" width = "70vw">

                    {isPrescriber ?
                        <WelcomeButton onClick={enterPrescriberMode} colorScheme="blue" size="lg" >👩‍⚕️👨‍⚕️ Prescriber mode</WelcomeButton>
                        :
                        becomingPrescriber ?
                            <BecomePrescriberButton isLoading loadingText="Submitting transaction" colorScheme = "blue" size="lg">
                                👩‍⚕️👨‍⚕️ Become a prescriber<br/>
                                (Beta app only)
                            </BecomePrescriberButton> 
                            :
                            <BecomePrescriberButton onClick={handleBecomePrescriber} colorScheme = "blue" size="lg">
                                👩‍⚕️👨‍⚕️ Become a prescriber<br/>
                                (Beta app only)
                            </BecomePrescriberButton>
                    }

                    <WelcomeButton onClick={enterPatientMode} colorScheme="teal" size="lg" ><Text>🤒😷 Patient mode</Text></WelcomeButton>
            </Flex>
            {children}
        </Flex>
    )
}

const WelcomeText = chakra(Text, {
    baseStyle: {
        textAlign: "center",
        fontSize: "2.5rem",
        fontFamily: "Interstate, sans-serif",
        fontWeight: "600",
    }
})

const BetaText = chakra(Text, {
    baseStyle: {
        fontSize: "2rem",
        fontWeight: "400"
    }
})

const BecomePrescriberButton = chakra(Button, {
    baseStyle: {
        borderRadius: "12",
        lineHeight: "2.0rem",
        fontSize: "1.4rem",
        height: "95px",
    }
})

const WelcomeButton = chakra(Button, {
    baseStyle: {
        borderRadius: "12",
        height: "75px",
        fontSize: "1.5rem"
    }
})

const HomeButton = chakra(Button, {
    baseStyle: {
        bgColor: "gray.500",
        fontSize: "1.1rem",
        height: "45px",
        marginBottom: "35px",
        _hover:{
            background: "gray.600",
        }
    }
})


