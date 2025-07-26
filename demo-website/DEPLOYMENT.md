# Deploy Smart Contract & Update Demo

This guide helps you deploy the HeritaESG smart contract and update the demo website with the contract address.

## 1. Deploy Smart Contract

First, you need to deploy the HeritaESG contract to Lisk Sepolia testnet:

### Using Hardhat (Recommended)

1. **Install dependencies**:
   ```bash
   cd ../  # Go back to project root
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the project root:
   ```bash
   PRIVATE_KEY=your_private_key_here
   LISK_SEPOLIA_RPC=https://rpc.sepolia-api.lisk.com
   ```

3. **Deploy the contract**:
   ```bash
   npx hardhat run scripts/deploy-lisk-sepolia.ts --network lisk-sepolia
   ```

4. **Note the contract address** from the deployment output

### Using Remix IDE (Alternative)

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Upload `contracts/HeritaESG.sol`
3. Compile the contract
4. Switch to Lisk Sepolia network in MetaMask
5. Deploy using the "Deploy & Run Transactions" tab
6. Copy the deployed contract address

## 2. Update Demo Configuration

After deployment, update the contract address in the demo:

### Method 1: Manual Update

Edit `js/web3-config.js` and replace:
```javascript
CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000000', // UPDATE THIS
```

With your deployed contract address:
```javascript
CONTRACT_ADDRESS: '0xYOUR_ACTUAL_CONTRACT_ADDRESS_HERE',
```

### Method 2: Use Update Script

Run the provided update script:
```bash
node update-contract-address.js YOUR_CONTRACT_ADDRESS
```

## 3. Verify Contract (Optional but Recommended)

Verify your contract on the block explorer:

1. Go to [Lisk Sepolia Blockscout](https://sepolia-blockscout.lisk.com/)
2. Search for your contract address
3. Click "Verify & Publish" 
4. Upload the source code and compilation details

## 4. Test the Demo

1. Start a local web server:
   ```bash
   cd demo-website
   python -m http.server 8000
   ```

2. Open `http://localhost:8000` in your browser

3. Connect your MetaMask wallet

4. Test all use cases:
   - Register business
   - Calculate HeritaScore  
   - Get AI suggestions
   - Sponsor project
   - Mint ESG NFT
   - Verify NFT

## 5. Production Deployment

For production deployment:

1. **Deploy to mainnet** (use real ETH)
2. **Update network configuration** in `web3-config.js`
3. **Set up proper backend** for business registration
4. **Implement real AI** for project suggestions
5. **Add security measures** and input validation
6. **Deploy to hosting service** (Netlify, Vercel, etc.)

## Network Configuration

The demo is pre-configured for Lisk Sepolia testnet:

- **Network Name**: Lisk Sepolia Testnet
- **Chain ID**: 4202 (0x106a)  
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Block Explorer**: https://sepolia-blockscout.lisk.com
- **Symbol**: ETH

## Contract Functions Used in Demo

The demo interacts with these contract functions:

- `issueESGCertification()` - Mint new ESG NFT
- `getCertificationData()` - Get NFT details
- `getESGNFTByEnterprise()` - Get all NFTs for enterprise
- `getEnterpriseESGScore()` - Get total ESG score
- `verifyCertification()` - Verify NFT (owner only)

## Troubleshooting

**"Contract not deployed"**
- Ensure contract is deployed to correct network
- Verify contract address is correct
- Check network selection in MetaMask

**"Transaction failed"**  
- Ensure you have test ETH for gas fees
- Check transaction parameters are valid
- Verify contract is not paused or restricted

**"Function not found"**
- Ensure ABI is correct and up-to-date
- Verify contract version matches ABI
- Check function names and parameters

## Sample Deployment Script

Here's a basic deployment script for `scripts/deploy-lisk-sepolia.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
    console.log("Deploying HeritaESG contract...");
    
    const HeritaESG = await ethers.getContractFactory("HeritaESG");
    const heritaESG = await HeritaESG.deploy();
    
    await heritaESG.deployed();
    
    console.log("HeritaESG deployed to:", heritaESG.address);
    console.log("Update demo config with this address!");
    
    // Verify contract (optional)
    if (process.env.ETHERSCAN_API_KEY) {
        await hre.run("verify:verify", {
            address: heritaESG.address,
            constructorArguments: [],
        });
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

Add this to your `hardhat.config.ts` networks section:

```typescript
liskSepolia: {
    url: process.env.LISK_SEPOLIA_RPC,
    accounts: [process.env.PRIVATE_KEY!],
    chainId: 4202,
},
```
