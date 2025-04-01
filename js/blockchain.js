// blockchain.js - Handles blockchain certificate creation and verification

// Simulated contract ABI and address (you would get this from Remix after deployment)
const contractABI = [0x1043ee0905a02a081511a4706b2d9243ebc281c393bbf88638d961811c4280af]; // This would be the ABI from Remix
const contractAddress = "0xa7b9dc8e87f79b628664cfaf71f55d8cf2acca4a"; // This would be the address from Remix

// Simulated contract interface
const contractInterface = {
    // Simulate creating a certificate
    createCertificate: function(certificateData) {
        console.log("Creating certificate:", certificateData);
        return {
            success: true,
            transactionId: "0.0." + Math.floor(Math.random() * 1000000) + "@" + Math.floor(Date.now() / 1000),
            tokenId: "0.0." + Math.floor(Math.random() * 1000000)
        };
    },
    
    // Simulate getting certificate details
    getCertificate: function(certificateId) {
        console.log("Getting certificate:", certificateId);
        // Get from localStorage in prototype
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        return certificates.find(cert => cert.id === certificateId);
    },
    
    // Simulate transferring a certificate
    transferCertificate: function(certificateId, newOwner) {
        console.log("Transferring certificate:", certificateId, "to", newOwner);
        return { success: true };
    }
};

// Create blockchain certificate
function createBlockchainCertificate(verification) {
    console.log("Creating blockchain certificate for verification:", verification.id);
    
    // Generate certificate ID
    const certificateId = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Generate mock Hedera token ID
    const tokenId = '0.0.' + Math.floor(Math.random() * 1000000);
    
    // Generate mock transaction ID
    const transactionId = '0.0.' + Math.floor(Math.random() * 1000000) + '@' + Math.floor(Date.now() / 1000);
    
    // Use provided wallet address or generate a mock one
    const walletAddress = verification.userAddress || ('0x' + Math.random().toString(36).substr(2, 40));
    
    // Prepare certificate data for contract
    const certificateData = {
        certificateId: certificateId,
        verificationId: verification.id,
        brand: verification.brand,
        model: verification.model,
        size: verification.size,
        colorway: verification.colorway,
        imageHashes: [], // In a real implementation, these would be IPFS hashes
        owner: walletAddress,
        isAuthentic: true
    };
    
    // Simulate contract call
    const result = contractInterface.createCertificate(certificateData);
    
    if (result.success) {
        // Create certificate object
        const certificate = {
            id: certificateId,
            verificationId: verification.id,
            tokenId: result.tokenId,
            transactionId: result.transactionId,
            ownerWallet: walletAddress,
            sneakerDetails: {
                brand: verification.brand,
                model: verification.model,
                size: verification.size,
                colorway: verification.colorway
            },
            images: verification.images, // This now contains URLs instead of full data
            issuedAt: new Date().toISOString(),
            issuer: 'SneakerVerify Platform'
        };
        
        // Store certificate in localStorage (simulating blockchain storage)
        try {
            const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
            certificates.push(certificate);
            localStorage.setItem('certificates', JSON.stringify(certificates));
        } catch (e) {
            console.error("Error storing certificate in localStorage:", e);
        }
        
        return certificate;
    } else {
        throw new Error("Failed to create certificate on blockchain");
    }
}

// Verify certificate by ID
function verifyCertificate(certificateId) {
    console.log("Verifying certificate:", certificateId);
    // Simulate contract call
    return contractInterface.getCertificate(certificateId);
}

// Transfer certificate to new owner
function transferCertificate(certificateId, newOwnerWallet) {
    console.log("Transferring certificate:", certificateId, "to", newOwnerWallet);
    // Simulate contract call
    const result = contractInterface.transferCertificate(certificateId, newOwnerWallet);
    
    if (result.success) {
        // Update certificate in localStorage
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const certIndex = certificates.findIndex(cert => cert.id === certificateId);
        
        if (certIndex >= 0) {
            certificates[certIndex].ownerWallet = newOwnerWallet;
            localStorage.setItem('certificates', JSON.stringify(certificates));
            return true;
        }
    }
    
    return false;
}

// Display certificate details
function displayCertificate(certificate) {
    console.log("Displaying certificate:", certificate.id);
    // Fill in certificate page details
    document.getElementById('cert-page-id').textContent = certificate.id;
    document.getElementById('cert-page-date').textContent = new Date(certificate.issuedAt).toLocaleDateString();
    document.getElementById('cert-page-brand').textContent = certificate.sneakerDetails.brand;
    document.getElementById('cert-page-model').textContent = certificate.sneakerDetails.model;
    document.getElementById('cert-page-size').textContent = certificate.sneakerDetails.size;
    document.getElementById('cert-page-colorway').textContent = certificate.sneakerDetails.colorway;
    document.getElementById('cert-page-token-id').textContent = certificate.tokenId;
    document.getElementById('cert-page-tx-id').textContent = certificate.transactionId;
    document.getElementById('cert-page-wallet').textContent = certificate.ownerWallet;
    
    // Generate QR code URL (using an external service for demo)
    const qrData = `https://example.com/verify/${certificate.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    // Update QR code image
    const qrContainer = document.getElementById('certificate-qr');
    qrContainer.innerHTML = `<img src="${qrUrl}" alt="Certificate QR Code">`;
    
    // Get image from sessionStorage using the stored URL reference
    let imageUrl = 'https://placehold.co/300x200/e0e0e0/333333?text=Sneaker+Image';
    
    // Try all available images, prioritizing left side
    if (certificate.images) {
        const imageKeys = ['leftSide', 'rightSide', 'sole'];
        
        for (const key of imageKeys) {
            if (certificate.images[key]) {
                const storedImage = sessionStorage.getItem(certificate.images[key]);
                if (storedImage) {
                    imageUrl = storedImage;
                    break; // Use the first available image
                }
            }
        }
    }
    
    // Update certificate image
    const imageContainer = document.getElementById('certificate-image');
    if (imageContainer) {
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Verified Sneaker" class="h-full w-full object-contain">`;
    }
    
    // Show certificate page
    showPage('certificate');
}

// Load user certificates for gallery
function loadCertificatesGallery() {
    console.log("Loading certificates gallery");
    if (!currentUser) return;
    
    const certificatesContainer = document.getElementById('certificates-container');
    if (!certificatesContainer) {
        console.error("Certificates container not found");
        return;
    }
    
    certificatesContainer.innerHTML = '';
    
    // Get certificates from localStorage
    const allCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    
    // Get user's certificate IDs
    const userCertificateIds = currentUser.certificateIds || [];
    
    // Filter certificates that belong to the user
    const userCertificates = allCertificates.filter(cert => 
        userCertificateIds.includes(cert.id) || 
        cert.ownerWallet === currentUser.walletAddress
    );
    
    if (userCertificates.length > 0) {
        document.getElementById('no-certificates').classList.add('hidden');
        certificatesContainer.classList.remove('hidden');
        
        userCertificates.forEach(certificate => {
            // Get image URL from sessionStorage using the stored reference
            let imageUrl = 'https://placehold.co/300x200/e0e0e0/333333?text=Sneaker+Image';
            
            // Try all available images, prioritizing left side
            if (certificate.images) {
                const imageKeys = ['leftSide', 'rightSide', 'sole'];
                
                for (const key of imageKeys) {
                    if (certificate.images[key]) {
                        const storedImage = sessionStorage.getItem(certificate.images[key]);
                        if (storedImage) {
                            imageUrl = storedImage;
                            break; // Use the first available image
                        }
                    }
                }
            }
            
            // Create certificate card
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md overflow-hidden certificate-card';
            card.innerHTML = `
                <div class="h-48 bg-gray-100 relative">
                    <img src="${imageUrl}" alt="${certificate.sneakerDetails.model}" class="h-full w-full object-contain">
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-semibold">${certificate.sneakerDetails.brand}</h3>
                            <h4 class="text-gray-700">${certificate.sneakerDetails.model}</h4>
                        </div>
                        <div class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Authentic</div>
                    </div>
                    <div class="text-sm text-gray-600 mb-3">
                        <div>Size: ${certificate.sneakerDetails.size}</div>
                        <div>Verified: ${new Date(certificate.issuedAt).toLocaleDateString()}</div>
                    </div>
                    <button class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 view-certificate-btn" data-certificate-id="${certificate.id}">View Certificate</button>
                </div>
            `;
            
            certificatesContainer.appendChild(card);
        });
        
        // Add event listeners to view certificate buttons
        document.querySelectorAll('.view-certificate-btn').forEach(button => {
            button.addEventListener('click', function() {
                const certificateId = this.getAttribute('data-certificate-id');
                const certificate = verifyCertificate(certificateId);
                if (certificate) {
                    displayCertificate(certificate);
                } else {
                    alert('Certificate not found. Please try again.');
                }
            });
        });
    } else {
        document.getElementById('no-certificates').classList.remove('hidden');
        certificatesContainer.classList.add('hidden');
    }
}

// Add transfer certificate functionality
function setupTransferButton() {
    // Add transfer certificate button if not already present
    const certPage = document.getElementById('certificate-page');
    if (certPage) {
        const actionButtons = certPage.querySelector('.flex.justify-between');
        if (actionButtons && !document.getElementById('transfer-cert-btn')) {
            const transferBtn = document.createElement('button');
            transferBtn.id = 'transfer-cert-btn';
            transferBtn.className = 'bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700';
            transferBtn.textContent = 'Transfer Certificate';
            transferBtn.setAttribute('data-certificate-id', '');
            
            // Insert before the download button
            const downloadBtn = document.getElementById('download-cert-btn');
            if (downloadBtn) {
                actionButtons.insertBefore(transferBtn, downloadBtn);
            } else {
                actionButtons.appendChild(transferBtn);
            }
            
            // Add event listener
            transferBtn.addEventListener('click', function() {
                const certificateId = this.getAttribute('data-certificate-id');
                const newOwner = prompt('Enter the wallet address of the new owner:');
                
                if (newOwner && certificateId) {
                    const success = transferCertificate(certificateId, newOwner);
                    if (success) {
                        alert('Certificate transferred successfully!');
                        // Reload certificates or update UI as needed
                        loadCertificatesGallery();
                        // Go back to certificates page
                        showPage('certificates');
                    } else {
                        alert('Failed to transfer certificate.');
                    }
                }
            });
        }
    }
}

// Initialize blockchain module
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing blockchain module...");
    
    // Set up certificate verification form
    const verifyForm = document.getElementById('verify-certificate-form');
    if (verifyForm) {
        verifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const certificateId = document.getElementById('certificate-id-input').value;
            if (!certificateId) {
                alert('Please enter a certificate ID');
                return;
            }
            
            const certificate = verifyCertificate(certificateId);
            if (certificate) {
                displayCertificate(certificate);
            } else {
                alert('Certificate not found. Please check the ID and try again.');
            }
        });
    }
    
    // Set up transfer button when certificate page is shown
    document.addEventListener('pageShown', function(e) {
        if (e.detail.page === 'certificate') {
            setupTransferButton();
            
            // Update transfer button with current certificate ID
            const certId = document.getElementById('cert-page-id').textContent;
            const transferBtn = document.getElementById('transfer-cert-btn');
            if (transferBtn) {
                transferBtn.setAttribute('data-certificate-id', certId);
            }
        }
    });
    
    // Set up certificates page
    const certificatesLink = document.querySelector('.nav-link[data-page="certificates"]');
    if (certificatesLink) {
        certificatesLink.addEventListener('click', function() {
            loadCertificatesGallery();
        });
    }
    
    // Set up "Start Verification" button on certificates page
    const startVerificationBtn = document.getElementById('start-verification-btn');
    if (startVerificationBtn) {
        startVerificationBtn.addEventListener('click', function() {
            showPage('verify');
        });
    }
});

// Function to clear all stored data
function clearAllStoredData() {
    console.log("Clearing all stored data...");
    
    try {
        // Count image entries before clearing
        let imageCount = 0;
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('image_')) {
                imageCount++;
            }
        }
        console.log(`Clearing ${imageCount} images from sessionStorage`);
        
        // Option to keep current user data
        const keepUserData = confirm("Keep current user logged in?");
        let currentUser = null;
        
        if (keepUserData) {
            try {
                currentUser = JSON.parse(localStorage.getItem('currentUser'));
                console.log("Preserving current user data:", currentUser ? currentUser.email : "none");
            } catch (e) {
                console.error("Error parsing current user data:", e);
            }
        }
        
        // Clear all storage
        sessionStorage.clear();
        localStorage.clear();
        
        // Restore user if needed
        if (keepUserData && currentUser) {
            // Keep only essential user data
            const minimalUser = {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                credits: currentUser.credits || 10,
                walletAddress: currentUser.walletAddress || null,
                verificationIds: [],
                certificateIds: []
            };
            
            localStorage.setItem('currentUser', JSON.stringify(minimalUser));
            localStorage.setItem('users', JSON.stringify([minimalUser]));
            console.log("Restored minimal user data");
        } else {
            console.log("All user data cleared");
        }
        
        alert("All stored data has been cleared successfully" + 
              (keepUserData ? ", but your user account was preserved." : ".") +
              "\n\nYou may need to refresh the page for changes to take effect.");
              
        return true;
    } catch (e) {
        console.error("Error clearing stored data:", e);
        alert("There was an error clearing the stored data: " + e.message);
        return false;
    }
}

// Clear only images from sessionStorage
function clearImagesOnly() {
    let imageCount = 0;
    const keysToRemove = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('image_')) {
            keysToRemove.push(key);
            imageCount++;
        }
    }
    
    // Remove all images
    keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
    });
    
    console.log(`Cleared ${imageCount} images from sessionStorage`);
    alert(`Cleared ${imageCount} images from storage.`);
}

// Clear only certificates
function clearCertificatesOnly() {
    // Get certificates count
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const count = certificates.length;
    
    // Clear certificates
    localStorage.setItem('certificates', '[]');
    
    // Update user's certificateIds
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        currentUser.certificateIds = [];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    console.log(`Cleared ${count} certificates from localStorage`);
    alert(`Cleared ${count} certificates from storage.`);
    
    // Reload certificates gallery if on certificates page
    if (document.getElementById('certificates-page').classList.contains('active')) {
        loadCertificatesGallery();
    }
}

// Clear a specific certificate by ID
function clearCertificate(certificateId) {
    if (!certificateId) {
        console.error("No certificate ID provided");
        return false;
    }
    
    console.log(`Attempting to clear certificate: ${certificateId}`);
    
    // Get all certificates
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    
    // Find the certificate
    const certIndex = certificates.findIndex(cert => cert.id === certificateId);
    
    if (certIndex === -1) {
        console.error(`Certificate with ID ${certificateId} not found`);
        return false;
    }
    
    // Get the certificate to find its images
    const certificate = certificates[certIndex];
    
    // Remove certificate from array
    certificates.splice(certIndex, 1);
    
    // Save updated certificates array
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    // Update user's certificateIds
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.certificateIds) {
        currentUser.certificateIds = currentUser.certificateIds.filter(id => id !== certificateId);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Clear associated images if they exist
    if (certificate.images) {
        Object.values(certificate.images).forEach(imageKey => {
            if (imageKey && sessionStorage.getItem(imageKey)) {
                sessionStorage.removeItem(imageKey);
                console.log(`Removed image: ${imageKey}`);
            }
        });
    }
    
    console.log(`Successfully cleared certificate: ${certificateId}`);
    return true;
}

// Clear images for a specific certificate
function clearCertificateImages(certificate) {
    if (!certificate || !certificate.images) {
        console.error("No valid certificate with images provided");
        return 0;
    }
    
    let clearedCount = 0;
    
    // Clear associated images if they exist
    Object.values(certificate.images).forEach(imageKey => {
        if (imageKey && sessionStorage.getItem(imageKey)) {
            sessionStorage.removeItem(imageKey);
            clearedCount++;
            console.log(`Removed image: ${imageKey}`);
        }
    });
    
    console.log(`Cleared ${clearedCount} images for certificate: ${certificate.id}`);
    return clearedCount;
}

// Calculate and display storage usage
function updateStorageUsage() {
    const storageUsageElement = document.getElementById('storage-usage-display');
    if (!storageUsageElement) return;
    
    try {
        // Calculate localStorage usage
        let localStorageSize = 0;
        let certificatesCount = 0;
        let verificationCount = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            localStorageSize += (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
            
            if (key === 'certificates') {
                try {
                    certificatesCount = JSON.parse(value).length;
                } catch (e) {}
            }
            
            if (key === 'verifications') {
                try {
                    verificationCount = JSON.parse(value).length;
                } catch (e) {}
            }
        }
        
        // Calculate sessionStorage usage
        let sessionStorageSize = 0;
        let imageCount = 0;
        
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);
            sessionStorageSize += (key.length + value.length) * 2;
            
            if (key && key.startsWith('image_')) {
                imageCount++;
            }
        }
        
        // Convert to KB
        const localStorageKB = (localStorageSize / 1024).toFixed(2);
        const sessionStorageKB = (sessionStorageSize / 1024).toFixed(2);
        const totalKB = ((localStorageSize + sessionStorageSize) / 1024).toFixed(2);
        
        // Update display
        storageUsageElement.innerHTML = `
            <div class="flex justify-between mb-1">
                <span>Total Storage:</span>
                <span class="font-medium">${totalKB} KB</span>
            </div>
            <div class="flex justify-between mb-1">
                <span>Images:</span>
                <span>${imageCount} images (${sessionStorageKB} KB)</span>
            </div>
            <div class="flex justify-between mb-1">
                <span>Certificates:</span>
                <span>${certificatesCount} certificates</span>
            </div>
            <div class="flex justify-between">
                <span>Verifications:</span>
                <span>${verificationCount} verifications</span>
            </div>
        `;
    } catch (e) {
        console.error("Error calculating storage usage:", e);
        storageUsageElement.textContent = "Error calculating storage usage";
    }
}

// Add button press effect
function addButtonPressEffect() {
    // Add CSS for button press effect if it doesn't exist
    if (!document.getElementById('button-press-style')) {
        const style = document.createElement('style');
        style.id = 'button-press-style';
        style.textContent = `
            .btn-press-effect {
                position: relative;
                overflow: hidden;
                transform: translateY(0);
                transition: transform 0.1s ease-in-out;
            }
            
            .btn-press-effect:active {
                transform: translateY(2px);
            }
            
            .btn-press-effect::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, 0.5);
                opacity: 0;
                border-radius: 100%;
                transform: scale(1, 1) translate(-50%, -50%);
                transform-origin: 50% 50%;
            }
            
            .btn-press-effect:active::after {
                opacity: 1;
                transform: scale(20, 20) translate(-50%, -50%);
                transition: transform 0.3s, opacity 0.3s;
            }
            
            .btn-loading {
                position: relative;
                pointer-events: none;
                color: transparent !important;
            }
            
            .btn-loading::after {
                content: '';
                position: absolute;
                width: 1rem;
                height: 1rem;
                top: calc(50% - 0.5rem);
                left: calc(50% - 0.5rem);
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 0.8s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show loading state on button
function showButtonLoading(button) {
    if (!button) return;
    
    // Store original text
    button.dataset.originalText = button.textContent;
    
    // Add loading class
    button.classList.add('btn-loading');
    
    // Disable button
    button.disabled = true;
}

// Reset button to normal state
function resetButton(button, success = true) {
    if (!button) return;
    
    // Remove loading class
    button.classList.remove('btn-loading');
    
    // Restore original text
    if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
    }
    
    // Add success/error flash
    const flashClass = success ? 'bg-green-500' : 'bg-red-700';
    const originalClass = button.className.replace(flashClass, '');
    
    button.className = `${originalClass} ${flashClass}`;
    
    // Enable button
    button.disabled = false;
    
    // Reset to original class after flash
    setTimeout(() => {
        button.className = originalClass;
    }, 500);
}

// Modify the displayCertificate function to add storage management
function displayCertificate(certificate) {
    console.log("Displaying certificate:", certificate.id);
    // Fill in certificate page details
    document.getElementById('cert-page-id').textContent = certificate.id;
    document.getElementById('cert-page-date').textContent = new Date(certificate.issuedAt).toLocaleDateString();
    document.getElementById('cert-page-brand').textContent = certificate.sneakerDetails.brand;
    document.getElementById('cert-page-model').textContent = certificate.sneakerDetails.model;
    document.getElementById('cert-page-size').textContent = certificate.sneakerDetails.size;
    document.getElementById('cert-page-colorway').textContent = certificate.sneakerDetails.colorway;
    document.getElementById('cert-page-token-id').textContent = certificate.tokenId;
    document.getElementById('cert-page-tx-id').textContent = certificate.transactionId;
    document.getElementById('cert-page-wallet').textContent = certificate.ownerWallet;
    
    // Generate QR code URL (using an external service for demo)
    const qrData = `https://example.com/verify/${certificate.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    // Update QR code image
    const qrContainer = document.getElementById('certificate-qr');
    qrContainer.innerHTML = `<img src="${qrUrl}" alt="Certificate QR Code">`;
    
    // Get image from sessionStorage using the stored URL reference
    let imageUrl = 'https://placehold.co/300x200/e0e0e0/333333?text=Sneaker+Image';
    
    // Try all available images, prioritizing left side
    if (certificate.images) {
        const imageKeys = ['leftSide', 'rightSide', 'sole'];
        
        for (const key of imageKeys) {
            if (certificate.images[key]) {
                const storedImage = sessionStorage.getItem(certificate.images[key]);
                if (storedImage) {
                    imageUrl = storedImage;
                    break; // Use the first available image
                }
            }
        }
    }
    
    // Update certificate image
    const imageContainer = document.getElementById('certificate-image');
    if (imageContainer) {
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Verified Sneaker" class="h-full w-full object-contain">`;
    }
    
    // Add storage management section if it doesn't exist
    addStorageManagementToCertPage(certificate);
    
    // Update transfer button with current certificate ID
    const transferBtn = document.getElementById('transfer-cert-btn');
    if (transferBtn) {
        transferBtn.setAttribute('data-certificate-id', certificate.id);
    }
    
    // Show certificate page
    showPage('certificate');
}

// Add storage management section to certificate page
function addStorageManagementToCertPage(certificate) {
    const certificatePage = document.getElementById('certificate-page');
    if (!certificatePage) return;
    
    // Ensure button press effects are available
    addButtonPressEffect();
    
    // Check if storage management section already exists
    if (document.getElementById('storage-management-section')) {
        // Just update the certificate ID for the delete button
        const deleteCertBtn = document.getElementById('delete-cert-btn');
        if (deleteCertBtn && certificate) {
            deleteCertBtn.setAttribute('data-certificate-id', certificate.id);
        }
        
        // Update the certificate images button
        const clearImagesBtn = document.getElementById('clear-cert-images-btn');
        if (clearImagesBtn && certificate) {
            clearImagesBtn.setAttribute('data-certificate-id', certificate.id);
        }
        
        // Update storage usage
        updateStorageUsage();
        return;
    }
    
    // Create storage management section
    const storageSection = document.createElement('div');
    storageSection.id = 'storage-management-section';
    storageSection.className = 'mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200';
    
    storageSection.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-700">Storage Management</h3>
            <div class="text-sm text-gray-500" id="storage-usage-display">Calculating...</div>
        </div>
        
        <div class="mb-4 p-3 bg-white rounded-md border border-gray-200">
            <h4 class="font-medium mb-2">This Certificate</h4>
            <div class="flex space-x-2">
                <button id="delete-cert-btn" class="btn-press-effect bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors" data-certificate-id="${certificate ? certificate.id : ''}">
                    Delete Certificate
                </button>
                <button id="clear-cert-images-btn" class="btn-press-effect bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600 transition-colors" data-certificate-id="${certificate ? certificate.id : ''}">
                    Clear Certificate Images
                </button>
            </div>
        </div>
        
        <div class="p-3 bg-white rounded-md border border-gray-200">
            <h4 class="font-medium mb-2">All Storage</h4>
            <div class="flex space-x-2">
                <button id="clear-images-btn" class="btn-press-effect bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600 transition-colors">
                    Clear All Images
                </button>
                <button id="clear-certs-btn" class="btn-press-effect bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors">
                    Clear All Certificates
                </button>
                <button id="clear-all-btn" class="btn-press-effect bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors">
                    Clear All Data
                </button>
            </div>
        </div>
    `;
    
    // Find the right place to insert the section
    const certificateContent = certificatePage.querySelector('.bg-white');
    certificateContent.appendChild(storageSection);
    
    // Add event listeners for individual certificate actions
    document.getElementById('delete-cert-btn').addEventListener('click', function() {
        const certId = this.getAttribute('data-certificate-id');
        if (!certId) return;
        
        if (confirm(`Delete certificate ${certId}? This cannot be undone.`)) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                const success = clearCertificate(certId);
                resetButton(button, success);
                
                if (success) {
                    alert(`Certificate ${certId} has been deleted.`);
                    // Redirect to certificates page
                    showPage('certificates');
                    // Reload certificates gallery
                    loadCertificatesGallery();
                } else {
                    alert('Failed to delete certificate.');
                }
            }, 500); // Simulate processing time
        }
    });
    
    document.getElementById('clear-cert-images-btn').addEventListener('click', function() {
        const certId = this.getAttribute('data-certificate-id');
        if (!certId) return;
        
        // Get the certificate
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const certificate = certificates.find(cert => cert.id === certId);
        
        if (certificate && confirm(`Clear images for certificate ${certId}? This cannot be undone.`)) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                const clearedCount = clearCertificateImages(certificate);
                resetButton(button, clearedCount > 0);
                
                alert(`Cleared ${clearedCount} images for certificate ${certId}.`);
                // Refresh the certificate display
                displayCertificate(certificate);
            }, 500); // Simulate processing time
        }
    });
    
    // Add event listeners for all storage actions
    document.getElementById('clear-images-btn').addEventListener('click', function() {
        if (confirm('Clear all stored images? This cannot be undone.')) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                clearImagesOnly();
                resetButton(button);
                updateStorageUsage();
            }, 500); // Simulate processing time
        }
    });
    
    document.getElementById('clear-certs-btn').addEventListener('click', function() {
        if (confirm('Clear all certificates? This cannot be undone. You will be redirected to the home page.')) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                clearCertificatesOnly();
                resetButton(button);
                // Redirect to home page since the certificate was deleted
                showPage('home');
            }, 500); // Simulate processing time
        }
    });
    
    document.getElementById('clear-all-btn').addEventListener('click', function() {
        if (confirm('Clear all stored data? This cannot be undone.')) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                clearAllStoredData();
                resetButton(button);
                // Redirect to home page
                showPage('home');
            }, 500); // Simulate processing time
        }
    });
    
    // Update storage usage
    updateStorageUsage();
}

// Function to clean up certificates
function cleanupCertificates(options = {}) {
    console.log("Cleaning up certificates with options:", options);
    
    try {
        // Get all certificates
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const originalCount = certificates.length;
        
        if (originalCount === 0) {
            console.log("No certificates to clean up");
            return { success: true, message: "No certificates to clean up", removed: 0 };
        }
        
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        let filteredCertificates = [...certificates];
        
        // Option 1: Keep only user's certificates
        if (options.keepOnlyUserCertificates && currentUser) {
            filteredCertificates = certificates.filter(cert => 
                cert.ownerWallet === currentUser.walletAddress || 
                (currentUser.certificateIds && currentUser.certificateIds.includes(cert.id))
            );
            console.log(`Keeping only ${filteredCertificates.length} certificates belonging to current user`);
        }
        
        // Option 2: Keep only recent N certificates
        if (options.keepRecentCount && typeof options.keepRecentCount === 'number') {
            filteredCertificates = filteredCertificates
                .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
                .slice(0, options.keepRecentCount);
            console.log(`Keeping only ${filteredCertificates.length} most recent certificates`);
        }
        
        // Option 3: Remove specific certificate by ID
        if (options.removeCertificateId) {
            filteredCertificates = filteredCertificates.filter(cert => 
                cert.id !== options.removeCertificateId
            );
            console.log(`Removed certificate with ID: ${options.removeCertificateId}`);
        }
        
        // Option 4: Clear all certificates
        if (options.clearAll) {
            filteredCertificates = [];
            console.log("Clearing all certificates");
        }
        
        // Calculate how many were removed
        const removedCount = originalCount - filteredCertificates.length;
        
        // Update localStorage with filtered certificates
        localStorage.setItem('certificates', JSON.stringify(filteredCertificates));
        
        // Update user's certificateIds if needed
        if (currentUser && currentUser.certificateIds) {
            const remainingIds = filteredCertificates.map(cert => cert.id);
            currentUser.certificateIds = currentUser.certificateIds.filter(id => 
                remainingIds.includes(id)
            );
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        console.log(`Cleanup complete. Removed ${removedCount} certificates.`);
        return { 
            success: true, 
            message: `Removed ${removedCount} certificates.`, 
            removed: removedCount,
            remaining: filteredCertificates.length
        };
    } catch (e) {
        console.error("Error cleaning up certificates:", e);
        return { success: false, message: e.message, removed: 0 };
    }
}

// Function to add certificate management UI
function addCertificateManagementUI() {
    console.log("Adding certificate management UI");
    
    // Find certificates page
    const certificatesPage = document.getElementById('certificates-page');
    if (!certificatesPage) {
        console.error("Certificates page not found");
        return;
    }
    
    // Check if management UI already exists
    if (document.getElementById('certificate-management-ui')) {
        console.log("Certificate management UI already exists");
        return;
    }
    
    // Create management UI container
    const managementUI = document.createElement('div');
    managementUI.id = 'certificate-management-ui';
    managementUI.className = 'mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200';
    
    managementUI.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-700">Certificate Management</h3>
            <button id="toggle-cert-management" class="text-sm text-blue-600 hover:text-blue-800">
                Show Options
            </button>
        </div>
        
        <div id="cert-management-options" class="hidden space-y-3">
            <div class="p-3 bg-white rounded-md border border-gray-200">
                <button id="keep-user-certs-btn" class="btn-press-effect w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Keep Only My Certificates
                </button>
            </div>
            
            <div class="p-3 bg-white rounded-md border border-gray-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">Keep Recent Certificates</label>
                <div class="flex space-x-2">
                    <input type="number" id="recent-cert-count" min="1" value="5" class="border border-gray-300 rounded-md px-3 py-2 w-20">
                    <button id="keep-recent-certs-btn" class="btn-press-effect flex-grow bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                        Keep Recent
                    </button>
                </div>
            </div>
            
            <div class="p-3 bg-white rounded-md border border-gray-200">
                <button id="clear-all-certs-btn" class="btn-press-effect w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
                    Clear All Certificates
                </button>
            </div>
        </div>
    `;
    
    // Find the right place to insert the UI
    const certificatesHeader = certificatesPage.querySelector('h2');
    if (certificatesHeader && certificatesHeader.parentNode) {
        certificatesHeader.parentNode.insertBefore(managementUI, certificatesHeader.nextSibling);
    } else {
        // Fallback: insert at the beginning of the page
        certificatesPage.insertBefore(managementUI, certificatesPage.firstChild);
    }
    
    // Add event listeners
    document.getElementById('toggle-cert-management').addEventListener('click', function() {
        const options = document.getElementById('cert-management-options');
        const isHidden = options.classList.contains('hidden');
        
        options.classList.toggle('hidden');
        this.textContent = isHidden ? 'Hide Options' : 'Show Options';
    });
    
    document.getElementById('keep-user-certs-btn').addEventListener('click', function() {
        if (confirm('Keep only your certificates and remove all others?')) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                const result = cleanupCertificates({ keepOnlyUserCertificates: true });
                resetButton(button, result.success);
                
                alert(result.message);
                loadCertificatesGallery(); // Refresh the gallery
            }, 500);
        }
    });
    
    document.getElementById('keep-recent-certs-btn').addEventListener('click', function() {
        const countInput = document.getElementById('recent-cert-count');
        const count = parseInt(countInput.value, 10);
        
        if (isNaN(count) || count < 1) {
            alert('Please enter a valid number greater than 0');
            return;
        }
        
        if (confirm(`Keep only the ${count} most recent certificates and remove all others?`)) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                const result = cleanupCertificates({ keepRecentCount: count });
                resetButton(button, result.success);
                
                alert(result.message);
                loadCertificatesGallery(); // Refresh the gallery
            }, 500);
        }
    });
    
    document.getElementById('clear-all-certs-btn').addEventListener('click', function() {
        if (confirm('Clear ALL certificates? This cannot be undone.')) {
            const button = this;
            showButtonLoading(button);
            
            setTimeout(() => {
                const result = cleanupCertificates({ clearAll: true });
                resetButton(button, result.success);
                
                alert(result.message);
                loadCertificatesGallery(); // Refresh the gallery
            }, 500);
        }
    });
    
    console.log("Certificate management UI added successfully");
}

// Initialize storage management
document.addEventListener('DOMContentLoaded', function() {
    // Listen for certificate page being shown
    document.addEventListener('pageShown', function(e) {
        if (e.detail && e.detail.page === 'certificate') {
            // Update storage usage when certificate page is shown
            updateStorageUsage();
        }
    });
});

// Export functions for use in other modules
window.blockchainModule = {
    createBlockchainCertificate,
    verifyCertificate,
    transferCertificate,
    displayCertificate,
    loadCertificatesGallery,
    cleanupCertificates,
    addCertificateManagementUI,
    clearAllStoredData,
    clearImagesOnly,
    clearCertificatesOnly,
    clearCertificate,
    clearCertificateImages,
    updateStorageUsage,
    addStorageManagementToCertPage,
    addButtonPressEffect,
    showButtonLoading,
    resetButton
};