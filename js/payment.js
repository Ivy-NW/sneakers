// payment.js - Handles credit purchases and payment processing

// Selected package details
let selectedPackage = {
    credits: 10,
    price: 450 // Price in KES
};

// Initialize payment module
function initPayment() {
    // Set up package selection
    document.querySelectorAll('.select-package-btn').forEach(button => {
        button.addEventListener('click', function() {
            const packageElement = this.closest('.credit-package');
            const credits = parseInt(packageElement.getAttribute('data-credits'));
            const price = parseInt(packageElement.getAttribute('data-price'));
            
            selectedPackage = { credits, price };
            
            // Update summary
            updatePaymentSummary();
            
            // Show payment section
            document.getElementById('payment-section').classList.remove('hidden');
            
            // Scroll to payment section
            document.getElementById('payment-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Set up payment method selection
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const method = this.value;
            
            // Hide all payment forms
            document.getElementById('card-payment-form').classList.add('hidden');
            document.getElementById('paypal-payment-form').classList.add('hidden');
            document.getElementById('crypto-payment-form').classList.add('hidden');
            document.getElementById('mpesa-payment-form').classList.add('hidden');
            
            // Show selected payment form
            document.getElementById(`${method}-payment-form`).classList.remove('hidden');
            
            // Update HBAR amount if crypto selected
            if (method === 'crypto') {
                // Simulate HBAR price: KES 10 per HBAR
                const hbarAmount = Math.round(selectedPackage.price / 10);
                document.getElementById('hbar-amount').textContent = hbarAmount;
            }
        });
    });
    
    // Set up change package button
    document.getElementById('change-package-btn').addEventListener('click', function() {
        document.getElementById('payment-section').classList.add('hidden');
    });
    
    // Set up complete payment button
    document.getElementById('complete-payment-btn').addEventListener('click', processPayment);
    
    // Set up M-Pesa STK push button
    document.getElementById('mpesa-stk-btn').addEventListener('click', initiateSTKPush);
    
    // Set up success modal close button
    document.getElementById('success-close-btn').addEventListener('click', function() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.getElementById('success-modal').classList.add('hidden');
        showPage('home');
    });
}

// Update payment summary
function updatePaymentSummary() {
    document.getElementById('summary-credits').textContent = `${selectedPackage.credits} Credits`;
    document.getElementById('summary-price').textContent = `KES ${selectedPackage.price.toLocaleString()}`;
    document.getElementById('summary-total').textContent = `KES ${selectedPackage.price.toLocaleString()}`;
}

// Initiate M-Pesa STK Push
function initiateSTKPush() {
    const phoneNumber = document.getElementById('mpesa-phone').value;
    
    // Validate phone number (simple validation for Kenya numbers)
    if (!phoneNumber || !/^(?:254|\+254|0)?(7[0-9]{8})$/.test(phoneNumber)) {
        alert('Please enter a valid Kenyan phone number');
        return;
    }
    
    // Format phone number to required format (254XXXXXXXXX)
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
    } else if (phoneNumber.startsWith('+')) {
        formattedPhone = phoneNumber.substring(1);
    }
    
    // Show loading state
    document.getElementById('mpesa-stk-btn').textContent = 'Processing...';
    document.getElementById('mpesa-stk-btn').disabled = true;
    
    // Simulate API call to M-Pesa STK push
    setTimeout(() => {
        // In a real implementation, this would be an API call to your backend
        // which would then call the M-Pesa API
        
        // Show confirmation message
        document.getElementById('mpesa-form').classList.add('hidden');
        document.getElementById('mpesa-confirmation').classList.remove('hidden');
        
        // Simulate payment completion after 5 seconds
        setTimeout(() => {
            // Add credits to user account
            addCreditsToUser(currentUser.id, selectedPackage.credits);
            
            // Create payment record
            const payment = {
                id: 'MPESA-' + Math.random().toString(36).substr(2, 9),
                userId: currentUser.id,
                amount: selectedPackage.price,
                credits: selectedPackage.credits,
                method: 'mpesa',
                phoneNumber: formattedPhone,
                status: 'completed',
                timestamp: new Date().toISOString()
            };
            
            // Store payment record
            const payments = JSON.parse(localStorage.getItem('payments') || '[]');
            payments.push(payment);
            localStorage.setItem('payments', JSON.stringify(payments));
            
            // Show success modal
            document.getElementById('modal-overlay').classList.remove('hidden');
            document.getElementById('success-modal').classList.remove('hidden');
            
            // Reset M-Pesa form
            document.getElementById('mpesa-form').classList.remove('hidden');
            document.getElementById('mpesa-confirmation').classList.add('hidden');
            document.getElementById('mpesa-stk-btn').textContent = 'Pay with M-Pesa';
            document.getElementById('mpesa-stk-btn').disabled = false;
            document.getElementById('mpesa-phone').value = '';
        }, 5000);
    }, 2000);
}

// Process payment
function processPayment() {
    // Check if user is logged in
    if (!currentUser) {
        showPage('login');
        return;
    }
    
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // For M-Pesa, we handle it separately with the STK push button
    if (paymentMethod === 'mpesa') {
        return;
    }
    
    // Validate payment details based on method
    if (paymentMethod === 'card') {
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;
        
        if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
            alert('Please fill in all card details');
            return;
        }
        
        // Simple validation for demo
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            alert('Invalid card number');
            return;
        }
    }
    
    // Simulate payment processing
    setTimeout(() => {
        // Add credits to user account
        addCreditsToUser(currentUser.id, selectedPackage.credits);
        
        // Create payment record
        const payment = {
            id: 'PAY-' + Math.random().toString(36).substr(2, 9),
            userId: currentUser.id,
            amount: selectedPackage.price,
            credits: selectedPackage.credits,
            method: paymentMethod,
            status: 'completed',
            timestamp: new Date().toISOString()
        };
        
        // Store payment record
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        payments.push(payment);
        localStorage.setItem('payments', JSON.stringify(payments));
        
        // Show success modal
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('success-modal').classList.remove('hidden');
    }, 1500);
}

// Add credits to user account
function addCreditsToUser(userId, creditsToAdd) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        // Add credits to user
        users[userIndex].credits = (users[userIndex].credits || 0) + creditsToAdd;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user object
        currentUser.credits = users[userIndex].credits;
        
        // Update credits display in the UI
        document.getElementById('user-credits').textContent = `${currentUser.credits} Credits`;
    }
}

// Initialize payment module on page load
document.addEventListener('DOMContentLoaded', initPayment);