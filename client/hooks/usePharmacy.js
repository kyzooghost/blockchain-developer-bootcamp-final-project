import abi from '../constants/abi'
import { ethers } from 'ethers';
import { useMetamask } from './useMetamask'
import { ADDRESS } from '../constants/chain_config'

export function usePharmacy() {
    const { provider } = useMetamask();
    const pharmacyContract = new ethers.Contract(ADDRESS, abi, provider)
    const pharmacyConnected = pharmacyContract.connect(provider.getSigner())
    return { pharmacyContract, pharmacyConnected }
}