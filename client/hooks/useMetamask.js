import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useMetamask() {
    const [accounts, setAccounts] = useState([])
    const [chainID, setChainID] = useState()

    const [provider, setProvider] = useState(() => {
        if (isMetaMaskInstalled()) {
            return new ethers.providers.Web3Provider(window.ethereum, "any")
        }
    })

    const shortenAddress = (_address) => {
        if(ethers.utils.isAddress(_address)) {
            const shortenedAddress = _address.slice(0, 6) + "..." + _address.slice(_address.length - 4, _address.length)
            return shortenedAddress
        } else {
            throw TypeError("Invalid input, address can't be parsed")
        }
    }

    useEffect(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then((_accounts) => {setAccounts(_accounts)});

        window.ethereum.on('accountsChanged', (EmittedAccounts) => {
            setAccounts(EmittedAccounts)
            window.location.reload() //Reload window here - Don't want an error when prescriber switches to non-prescriber account, while in Prescriber view
            console.log("accountsChanged, emitted object:", EmittedAccounts)
        })

        return () => {window.ethereum.removeListener('accountsChanged', (EmittedAccounts) => {
            setAccounts(EmittedAccounts)
            console.log("REMOVE accountsChanged, emitted object:", EmittedAccounts)
        })}
    }, [])

    useEffect(() => {
        window.ethereum.request({ method: 'eth_chainId' }).then((_chainId) => {setChainID(_chainId)});

        window.ethereum.on('chainChanged', (EmittedChain) => {
            setChainID(EmittedChain)
            console.log("chainChanged, emitted object:", EmittedChain)
        })

        return () => {window.ethereum.removeListener('chainChanged', (EmittedChain) => {
            setChainID(EmittedChain)
            console.log("REMOVE chainChanged, emitted object:", EmittedChain)
        })}
    }, [])

    useEffect(() => {
        if(isMetaMaskInstalled()) {
            const web3provider = new ethers.providers.Web3Provider(window.ethereum, "any")
            setProvider(web3provider)
        }
    }, [])

    return { accounts, chainID, provider, shortenAddress }
}

function isMetaMaskInstalled () {
    if (typeof window !== "undefined") {
        return Boolean(window.ethereum && window.ethereum.isMetaMask)
    }
}