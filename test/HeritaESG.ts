import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("HeritaESG", function () {
  let heritaESG: any;
  let owner: SignerWithAddress;
  let enterprise1: SignerWithAddress;
  let enterprise2: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [owner, enterprise1, enterprise2, otherAccount] = await ethers.getSigners();

    // Deploy the contract
    const HeritaESG = await ethers.getContractFactory("HeritaESG");
    heritaESG = await HeritaESG.deploy();
    await heritaESG.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await heritaESG.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await heritaESG.name()).to.equal("HERITA ESG Certification");
      expect(await heritaESG.symbol()).to.equal("HESG");
    });

    it("Should start with zero total certifications", async function () {
      expect(await heritaESG.getTotalCertifications()).to.equal(0);
    });
  });

  describe("ESG Certification Issuance", function () {
    it("Should issue an ESG certification successfully", async function () {
      const enterpriseId = "ENT001";
      const projectId = "PRJ001";
      const amount = ethers.parseEther("10");
      const esgScore = 85;

      await expect(
        heritaESG.issueESGCertification(
          enterprise1.address,
          enterpriseId,
          projectId,
          amount,
          esgScore
        )
      )
        .to.emit(heritaESG, "ESGCertificationIssued")
        .withArgs(1, enterpriseId, projectId, amount, esgScore);

      // Check if NFT was minted
      expect(await heritaESG.ownerOf(1)).to.equal(enterprise1.address);
      expect(await heritaESG.balanceOf(enterprise1.address)).to.equal(1);
      expect(await heritaESG.getTotalCertifications()).to.equal(1);
    });

    it("Should store certification data correctly", async function () {
      const enterpriseId = "ENT001";
      const projectId = "PRJ001";
      const amount = ethers.parseEther("10");
      const esgScore = 85;

      await heritaESG.issueESGCertification(
        enterprise1.address,
        enterpriseId,
        projectId,
        amount,
        esgScore
      );

      const certification = await heritaESG.getCertificationData(1);
      expect(certification.enterpriseId).to.equal(enterpriseId);
      expect(certification.projectId).to.equal(projectId);
      expect(certification.amount).to.equal(amount);
      expect(certification.esgScore).to.equal(esgScore);
      expect(certification.verified).to.equal(false);
      expect(certification.timestamp).to.be.gt(0);
    });

    it("Should only allow owner to issue certifications", async function () {
      await expect(
        heritaESG.connect(otherAccount).issueESGCertification(
          enterprise1.address,
          "ENT001",
          "PRJ001",
          ethers.parseEther("10"),
          85
        )
      ).to.be.revertedWithCustomError(heritaESG, "OwnableUnauthorizedAccount");
    });

    it("Should reject invalid inputs", async function () {
      // Empty enterprise ID
      await expect(
        heritaESG.issueESGCertification(
          enterprise1.address,
          "",
          "PRJ001",
          ethers.parseEther("10"),
          85
        )
      ).to.be.revertedWith("Enterprise ID cannot be empty");

      // Empty project ID
      await expect(
        heritaESG.issueESGCertification(
          enterprise1.address,
          "ENT001",
          "",
          ethers.parseEther("10"),
          85
        )
      ).to.be.revertedWith("Project ID cannot be empty");

      // Zero amount
      await expect(
        heritaESG.issueESGCertification(
          enterprise1.address,
          "ENT001",
          "PRJ001",
          0,
          85
        )
      ).to.be.revertedWith("Amount must be greater than 0");

      // Invalid ESG score
      await expect(
        heritaESG.issueESGCertification(
          enterprise1.address,
          "ENT001",
          "PRJ001",
          ethers.parseEther("10"),
          101
        )
      ).to.be.revertedWith("ESG score must be between 0 and 100");

      // Zero address
      await expect(
        heritaESG.issueESGCertification(
          ethers.ZeroAddress,
          "ENT001",
          "PRJ001",
          ethers.parseEther("10"),
          85
        )
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should prevent duplicate enterprise-project combinations", async function () {
      const enterpriseId = "ENT001";
      const projectId = "PRJ001";

      // First issuance should succeed
      await heritaESG.issueESGCertification(
        enterprise1.address,
        enterpriseId,
        projectId,
        ethers.parseEther("10"),
        85
      );

      // Second issuance with same enterprise-project should fail
      await expect(
        heritaESG.issueESGCertification(
          enterprise1.address,
          enterpriseId,
          projectId,
          ethers.parseEther("5"),
          90
        )
      ).to.be.revertedWith(
        "Sponsorship already certified for this enterprise-project combination"
      );
    });
  });

  describe("Certification Verification", function () {
    beforeEach(async function () {
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("10"),
        85
      );
    });

    it("Should verify certification successfully", async function () {
      await expect(heritaESG.verifyCertification(1))
        .to.emit(heritaESG, "CertificationVerified")
        .withArgs(1, "ENT001", "PRJ001");

      const certification = await heritaESG.getCertificationData(1);
      expect(certification.verified).to.equal(true);
    });

    it("Should only allow owner to verify", async function () {
      await expect(
        heritaESG.connect(otherAccount).verifyCertification(1)
      ).to.be.revertedWithCustomError(heritaESG, "OwnableUnauthorizedAccount");
    });

    it("Should reject verification of non-existent token", async function () {
      await expect(heritaESG.verifyCertification(999)).to.be.revertedWith(
        "Token does not exist"
      );
    });

    it("Should reject double verification", async function () {
      await heritaESG.verifyCertification(1);
      await expect(heritaESG.verifyCertification(1)).to.be.revertedWith(
        "Certification already verified"
      );
    });
  });

  describe("Enterprise ESG Queries", function () {
    beforeEach(async function () {
      // Issue multiple certifications
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("10"),
        85
      );
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ002",
        ethers.parseEther("15"),
        90
      );
      await heritaESG.issueESGCertification(
        enterprise2.address,
        "ENT002",
        "PRJ003",
        ethers.parseEther("20"),
        95
      );

      // Verify some certifications
      await heritaESG.verifyCertification(1);
      await heritaESG.verifyCertification(3);
    });

    it("Should get ESG NFTs by enterprise", async function () {
      const ent1Tokens = await heritaESG.getESGNFTByEnterprise("ENT001");
      const ent2Tokens = await heritaESG.getESGNFTByEnterprise("ENT002");

      expect(ent1Tokens.length).to.equal(2);
      expect(ent1Tokens[0]).to.equal(1);
      expect(ent1Tokens[1]).to.equal(2);

      expect(ent2Tokens.length).to.equal(1);
      expect(ent2Tokens[0]).to.equal(3);
    });

    it("Should get enterprise ESG details", async function () {
      const details = await heritaESG.getEnterpriseESGDetails("ENT001");

      expect(details.length).to.equal(2);
      expect(details[0].enterpriseId).to.equal("ENT001");
      expect(details[0].projectId).to.equal("PRJ001");
      expect(details[0].verified).to.equal(true);
      expect(details[1].enterpriseId).to.equal("ENT001");
      expect(details[1].projectId).to.equal("PRJ002");
      expect(details[1].verified).to.equal(false);
    });

    it("Should calculate enterprise ESG score correctly", async function () {
      const [totalScore, verifiedCount] = await heritaESG.getEnterpriseESGScore("ENT001");

      expect(totalScore).to.equal(85); // Only verified certification
      expect(verifiedCount).to.equal(1);
    });

    it("Should return empty array for non-existent enterprise", async function () {
      const tokens = await heritaESG.getESGNFTByEnterprise("NONEXISTENT");
      expect(tokens.length).to.equal(0);
    });
  });

  describe("ESG Score Updates", function () {
    beforeEach(async function () {
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("10"),
        85
      );
    });

    it("Should update ESG score successfully", async function () {
      await heritaESG.updateESGScore(1, 95);

      const certification = await heritaESG.getCertificationData(1);
      expect(certification.esgScore).to.equal(95);
    });

    it("Should only allow owner to update ESG score", async function () {
      await expect(
        heritaESG.connect(otherAccount).updateESGScore(1, 95)
      ).to.be.revertedWithCustomError(heritaESG, "OwnableUnauthorizedAccount");
    });

    it("Should reject invalid ESG score", async function () {
      await expect(heritaESG.updateESGScore(1, 101)).to.be.revertedWith(
        "ESG score must be between 0 and 100"
      );
    });

    it("Should reject update for non-existent token", async function () {
      await expect(heritaESG.updateESGScore(999, 95)).to.be.revertedWith(
        "Token does not exist"
      );
    });
  });

  describe("Multiple Enterprises and Projects", function () {
    it("Should handle multiple enterprises with multiple projects", async function () {
      // Enterprise 1 sponsors 2 projects
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("10"),
        85
      );
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ002",
        ethers.parseEther("15"),
        90
      );

      // Enterprise 2 sponsors 1 project
      await heritaESG.issueESGCertification(
        enterprise2.address,
        "ENT002",
        "PRJ003",
        ethers.parseEther("20"),
        95
      );

      // Same project can be sponsored by different enterprises
      await heritaESG.issueESGCertification(
        enterprise2.address,
        "ENT002",
        "PRJ001",
        ethers.parseEther("25"),
        88
      );

      expect(await heritaESG.getTotalCertifications()).to.equal(4);

      const ent1Tokens = await heritaESG.getESGNFTByEnterprise("ENT001");
      const ent2Tokens = await heritaESG.getESGNFTByEnterprise("ENT002");

      expect(ent1Tokens.length).to.equal(2);
      expect(ent2Tokens.length).to.equal(2);
    });
  });

  describe("Advanced Enterprise ESG Analytics", function () {
    beforeEach(async function () {
      // Create a comprehensive test scenario
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("100"),
        75
      );
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ002",
        ethers.parseEther("200"),
        85
      );
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ003",
        ethers.parseEther("150"),
        90
      );

      // Verify only some certifications
      await heritaESG.verifyCertification(1); // 75 points
      await heritaESG.verifyCertification(3); // 90 points
      // Token 2 remains unverified
    });

    it("Should correctly calculate total ESG score from verified certifications only", async function () {
      const [totalScore, verifiedCount] = await heritaESG.getEnterpriseESGScore("ENT001");
      
      expect(totalScore).to.equal(165); // 75 + 90
      expect(verifiedCount).to.equal(2);
    });

    it("Should include all certifications in enterprise details regardless of verification", async function () {
      const details = await heritaESG.getEnterpriseESGDetails("ENT001");
      
      expect(details.length).to.equal(3);
      expect(details[0].verified).to.equal(true);  // Token 1
      expect(details[1].verified).to.equal(false); // Token 2
      expect(details[2].verified).to.equal(true);  // Token 3
    });

    it("Should track total amount sponsored across all certifications", async function () {
      const details = await heritaESG.getEnterpriseESGDetails("ENT001");
      let totalAmount = BigInt(0);
      
      for (const cert of details) {
        totalAmount += cert.amount;
      }
      
      expect(totalAmount).to.equal(ethers.parseEther("450")); // 100 + 200 + 150
    });
  });

  describe("Edge Cases and Error Handling", function () {
    it("Should handle zero ESG score", async function () {
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("10"),
        0 // Zero ESG score should be allowed
      );

      const certification = await heritaESG.getCertificationData(1);
      expect(certification.esgScore).to.equal(0);
    });

    it("Should handle maximum ESG score", async function () {
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("10"),
        100 // Maximum ESG score
      );

      const certification = await heritaESG.getCertificationData(1);
      expect(certification.esgScore).to.equal(100);
    });

    it("Should handle enterprise with no certifications", async function () {
      const [totalScore, verifiedCount] = await heritaESG.getEnterpriseESGScore("NONEXISTENT");
      expect(totalScore).to.equal(0);
      expect(verifiedCount).to.equal(0);

      const details = await heritaESG.getEnterpriseESGDetails("NONEXISTENT");
      expect(details.length).to.equal(0);
    });

    it("Should maintain correct token enumeration", async function () {
      // Issue multiple certifications
      await heritaESG.issueESGCertification(
        enterprise1.address,
        "ENT001",
        "PRJ001",
        ethers.parseEther("10"),
        85
      );
      await heritaESG.issueESGCertification(
        enterprise2.address,
        "ENT002",
        "PRJ002",
        ethers.parseEther("20"),
        90
      );

      // Check total supply
      expect(await heritaESG.totalSupply()).to.equal(2);

      // Check token by index
      expect(await heritaESG.tokenByIndex(0)).to.equal(1);
      expect(await heritaESG.tokenByIndex(1)).to.equal(2);

      // Check tokens of owner
      expect(await heritaESG.tokenOfOwnerByIndex(enterprise1.address, 0)).to.equal(1);
      expect(await heritaESG.tokenOfOwnerByIndex(enterprise2.address, 0)).to.equal(2);
    });
  });

  describe("Contract Information and Metadata", function () {
    it("Should return correct contract metadata", async function () {
      expect(await heritaESG.name()).to.equal("HERITA ESG Certification");
      expect(await heritaESG.symbol()).to.equal("HESG");
    });

    it("Should support required interfaces", async function () {
      // ERC721 interface
      expect(await heritaESG.supportsInterface("0x80ac58cd")).to.equal(true);
      // ERC721Enumerable interface
      expect(await heritaESG.supportsInterface("0x780e9d63")).to.equal(true);
      // ERC165 interface
      expect(await heritaESG.supportsInterface("0x01ffc9a7")).to.equal(true);
    });

    it("Should emit events correctly", async function () {
      // Test ESGCertificationIssued event
      await expect(
        heritaESG.issueESGCertification(
          enterprise1.address,
          "ENT001",
          "PRJ001",
          ethers.parseEther("10"),
          85
        )
      ).to.emit(heritaESG, "ESGCertificationIssued")
       .withArgs(1, "ENT001", "PRJ001", ethers.parseEther("10"), 85);

      // Test CertificationVerified event
      await expect(heritaESG.verifyCertification(1))
        .to.emit(heritaESG, "CertificationVerified")
        .withArgs(1, "ENT001", "PRJ001");
    });
  });

  describe("Gas Optimization Tests", function () {
    it("Should efficiently handle bulk operations", async function () {
      const startGas = await ethers.provider.getBalance(owner.address);
      
      // Issue multiple certifications
      for (let i = 1; i <= 5; i++) {
        await heritaESG.issueESGCertification(
          enterprise1.address,
          "ENT001",
          `PRJ00${i}`,
          ethers.parseEther("10"),
          80 + i
        );
      }
      
      const endGas = await ethers.provider.getBalance(owner.address);
      expect(startGas).to.be.gt(endGas); // Gas was consumed
      
      // Verify all certifications were created
      expect(await heritaESG.getTotalCertifications()).to.equal(5);
      const tokens = await heritaESG.getESGNFTByEnterprise("ENT001");
      expect(tokens.length).to.equal(5);
    });
  });
});
