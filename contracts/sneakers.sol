// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SneakerCertificate
 * @dev Smart contract for creating and managing sneaker authentication certificates on Hedera
 */
contract SneakerCertificate {
    // Certificate structure
    struct Certificate {
        string certificateId;
        string verificationId;
        string brand;
        string model;
        string size;
        string colorway;
        string[] imageHashes;
        uint256 issuedAt;
        bool isAuthentic;
        address owner;
    }
    
    // Mapping from certificate ID to Certificate
    mapping(string => Certificate) private certificates;
    
    // Mapping from address to array of certificate IDs
    mapping(address => string[]) private userCertificates;
    
    // Events
    event CertificateCreated(string certificateId, address owner);
    event CertificateTransferred(string certificateId, address from, address to);
    
    // Platform admin address
    address private admin;
    
    // Constructor
    constructor() {
        admin = msg.sender;
    }
    
    // Modifier to restrict functions to admin only
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    // Create a new certificate (only admin can create certificates)
    function createCertificate(
        string memory certificateId,
        string memory verificationId,
        string memory brand,
        string memory model,
        string memory size,
        string memory colorway,
        string[] memory imageHashes,
        address owner,
        bool isAuthentic
    ) public onlyAdmin returns (bool) {
        // Check if certificate already exists
        require(bytes(certificates[certificateId].certificateId).length == 0, "Certificate already exists");
        
        // Create new certificate
        Certificate memory newCertificate = Certificate({
            certificateId: certificateId,
            verificationId: verificationId,
            brand: brand,
            model: model,
            size: size,
            colorway: colorway,
            imageHashes: imageHashes,
            issuedAt: block.timestamp,
            isAuthentic: isAuthentic,
            owner: owner
        });
        
        // Store certificate
        certificates[certificateId] = newCertificate;
        
        // Add certificate to user's collection
        userCertificates[owner].push(certificateId);
        
        // Emit event
        emit CertificateCreated(certificateId, owner);
        
        return true;
    }
    
    // Get certificate details
    function getCertificate(string memory certificateId) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        bool,
        address
    ) {
        Certificate memory cert = certificates[certificateId];
        require(bytes(cert.certificateId).length > 0, "Certificate does not exist");
        
        return (
            cert.verificationId,
            cert.brand,
            cert.model,
            cert.size,
            cert.colorway,
            cert.issuedAt,
            cert.isAuthentic,
            cert.owner
        );
    }
    
    // Get image hashes for a certificate
    function getCertificateImages(string memory certificateId) public view returns (string[] memory) {
        require(bytes(certificates[certificateId].certificateId).length > 0, "Certificate does not exist");
        return certificates[certificateId].imageHashes;
    }
    
    // Transfer certificate to a new owner
    function transferCertificate(string memory certificateId, address newOwner) public returns (bool) {
        Certificate storage cert = certificates[certificateId];
        
        // Check if certificate exists and sender is the owner
        require(bytes(cert.certificateId).length > 0, "Certificate does not exist");
        require(cert.owner == msg.sender, "Only the owner can transfer the certificate");
        
        // Remove certificate from current owner's collection
        string[] storage ownerCerts = userCertificates[msg.sender];
        for (uint i = 0; i < ownerCerts.length; i++) {
            if (keccak256(bytes(ownerCerts[i])) == keccak256(bytes(certificateId))) {
                // Replace with the last element and pop
                ownerCerts[i] = ownerCerts[ownerCerts.length - 1];
                ownerCerts.pop();
                break;
            }
        }
        
        // Add certificate to new owner's collection
        userCertificates[newOwner].push(certificateId);
        
        // Update certificate owner
        cert.owner = newOwner;
        
        // Emit event
        emit CertificateTransferred(certificateId, msg.sender, newOwner);
        
        return true;
    }
    
    // Get all certificates owned by a user
    function getUserCertificates(address user) public view returns (string[] memory) {
        return userCertificates[user];
    }
    
    // Verify if a certificate is authentic
    function verifyCertificateAuthenticity(string memory certificateId) public view returns (bool) {
        require(bytes(certificates[certificateId].certificateId).length > 0, "Certificate does not exist");
        return certificates[certificateId].isAuthentic;
    }
}