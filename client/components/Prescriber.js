import { Flex, Text, Image, Box, Input, Button, Spinner, Skeleton, chakra, 
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
    const [patientAddress, setpatientAddress] = useState("")
    const [scriptsLoading, setScriptsLoading] = useState(true)
    const [isAspirinPrescribing, setIsAspirinPrescribing] = useState(false)
    const [isMelatoninPrescribing, setIsMelatoninPrescribing] = useState(false)
    const [isPantoprazolePrescribing, setIsPantoprazolePrescribing] = useState(false)
    const [isCephalexinPrescribing, setIsCephalexinPrescribing] = useState(false)
    const [scripts, setScripts] = useState([])
    const [patientScripts, setPatientScripts] = useState([])
    const [patientScriptsButtonLoading, setPatientScriptsButtonLoading] = useState(false)
    const [patientScriptsRequested, setPatientScriptsRequested] = useState(false)

    const { accounts, provider, shortenAddress } = useMetamask();
    const { pharmacyConnected } = usePharmacy();

    /* FORM INPUT AND BUTTON CLICK HANDLERS */

    const handleAddressInputChange = (event) => setpatientAddress(event.target.value)

    useEffect(() => {
        if (accounts[0]) {
            (async () => {
                let script_ids = await pharmacyConnected.get_prescriberPrescriptions(accounts[0]);
                script_ids = script_ids.slice(-5).map(x => Number(ethers.utils.formatUnits(x, 0)))
                const raw_scripts = await Promise.all(script_ids.map(async (x) => {return await pharmacyConnected.getScriptInformation(x)}))
                
                let placeholder_scripts = []
    
                for (let element of raw_scripts) {
                    placeholder_scripts.push({
                        id: Number(ethers.utils.formatUnits(element[0], 0)),
                        patient: shortenAddress(element[2]),
                        medication: element[3],
                        time_prescribed: new Date(element[4]*1000).toLocaleString('en-AU'),
                        claimed: (element[7] ? 'yes' : 'no')
                    })
                }
    
                setScriptsLoading(false)
                setScripts(placeholder_scripts)
    
            })();
        }
    })

    async function handleSeePrescriptions() {
        try {
            setPatientScriptsRequested(false)
            setPatientScriptsButtonLoading(true)
            let script_ids = await pharmacyConnected.get_patientPrescriptions(patientAddress);
            script_ids = script_ids.map(x => Number(ethers.utils.formatUnits(x, 0)));
            let scripts = await Promise.all(script_ids.map(async (x) => {return await pharmacyConnected.getScriptInformation(x)}))
            let placeholder_scripts = []
    
            for (let element of scripts) {
                placeholder_scripts.push({
                    id: Number(ethers.utils.formatUnits(element[0], 0)),
                    prescriber: shortenAddress(element[1]),
                    medication: element[3],
                    time_prescribed: new Date(element[4]*1000).toLocaleString('en-AU'),
                    time_dispensed: new Date(element[5]*1000).toLocaleString('en-AU'),
                    claimed: (element[7] ? 'yes' : 'no'),
                    valid: element[6].toString(),
                    price: `${ethers.utils.formatEther(element[9].toString())} ETH`
                })
            }

            placeholder_scripts = placeholder_scripts.reverse()
            setPatientScripts(placeholder_scripts)
            setPatientScriptsButtonLoading(false)
            setPatientScriptsRequested(true)
        } catch(err) {
            alert(err.message)
        }
    }

    async function handleAspirinClick() {
        if(ethers.utils.isAddress(patientAddress)) {
            try {
                // Turn on event listener for "error", although not sure how to active this and what the message looks like
                provider.on("error", (tx) => {alert(tx)})
    
                // Sending the transaction
                const tx = await pharmacyConnected.createPrescription(patientAddress, "Aspirin", 100, "100mg every night, for a month")
                setIsAspirinPrescribing(true)

                // Await transaction confirmation
                const status = await provider.waitForTransaction(tx.hash)
                setIsAspirinPrescribing(false)
                alert("Created prescription successfully!")
            } catch(err) {
                alert(err.message)
            }
        } else {
            alert("Please enter a valid patient Ethereum address")
        }
    }

    async function handleMelatoninClick() {
        if(ethers.utils.isAddress(patientAddress)) {
            try {
                // Turn on event listener for "error", although not sure how to active this and what the message looks like
                provider.on("error", (tx) => {alert(tx)})
    
                // Sending the transaction
                const tx = await pharmacyConnected.createPrescription(patientAddress, "Melatonin", 2, "2mg before bedtime, as required")
                setIsMelatoninPrescribing(true)

                // Await transaction confirmation
                const status = await provider.waitForTransaction(tx.hash)
                setIsMelatoninPrescribing(false)
                alert("Created prescription successfully!")
            } catch(err) {
                alert(err.message)
            }
        } else {
            alert("Please enter a valid patient Ethereum address")
        }
    }

    async function handlePantoprazoleClick() {
        if(ethers.utils.isAddress(patientAddress)) {
            try {
                // Turn on event listener for "error", although not sure how to active this and what the message looks like
                provider.on("error", (tx) => {alert(tx)})
    
                // Sending the transaction
                const tx = await pharmacyConnected.createPrescription(patientAddress, "Pantoprazole", 20, "20mg in the morning, for two months")
                setIsPantoprazolePrescribing(true)

                // Await transaction confirmation
                const status = await provider.waitForTransaction(tx.hash)
                setIsPantoprazolePrescribing(false)
                alert("Created prescription successfully!")
            } catch(err) {
                alert(err.message)
            }
        } else {
            alert("Please enter a valid patient Ethereum address")
        }
    }

    async function handleCephalexinClick() {
        if(ethers.utils.isAddress(patientAddress)) {
            try {
                // Turn on event listener for "error", although not sure how to active this and what the message looks like
                provider.on("error", (tx) => {alert(tx)})
    
                // Sending the transaction
                const tx = await pharmacyConnected.createPrescription(patientAddress, "Cephalexin", 500, "500mg every 12 hours, for five days")
                setIsCephalexinPrescribing(true)

                // Await transaction confirmation
                const status = await provider.waitForTransaction(tx.hash)
                setIsCephalexinPrescribing(false)
                alert("Created prescription successfully!")
            } catch(err) {
                alert(err.message)
            }
        } else {
            alert("Please enter a valid patient Ethereum address")
        }
    }

    // 0xd9A8DEF63006499689E6CCC1114A8E6151CeD64D
    // 0xd9362eFdB46551eD707c5Bed8AA4d3410aEfd3Cc

    return (
        <Flex direction="column">
            <WelcomeText textAlign="center">Welcome Dr. {accounts[0]}</WelcomeText>
            <br/>
            <br/>
            <br/>
            <WelcomeText textAlign="center">{" Enter your patient's Ethereum address: "}</WelcomeText> 
            <br/>
            <PatientInput placeholder= "0x..." value={patientAddress} onChange={handleAddressInputChange}/>
            <br/>
            <br/>
            <Flex justifyContent = "center">
                <Button 
                    isDisabled={!(ethers.utils.isAddress(patientAddress) && accounts[0] != patientAddress)} 
                    isLoading={patientScriptsButtonLoading}
                    onClick={handleSeePrescriptions}
                    colorScheme="gray" border="1px" borderColor="gray.300"
                    >
                    See patient&#39;s existing prescriptions
                </Button>
            </Flex>
            {patientScriptsRequested ? 
                patientScripts.length == 0 ? 
                    <Flex justifyContent = "center" mt={6} mb={-2}>
                        <Text>Your patient has no prescriptions</Text> 
                    </Flex>
                    :
                    <Box mt={8}>
                        <WelcomeText textAlign="center" mb={5}>{patientAddress}&#39;s prescriptions</WelcomeText>
                        <Box mt={5} mb={-2} height="310px" overflowY="auto">
                            <Table tableLayout="fixed" variant="striped" colorScheme="cyan" marginBottom="50px">
                                <Thead>
                                    <Tr>
                                        <Th>Script ID</Th>
                                        <Th>Prescriber</Th>
                                        <Th>Medication</Th>
                                        <Th>Time prescribed</Th>
                                        <Th isBool>Claimed?</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {patientScripts.map(element => {
                                        return( 
                                            <Tr key={element.id}>
                                                <Td>{element.id}</Td>
                                                <Td>{element.prescriber}</Td>
                                                <Td>{element.medication}</Td>
                                                <Td>{element.time_prescribed}</Td>
                                                <Td isBool>{element.claimed}</Td>
                                            </Tr>             
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>
                : 
                null}
            <br/>
            <br/>
            <WelcomeText textAlign="center">What would you like to prescribe?</WelcomeText>
            <Flex m = {10} justify="space-between">
                <MedicineBox onClick={handleAspirinClick} margin = "0 auto">
                    <Image maxHeight= "100%" width = "90px" src="pill.png" alt="pill" />
                    {isAspirinPrescribing ? <MedicineText><Spinner speed = "0.75s"/></MedicineText> : <MedicineText>Aspirin</MedicineText>}
                </MedicineBox>
                <MedicineBox onClick={handleMelatoninClick} margin = "0 auto">
                    <Image maxHeight= "100%" width = "90px" src="pill.png" alt="pill" />
                    {isMelatoninPrescribing ? <MedicineText><Spinner speed = "0.75s"/></MedicineText> : <MedicineText>Melatonin</MedicineText>}
                </MedicineBox>
                <MedicineBox onClick={handlePantoprazoleClick} margin = "0 auto">
                    <Image maxHeight= "100%" width = "90px" src="pill.png" alt="pill" />
                    {isPantoprazolePrescribing ? <MedicineText><Spinner speed = "0.75s"/></MedicineText> : <MedicineText>Pantoprazole</MedicineText>}
                </MedicineBox>
                <MedicineBox onClick={handleCephalexinClick} margin = "0 auto">
                    <Image maxHeight= "100%" width = "90px" src="pill.png" alt="pill" />
                    {isCephalexinPrescribing ? <MedicineText><Spinner speed = "0.75s"/></MedicineText> : <MedicineText>Cephalexin</MedicineText>}
                </MedicineBox>
      
            </Flex>

            <br/>
            <WelcomeText textAlign="center">Your recent prescriptions (showing last 5)</WelcomeText>
            <br/>

            {scriptsLoading ? 
            <Skeleton height = "305px"/>
            :
            <Table tableLayout="fixed" variant="striped" colorScheme="teal" marginBottom="50px">
                <Thead>
                    <Tr>
                        <Th>Script ID</Th>
                        <Th>Patient</Th>
                        <Th>Medication</Th>
                        <Th>Time prescribed</Th>
                        <Th isBool>Claimed?</Th>
                    </Tr>
                </Thead>
                
                <Tbody>
                    {scripts.length != 0 && scripts.map(element => {
                        return( 
                            <Tr key={element.id}>
                                <Td>{element.id}</Td>
                                <Td>{element.patient}</Td>
                                <Td>{element.medication}</Td>
                                <Td>{element.time_prescribed}</Td>
                                <Td isBool>{element.claimed}</Td>
                            </Tr>             
                        )
                    })}
                </Tbody>
            </Table>
            }

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
        border: "1.5px solid gray",
        p: "3",
        borderRadius: "20px",
        _hover:{
            transform: "scale(1.025)",
            color: "#e7f5f3",
            bgColor: "gray",
            cursor: "pointer"
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