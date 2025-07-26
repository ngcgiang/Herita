#!/usr/bin/env node

/**
 * Script to update the contract address in the demo website
 * Usage: node update-contract-address.js 0xYourContractAddress
 */

const fs = require('fs');
const path = require('path');

// Get contract address from command line argument
const contractAddress = process.argv[2];

if (!contractAddress) {
    console.error('❌ Error: Please provide a contract address');
    console.log('Usage: node update-contract-address.js 0xYourContractAddress');
    process.exit(1);
}

// Validate contract address format
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    console.error('❌ Error: Invalid contract address format');
    console.log('Contract address should be a 42-character hex string starting with 0x');
    process.exit(1);
}

// Path to the web3 config file
const configPath = path.join(__dirname, 'js', 'web3-config.js');

try {
    // Read the config file
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Replace the contract address
    const oldPattern = /CONTRACT_ADDRESS:\s*['"`]0x[a-fA-F0-9]*['"`]/;
    const newValue = `CONTRACT_ADDRESS: '${contractAddress}'`;
    
    if (!oldPattern.test(configContent)) {
        console.error('❌ Error: Could not find CONTRACT_ADDRESS in config file');
        process.exit(1);
    }
    
    configContent = configContent.replace(oldPattern, newValue);
    
    // Write the updated config file
    fs.writeFileSync(configPath, configContent, 'utf8');
    
    console.log('✅ Contract address updated successfully!');
    console.log(`📄 File: ${configPath}`);
    console.log(`🔗 New address: ${contractAddress}`);
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Start a local web server in the demo-website directory');
    console.log('2. Open the demo in your browser');
    console.log('3. Connect your wallet and test the functionality');
    
} catch (error) {
    console.error('❌ Error updating config file:', error.message);
    process.exit(1);
}
