import abi from '../constants/abi'
import { ethers } from 'ethers';
import { useMetamask } from './useMetamask'
import { ADDRESS } from '../constants/chain_config'

export function usePharmacy() {
    const { provider } = useMetamask();

    // let pharmacyAddress = "0x40ab96e4612be5a1176F5F49787076DD79da0eba"
    const pharmacyContract = new ethers.Contract(ADDRESS, abi, provider)
    const pharmacyConnected = pharmacyContract.connect(provider.getSigner())
    
    return { pharmacyContract, pharmacyConnected }
}