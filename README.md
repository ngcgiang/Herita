# HERITA ESG Certification System

A blockchain-based system that enables businesses to improve their ESG (Environmental, Social, Governance) scores by funding cultural heritage projects. Upon completing sponsorships, the system issues NFT certificates as proof of ESG compliance.

## Overview

The HERITA system connects businesses with cultural heritage preservation projects through a transparent, verifiable NFT-based certification system. Each NFT represents a verified sponsorship and contributes to the business's overall ESG score.

## Smart Contract Features

### Core Functionality
- **ESG Certification NFTs**: Each sponsorship is represented by a unique NFT
- **On-chain Data Storage**: All certification data is stored permanently on the blockchain
- **Verification System**: Heritage organizations can verify the impact of sponsorships
- **Enterprise Queries**: Businesses can retrieve all their certifications and scores

### NFT Data Structure
Each ESG certification NFT contains:
- `enterpriseId`: Unique identifier for the sponsoring business
- `projectId`: Unique identifier for the heritage project
- `amount`: Amount sponsored (in wei)
- `timestamp`: Time when the sponsorship was certified
- `esgScore`: ESG score assigned (0-100 scale)
- `verified`: Boolean indicating impact verification by heritage organization

### Access Control
- Only the contract owner (HERITA system) can issue certifications
- Only the contract owner can verify certifications
- Businesses receive NFTs as proof of their sponsorships

## Contract Functions

### Admin Functions (Owner Only)
```solidity
function issueESGCertification(
    address to,
    string memory enterpriseId,
    string memory projectId,
    uint256 amount,
    uint256 esgScore
) external onlyOwner returns (uint256)
```

```solidity
function verifyCertification(uint256 tokenId) external onlyOwner
```

```solidity
function updateESGScore(uint256 tokenId, uint256 newEsgScore) external onlyOwner
```

### Query Functions (Public)
```solidity
function getESGNFTByEnterprise(string memory enterpriseId) external view returns (uint256[] memory)
```

```solidity
function getEnterpriseESGDetails(string memory enterpriseId) external view returns (ESGCertification[] memory)
```

```solidity
function getEnterpriseESGScore(string memory enterpriseId) external view returns (uint256 totalScore, uint256 verifiedCount)
```

```solidity
function getCertificationData(uint256 tokenId) external view returns (ESGCertification memory)
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Hardhat

### Install Dependencies
```bash
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Lisk Sepolia
```bash
npx hardhat run ignition/modules/HeritaESG.ts --network lisk-sepolia
```

## Usage Example

### 1. Deploy the Contract
```typescript
const HeritaESG = await ethers.getContractFactory("HeritaESG");
const heritaESG = await HeritaESG.deploy();
```

### 2. Issue ESG Certification
```typescript
await heritaESG.issueESGCertification(
    enterpriseAddress,
    "ENT-MICROSOFT",
    "PRJ-LOUVRE-RESTORATION",
    ethers.parseEther("50"), // 50 ETH sponsored
    85 // ESG score
);
```

### 3. Query Enterprise Certifications
```typescript
const tokenIds = await heritaESG.getESGNFTByEnterprise("ENT-MICROSOFT");
const details = await heritaESG.getEnterpriseESGDetails("ENT-MICROSOFT");
```

### 4. Verify Certification
```typescript
await heritaESG.verifyCertification(tokenId);
```

### 5. Calculate ESG Score
```typescript
const [totalScore, verifiedCount] = await heritaESG.getEnterpriseESGScore("ENT-MICROSOFT");
```

## Business Logic

### ESG Score Calculation
- Each verified certification contributes its ESG score to the enterprise's total
- Only verified certifications count toward the final ESG score
- Unverified certifications are tracked but don't contribute to the score

### Duplicate Prevention
- The system prevents issuing multiple certifications for the same enterprise-project combination
- Each sponsorship relationship can only be certified once

### Verification Workflow
1. Enterprise sponsors a heritage project
2. HERITA system issues an NFT certification (unverified)
3. Heritage organization confirms the impact
4. HERITA system marks the certification as verified
5. The ESG score now contributes to the enterprise's total

## Security Features

- **Owner-only functions**: Critical operations require contract owner privileges
- **Input validation**: All inputs are validated for correctness
- **Duplicate prevention**: Prevents double-certification of sponsorships
- **Immutable records**: Once issued, certification data cannot be altered (except ESG score updates)

## Integration with Lisk

This contract is optimized for deployment on Lisk, leveraging:
- Low transaction costs for frequent NFT issuance
- Fast confirmation times for real-time ESG tracking
- EVM compatibility for easy integration with existing tools

## Events

The contract emits the following events for external monitoring:

```solidity
event ESGCertificationIssued(
    uint256 indexed tokenId,
    string indexed enterpriseId,
    string indexed projectId,
    uint256 amount,
    uint256 esgScore
);

event CertificationVerified(
    uint256 indexed tokenId,
    string indexed enterpriseId,
    string indexed projectId
);
```

## Testing

Comprehensive test suite covering:
- Contract deployment
- ESG certification issuance
- Access control
- Input validation
- Certification verification
- Enterprise queries
- Score calculations
- Error handling

Run tests with:
```bash
npx hardhat test
```

## Quick Start Commands

```shell
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Lisk Sepolia
npx hardhat run ignition/modules/HeritaESG.ts --network lisk-sepolia

# Run usage example
npx hardhat run scripts/usage-example.ts --network lisk-sepolia
```

## License

This project is licensed under the MIT License.
