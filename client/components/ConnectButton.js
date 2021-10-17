// TODO? - Authenticate yourself before getting in?

import React, { useState, useEffect, useRef } from 'react';
import { Button, Box, Text, Flex, chakra } from "@chakra-ui/react";
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';
import Identicon from "./Identicon";
import { useMetamask } from '../hooks/useMetamask'
import { DEPLOYED_CHAIN_ID } from '../contract_config'

const ONBOARD_TEXT = "Click here to install Metamask! (required for this app)";
const CONNECT_TEXT = 'Connect to a wallet';
const PLEASE_SWITCH_TEXT = 'Wrong network! Please click to switch 🙏'

function isMetaMaskInstalled () {
  if (typeof window !== "undefined") {
      return Boolean(window.ethereum && window.ethereum.isMetaMask)
  }
}

export default function ConnectButton({ handleOpenModal }) {

  const [buttonText, setButtonText] = useState(ONBOARD_TEXT)
  const [accounts, setAccounts] = useState([])
  const [balance, setBalance] = useState()
  const onboarding = useRef();

  const { provider, chainID } = useMetamask();
  
  // Hook to handle balance
  useEffect(() => {
      if (isMetaMaskInstalled() && provider && accounts[0]) {
        (async () => {
            setBalance(await provider.getBalance(accounts[0]))
        })();
      }
  }, [accounts, chainID, provider]) // Unsure here, what is the appropriate event to trigger a balance check, considered doing a setInterval of ~2 secs

  useEffect(() => {
    if(isMetaMaskInstalled()) {
        if (accounts.length > 0) {
            if (chainID !== DEPLOYED_CHAIN_ID) {
              setButtonText(PLEASE_SWITCH_TEXT)
            }
        } else {
            setButtonText(CONNECT_TEXT);
        }
      }
  }, [accounts, chainID])

  // After first render => grab new accounts, and set up event handler for changed accounts
  useEffect(() => {
      function handleNewAccounts(newAccounts) {setAccounts(newAccounts)}

      if(isMetaMaskInstalled()) {
        window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(handleNewAccounts);
          window.ethereum.on('accountsChanged', handleNewAccounts)        
          return () => {window.ethereum.removeListener('accountsChanged', handleNewAccounts)}; //Clean up by removing event handler?
      }
  }, [])

  // After first render => Load MetaMaskOnBoarding object
  useEffect(() => {
      if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding()
        }
  }, []);

  function onClick() {
      if (isMetaMaskInstalled()) {
        if (accounts.length > 0) {
          window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: DEPLOYED_CHAIN_ID }],
          });
        }

        window.ethereum
          .request({ method: 'eth_requestAccounts'})
          .then((newAccounts) => {
              setAccounts(newAccounts)
          });
      } else {
          onboarding.current.startOnboarding();
      }
  }

  return (
    (chainID == DEPLOYED_CHAIN_ID && accounts[0]) ?
    <UniswapBox>
        <Box px="3">
        <Text color="white" fontSize="md">
            {balance && parseFloat(ethers.utils.formatEther(balance)).toFixed(2)} ETH
        </Text>
        </Box>

        <UniswapAccountButton onClick = {handleOpenModal}>
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
            {accounts[0] && `${accounts[0].slice(0, 6)}...${accounts[0].slice(accounts[0].length - 4, accounts[0].length)}`}
        </Text>
        <Identicon account = {accounts[0]} />
        </UniswapAccountButton>
    </UniswapBox>
    :
    <BaseButton onClick={onClick}>{buttonText}</BaseButton>
  )
}

const BaseButton = chakra(Button, {
  baseStyle: {
  marginTop:"50px",
  marginBottom: "70px",
  border: "1px solid",
  borderColor: "gray.300",
  p:"1.5"
  },
});

const UniswapBox = chakra(Flex, {
  baseStyle: {
    direction: "row",
    alignItems:"center",
    background:"gray.700",
    borderRadius:"xl",
    py:"0",
    marginTop:"50px",
    marginBottom: "70px"
  }
});

const UniswapAccountButton = chakra(Button, {
  baseStyle: {
    bg:"gray.800",
    border:"1px solid transparent",
    borderRadius:"xl",
    m:"1px",
    px:"3",
    height:"38px",
    _hover:{
      border: "1px",
      borderStyle: "solid",
      borderColor: "blue.400",
      backgroundColor: "gray.700",
    }
  }
});