import '../styles/globals.css'
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import Layout from "../components/Layout";
import ConnectButton from "../components/ConnectButton";
import AccountModal from "../components/AccountModal";

function MyApp({ Component, pageProps }) {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
      <ChakraProvider>
        <Layout>
          <ConnectButton handleOpenModal={onOpen}/>
          <AccountModal isOpen={isOpen} onClose={onClose} />
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
  )
}

export default MyApp
