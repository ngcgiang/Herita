// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HeritaESG
 * @dev NFT contract for ESG certification based on cultural heritage project sponsorships
 */
contract HeritaESG is ERC721, ERC721Enumerable, Ownable {
    
    // Token ID counter
    uint256 private _tokenIdCounter;
    
    // Struct to store sponsorship data
    struct Sponsorship {
        address sponsor;        // Address of the sponsor
        string enterpriseId;    // ID of the sponsoring business
        string projectId;       // ID of the funded heritage project
        uint256 amount;         // Amount sponsored (in wei)
        uint256 timestamp;      // Time of sponsorship
        bool certified;         // Whether this sponsorship has been certified as NFT
    }
    
    // Struct to store ESG NFT data
    struct ESGCertification {
        string enterpriseId;    // ID of the sponsoring business
        string projectId;       // ID of the funded heritage project
        uint256 amount;         // Amount sponsored (in wei)
        uint256 timestamp;      // Time of sponsorship
        uint256 esgScore;       // ESG score assigned (0-100 scale)
        bool verified;          // Whether impact has been confirmed by heritage org
    }
    
    // Mapping from sponsorship ID to sponsorship data
    mapping(uint256 => Sponsorship) public sponsorships;
    uint256 private _sponsorshipIdCounter;
    
    // Mapping from token ID to ESG certification data
    mapping(uint256 => ESGCertification) public esgCertifications;
    
    // Mapping from enterprise ID to array of token IDs
    mapping(string => uint256[]) public enterpriseTokens;
    
    // Mapping to track if an enterprise-project combination already exists
    mapping(string => mapping(string => bool)) public sponsorshipExists;
    
    // Events
    event SponsorshipReceived(
        uint256 indexed sponsorshipId,
        address indexed sponsor,
        string indexed enterpriseId,
        string projectId,
        uint256 amount
    );
    
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
    
    /**
     * @dev Constructor sets the token name and symbol
     */
    constructor() ERC721("HERITA ESG Certification", "HESG") Ownable(msg.sender) {}
    
    /**
     * @dev Allows receiving ETH for general donations
     */
    receive() external payable {
        // Contract can receive ETH
    }
    
    /**
     * @dev Sponsors a heritage project with ETH
     * @param enterpriseId ID of the sponsoring business
     * @param projectId ID of the heritage project to sponsor
     */
    function sponsor(string memory enterpriseId, string memory projectId) external payable {
        require(msg.value > 0, "Sponsorship amount must be greater than 0");
        require(bytes(enterpriseId).length > 0, "Enterprise ID cannot be empty");
        require(bytes(projectId).length > 0, "Project ID cannot be empty");
        
        // Increment sponsorship counter
        _sponsorshipIdCounter++;
        uint256 sponsorshipId = _sponsorshipIdCounter;
        
        // Store sponsorship data
        sponsorships[sponsorshipId] = Sponsorship({
            sponsor: msg.sender,
            enterpriseId: enterpriseId,
            projectId: projectId,
            amount: msg.value,
            timestamp: block.timestamp,
            certified: false
        });
        
        emit SponsorshipReceived(sponsorshipId, msg.sender, enterpriseId, projectId, msg.value);
    }
    
    /**
     * @dev Issues a new ESG certification NFT based on a sponsorship
     * @param to Address to mint the NFT to (typically the enterprise wallet)
     * @param sponsorshipId ID of the sponsorship to certify
     * @param esgScore ESG score assigned (0-100)
     * @return tokenId The ID of the newly minted token
     */
    function issueESGCertificationFromSponsorship(
        address to,
        uint256 sponsorshipId,
        uint256 esgScore
    ) public onlyOwner returns (uint256) {
        require(sponsorshipId > 0 && sponsorshipId <= _sponsorshipIdCounter, "Invalid sponsorship ID");
        require(esgScore <= 100, "ESG score must be between 0 and 100");
        require(to != address(0), "Cannot mint to zero address");
        
        Sponsorship storage sponsorship = sponsorships[sponsorshipId];
        require(!sponsorship.certified, "This sponsorship has already been certified");
        require(!sponsorshipExists[sponsorship.enterpriseId][sponsorship.projectId], "Sponsorship already certified for this enterprise-project combination");
        
        // Increment token counter
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        // Mint the NFT
        _safeMint(to, tokenId);
        
        // Store certification data
        esgCertifications[tokenId] = ESGCertification({
            enterpriseId: sponsorship.enterpriseId,
            projectId: sponsorship.projectId,
            amount: sponsorship.amount,
            timestamp: sponsorship.timestamp,
            esgScore: esgScore,
            verified: false
        });
        
        // Add token to enterprise's token list
        enterpriseTokens[sponsorship.enterpriseId].push(tokenId);
        
        // Mark this sponsorship as existing and certified
        sponsorshipExists[sponsorship.enterpriseId][sponsorship.projectId] = true;
        sponsorship.certified = true;
        
        emit ESGCertificationIssued(tokenId, sponsorship.enterpriseId, sponsorship.projectId, sponsorship.amount, esgScore);
        
        return tokenId;
    }
    
    /**
     * @dev Issues a new ESG certification NFT (original function for backward compatibility)
     * @param to Address to mint the NFT to (typically the enterprise wallet)
     * @param enterpriseId ID of the sponsoring business
     * @param projectId ID of the funded heritage project
     * @param amount Amount sponsored
     * @param esgScore ESG score assigned (0-100)
     * @return tokenId The ID of the newly minted token
     */
    function issueESGCertification(
        address to,
        string memory enterpriseId,
        string memory projectId,
        uint256 amount,
        uint256 esgScore
    ) public onlyOwner returns (uint256) {
        require(bytes(enterpriseId).length > 0, "Enterprise ID cannot be empty");
        require(bytes(projectId).length > 0, "Project ID cannot be empty");
        require(amount > 0, "Amount must be greater than 0");
        require(esgScore <= 100, "ESG score must be between 0 and 100");
        require(to != address(0), "Cannot mint to zero address");
        
        // Check if this enterprise-project combination already exists
        require(
            !sponsorshipExists[enterpriseId][projectId],
            "Sponsorship already certified for this enterprise-project combination"
        );
        
        // Increment token counter
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        // Mint the NFT
        _safeMint(to, tokenId);
        
        // Store certification data
        esgCertifications[tokenId] = ESGCertification({
            enterpriseId: enterpriseId,
            projectId: projectId,
            amount: amount,
            timestamp: block.timestamp,
            esgScore: esgScore,
            verified: false
        });
        
        // Add token to enterprise's token list
        enterpriseTokens[enterpriseId].push(tokenId);
        
        // Mark this sponsorship as existing
        sponsorshipExists[enterpriseId][projectId] = true;
        
        emit ESGCertificationIssued(tokenId, enterpriseId, projectId, amount, esgScore);
        
        return tokenId;
    }
    
    /**
     * @dev Verifies an ESG certification (can only be called by contract owner)
     * @param tokenId ID of the token to verify
     */
    function verifyCertification(uint256 tokenId) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(!esgCertifications[tokenId].verified, "Certification already verified");
        
        esgCertifications[tokenId].verified = true;
        
        emit CertificationVerified(
            tokenId,
            esgCertifications[tokenId].enterpriseId,
            esgCertifications[tokenId].projectId
        );
    }
    
    /**
     * @dev Updates the ESG score for a certification (only owner)
     * @param tokenId ID of the token to update
     * @param newEsgScore New ESG score (0-100)
     */
    function updateESGScore(uint256 tokenId, uint256 newEsgScore) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(newEsgScore <= 100, "ESG score must be between 0 and 100");
        
        esgCertifications[tokenId].esgScore = newEsgScore;
    }
    
    /**
     * @dev Gets all ESG NFTs for a given enterprise
     * @param enterpriseId ID of the enterprise
     * @return Array of token IDs owned by the enterprise
     */
    function getESGNFTByEnterprise(string memory enterpriseId) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return enterpriseTokens[enterpriseId];
    }
    
    /**
     * @dev Gets detailed information about an enterprise's certifications
     * @param enterpriseId ID of the enterprise
     * @return certifications Array of ESGCertification structs
     */
    function getEnterpriseESGDetails(string memory enterpriseId)
        public
        view
        returns (ESGCertification[] memory)
    {
        uint256[] memory tokenIds = enterpriseTokens[enterpriseId];
        ESGCertification[] memory certifications = new ESGCertification[](tokenIds.length);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            certifications[i] = esgCertifications[tokenIds[i]];
        }
        
        return certifications;
    }
    
    /**
     * @dev Gets the total ESG score for an enterprise (sum of all verified certifications)
     * @param enterpriseId ID of the enterprise
     * @return totalScore Sum of all verified ESG scores
     * @return verifiedCount Number of verified certifications
     */
    function getEnterpriseESGScore(string memory enterpriseId)
        public
        view
        returns (uint256 totalScore, uint256 verifiedCount)
    {
        uint256[] memory tokenIds = enterpriseTokens[enterpriseId];
        totalScore = 0;
        verifiedCount = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            ESGCertification memory cert = esgCertifications[tokenIds[i]];
            if (cert.verified) {
                totalScore += cert.esgScore;
                verifiedCount++;
            }
        }
    }
    
    /**
     * @dev Gets certification data for a specific token
     * @param tokenId ID of the token
     * @return ESGCertification struct with all certification details
     */
    function getCertificationData(uint256 tokenId) 
        public 
        view 
        returns (ESGCertification memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return esgCertifications[tokenId];
    }
    
    /**
     * @dev Returns the total number of certifications issued
     * @return Total number of tokens minted
     */
    function getTotalCertifications() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Returns the total number of sponsorships received
     * @return Total number of sponsorships
     */
    function getTotalSponsorships() public view returns (uint256) {
        return _sponsorshipIdCounter;
    }
    
    /**
     * @dev Gets sponsorship data for a specific sponsorship ID
     * @param sponsorshipId ID of the sponsorship
     * @return Sponsorship struct with all sponsorship details
     */
    function getSponsorshipData(uint256 sponsorshipId) 
        public 
        view 
        returns (Sponsorship memory) 
    {
        require(sponsorshipId > 0 && sponsorshipId <= _sponsorshipIdCounter, "Invalid sponsorship ID");
        return sponsorships[sponsorshipId];
    }
    
    /**
     * @dev Gets the contract's ETH balance
     * @return Balance in wei
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Allows owner to withdraw ETH from the contract
     * @param amount Amount to withdraw in wei
     */
    function withdrawFunds(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        require(amount > 0, "Amount must be greater than 0");
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    
    /**
     * @dev Override to prevent token transfers (soulbound tokens)
     * Uncomment this if you want the NFTs to be non-transferable
     */
    /*
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "ESG certifications are soulbound");
        return super._update(to, tokenId, auth);
    }
    */
}