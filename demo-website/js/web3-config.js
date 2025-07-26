// Web3 Configuration for Herita Platform Demo

// Contract configuration
const CONTRACT_CONFIG = {
    // Lisk Sepolia Testnet configuration
    NETWORK: {
        chainId: '0x106a', // 4202 in decimal (Lisk Sepolia)
        chainName: 'Lisk Sepolia Testnet',
        nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
        blockExplorerUrls: ['https://sepolia-blockscout.lisk.com']
    },
    
    // Contract address (you'll need to update this with your deployed contract address)
    CONTRACT_ADDRESS: '0x645DF960BA7627745cAFD3bF19fc6950fcCC9A36', // UPDATE THIS
    
    // Contract name and symbol
    CONTRACT_NAME: 'HERITA ESG Certification',
    CONTRACT_SYMBOL: 'HESG'
};

// Web3 state management
const Web3State = {
    provider: null,
    signer: null,
    contract: null,
    userAddress: null,
    isConnected: false,
    networkId: null
};

// Initialize Web3 connection
async function initWeb3() {
    console.log('Initializing Web3...');
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Create provider and signer
            Web3State.provider = new ethers.providers.Web3Provider(window.ethereum);
            Web3State.signer = Web3State.provider.getSigner();
            Web3State.userAddress = await Web3State.signer.getAddress();
            
            // Check network
            const network = await Web3State.provider.getNetwork();
            Web3State.networkId = network.chainId;
            
            // Check if we're on the correct network
            if (Web3State.networkId !== parseInt(CONTRACT_CONFIG.NETWORK.chainId, 16)) {
                await switchToLiskSepolia();
            }
            
            // Initialize contract
            if (CONTRACT_CONFIG.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
                Web3State.contract = new ethers.Contract(
                    CONTRACT_CONFIG.CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    Web3State.signer
                );
            }
            
            Web3State.isConnected = true;
            updateWalletUI();
            
            console.log('Web3 initialized successfully');
            console.log('User address:', Web3State.userAddress);
            console.log('Network ID:', Web3State.networkId);
            
            return true;
        } catch (error) {
            console.error('Error initializing Web3:', error);
            showAlert('Error connecting to wallet: ' + error.message, 'error');
            return false;
        }
    } else {
        showAlert('MetaMask is not installed. Please install MetaMask to use this demo.', 'warning');
        return false;
    }
}

// Switch to Lisk Sepolia network
async function switchToLiskSepolia() {
    try {
        // Try to switch to the network
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONTRACT_CONFIG.NETWORK.chainId }]
        });
    } catch (error) {
        // Network doesn't exist, add it
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [CONTRACT_CONFIG.NETWORK]
                });
            } catch (addError) {
                console.error('Error adding network:', addError);
                throw addError;
            }
        } else {
            console.error('Error switching network:', error);
            throw error;
        }
    }
}

// Update wallet UI
function updateWalletUI() {
    const connectButton = document.getElementById('connectWallet');
    const connectionStatus = document.getElementById('connectionStatus');
    
    if (Web3State.isConnected && Web3State.userAddress) {
        connectButton.textContent = `${Web3State.userAddress.substring(0, 6)}...${Web3State.userAddress.substring(38)}`;
        connectButton.className = 'bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm';
        connectionStatus.textContent = 'Connected';
        connectionStatus.className = 'status-connected';
        
        // Update wallet address fields
        document.getElementById('walletAddress').value = Web3State.userAddress;
        document.getElementById('recipientAddress').value = Web3State.userAddress;
    } else {
        connectButton.textContent = 'Connect Wallet';
        connectButton.className = 'bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm';
        connectionStatus.textContent = 'Not Connected';
        connectionStatus.className = 'status-disconnected';
    }
}

// Format Wei to ETH
function formatEther(wei) {
    return ethers.utils.formatEther(wei);
}

// Parse ETH to Wei
function parseEther(eth) {
    return ethers.utils.parseEther(eth.toString());
}

// Format address for display
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

// Get block explorer URL
function getBlockExplorerUrl(txHash) {
    return `${CONTRACT_CONFIG.NETWORK.blockExplorerUrls[0]}/tx/${txHash}`;
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertClass = {
        'success': 'alert-success',
        'warning': 'alert-warning',
        'error': 'alert-error',
        'info': 'bg-blue-100 border border-blue-400 text-blue-700'
    }[type];
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `${alertClass} px-4 py-3 rounded mb-4`;
    alertDiv.innerHTML = `
        <div class="flex justify-between items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg">&times;</button>
        </div>
    `;
    
    // Insert at the top of the use case container
    const container = document.getElementById('useCaseContainer');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            Web3State.isConnected = false;
            Web3State.userAddress = null;
        } else {
            Web3State.userAddress = accounts[0];
        }
        updateWalletUI();
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    });
}

// Export for use in other files
window.Web3State = Web3State;
window.CONTRACT_CONFIG = CONTRACT_CONFIG;
window.initWeb3 = initWeb3;
window.formatEther = formatEther;
window.parseEther = parseEther;
window.formatAddress = formatAddress;
window.getBlockExplorerUrl = getBlockExplorerUrl;
window.showAlert = showAlert;
