// verification.js - Handles sneaker verification process

// Store uploaded images
const uploadedImages = {
    leftSide: null,
    rightSide: null,
    sole: null
};

// Store image URLs instead of full data
const uploadedImageUrls = {
    leftSide: null,
    rightSide: null,
    sole: null
};

// Initialize verification module
function initVerification() {
    console.log("Initializing verification module...");
    
    // Set up image upload buttons
    document.querySelectorAll('.upload-btn').forEach(button => {
        const targetId = button.getAttribute('data-target');
        console.log("Setting up upload button for:", targetId);
        button.addEventListener('click', () => {
            document.getElementById(targetId).click();
        });
    });
    
    // Set up image upload change events
    const leftUpload = document.getElementById('left-side-upload');
    const rightUpload = document.getElementById('right-side-upload');
    const soleUpload = document.getElementById('sole-upload');
    
    console.log("Upload elements found:", 
        leftUpload ? "Left ✓" : "Left ✗", 
        rightUpload ? "Right ✓" : "Right ✗", 
        soleUpload ? "Sole ✓" : "Sole ✗");
    
    if (leftUpload) leftUpload.addEventListener('change', handleImageUpload);
    if (rightUpload) rightUpload.addEventListener('change', handleImageUpload);
    if (soleUpload) soleUpload.addEventListener('change', handleImageUpload);
    
    // Set up verification submission
    document.getElementById('submit-verification-btn').addEventListener('click', submitVerification);
    
    // Add debug button if needed
    const submitBtn = document.getElementById('submit-verification-btn');
    if (submitBtn) {
        const debugBtn = document.createElement('button');
        debugBtn.type = 'button';
        debugBtn.id = 'debug-images-btn';
        debugBtn.className = 'ml-2 text-sm text-gray-500';
        debugBtn.textContent = 'Debug Images';
        debugBtn.addEventListener('click', function() {
            console.log("Current uploaded images:");
            console.log("leftSide:", uploadedImages.leftSide ? "Present" : "Missing");
            console.log("rightSide:", uploadedImages.rightSide ? "Present" : "Missing");
            console.log("sole:", uploadedImages.sole ? "Present" : "Missing");
        });
        submitBtn.parentNode.insertBefore(debugBtn, submitBtn.nextSibling);
    }
}

// Image compression function
function compressImage(dataUrl, quality = 0.5) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            
            // Calculate new dimensions (max 800px width/height)
            let width = img.width;
            let height = img.height;
            const maxDimension = 800;
            
            if (width > height && width > maxDimension) {
                height = Math.round(height * (maxDimension / width));
                width = maxDimension;
            } else if (height > maxDimension) {
                width = Math.round(width * (maxDimension / height));
                height = maxDimension;
            }
            
            // Set canvas dimensions to the new size
            canvas.width = width;
            canvas.height = height;
            
            // Draw the image on the canvas with the new dimensions
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get the compressed image as a data URL
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // Log compression stats
            const originalSize = Math.round(dataUrl.length / 1024);
            const compressedSize = Math.round(compressedDataUrl.length / 1024);
            console.log(`Image compressed from ${originalSize}KB to ${compressedSize}KB (${Math.round((compressedSize/originalSize)*100)}%)`);
            
            resolve(compressedDataUrl);
        };
        img.src = dataUrl;
    });
}

// Handle image upload with compression
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const inputId = event.target.id;
    const previewId = inputId.replace('upload', 'preview');
    
    // Fix the image type extraction
    let imageType;
    if (inputId === 'left-side-upload') {
        imageType = 'leftSide';
    } else if (inputId === 'right-side-upload') {
        imageType = 'rightSide';
    } else if (inputId === 'sole-upload') {
        imageType = 'sole';
    }
    
    console.log("Input ID:", inputId, "Image Type:", imageType);
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        // Compress the image before storing
        compressImage(e.target.result, 0.5).then(compressedImage => {
            // Store compressed image data temporarily
            uploadedImages[imageType] = compressedImage;
            
            // For storage, create a placeholder URL
            uploadedImageUrls[imageType] = `image_${imageType}_${Date.now()}`;
            
            console.log("Stored compressed image for:", imageType);
            
            // Update preview
            const previewElement = document.getElementById(previewId);
            previewElement.innerHTML = '';
            
            const img = document.createElement('img');
            img.src = compressedImage;
            img.classList.add('h-full', 'w-full', 'object-contain');
            previewElement.appendChild(img);
        });
    };
    
    reader.readAsDataURL(file);
}

// Clear old images from sessionStorage
function clearOldSessionStorageImages() {
    // Find and remove old image entries
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('image_')) {
            keysToRemove.push(key);
        }
    }
    
    // Remove old images (keep the 3 newest ones)
    if (keysToRemove.length > 3) {
        keysToRemove.sort((a, b) => {
            const timeA = parseInt(a.split('_').pop() || '0');
            const timeB = parseInt(b.split('_').pop() || '0');
            return timeA - timeB;
        });
        
        // Remove all but the 3 newest
        const toRemove = keysToRemove.slice(0, keysToRemove.length - 3);
        toRemove.forEach(key => {
            sessionStorage.removeItem(key);
            console.log("Removed old image from sessionStorage:", key);
        });
    }
}

// Submit verification - UPDATED
function submitVerification() {
    // Check if user is logged in
    if (!currentUser) {
        showPage('login');
        return;
    }
    
    // Debug what images we have
    console.log("Checking uploaded images:");
    console.log("leftSide:", uploadedImages.leftSide ? "Present" : "Missing");
    console.log("rightSide:", uploadedImages.rightSide ? "Present" : "Missing");
    console.log("sole:", uploadedImages.sole ? "Present" : "Missing");
    
    // Check if all images are uploaded
    const leftPreview = document.getElementById('left-side-preview');
    const rightPreview = document.getElementById('right-side-preview');
    const solePreview = document.getElementById('sole-preview');
    
    const hasLeftImage = leftPreview.querySelector('img') !== null;
    const hasRightImage = rightPreview.querySelector('img') !== null;
    const hasSoleImage = solePreview.querySelector('img') !== null;
    
    if (!hasLeftImage || !hasRightImage || !hasSoleImage) {
        alert('Please upload all required images');
        return;
    }
    
    // Get sneaker details
    const brand = document.getElementById('sneaker-brand').value;
    const model = document.getElementById('sneaker-model').value;
    const size = document.getElementById('sneaker-size').value;
    const colorway = document.getElementById('sneaker-colorway').value;
    
    // Validate form
    if (!brand || !model || !size || !colorway) {
        alert('Please fill in all sneaker details');
        return;
    }
    
    // Check if user has enough credits
    if (currentUser.credits < 2) {
        alert('You need at least 2 credits to verify a sneaker. Please purchase more credits.');
        showPage('credits');
        return;
    }
    
    // Create verification object with image URLs instead of full data
    const verification = {
        id: 'VRF-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        userId: currentUser.id,
        brand,
        model,
        size,
        colorway,
        images: {
            leftSide: uploadedImageUrls.leftSide,
            rightSide: uploadedImageUrls.rightSide,
            sole: uploadedImageUrls.sole
        },
        status: 'processing',
        submittedAt: new Date().toISOString()
    };
    
    // Clear old images to make space for new ones
    clearOldSessionStorageImages();
    
    // Store the actual images in sessionStorage instead of localStorage
    // This keeps them available for the current session but doesn't exceed localStorage quota
    try {
        // Try to store all images
        if (uploadedImages.leftSide) {
            try {
                sessionStorage.setItem(uploadedImageUrls.leftSide, uploadedImages.leftSide);
            } catch (e) {
                console.warn("Could not store left side image:", e);
                // Try to clear some space and retry with even more compression
                clearOldSessionStorageImages();
                compressImage(uploadedImages.leftSide, 0.3).then(veryCompressedImage => {
                    try {
                        sessionStorage.setItem(uploadedImageUrls.leftSide, veryCompressedImage);
                    } catch (e2) {
                        console.error("Failed to store even compressed left image:", e2);
                    }
                });
            }
        }
        
        if (uploadedImages.rightSide) {
            try {
                sessionStorage.setItem(uploadedImageUrls.rightSide, uploadedImages.rightSide);
            } catch (e) {
                console.warn("Could not store right side image:", e);
                // Only try to store one image if we're having storage issues
            }
        }
        
        if (uploadedImages.sole) {
            try {
                sessionStorage.setItem(uploadedImageUrls.sole, uploadedImages.sole);
            } catch (e) {
                console.warn("Could not store sole image:", e);
                // Only try to store one image if we're having storage issues
            }
        }
    } catch (e) {
        console.warn("Could not store images in sessionStorage:", e);
        // Continue anyway - we'll use the preview images for display
    }
    
    // Deduct credits
    deductCreditsFromUser(currentUser.id, 2);
    
    // CRITICAL CHANGE: Store only the current verification in a separate key
    // instead of adding it to the user's verifications array
    try {
        // Store the verification separately
        const verifications = JSON.parse(localStorage.getItem('verifications') || '[]');
        verifications.push(verification);
        
        // Limit to last 10 verifications to save space
        if (verifications.length > 10) {
            verifications.splice(0, verifications.length - 10);
        }
        
        localStorage.setItem('verifications', JSON.stringify(verifications));
        
        // Update current user's verification IDs only (not the full data)
        if (!currentUser.verificationIds) currentUser.verificationIds = [];
        currentUser.verificationIds.push(verification.id);
        
        // Limit to last 10 verification IDs
        if (currentUser.verificationIds.length > 10) {
            currentUser.verificationIds.splice(0, currentUser.verificationIds.length - 10);
        }
        
        // Remove old verifications array to save space
        if (currentUser.verifications) {
            delete currentUser.verifications;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update users array - only update the specific user's verification IDs
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            // Only update verification IDs, not full verifications
            users[userIndex].verificationIds = currentUser.verificationIds;
            
            // Remove old verifications array to save space
            if (users[userIndex].verifications) {
                delete users[userIndex].verifications;
            }
            
            localStorage.setItem('users', JSON.stringify(users));
        }
    } catch (e) {
        console.error("Error storing verification data:", e);
        alert("There was an error storing your verification data. The verification will continue but may not be saved permanently.");
        
        // Emergency cleanup to free space
        emergencyStorageCleanup();
    }
    
    // Show verification result page
    showPage('verification-result');
    
    // Start verification process
    processVerification(verification);
}

// Emergency cleanup to free storage space
function emergencyStorageCleanup() {
    try {
        // Keep only essential data
        const currentUserData = localStorage.getItem('currentUser');
        const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
        
        // Clear almost everything
        localStorage.clear();
        
        // Restore minimal user data
        if (currentUser) {
            // Keep only essential user data
            const minimalUser = {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                credits: currentUser.credits || 0
            };
            
            localStorage.setItem('currentUser', JSON.stringify(minimalUser));
            
            // Create a minimal users array with just this user
            localStorage.setItem('users', JSON.stringify([minimalUser]));
        }
        
        console.warn("Emergency storage cleanup performed");
    } catch (e) {
        console.error("Error during emergency cleanup:", e);
    }
}

// Process verification (simulate AI analysis)
function processVerification(verification) {
    // Show loading state
    document.getElementById('verification-loading').classList.remove('hidden');
    document.getElementById('verification-complete').classList.add('hidden');
    
    // Simulate AI processing delay
    setTimeout(() => {
        // Generate random result (for demo purposes)
        const isAuthentic = Math.random() > 0.3; // 70% chance of authentic
        const confidenceScore = isAuthentic ? 
            Math.floor(Math.random() * 15) + 85 : // 85-99% for authentic
            Math.floor(Math.random() * 30) + 40;  // 40-69% for fake
        
        // Generate analysis points
        const analysisPoints = generateAnalysisPoints(isAuthentic, verification.brand);
        
        // Update verification with results
        verification.result = {
            isAuthentic,
            confidenceScore,
            analysisPoints,
            completedAt: new Date().toISOString()
        };
        verification.status = 'completed';
        
        // Update verification in storage
        updateVerificationInStorage(verification);
        
        // If authentic, create blockchain certificate
        let certificate = null;
        if (isAuthentic) {
            // Add user address for blockchain certificate
            verification.userAddress = currentUser.walletAddress || ('0x' + Math.random().toString(36).substr(2, 40));
            verification.isAuthentic = true;
            
            // Call the blockchain module to create certificate
            try {
                // Use the blockchain module if available, otherwise fall back to local function
                if (window.blockchainModule && window.blockchainModule.createBlockchainCertificate) {
                    certificate = window.blockchainModule.createBlockchainCertificate(verification);
                } else {
                    console.warn("Blockchain module not found, using local fallback");
                    certificate = createLocalCertificate(verification);
                }
                
                try {
                    // Store certificate ID only, not the full certificate
                    if (!currentUser.certificateIds) currentUser.certificateIds = [];
                    currentUser.certificateIds.push(certificate.id);
                    
                    // Limit to last 10 certificate IDs
                    if (currentUser.certificateIds.length > 10) {
                        currentUser.certificateIds.splice(0, currentUser.certificateIds.length - 10);
                    }
                    
                    // Remove old certificates array to save space
                    if (currentUser.certificates) {
                        delete currentUser.certificates;
                    }
                    
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Update users array - only update the specific user's certificate IDs
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const userIndex = users.findIndex(u => u.id === currentUser.id);
                    if (userIndex !== -1) {
                        // Only update certificate IDs, not full certificates
                        users[userIndex].certificateIds = currentUser.certificateIds;
                        
                        // Remove old certificates array to save space
                        if (users[userIndex].certificates) {
                            delete users[userIndex].certificates;
                        }
                        
                        localStorage.setItem('users', JSON.stringify(users));
                    }
                } catch (e) {
                    console.error("Error storing certificate data:", e);
                    alert("There was an error storing your certificate data. The certificate was created but may not be saved permanently.");
                    
                    // Emergency cleanup to free space
                    emergencyStorageCleanup();
                }
            } catch (error) {
                console.error("Error creating blockchain certificate:", error);
                alert("There was an error creating your blockchain certificate. Please try again later.");
            }
        }
        
        // Display results
        displayVerificationResults(verification, certificate);
    }, 3000);
}

// Local fallback function for creating certificates if blockchain module is not available
function createLocalCertificate(verification) {
    // Generate certificate ID
    const certificateId = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Generate mock Hedera token ID
    const tokenId = '0.0.' + Math.floor(Math.random() * 1000000);
    
    // Generate mock transaction ID
    const transactionId = '0.0.' + Math.floor(Math.random() * 1000000) + '@' + Math.floor(Date.now() / 1000);
    
    // Generate mock wallet address if not provided
    const walletAddress = verification.userAddress || ('0x' + Math.random().toString(36).substr(2, 40));
    
    // Create certificate object
    const certificate = {
        id: certificateId,
        verificationId: verification.id,
        tokenId: tokenId,
        transactionId: transactionId,
        ownerWallet: walletAddress,
        sneakerDetails: {
            brand: verification.brand,
            model: verification.model,
            size: verification.size,
            colorway: verification.colorway
        },
        images: verification.images,
        issuedAt: new Date().toISOString(),
        issuer: 'SneakerVerify Platform'
    };
    
    // Store certificate in localStorage
    try {
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        certificates.push(certificate);
        localStorage.setItem('certificates', JSON.stringify(certificates));
    } catch (e) {
        console.error("Error storing certificate in localStorage:", e);
    }
    
    return certificate;
}

// Update verification in localStorage
function updateVerificationInStorage(verification) {
    try {
        // Update in verifications array
        const verifications = JSON.parse(localStorage.getItem('verifications') || '[]');
        const verificationIndex = verifications.findIndex(v => v.id === verification.id);
        if (verificationIndex !== -1) {
            verifications[verificationIndex] = verification;
            localStorage.setItem('verifications', JSON.stringify(verifications));
        }
    } catch (e) {
        console.error("Error updating verification in storage:", e);
    }
}

// Generate analysis points based on authenticity
function generateAnalysisPoints(isAuthentic, brand) {
    const authenticPoints = [
        "Stitching pattern matches authentic reference samples",
        "Material quality consistent with manufacturer standards",
        "Logo placement and proportions are correct",
        "Barcode and serial number validated against database",
        "Sole pattern and texture match authentic design"
    ];
    
    const fakePoints = [
        "Irregular stitching pattern detected",
        "Material quality inconsistent with authentic samples",
        "Logo placement slightly off-center",
        "Barcode does not match official database records",
        "Color shade varies from authentic reference"
    ];
    
    // Add brand-specific points
    if (brand === 'nike') {
        authenticPoints.push("Nike swoosh shape and proportions are correct");
        fakePoints.push("Nike swoosh shape has irregular curves");
    } else if (brand === 'adidas') {
        authenticPoints.push("Adidas three stripes spacing is consistent with authentic pairs");
        fakePoints.push("Adidas three stripes spacing is inconsistent");
    } else if (brand === 'jordan') {
        authenticPoints.push("Jumpman logo proportions match authentic reference");
        fakePoints.push("Jumpman logo has incorrect proportions");
    }
    
    // Return appropriate points based on authenticity
    if (isAuthentic) {
        // Return 3-5 random authentic points
        return shuffleArray(authenticPoints).slice(0, Math.floor(Math.random() * 3) + 3);
    } else {
        // Return 2-4 random fake points
        return shuffleArray(fakePoints).slice(0, Math.floor(Math.random() * 3) + 2);
    }
}

// Display verification results
function displayVerificationResults(verification, certificate) {
    // Hide loading, show results
    document.getElementById('verification-loading').classList.add('hidden');
    document.getElementById('verification-complete').classList.remove('hidden');
    
    // Show appropriate result section
    if (verification.result.isAuthentic) {
        document.getElementById('result-authentic').classList.remove('hidden');
        document.getElementById('result-fake').classList.add('hidden');
        document.getElementById('certificate-section').classList.remove('hidden');
    } else {
        document.getElementById('result-authentic').classList.add('hidden');
        document.getElementById('result-fake').classList.remove('hidden');
        document.getElementById('certificate-section').classList.add('hidden');
    }
    
    // Fill in result details
    document.getElementById('result-brand').textContent = verification.brand;
    document.getElementById('result-model').textContent = verification.model;
    document.getElementById('result-confidence').textContent = `${verification.result.confidenceScore}%`;
    document.getElementById('result-verification-id').textContent = verification.id;
    
    // Fill in analysis points
    const analysisContainer = document.getElementById('result-analysis');
    analysisContainer.innerHTML = '';
    verification.result.analysisPoints.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        analysisContainer.appendChild(li);
    });
    
    // Fill in certificate details if authentic
    if (certificate) {
        document.getElementById('certificate-id').textContent = certificate.id;
        
        // Add event listener to view certificate button
        const viewCertBtn = document.getElementById('view-certificate-btn');
        if (viewCertBtn) {
            viewCertBtn.setAttribute('data-certificate-id', certificate.id);
            viewCertBtn.addEventListener('click', function() {
                const certId = this.getAttribute('data-certificate-id');
                
                // Use blockchain module if available
                if (window.blockchainModule && window.blockchainModule.displayCertificate) {
                    const cert = window.blockchainModule.verifyCertificate(certId);
                    if (cert) {
                        window.blockchainModule.displayCertificate(cert);
                    } else {
                        alert('Certificate not found. Please try again.');
                    }
                } else {
                    // Fallback to local display
                    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
                    const cert = certificates.find(c => c.id === certId);
                    if (cert) {
                        displayCertificate(cert);
                    } else {
                        alert('Certificate not found. Please try again.');
                    }
                }
            });
        }
    }
}

// Local fallback for displaying certificate if blockchain module is not available
function displayCertificate(certificate) {
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
    
    // Try to get the image from sessionStorage
    let imageUrl = 'https://placehold.co/300x200/e0e0e0/333333?text=Sneaker+Image';
    if (certificate.images && certificate.images.leftSide) {
        const storedImage = sessionStorage.getItem(certificate.images.leftSide);
        if (storedImage) {
            imageUrl = storedImage;
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

// Helper function to get image data from storage
function getImageData(imageUrl) {
    // Try to get from sessionStorage first
    const imageData = sessionStorage.getItem(imageUrl);
    if (imageData) return imageData;
    
    // If not in sessionStorage, return a placeholder
    return 'https://placehold.co/300x200/e0e0e0/333333?text=Sneaker+Image';
}

// Helper function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Initialize verification module on page load
document.addEventListener('DOMContentLoaded', function() {
    initVerification();
});