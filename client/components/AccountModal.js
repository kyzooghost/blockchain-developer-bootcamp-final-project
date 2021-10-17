import {
    Box,
    Button,
    Flex,
    Link,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    useClipboard,
    chakra
  } from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useMetamask } from '../hooks/useMetamask'
import Identicon from "./Identicon";

export default function AccountModal({ isOpen, onClose }) {
    const { accounts, shortenAddress } = useMetamask();
    const { hasCopied, onCopy } = useClipboard(accounts[0])

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <UniswapModalContent>

          <UniswapModalHeader>
            Account
          </UniswapModalHeader>
          <UniswapModalCloseButton/>

          <ModalBody pt={0} px={4}>
            <UniswapModalBodyBox>

              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text color="gray.400" fontSize="sm">
                  Connected with MetaMask
                </Text>
              </Flex>

              <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
                <Identicon account={accounts[0]} />
                <UniswapModalAccountText>
                  {accounts[0] && shortenAddress(accounts[0])}
                </UniswapModalAccountText>
              </Flex>

              <Flex alignContent="center" m={3}>
              <CopyAddressButton variant="link" onClick={onCopy}>
                  <CopyIcon mr={1} />
                  {hasCopied ? "Copied!" : "Copy Address"}
                </CopyAddressButton>
                <ExplorerLink href={`https://rinkeby.etherscan.io/address/${accounts[0]}`} isExternal>
                  <ExternalLinkIcon mr={1} />
                  View on Explorer
                </ExplorerLink>
              </Flex>

            </UniswapModalBodyBox>
          </ModalBody>
  
        </UniswapModalContent>
      </Modal>
  )
}

/* Styled Chakra components */

const UniswapModalContent = chakra(ModalContent, {
  baseStyle: {
    background:"gray.900",
    border:"1px",
    borderStyle:"solid",
    borderColor:"gray.700",
    borderRadius:"3xl"
  }
});

const UniswapModalHeader = chakra(ModalHeader, {
  baseStyle: {
    color:"white",
    px:"4",
    fontSize:"lg",
    fontWeight:"medium"
  }
});

const UniswapModalCloseButton = chakra(ModalCloseButton, {
  baseStyle: {
    color:"white",
    fontSize:"sm",
    _hover:{
      color: "whiteAlpha.700",
    }
  }
});

const UniswapModalBodyBox = chakra(Box, {
  baseStyle: {
    borderRadius:"3xl",
    border:"1px",
    borderStyle:"solid",
    borderColor:"gray.600",
    px:"5",
    pt:"4",
    pb:"2",
    mb:"3"
  }
});

const UniswapModalAccountText = chakra(Text, {
  baseStyle: {
    color:"white",
    fontSize:"xl",
    fontWeight:"semibold",
    ml:"2",
    lineHeight:"1.1"
  }
});

const CopyAddressButton = chakra(Button, {
  baseStyle: {
    color:"gray.400",
    fontWeight:"normal",
    fontSize:"sm",
    _hover:{
      textDecoration: "none",
      color: "whiteAlpha.800",
    }
  }
});

const ExplorerLink = chakra(Link, {
  baseStyle: {
    fontSize: "sm",
    display: "flex",
    alignItems: "center",
    color:"gray.400",
    ml:"6",
    _hover: {
      color: "whiteAlpha.800",
      textDecoration: "underline",
    }
  }
});