# Herita Platform Demo Website

A comprehensive demo website showcasing the Herita platform's ESG blockchain functionality for cultural heritage project sponsorship.

## 🎯 Overview

The Herita platform enables businesses to increase their ESG scores by sponsoring cultural heritage projects and receiving blockchain-verified NFT certifications. This demo implements all 6 core use cases:

1. **UC01 - Register Business**: Business registration and profile creation
2. **UC02 - Evaluate & Score Business**: HeritaScore calculation based on financial data
3. **UC03 - AI Co-pilot for Project Suggestions**: AI-powered heritage project recommendations
4. **UC04 - Sponsor Heritage Project**: Project sponsorship with blockchain transactions
5. **UC05 - Mint ESG NFT**: Blockchain-verified ESG contribution certificates
6. **UC06 - Verify NFT via HeritaBank**: Bank verification of ESG NFT authenticity

## 📁 File Structure

```
demo-website/
├── index.html                 # Main demo page with all use cases
├── css/
│   └── style.css             # Custom styling and animations
├── js/
│   ├── web3-config.js        # Web3 configuration and wallet connection
│   ├── contract-abi.js       # Smart contract ABI definition
│   └── main.js               # Main application logic and UI interactions
├── assets/                   # Static assets (images, icons)
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

1. **MetaMask Wallet**: Install MetaMask browser extension
2. **Test ETH**: Get testnet ETH from Lisk Sepolia faucet
3. **Modern Browser**: Chrome, Firefox, or Edge with Web3 support

### Setup Instructions

1. **Clone or Download** the demo files to your local machine

2. **Update Contract Address** in `js/web3-config.js`:
   ```javascript
   CONTRACT_ADDRESS: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'
   ```

3. **Serve the Files** using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using VS Code Live Server extension
   Right-click index.html -> "Open with Live Server"
   ```

4. **Open in Browser**: Navigate to `http://localhost:8000`

5. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection

6. **Switch Network**: The app will automatically prompt to switch to Lisk Sepolia testnet

## 🔧 Configuration

### Network Configuration

The demo is configured for **Lisk Sepolia Testnet**:
- **Chain ID**: 4202 (0x106a)
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Explorer**: https://sepolia-blockscout.lisk.com

### Smart Contract

Update the contract address in `js/web3-config.js` with your deployed HeritaESG contract:

```javascript
const CONTRACT_CONFIG = {
    CONTRACT_ADDRESS: '0x...', // Your contract address
    // ... other config
};
```

## 🎮 Demo Flow & Use Cases

### UC01: Business Registration
1. Navigate to "Register Business" section
2. Fill in company details (name, ID, industry, size)
3. Ensure wallet is connected (address auto-filled)
4. Submit registration
5. Business ID will be used across other use cases

### UC02: Business Evaluation
1. Go to "Evaluate & Score" section
2. Enter financial data:
   - Annual revenue
   - Current ESG initiatives
   - Sustainability budget percentage
   - Cultural heritage interest level
3. Click "Calculate HeritaScore"
4. View score breakdown and recommendations

### UC03: AI Project Suggestions
1. Access "AI Project Suggestions" section
2. Set preferences:
   - Budget range
   - Geographic preference
   - Project type preferences (monuments, museums, etc.)
3. Click "Get AI Recommendations"
4. View AI-generated project matches with scoring
5. Select a project to proceed to sponsorship

### UC04: Sponsor Heritage Project
1. Navigate to "Sponsor Project" section
2. Select a project (or use one from AI suggestions)
3. Enter sponsorship amount in ETH (minimum 0.001 ETH)
4. Provide your enterprise ID
5. Submit sponsorship transaction
6. Transaction will be simulated on testnet

### UC05: Mint ESG NFT
1. Go to "Mint ESG NFT" section
2. Form will be pre-filled from previous sponsorship
3. Verify details:
   - Recipient address (your wallet)
   - Enterprise ID
   - Project ID
   - Sponsorship amount (in Wei)
   - ESG score (0-100)
4. Click "Mint ESG NFT"
5. Approve transaction in MetaMask
6. View minted NFT certificate details

### UC06: Verify NFT (HeritaBank)
1. Access "HeritaBank NFT Verification" section
2. Choose verification method:
   - By Enterprise ID
   - By Token ID
   - By Wallet Address
3. Enter the search value
4. Click "Verify ESG NFT"
5. View verification results with NFT authenticity

## 🔍 Demo Features

### Mock Data
- Pre-populated heritage projects from around the world
- Sample business profiles and ESG scores
- Simulated AI recommendations and matching

### Blockchain Integration
- Real Web3 wallet connection
- Testnet transaction simulation
- Smart contract interaction (when deployed)
- NFT minting and verification

### UI/UX Features
- Responsive design with Tailwind CSS
- Interactive use case navigation
- Real-time wallet status updates
- Transaction progress indicators
- Alert notifications and error handling

## 🛠 Development Notes

### Mock vs Real Blockchain
The demo intelligently switches between:
- **Real blockchain operations** when contract is deployed and wallet connected
- **Mock simulations** for demonstration purposes when contract isn't available

### Customization
To customize the demo:

1. **Add More Projects**: Edit `MOCK_DATA.projects` in `main.js`
2. **Modify Scoring Algorithm**: Update `calculateHeritaScore()` function
3. **Change Styling**: Modify `css/style.css` or Tailwind classes
4. **Add Features**: Extend use case sections in `index.html`

### Error Handling
The demo includes comprehensive error handling for:
- Wallet connection issues
- Network switching problems
- Transaction failures
- Input validation errors
- Contract interaction errors

## 📊 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   Web3 Layer     │    │  Smart Contract │
│                 │    │                  │    │                 │
│ • HTML/CSS/JS   │◄──►│ • MetaMask       │◄──►│ • HeritaESG.sol │
│ • Tailwind      │    │ • Ethers.js      │    │ • Lisk Sepolia  │
│ • Use Cases     │    │ • Wallet Connect │    │ • NFT Minting   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🧪 Testing Scenarios

### Complete User Journey
1. Register business → Calculate score → Get AI suggestions → Sponsor project → Mint NFT → Verify NFT
2. Test with different business sizes and budgets
3. Try various project preferences and verification methods

### Error Testing
1. Try operations without wallet connection
2. Test with insufficient funds
3. Verify input validation on all forms
4. Test network switching functionality

### Bank Verification Testing
1. Verify with valid enterprise IDs
2. Search by token IDs from minted NFTs
3. Test with non-existent data
4. Verify multiple NFTs for same enterprise

## 🔒 Security Considerations

This is a **demo environment** with the following security notes:
- Uses testnet only (no real funds at risk)
- Mock data for demonstration purposes
- Client-side validation only
- Not production-ready without additional security measures

## 📝 Future Enhancements

Potential improvements for production deployment:
- Backend API integration
- Real AI/ML project matching
- Enhanced security and validation
- Mobile responsiveness optimization
- Multi-language support
- Advanced analytics dashboard
- Integration with real heritage organizations

## 🆘 Troubleshooting

### Common Issues

**"Wallet not connected"**
- Ensure MetaMask is installed and unlocked
- Try refreshing the page and reconnecting

**"Wrong network"**
- The app should auto-prompt to switch to Lisk Sepolia
- Manually add network if auto-switch fails

**"Contract not found"**
- Ensure contract address is correctly set in `web3-config.js`
- Verify contract is deployed on Lisk Sepolia testnet

**"Transaction failed"**
- Check you have sufficient testnet ETH
- Verify gas settings in MetaMask
- Try reducing transaction amount

### Getting Test ETH
Visit Lisk Sepolia faucet to get free testnet ETH:
- [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com/)

## 📞 Support

For questions or issues with the demo:
1. Check the browser console for error messages
2. Verify all setup steps were completed
3. Ensure you're using a supported browser with MetaMask
4. Test with a clean browser session if needed

---

**Demo Version**: 1.0  
**Last Updated**: July 2025  
**Testnet**: Lisk Sepolia  
**Status**: Demo/Development  
