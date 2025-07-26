// Main JavaScript for Herita Platform Demo
// Handles all UI interactions and blockchain operations

// Mock data for demo purposes
const MOCK_DATA = {
    businesses: {},
    projects: [
        {
            id: 'PROJ001',
            title: 'Restore Ancient Roman Theatre',
            location: 'Italy',
            description: 'Restore a 2000-year-old Roman theatre to preserve cultural heritage',
            targetAmount: 15000,
            category: 'monuments',
            urgency: 'high',
            impact: 'Historical preservation and tourist attraction'
        },
        {
            id: 'PROJ002',
            title: 'Maya Temple Conservation',
            location: 'Guatemala',
            description: 'Preserve ancient Maya temple complex from environmental damage',
            targetAmount: 25000,
            category: 'archaeology',
            urgency: 'urgent',
            impact: 'Archaeological research and cultural tourism'
        },
        {
            id: 'PROJ003',
            title: 'Medieval Castle Preservation',
            location: 'Scotland',
            description: 'Restore medieval castle walls and defensive structures',
            targetAmount: 40000,
            category: 'monuments',
            urgency: 'medium',
            impact: 'Cultural heritage and educational programs'
        },
        {
            id: 'PROJ004',
            title: 'Traditional Craft Center',
            location: 'Japan',
            description: 'Establish center to preserve traditional Japanese crafts',
            targetAmount: 8000,
            category: 'traditions',
            urgency: 'low',
            impact: 'Cultural continuity and artisan support'
        },
        {
            id: 'PROJ005',
            title: 'Archaeological Museum Upgrade',
            location: 'Egypt',
            description: 'Modernize museum displays and preservation facilities',
            targetAmount: 35000,
            category: 'museums',
            urgency: 'medium',
            impact: 'Education and artifact preservation'
        }
    ]
};

// Application state
const AppState = {
    currentUseCase: 'welcome',
    registeredBusiness: null,
    heritaScore: null,
    selectedProject: null,
    lastTransaction: null,
    mintedNFTs: []
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Herita Platform Demo loaded');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize with welcome screen
    showUseCase('welcome');
    
    // Auto-fill wallet address if already connected
    if (Web3State.isConnected) {
        updateWalletUI();
    }
});

// Set up all event listeners
function setupEventListeners() {
    // Wallet connection
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Use case forms
    document.getElementById('businessForm').addEventListener('submit', handleBusinessRegistration);
    document.getElementById('evaluationForm').addEventListener('submit', handleBusinessEvaluation);
    document.getElementById('suggestionsForm').addEventListener('submit', handleProjectSuggestions);
    document.getElementById('sponsorshipForm').addEventListener('submit', handleSponsorship);
    document.getElementById('mintForm').addEventListener('submit', handleNFTMinting);
    document.getElementById('verificationForm').addEventListener('submit', handleNFTVerification);
    
    // Verification method change
    document.getElementById('verificationMethod').addEventListener('change', handleVerificationMethodChange);
    
    // Project selection change
    document.getElementById('projectSelect').addEventListener('change', handleProjectSelection);
}

// Connect wallet
async function connectWallet() {
    const success = await initWeb3();
    if (success) {
        showAlert('Wallet connected successfully!', 'success');
    }
}

// Show specific use case section
function showUseCase(useCase) {
    // Hide all sections
    const sections = ['welcome', 'register', 'evaluate', 'suggestions', 'sponsor', 'mint', 'verify'];
    sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(useCase).classList.remove('hidden');
    AppState.currentUseCase = useCase;
    
    // Update any section-specific data
    if (useCase === 'mint' && Web3State.isConnected) {
        document.getElementById('recipientAddress').value = Web3State.userAddress;
    }
}

// UC01: Handle business registration
function handleBusinessRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const businessData = {
        name: formData.get('businessName') || document.getElementById('businessName').value,
        id: formData.get('businessId') || document.getElementById('businessId').value,
        industry: document.getElementById('industry').value,
        size: document.getElementById('companySize').value,
        walletAddress: Web3State.userAddress
    };
    
    // Validate required fields
    if (!businessData.name || !businessData.id) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    if (!Web3State.isConnected) {
        showAlert('Please connect your wallet first', 'warning');
        return;
    }
    
    // Store business data
    MOCK_DATA.businesses[businessData.id] = businessData;
    AppState.registeredBusiness = businessData;
    
    // Show success message
    document.getElementById('registrationResult').classList.remove('hidden');
    showAlert(`Business "${businessData.name}" registered successfully with ID: ${businessData.id}`, 'success');
    
    // Pre-fill enterprise ID in other forms
    document.getElementById('enterpriseId').value = businessData.id;
    document.getElementById('mintEnterpriseId').value = businessData.id;
    
    console.log('Business registered:', businessData);
}

// UC02: Handle business evaluation
function handleBusinessEvaluation(event) {
    event.preventDefault();
    
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    const esgInitiatives = parseInt(document.getElementById('esgInitiatives').value) || 0;
    const sustainabilityBudget = parseFloat(document.getElementById('sustainabilityBudget').value) || 0;
    const heritageInterest = parseInt(document.getElementById('heritageInterest').value) || 1;
    
    // Calculate HeritaScore using a simple algorithm
    const heritaScore = calculateHeritaScore(revenue, esgInitiatives, sustainabilityBudget, heritageInterest);
    
    // Store score
    AppState.heritaScore = heritaScore;
    
    // Display results
    displayHeritaScore(heritaScore, revenue, esgInitiatives, sustainabilityBudget, heritageInterest);
}

// Calculate HeritaScore based on inputs
function calculateHeritaScore(revenue, esgInitiatives, sustainabilityBudget, heritageInterest) {
    let score = 0;
    
    // Revenue factor (0-30 points)
    if (revenue > 10000000) score += 30;
    else if (revenue > 1000000) score += 25;
    else if (revenue > 100000) score += 20;
    else if (revenue > 10000) score += 15;
    else score += 10;
    
    // ESG initiatives factor (0-25 points)
    score += esgInitiatives * 8;
    
    // Sustainability budget factor (0-25 points)
    if (sustainabilityBudget > 5) score += 25;
    else if (sustainabilityBudget > 2) score += 20;
    else if (sustainabilityBudget > 1) score += 15;
    else if (sustainabilityBudget > 0.5) score += 10;
    else score += 5;
    
    // Heritage interest factor (0-20 points)
    score += heritageInterest * 5;
    
    return Math.min(Math.max(score, 0), 100); // Cap between 0-100
}

// Display HeritaScore results
function displayHeritaScore(score, revenue, esgInitiatives, sustainabilityBudget, heritageInterest) {
    document.getElementById('scoreResult').classList.remove('hidden');
    document.getElementById('scoreDisplay').textContent = score;
    
    // Generate score breakdown
    const breakdown = document.getElementById('scoreBreakdown');
    breakdown.innerHTML = `
        <div>💰 Financial Capacity: ${revenue > 1000000 ? 'Strong' : revenue > 100000 ? 'Good' : 'Moderate'}</div>
        <div>📊 Current ESG Programs: ${esgInitiatives === 0 ? 'None' : esgInitiatives === 1 ? 'Minimal' : esgInitiatives === 2 ? 'Moderate' : 'Extensive'}</div>
        <div>🌱 Sustainability Focus: ${sustainabilityBudget}% of revenue</div>
        <div>🏛️ Heritage Interest: ${heritageInterest === 1 ? 'Low' : heritageInterest === 2 ? 'Medium' : heritageInterest === 3 ? 'High' : 'Very High'}</div>
    `;
    
    // Generate recommendations
    const recommendations = document.getElementById('recommendations');
    let recText = '';
    if (score < 40) {
        recText = 'Consider starting with smaller heritage projects to build your ESG portfolio.';
    } else if (score < 70) {
        recText = 'You have good potential. Try medium-scale heritage projects for optimal impact.';
    } else {
        recText = 'Excellent! You can support major heritage projects for maximum ESG impact.';
    }
    recommendations.textContent = recText;
}

// UC03: Handle project suggestions
function handleProjectSuggestions(event) {
    event.preventDefault();
    
    const budget = parseInt(document.getElementById('budgetRange').value);
    const geography = document.getElementById('geography').value;
    const projectTypes = Array.from(document.querySelectorAll('.project-type:checked')).map(cb => cb.value);
    
    // Show loading
    document.getElementById('loadingSuggestions').classList.remove('hidden');
    document.getElementById('projectSuggestions').classList.add('hidden');
    
    // Simulate AI processing delay
    setTimeout(() => {
        const suggestions = generateProjectSuggestions(budget, geography, projectTypes);
        displayProjectSuggestions(suggestions);
        
        document.getElementById('loadingSuggestions').classList.add('hidden');
        document.getElementById('projectSuggestions').classList.remove('hidden');
    }, 2000);
}

// Generate AI project suggestions
function generateProjectSuggestions(budget, geography, projectTypes) {
    let filteredProjects = MOCK_DATA.projects.filter(project => {
        // Filter by budget
        if (project.targetAmount > budget * 1.5) return false;
        
        // Filter by project type if specified
        if (projectTypes.length > 0 && !projectTypes.includes(project.category)) return false;
        
        return true;
    });
    
    // Sort by relevance (mock AI scoring)
    filteredProjects = filteredProjects.map(project => ({
        ...project,
        aiScore: Math.random() * 100,
        match: Math.floor(Math.random() * 30 + 70) // 70-100% match
    })).sort((a, b) => b.aiScore - a.aiScore);
    
    return filteredProjects.slice(0, 3); // Return top 3 suggestions
}

// Display project suggestions
function displayProjectSuggestions(suggestions) {
    const container = document.getElementById('projectSuggestions');
    
    if (suggestions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">No projects match your criteria. Try adjusting your preferences.</p>';
        return;
    }
    
    container.innerHTML = suggestions.map(project => `
        <div class="project-card border rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-900">${project.title}</h4>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${project.match}% Match</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">📍 ${project.location}</p>
            <p class="text-sm text-gray-700 mb-3">${project.description}</p>
            <div class="flex justify-between items-center text-sm">
                <span class="text-blue-600 font-medium">$${project.targetAmount.toLocaleString()}</span>
                <button onclick="selectProject('${project.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                    Select Project
                </button>
            </div>
        </div>
    `).join('');
}

// Select a project for sponsorship
function selectProject(projectId) {
    const project = MOCK_DATA.projects.find(p => p.id === projectId);
    if (project) {
        AppState.selectedProject = project;
        document.getElementById('projectSelect').value = projectId;
        
        // Show selected project details
        document.getElementById('selectedProject').classList.remove('hidden');
        document.getElementById('projectDetails').innerHTML = `
            <strong>${project.title}</strong><br>
            📍 ${project.location} | 💰 $${project.targetAmount.toLocaleString()}<br>
            ${project.description}
        `;
        
        // Switch to sponsor tab
        showUseCase('sponsor');
        showAlert('Project selected! You can now proceed with sponsorship.', 'success');
    }
}

// Handle project selection change
function handleProjectSelection(event) {
    const projectId = event.target.value;
    if (projectId) {
        selectProject(projectId);
    } else {
        document.getElementById('selectedProject').classList.add('hidden');
    }
}

// UC04: Handle sponsorship
async function handleSponsorship(event) {
    event.preventDefault();
    
    if (!Web3State.isConnected) {
        showAlert('Please connect your wallet first', 'warning');
        return;
    }
    
    const projectId = document.getElementById('projectSelect').value;
    const amount = parseFloat(document.getElementById('sponsorAmount').value);
    const enterpriseId = document.getElementById('enterpriseId').value;
    
    if (!projectId || !amount || !enterpriseId) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    if (amount < 0.001) {
        showAlert('Minimum sponsorship amount is 0.001 ETH', 'error');
        return;
    }
    
    try {
        // Check if we have a real contract deployed
        if (Web3State.contract && CONTRACT_CONFIG.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
            // Real blockchain sponsorship transaction
            showAlert('Initiating real sponsorship transaction on Lisk Sepolia testnet...', 'info');
            
            const amountWei = parseEther(amount);
            
            // Check balance first
            const balance = await Web3State.provider.getBalance(Web3State.userAddress);
            if (balance.lt(amountWei)) {
                showAlert(`Insufficient balance. You need at least ${amount} ETH. Current balance: ${formatEther(balance)} ETH`, 'error');
                return;
            }
            
            // Real blockchain sponsorship using new sponsor function (if available)
            showAlert(`Sponsoring project ${projectId} with ${amount} ETH...`, 'info');
            
            let tx, receipt;
            
            try {
                // Check if the contract has the sponsor function
                if (Web3State.contract.sponsor) {
                    // Use new sponsor function
                    const gasEstimate = await Web3State.contract.estimateGas.sponsor(enterpriseId, projectId, {
                        value: amountWei
                    });
                    
                    console.log(`Gas estimate for sponsor function: ${gasEstimate.toString()}`);
                    
                    const gasLimit = gasEstimate.mul(120).div(100);
                    
                    showAlert('📝 Please confirm the sponsorship transaction in your wallet...', 'info');
                    
                    tx = await Web3State.contract.sponsor(enterpriseId, projectId, {
                        value: amountWei,
                        gasLimit: gasLimit
                    });
                } else {
                    // Fallback: direct ETH transfer to contract
                    showAlert('⚠️ Contract does not have sponsor function, sending ETH directly...', 'warning');
                    
                    tx = await Web3State.signer.sendTransaction({
                        to: CONTRACT_CONFIG.CONTRACT_ADDRESS,
                        value: amountWei,
                        gasLimit: 25000
                    });
                }
                
                showAlert('Transaction submitted! Waiting for confirmation...', 'info');
                receipt = await tx.wait();
                
            } catch (error) {
                if (error.message.includes('sponsor is not a function')) {
                    // Contract doesn't have sponsor function, use direct transfer
                    showAlert('⚠️ Using direct ETH transfer (contract has no sponsor function)...', 'warning');
                    
                    tx = await Web3State.signer.sendTransaction({
                        to: CONTRACT_CONFIG.CONTRACT_ADDRESS,
                        value: amountWei,
                        gasLimit: 25000
                    });
                    
                    showAlert('Transaction submitted! Waiting for confirmation...', 'info');
                    receipt = await tx.wait();
                } else {
                    throw error;
                }
            }
            
            AppState.lastTransaction = {
                projectId,
                amount: amountWei,
                enterpriseId,
                txHash: receipt.transactionHash,
                timestamp: Date.now(),
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString()
            };
            
            // Show success with real transaction details
            document.getElementById('sponsorshipResult').classList.remove('hidden');
            
            // Check if we used the sponsor function or direct transfer
            const hasActualSponsorFunction = Web3State.contract.sponsor !== undefined;
            
            document.getElementById('transactionDetails').innerHTML = `
                <div><strong>✅ Sponsorship Transaction Hash:</strong> <a href="${getBlockExplorerUrl(receipt.transactionHash)}" target="_blank" class="text-blue-600 hover:underline">${receipt.transactionHash.substring(0, 10)}...</a></div>
                <div><strong>Amount:</strong> ${amount} ETH</div>
                <div><strong>Project:</strong> ${projectId}</div>
                <div><strong>Enterprise:</strong> ${enterpriseId}</div>
                <div><strong>Block Number:</strong> ${receipt.blockNumber}</div>
                <div><strong>Gas Used:</strong> ${receipt.gasUsed.toString()}</div>
                <div><strong>Network:</strong> Lisk Sepolia Testnet</div>
                <div><strong>Contract:</strong> ${CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(0, 10)}...${CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(-8)}</div>
                <div><strong>Status:</strong> ${hasActualSponsorFunction ? '✅ Sponsorship recorded via contract function' : '📤 ETH sent to contract'}</div>
            `;
            
            showAlert(`✅ Real sponsorship confirmed! ETH sent to contract${hasActualSponsorFunction ? ' and sponsorship recorded' : ''}. You can now mint your ESG NFT.`, 'success');
            
        } else {
            // Fallback to simulation mode
            showAlert('⚠️ Contract not deployed - using simulation mode', 'warning');
            
            const amountWei = parseEther(amount);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const txHash = '0x' + Math.random().toString(16).substring(2, 66);
            
            AppState.lastTransaction = {
                projectId,
                amount: amountWei,
                enterpriseId,
                txHash,
                timestamp: Date.now()
            };
            
            document.getElementById('sponsorshipResult').classList.remove('hidden');
            document.getElementById('transactionDetails').innerHTML = `
                <div><strong>🔬 Simulated Transaction Hash:</strong> <span class="text-orange-600">${txHash.substring(0, 10)}...</span></div>
                <div><strong>Amount:</strong> ${amount} ETH</div>
                <div><strong>Project:</strong> ${projectId}</div>
                <div><strong>Enterprise:</strong> ${enterpriseId}</div>
                <div class="text-orange-600 text-sm mt-2">⚠️ This is a simulation. Deploy the contract for real transactions.</div>
            `;
            
            showAlert('Sponsorship simulation completed! You can now mint your ESG NFT.', 'success');
        }
        
        // Pre-fill mint form
        document.getElementById('mintEnterpriseId').value = enterpriseId;
        document.getElementById('mintProjectId').value = projectId;
        document.getElementById('mintAmount').value = AppState.lastTransaction.amount.toString();
        
    } catch (error) {
        console.error('Sponsorship error:', error);
        if (error.code === 4001) {
            showAlert('Transaction rejected by user', 'warning');
        } else if (error.code === -32603) {
            showAlert('Internal JSON-RPC error. Please check your network connection and try again.', 'error');
        } else {
            showAlert('Sponsorship failed: ' + error.message, 'error');
        }
    }
}

// UC05: Handle NFT minting
async function handleNFTMinting(event) {
    event.preventDefault();
    
    if (!Web3State.isConnected) {
        showAlert('Please connect your wallet first', 'warning');
        return;
    }
    
    const recipientAddress = document.getElementById('recipientAddress').value;
    const enterpriseId = document.getElementById('mintEnterpriseId').value;
    const projectId = document.getElementById('mintProjectId').value;
    const amount = document.getElementById('mintAmount').value;
    const esgScore = parseInt(document.getElementById('mintEsgScore').value);
    
    if (!recipientAddress || !enterpriseId || !projectId || !amount || !esgScore) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    if (esgScore < 0 || esgScore > 100) {
        showAlert('ESG score must be between 0 and 100', 'error');
        return;
    }
    
    try {
        if (Web3State.contract && CONTRACT_CONFIG.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
            // Real blockchain NFT minting
            showAlert('🎖️ Minting ESG NFT on Lisk Sepolia testnet...', 'info');
            
            // Check if user is the contract owner (for demo purposes, anyone can mint)
            try {
                const contractOwner = await Web3State.contract.owner();
                console.log('Contract owner:', contractOwner);
                console.log('Current user:', Web3State.userAddress);
                
                if (contractOwner.toLowerCase() !== Web3State.userAddress.toLowerCase()) {
                    showAlert('⚠️ Note: You are not the contract owner. This transaction may fail if the contract restricts minting.', 'warning');
                }
            } catch (error) {
                console.log('Could not check contract owner:', error);
            }
            
            // Estimate gas before transaction
            try {
                const gasEstimate = await Web3State.contract.estimateGas.issueESGCertification(
                    recipientAddress,
                    enterpriseId,
                    projectId,
                    amount,
                    esgScore
                );
                console.log('Estimated gas:', gasEstimate.toString());
                showAlert(`Estimated gas: ${gasEstimate.toString()} units`, 'info');
            } catch (gasError) {
                console.error('Gas estimation failed:', gasError);
                showAlert('Gas estimation failed. Transaction may fail: ' + gasError.message, 'warning');
            }
            
            // Execute the real minting transaction
            const tx = await Web3State.contract.issueESGCertification(
                recipientAddress,
                enterpriseId,
                projectId,
                amount,
                esgScore
            );
            
            showAlert('Transaction submitted! Waiting for confirmation...', 'info');
            console.log('Transaction hash:', tx.hash);
            
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            
            // Get token ID from event logs
            const event = receipt.events?.find(e => e.event === 'ESGCertificationIssued');
            const tokenId = event?.args?.tokenId?.toString();
            
            if (tokenId) {
                showAlert(`✅ ESG NFT #${tokenId} minted successfully on testnet!`, 'success');
                displayMintingSuccess(tokenId, enterpriseId, projectId, amount, esgScore, receipt.transactionHash, receipt);
            } else {
                showAlert('⚠️ Transaction succeeded but could not extract token ID from events', 'warning');
                displayMintingSuccess('Unknown', enterpriseId, projectId, amount, esgScore, receipt.transactionHash, receipt);
            }
            
        } else {
            // Fallback to mock minting
            showAlert('⚠️ Contract not available - using simulation mode', 'warning');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockTokenId = Math.floor(Math.random() * 1000) + 1;
            const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
            
            showAlert(`🔬 Simulated ESG NFT #${mockTokenId} minted!`, 'success');
            displayMintingSuccess(mockTokenId, enterpriseId, projectId, amount, esgScore, mockTxHash);
        }
        
    } catch (error) {
        console.error('Minting error:', error);
        
        // Enhanced error handling for common Web3 errors
        if (error.code === 4001) {
            showAlert('Transaction rejected by user', 'warning');
        } else if (error.code === -32603) {
            showAlert('Internal JSON-RPC error. Please check your network connection.', 'error');
        } else if (error.message.includes('insufficient funds')) {
            showAlert('Insufficient funds for gas fees. Please add some ETH to your wallet.', 'error');
        } else if (error.message.includes('nonce too low')) {
            showAlert('Nonce too low. Please try resetting your MetaMask account or wait for pending transactions.', 'error');
        } else if (error.message.includes('gas required exceeds allowance')) {
            showAlert('Transaction would exceed gas limit. Try reducing the transaction complexity.', 'error');
        } else if (error.message.includes('revert')) {
            showAlert('Transaction reverted. This may be due to contract restrictions or invalid parameters: ' + error.message, 'error');
        } else {
            showAlert('Minting failed: ' + error.message, 'error');
        }
    }
}

// Display minting success
function displayMintingSuccess(tokenId, enterpriseId, projectId, amount, esgScore, txHash, receipt = null) {
    document.getElementById('mintingResult').classList.remove('hidden');
    
    const nftData = {
        tokenId,
        enterpriseId,
        projectId,
        amount,
        esgScore,
        txHash,
        timestamp: Date.now(),
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        isReal: !!receipt
    };
    
    AppState.mintedNFTs.push(nftData);
    
    let additionalDetails = '';
    if (receipt) {
        additionalDetails = `
            <div><strong>Block Number:</strong> ${receipt.blockNumber}</div>
            <div><strong>Gas Used:</strong> ${receipt.gasUsed.toString()}</div>
            <div><strong>Network:</strong> Lisk Sepolia Testnet</div>
            <div><strong>Status:</strong> ✅ Real Transaction</div>
        `;
    } else {
        additionalDetails = `
            <div><strong>Status:</strong> 🔬 Simulation Mode</div>
        `;
    }
    
    document.getElementById('nftDetails').innerHTML = `
        <div class="nft-certificate">
            <div class="text-center mb-4">
                <h4 class="text-lg font-bold text-gray-900">🎖️ ESG CERTIFICATION NFT</h4>
                <div class="text-sm text-gray-600">Token ID: #${tokenId}</div>
                ${receipt ? '<div class="text-xs text-green-600 font-semibold">✅ REAL BLOCKCHAIN TRANSACTION</div>' : '<div class="text-xs text-orange-600 font-semibold">🔬 SIMULATION</div>'}
            </div>
            <div class="space-y-2 text-sm">
                <div><strong>Enterprise:</strong> ${enterpriseId}</div>
                <div><strong>Project:</strong> ${projectId}</div>
                <div><strong>Amount:</strong> ${typeof amount === 'string' ? formatEther(amount) : amount} ETH</div>
                <div><strong>ESG Score:</strong> ${esgScore}/100</div>
                <div><strong>Timestamp:</strong> ${new Date().toLocaleString()}</div>
                <div><strong>Transaction:</strong> <a href="${getBlockExplorerUrl(txHash)}" target="_blank" class="text-blue-600 hover:underline">${txHash.substring(0, 10)}...</a></div>
                ${additionalDetails}
            </div>
        </div>
    `;
    
    showAlert(`ESG NFT #${tokenId} ${receipt ? 'minted successfully on testnet' : 'simulated'}!`, 'success');
}

// Handle verification method change
function handleVerificationMethodChange(event) {
    const method = event.target.value;
    
    // Hide all input fields
    document.getElementById('enterpriseIdInput').classList.add('hidden');
    document.getElementById('tokenIdInput').classList.add('hidden');
    document.getElementById('walletAddressInput').classList.add('hidden');
    
    // Show selected input field
    document.getElementById(method + 'Input').classList.remove('hidden');
}

// UC06: Handle NFT verification
async function handleNFTVerification(event) {
    event.preventDefault();
    
    const method = document.getElementById('verificationMethod').value;
    let searchValue;
    
    switch (method) {
        case 'enterpriseId':
            searchValue = document.getElementById('verifyEnterpriseId').value;
            break;
        case 'tokenId':
            searchValue = document.getElementById('verifyTokenId').value;
            break;
        case 'walletAddress':
            searchValue = document.getElementById('verifyWalletAddress').value;
            break;
    }
    
    if (!searchValue) {
        showAlert('Please enter a value to verify', 'error');
        return;
    }
    
    try {
        showAlert('🔍 Verifying ESG NFT on blockchain...', 'info');
        
        let verificationResults = [];
        
        if (Web3State.contract && CONTRACT_CONFIG.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
            // Real blockchain verification
            console.log(`Verifying ${method}: ${searchValue}`);
            
            if (method === 'enterpriseId') {
                try {
                    const tokenIds = await Web3State.contract.getESGNFTByEnterprise(searchValue);
                    console.log('Found token IDs:', tokenIds);
                    
                    for (let tokenId of tokenIds) {
                        try {
                            const certData = await Web3State.contract.getCertificationData(tokenId);
                            console.log(`Token ${tokenId} data:`, certData);
                            
                            verificationResults.push({
                                tokenId: tokenId.toString(),
                                enterpriseId: certData.enterpriseId,
                                projectId: certData.projectId,
                                amount: certData.amount.toString(),
                                timestamp: certData.timestamp.toNumber(),
                                esgScore: certData.esgScore.toNumber(),
                                verified: certData.verified,
                                isReal: true
                            });
                        } catch (tokenError) {
                            console.error(`Error getting data for token ${tokenId}:`, tokenError);
                        }
                    }
                } catch (error) {
                    console.error('Error getting NFTs by enterprise:', error);
                    showAlert('No NFTs found for this enterprise ID on the blockchain', 'warning');
                }
            } else if (method === 'tokenId') {
                try {
                    const certData = await Web3State.contract.getCertificationData(searchValue);
                    console.log(`Token ${searchValue} data:`, certData);
                    
                    verificationResults.push({
                        tokenId: searchValue,
                        enterpriseId: certData.enterpriseId,
                        projectId: certData.projectId,
                        amount: certData.amount.toString(),
                        timestamp: certData.timestamp.toNumber(),
                        esgScore: certData.esgScore.toNumber(),
                        verified: certData.verified,
                        isReal: true
                    });
                } catch (error) {
                    console.error('Error getting certification data:', error);
                    showAlert('Token ID not found on the blockchain', 'warning');
                }
            } else if (method === 'walletAddress') {
                try {
                    // Get balance of tokens for this address
                    const balance = await Web3State.contract.balanceOf(searchValue);
                    console.log(`Address ${searchValue} has ${balance} NFTs`);
                    
                    for (let i = 0; i < balance.toNumber(); i++) {
                        try {
                            const tokenId = await Web3State.contract.tokenOfOwnerByIndex(searchValue, i);
                            const certData = await Web3State.contract.getCertificationData(tokenId);
                            
                            verificationResults.push({
                                tokenId: tokenId.toString(),
                                enterpriseId: certData.enterpriseId,
                                projectId: certData.projectId,
                                amount: certData.amount.toString(),
                                timestamp: certData.timestamp.toNumber(),
                                esgScore: certData.esgScore.toNumber(),
                                verified: certData.verified,
                                isReal: true
                            });
                        } catch (tokenError) {
                            console.error(`Error getting token at index ${i}:`, tokenError);
                        }
                    }
                } catch (error) {
                    console.error('Error getting NFTs by wallet address:', error);
                    showAlert('No NFTs found for this wallet address on the blockchain', 'warning');
                }
            }
            
            if (verificationResults.length > 0) {
                showAlert(`✅ Found ${verificationResults.length} NFT(s) on blockchain!`, 'success');
            }
            
        } else {
            // Fallback to mock verification
            showAlert('⚠️ Contract not available - using local data', 'warning');
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate mock results based on minted NFTs or create sample data
            if (method === 'enterpriseId') {
                verificationResults = AppState.mintedNFTs.filter(nft => nft.enterpriseId === searchValue);
            } else if (method === 'tokenId') {
                verificationResults = AppState.mintedNFTs.filter(nft => nft.tokenId.toString() === searchValue);
            } else {
                verificationResults = AppState.mintedNFTs; // For demo purposes
            }
            
            // Add sample data if no results
            if (verificationResults.length === 0 && method === 'enterpriseId' && searchValue === 'COMP001') {
                verificationResults = [{
                    tokenId: '42',
                    enterpriseId: 'COMP001',
                    projectId: 'PROJ001',
                    amount: '1000000000000000',
                    esgScore: 75,
                    verified: true,
                    timestamp: Date.now() - 86400000,
                    isReal: false
                }];
            }
        }
        
        displayVerificationResults(verificationResults, method, searchValue);
        
    } catch (error) {
        console.error('Verification error:', error);
        showAlert('Verification failed: ' + error.message, 'error');
        document.getElementById('noResults').classList.remove('hidden');
        document.getElementById('verificationResults').classList.add('hidden');
    }
}

// Display verification results
function displayVerificationResults(results, method, searchValue) {
    const resultsContainer = document.getElementById('verificationResults');
    const noResults = document.getElementById('noResults');
    
    if (results.length === 0) {
        const isRealContract = Web3State.contract && CONTRACT_CONFIG.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
        noResults.innerHTML = `
            <div class="text-center py-4">
                <div class="text-4xl mb-2">🔍</div>
                <p class="text-gray-600">No ESG NFTs found for ${method}: <strong>${searchValue}</strong></p>
                ${!isRealContract ? 
                    '<p class="text-sm text-orange-500 mt-2">⚠️ Contract not connected - try minting an NFT first!</p>' : 
                    '<p class="text-sm text-blue-500 mt-2">Try a different search term or mint some NFTs first</p>'
                }
            </div>
        `;
        noResults.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    
    const isRealData = results[0]?.isReal;
    
    resultsContainer.innerHTML = `
        <div class="mb-4">
            <h4 class="font-semibold text-green-900 mb-2">✅ Verification Successful</h4>
            <p class="text-sm text-gray-600 mb-2">Found ${results.length} ESG NFT${results.length > 1 ? 's' : ''} for ${method}: <strong>${searchValue}</strong></p>
            ${isRealData ? 
                '<p class="text-xs text-green-600 font-medium">✓ Verified on Lisk Sepolia Testnet</p>' : 
                '<p class="text-xs text-orange-500">⚠️ Local data (contract not connected)</p>'
            }
        </div>
        <div class="space-y-4">
            ${results.map(result => `
                <div class="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h5 class="font-semibold text-gray-900">NFT #${result.tokenId}</h5>
                            <div class="flex items-center mt-1 space-x-2">
                                <span class="text-xs px-2 py-1 rounded ${result.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                    ${result.verified ? '✅ Verified' : '⏳ Pending'}
                                </span>
                                ${result.isReal ? 
                                    '<span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">🔗 On-chain</span>' :
                                    '<span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">📱 Local</span>'
                                }
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-xl font-bold text-blue-600">${result.esgScore}/100</div>
                            <div class="text-xs text-gray-500">ESG Score</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Enterprise:</strong> ${result.enterpriseId}</div>
                        <div><strong>Project:</strong> ${result.projectId}</div>
                        <div><strong>Amount:</strong> ${typeof result.amount === 'string' ? (parseFloat(result.amount) / 1000000000000000).toFixed(4) : result.amount} ETH</div>
                        <div><strong>Date:</strong> ${new Date((result.timestamp * 1000) || result.timestamp).toLocaleDateString()}</div>
                    </div>
                    
                    ${result.isReal ? `
                        <div class="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                            <h6 class="text-xs font-medium text-blue-800 mb-1">🔗 Blockchain Details</h6>
                            <div class="text-xs text-blue-600 space-y-0.5">
                                <div>Network: Lisk Sepolia Testnet</div>
                                <div>Contract: ${CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(0, 10)}...${CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(-8)}</div>
                                <div>Token ID: ${result.tokenId}</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h5 class="font-medium text-blue-900 mb-1">🏦 Bank Verification Summary</h5>
            <p class="text-sm text-blue-800">
                ${isRealData ? 'All displayed NFTs are authentic blockchain records from Lisk Sepolia testnet.' : 'Displaying local/mock data for demonstration purposes.'}
                Total ESG contribution: ${results.reduce((sum, r) => sum + (r.esgScore || 0), 0)} points across ${results.length} project${results.length > 1 ? 's' : ''}.
                ${isRealData ? `<br><span class="font-medium">✓ Blockchain Verified</span>` : '<br><span class="text-orange-600">Connect wallet for real verification</span>'}
            </p>
        </div>
    `;
}

// Helper function to check wallet balance and provide testnet guidance
async function checkWalletBalance() {
    if (!Web3State.provider || !Web3State.account) {
        return { hasBalance: false, balance: '0', needsSetup: true };
    }
    
    try {
        const balance = await Web3State.provider.getBalance(Web3State.account);
        const balanceInEth = parseFloat(ethers.utils.formatEther(balance));
        
        return {
            hasBalance: balanceInEth > 0.001, // Need at least 0.001 ETH for transactions
            balance: balanceInEth.toFixed(6),
            needsSetup: balanceInEth === 0
        };
    } catch (error) {
        console.error('Error checking balance:', error);
        return { hasBalance: false, balance: '0', needsSetup: true };
    }
}

// Show testnet setup guidance
function showTestnetGuidance() {
    showAlert(`
        <div class="text-left">
            <h4 class="font-bold text-blue-800 mb-2">🚀 Setup for Testnet Testing</h4>
            <ol class="text-sm space-y-1 mb-3">
                <li><strong>1.</strong> Connect your wallet (MetaMask)</li>
                <li><strong>2.</strong> Switch to Lisk Sepolia Testnet</li>
                <li><strong>3.</strong> Get test ETH from: <a href="https://sepolia-faucet.lisk.com/" target="_blank" class="text-blue-600 underline">Lisk Sepolia Faucet</a></li>
                <li><strong>4.</strong> Wait for test ETH to arrive (~1-2 minutes)</li>
                <li><strong>5.</strong> Try sponsoring or minting again!</li>
            </ol>
            <p class="text-xs text-gray-600">Network: Lisk Sepolia (Chain ID: 4202)</p>
        </div>
    `, 'info', 8000);
}

// Utility function to make functions globally available
window.showUseCase = showUseCase;
window.selectProject = selectProject;

console.log('Herita Platform Demo JavaScript loaded successfully');
