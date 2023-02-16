import { Button } from "@chakra-ui/react";
import React from 'react';

export default function HomeButton() {

    function handleClick() {
        prescriberMode = false;
        patientMode = false;
    }

    return (
            <>
                <Button 
                    onClick={handleClick}
                    bgColor= "gray.500"
                    fontSize = "1.1rem"
                    height = "45px"
                    _hover={{
                        background: "gray.700",
                      }}
                >
                    Return to home page
                </Button>
                <br/>
                <br/>
            </>
    )
}