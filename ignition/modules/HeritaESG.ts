import { ethers } from "hardhat";

async function main() {
  console.log("Deploying HERITA ESG Contract...");

  // Get the ContractFactory and Signers here.
  const HeritaESG = await ethers.getContractFactory("HeritaESG");
  
  // Deploy the contract
  const heritaESG = await HeritaESG.deploy();
  
  // Wait for deployment to finish
  await heritaESG.waitForDeployment();
  
  const contractAddress = await heritaESG.getAddress();
  
  console.log("HERITA ESG Contract deployed to:", contractAddress);
  console.log("Owner address:", await heritaESG.owner());
  
  // Verify deployment
  const name = await heritaESG.name();
  const symbol = await heritaESG.symbol();
  
  console.log("Contract Name:", name);
  console.log("Contract Symbol:", symbol);
  console.log("Total Certifications:", await heritaESG.getTotalCertifications());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
