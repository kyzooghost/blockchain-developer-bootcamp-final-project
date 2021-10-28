import { Flex, Text, Skeleton, Box, Input, Button, chakra, 
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td} from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useMetamask } from '../hooks/useMetamask'
import { usePharmacy } from '../hooks/usePharmacy'

export default function Prescriber({ children } ) {
    const [pendingScripts, setPendingScripts] = useState([])
    const [claimedScripts, setClaimedScripts] = useState([])
    const [scriptsLoading, setScriptsLoading] = useState(true)
    const [purchaseButtonLoading_0, setPurchaseButtonLoading_0] = useState(false)
    const [purchaseButtonLoading_1, setPurchaseButtonLoading_1] = useState(false)
    const [purchaseButtonLoading_2, setPurchaseButtonLoading_2] = useState(false)
    const [purchaseButtonLoading_3, setPurchaseButtonLoading_3] = useState(false)
    const [purchaseButtonLoading_4, setPurchaseButtonLoading_4] = useState(false)

    let useState_holder = {
        purchaseButtonLoading_0: purchaseButtonLoading_0,
        purchaseButtonLoading_1: purchaseButtonLoading_1,
        purchaseButtonLoading_2: purchaseButtonLoading_2,
        purchaseButtonLoading_3: purchaseButtonLoading_3,
        purchaseButtonLoading_4: purchaseButtonLoading_4,
        setPurchaseButtonLoading_0: setPurchaseButtonLoading_0,
        setPurchaseButtonLoading_1: setPurchaseButtonLoading_1,
        setPurchaseButtonLoading_2: setPurchaseButtonLoading_2,
        setPurchaseButtonLoading_3: setPurchaseButtonLoading_3,
        setPurchaseButtonLoading_4: setPurchaseButtonLoading_4,
    };

    const { accounts, provider, shortenAddress } = useMetamask();
    const { pharmacyConnected } = usePharmacy();

    // This is a huge anonymous async function inserted into the useEffect, if we want to put another function into the useEffect it's neater to name and describe the function somewhere else, rather than pollute the useEffect space
    useEffect(() => {
        if (accounts[0]) {
            (async () => {
                let script_ids = await pharmacyConnected.get_patientPrescriptions(accounts[0]);
                script_ids = script_ids.map(x => Number(ethers.utils.formatUnits(x, 0)));
                let scripts = await Promise.all(script_ids.map(async (x) => {return await pharmacyConnected.getScriptInformation(x)}))
                let placeholder_scripts = []
    
                for (let element of scripts) {
                    placeholder_scripts.push({
                        id: Number(ethers.utils.formatUnits(element[0], 0)),
                        prescriber: shortenAddress(element[1]),
                        medication: element[3],
                        time_dispensed: new Date(element[5]*1000).toLocaleString('en-AU'),
                        claimed: element[7].toString(),
                        valid: element[6].toString(),
                        price: `${ethers.utils.formatEther(element[9].toString())} ETH`
                    })
                }
    
                placeholder_scripts = placeholder_scripts.reverse()
                let claimed_scripts = [];
                let pending_scripts = [];
    
                for (let element of placeholder_scripts) {
                    if (element.claimed == "true") {
                        claimed_scripts.push(element)
                    } else if (element.claimed == "false" && element.valid == "true") {
                        pending_scripts.push(element)
                    }
                }
    
                pending_scripts = pending_scripts.slice(-5)
                setPendingScripts(pending_scripts);
                setClaimedScripts(claimed_scripts);
                setScriptsLoading(false);
            })();            
        }
    })

    async function handleClick(script_id, index) {
        useState_holder['setPurchaseButtonLoading_' + index](true)

        try {
            // Turn on event listener for "error", although not sure how to active this and what the message looks like
            provider.on("error", (tx) => {alert(tx)})

            // Sending the transaction
            const tx = await pharmacyConnected.purchase(script_id, {value: ethers.utils.parseEther("0.01")})

            // Await transaction confirmation
            const status = await provider.waitForTransaction(tx.hash)
            useState_holder['setPurchaseButtonLoading_' + index](false)
            alert("Purchase successful!")

        } catch(err) {
            alert(err.message)
            useState_holder['setPurchaseButtonLoading_' + index](false)
        }
    }

    return (
        <Flex direction="column">
            <WelcomeText textAlign="center">Welcome {accounts[0]}</WelcomeText>
            <br/>
            <br/>
            <br/>
            <WelcomeText textAlign="center">Your pending prescriptions</WelcomeText>
            <br/>
            {scriptsLoading ?
            <Skeleton height = "305px"/>
            :
            <Table tableLayout="fixed" variant="striped" colorScheme="cyan" marginBottom="50px">
                <Thead>
                    <Tr>
                    <Th>Script ID</Th>
                    <Th>Prescriber</Th>
                    <Th>Medication</Th>
                    <Th>Price</Th>
                    <Th isNumeric></Th>
                    </Tr>
                </Thead>

                <Tbody>

                    {pendingScripts.length != 0 && pendingScripts.map((element, index) => {
                        return( 
                            <Tr key={element.id}>
                                <Td>{element.id}</Td>
                                <Td>{element.prescriber}</Td>
                                <Td>{element.medication}</Td>
                                <Td>{element.price}</Td>
                                <Td isNumeric>
                                    <PurchaseButton isLoading={useState_holder['purchaseButtonLoading_' + index]} onClick={() => handleClick(element.id, index)} size = "sm" colorScheme="blue">Purchase</PurchaseButton>
                                </Td>
                                
                            </Tr>             
                        )
                    })}

                </Tbody>
            </Table>
            }
            <br/>
            <WelcomeText textAlign="center">Your claimed prescriptions</WelcomeText>
            <br/>
            {scriptsLoading ?
            <Skeleton height = "305px"/>
            :
            <Box height="310px" overflowY="auto">
                <Table tableLayout="fixed" variant="striped" colorScheme="teal" marginBottom="50px">
                    <Thead>
                        <Tr>
                        <Th>Script ID</Th>
                        <Th>Prescriber</Th>
                        <Th>Medication</Th>
                        <Th>Time purchased</Th>
                        </Tr>
                    </Thead>
                    
                    <Tbody>
                        {claimedScripts.length != 0 && claimedScripts.map(element => {
                                return( 
                                    <Tr key={element.id}>
                                        <Td>{element.id}</Td>
                                        <Td>{element.prescriber}</Td>
                                        <Td>{element.medication}</Td>
                                        <Td>{element.time_dispensed}</Td>
                                    </Tr>             
                                )
                        })}
                    </Tbody>
                </Table>
            </Box>
            }
            <br/>
            <br/>
            {children}
        </Flex>
    )
}

const WelcomeText = chakra(Text, {
    baseStyle: {
        fontFamily: "sans-serif",
        fontWeight: "600",
        fontSize: "1.6rem",
        lineHeight: "120%"
    }
})

const MedicineText = chakra(Text, {
    baseStyle: {
        mt: "10px",
        textAlign: "center",
        fontSize: "1.05rem",
        fontFamily: "Interstate, sans-serif",
        fontWeight: "500",
    }
})

const MedicineBox = chakra(Box, {
    baseStyle: {
        border: "1px solid gray",
        p: "3",
        borderRadius: "20px",
        _hover:{
            background: "gray.50",
            color: "teal.400",
          }
    }
})

const PatientInput = chakra(Input, {
    baseStyle: {
        size: "md",
        variant: "outline",
        borderColor: "gray.300",
        _hover: {
            borderColor: "gray.500"
        }
    }
})

const MedicineButton = chakra(Button, {
    baseStyle: {
        border: "1px solid black",
        bgImage: "url('pill.png')",
        bgRepeat: "no-repeat",
        bgPosition: "50% 0%",
        bgSize: "cover",
        height: "120px"
    }
})

const PurchaseButton = chakra(Button, {
    baseStyle: {
        size: "sm"
    }
})