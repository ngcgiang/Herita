import { ethers } from "hardhat";

async function main() {
  // This script demonstrates how to interact with the HERITA ESG contract
  console.log("HERITA ESG Contract Usage Example");
  console.log("=================================");

  // Get signers
  const [owner, enterprise1, enterprise2] = await ethers.getSigners();
  
  // Deploy the contract (in production, you would connect to an existing contract)
  console.log("\n1. Deploying Contract...");
  const HeritaESG = await ethers.getContractFactory("HeritaESG");
  const heritaESG = await HeritaESG.deploy();
  await heritaESG.waitForDeployment();
  
  const contractAddress = await heritaESG.getAddress();
  console.log("Contract deployed to:", contractAddress);
  console.log("Owner:", await heritaESG.owner());

  // Example 1: Issue ESG certifications
  console.log("\n2. Issuing ESG Certifications...");
  
  // Enterprise 1 sponsors heritage project 1
  const tx1 = await heritaESG.issueESGCertification(
    enterprise1.address,
    "ENT-MICROSOFT",
    "PRJ-LOUVRE-RESTORATION",
    ethers.parseEther("50"), // 50 ETH sponsored
    85 // ESG score
  );
  await tx1.wait();
  console.log("✓ Microsoft sponsored Louvre restoration - Token ID: 1");

  // Enterprise 1 sponsors another project
  const tx2 = await heritaESG.issueESGCertification(
    enterprise1.address,
    "ENT-MICROSOFT",
    "PRJ-POMPEII-CONSERVATION",
    ethers.parseEther("30"), // 30 ETH sponsored
    90 // ESG score
  );
  await tx2.wait();
  console.log("✓ Microsoft sponsored Pompeii conservation - Token ID: 2");

  // Enterprise 2 sponsors a project
  const tx3 = await heritaESG.issueESGCertification(
    enterprise2.address,
    "ENT-GOOGLE",
    "PRJ-MACHU-PICCHU-PRESERVATION",
    ethers.parseEther("75"), // 75 ETH sponsored
    95 // ESG score
  );
  await tx3.wait();
  console.log("✓ Google sponsored Machu Picchu preservation - Token ID: 3");

  // Example 2: Query enterprise ESG NFTs
  console.log("\n3. Querying Enterprise ESG NFTs...");
  
  const microsoftTokens = await heritaESG.getESGNFTByEnterprise("ENT-MICROSOFT");
  const googleTokens = await heritaESG.getESGNFTByEnterprise("ENT-GOOGLE");
  
  console.log("Microsoft token IDs:", microsoftTokens.map((id: any) => id.toString()));
  console.log("Google token IDs:", googleTokens.map((id: any) => id.toString()));

  // Example 3: Get detailed certification information
  console.log("\n4. Getting Detailed Certification Information...");
  
  const microsoftDetails = await heritaESG.getEnterpriseESGDetails("ENT-MICROSOFT");
  console.log("Microsoft ESG Certifications:");
  for (let i = 0; i < microsoftDetails.length; i++) {
    const cert = microsoftDetails[i];
    console.log(`  Certification ${i + 1}:`);
    console.log(`    Project: ${cert.projectId}`);
    console.log(`    Amount: ${ethers.formatEther(cert.amount)} ETH`);
    console.log(`    ESG Score: ${cert.esgScore}`);
    console.log(`    Verified: ${cert.verified}`);
    console.log(`    Timestamp: ${new Date(Number(cert.timestamp) * 1000).toISOString()}`);
  }

  // Example 4: Verify certifications (heritage organization confirms impact)
  console.log("\n5. Verifying Certifications...");
  
  await heritaESG.verifyCertification(1);
  console.log("✓ Verified Microsoft's Louvre restoration certification");
  
  await heritaESG.verifyCertification(3);
  console.log("✓ Verified Google's Machu Picchu preservation certification");

  // Example 5: Calculate enterprise ESG scores
  console.log("\n6. Calculating Enterprise ESG Scores...");
  
  const [microsoftScore, microsoftVerifiedCount] = await heritaESG.getEnterpriseESGScore("ENT-MICROSOFT");
  const [googleScore, googleVerifiedCount] = await heritaESG.getEnterpriseESGScore("ENT-GOOGLE");
  
  console.log(`Microsoft: ${microsoftScore} total ESG points from ${microsoftVerifiedCount} verified certifications`);
  console.log(`Google: ${googleScore} total ESG points from ${googleVerifiedCount} verified certifications`);

  // Example 6: Update ESG score (if needed)
  console.log("\n7. Updating ESG Score...");
  
  await heritaESG.updateESGScore(2, 92); // Update Pompeii project score
  console.log("✓ Updated Pompeii conservation ESG score to 92");

  // Final stats
  console.log("\n8. Final Statistics...");
  
  const totalCertifications = await heritaESG.getTotalCertifications();
  console.log(`Total certifications issued: ${totalCertifications}`);
  
  // Get updated Microsoft details
  const updatedMicrosoftDetails = await heritaESG.getEnterpriseESGDetails("ENT-MICROSOFT");
  console.log("\nUpdated Microsoft Certifications:");
  for (let i = 0; i < updatedMicrosoftDetails.length; i++) {
    const cert = updatedMicrosoftDetails[i];
    console.log(`  ${cert.projectId}: ${cert.esgScore} ESG points (Verified: ${cert.verified})`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("HERITA ESG system successfully demonstrated!");
  console.log("Businesses can now track their ESG impact through");
  console.log("cultural heritage project sponsorships via NFTs.");
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
