document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Check if user is logged in
    checkUserAuthentication();
    
    // Initialize animations
    initAnimations();
  });
  
  /**
   * Initialize the application
   */
  function initApp() {
    // Setup navigation
    setupNavigation();
    
    // Setup form submissions
    setupForms();
    
    // Setup interactive elements
    setupInteractiveElements();
    
    // Setup testimonial slider
    setupTestimonialSlider();
    
    // Setup count animation for stats
    setupCountAnimation();
    
    // Initialize verification steps
    initVerificationSteps();
    
    // Setup payment methods
    setupPaymentMethods();
    
    // Setup profile and settings tabs
    setupTabNavigation();
    
    // Setup mobile menu
    setupMobileMenu();
  }
  
  /**
   * Check if user is authenticated
   */
  function checkUserAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (isLoggedIn === 'true') {
      authButtons.style.display = 'none';
      userMenu.style.display = 'block';
      
      // Load user data
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        document.querySelector('.user-name').textContent = userData.name;
        const userAvatarImages = document.querySelectorAll('.user-avatar img');
        userAvatarImages.forEach(img => {
          img.src = userData.avatar;
        });
      }
    } else {
      authButtons.style.display = 'flex';
      userMenu.style.display = 'none';
    }
    
    // Setup logout button
    document.getElementById('logout-btn').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userData');
      window.location.reload();
    });
  }
  
  /**
   * Setup navigation between pages
   */
  function setupNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetPage = this.getAttribute('data-page');
        navigateToPage(targetPage);
      });
    });
    
    // Check if URL has a hash for direct navigation
    if (window.location.hash) {
      const targetPage = window.location.hash.substring(1);
      navigateToPage(targetPage);
    }
  }
  
  /**
   * Navigate to a specific page
   * @param {string} pageId - The ID of the page to navigate to
   */
  function navigateToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show the target page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
      
      // Update active nav links
      document.querySelectorAll('[data-page]').forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Update URL hash
      window.location.hash = pageId;
      
      // Close mobile menu if open
      const mobileMenu = document.querySelector('.mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
      }
    }
  }
  
  /**
   * Setup form submissions
   */
  function setupForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Basic validation
        if (!email || !password) {
          showToast('Please fill in all fields', 'error');
          return;
        }
        
        // Simulate login (in a real app, this would make an API call)
        simulateLogin(email, password);
      });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('register-first-name').value;
        const lastName = document.getElementById('register-last-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          showToast('Please fill in all fields', 'error');
          return;
        }
        
        if (password !== confirmPassword) {
          showToast('Passwords do not match', 'error');
          return;
        }
        
        // Simulate registration (in a real app, this would make an API call)
        simulateRegistration(firstName, lastName, email, password);
      });
      
      // Password strength checker
      const passwordInput = document.getElementById('register-password');
      passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
      });
    }
    
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Profile updated successfully', 'success');
      });
    }
    
    // Shipping form
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
      shippingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Shipping information updated', 'success');
      });
    }
    
    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
          showToast('Please fill in all fields', 'error');
          return;
        }
        
        if (newPassword !== confirmPassword) {
          showToast('New passwords do not match', 'error');
          return;
        }
        
        showToast('Password updated successfully', 'success');
        passwordForm.reset();
      });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('You have been subscribed to the newsletter', 'success');
        newsletterForm.reset();
      });
    }
    
    // Credit card form
    const creditCardForm = document.getElementById('credit-card-form');
    if (creditCardForm) {
      // Add input masks for credit card
      const cardNumberInput = document.getElementById('card-number');
      if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
          this.value = formatCreditCardNumber(this.value);
        });
      }
      
      const expiryDateInput = document.getElementById('expiry-date');
      if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
          this.value = formatExpiryDate(this.value);
        });
      }
      
      const cvvInput = document.getElementById('cvv');
      if (cvvInput) {
        cvvInput.addEventListener('input', function() {
          this.value = this.value.replace(/\D/g, '').slice(0, 3);
        });
      }
    }
  }
  
  /**
   * Simulate user login
   * @param {string} email - User email
   * @param {string} password - User password
   */
  function simulateLogin(email, password) {
    // In a real app, this would make an API call to authenticate the user
    // For the prototype, we'll simulate a successful login
    
    // Simulate API delay
    showToast('Logging in...', 'info');
    
    setTimeout(() => {
      // Store login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      // Store user data
      const userData = {
        name: 'John Doe',
        email: email,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        credits: 15
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      showToast('Login successful!', 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigateToPage('dashboard');
        window.location.reload(); // Force reload to update UI based on login state
      }, 1000);
    }, 1500);
  }
  
  /**
   * Simulate user registration
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @param {string} email - User email
   * @param {string} password - User password
   */
  function simulateRegistration(firstName, lastName, email, password) {
    // In a real app, this would make an API call to register the user
    // For the prototype, we'll simulate a successful registration
    
    // Simulate API delay
    showToast('Creating your account...', 'info');
    
    setTimeout(() => {
      // Store login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      // Store user data
      const userData = {
        name: `${firstName} ${lastName}`,
        email: email,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        credits: 10 // Start with 10 free credits
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      showToast('Registration successful!', 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigateToPage('dashboard');
        window.location.reload(); // Force reload to update UI based on login state
      }, 1000);
    }, 1500);
  }
  
  /**
   * Update password strength indicator
   * @param {string} password - The password to check
   */
  function updatePasswordStrength(password) {
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthMeter || !strengthText) return;
    
    // Reset all segments
    const segments = strengthMeter.querySelectorAll('.strength-segment');
    segments.forEach(segment => {
      segment.style.backgroundColor = 'var(--gray-300)';
    });
    
    // Define strength criteria
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    // Calculate score (0-4)
    let score = 0;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    if (isLongEnough) score++;
    
    // Map score to strength level (0-4)
    let strengthLevel = 0;
    if (password.length === 0) {
      strengthLevel = 0;
    } else if (score === 1) {
      strengthLevel = 1; // Very Weak
    } else if (score === 2) {
      strengthLevel = 2; // Weak
    } else if (score === 3) {
      strengthLevel = 3; // Medium
    } else if (score >= 4) {
      strengthLevel = 4; // Strong
    }
    
    // Update visual indicators
    for (let i = 0; i < strengthLevel; i++) {
      if (i < segments.length) {
        const color = getStrengthColor(strengthLevel);
        segments[i].style.backgroundColor = color;
      }
    }
    
    // Update text
    const strengthLabels = ['Empty', 'Very Weak', 'Weak', 'Medium', 'Strong'];
    strengthText.textContent = `Password strength: ${strengthLabels[strengthLevel]}`;
    strengthText.style.color = getStrengthColor(strengthLevel);
  }
  
  /**
   * Get color for password strength
   * @param {number} level - Strength level (0-4)
   * @returns {string} Color value
   */
  function getStrengthColor(level) {
    switch (level) {
      case 0: return 'var(--gray-300)';
      case 1: return 'var(--danger)';
      case 2: return 'var(--warning)';
      case 3: return 'var(--secondary)';
      case 4: return 'var(--success)';
      default: return 'var(--gray-300)';
    }
  }
  
  /**
   * Format credit card number with spaces
   * @param {string} value - The input value
   * @returns {string} Formatted credit card number
   */
  function formatCreditCardNumber(value) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limited = digits.slice(0, 16);
    
    // Add spaces after every 4 digits
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  
  /**
   * Format expiry date as MM/YY
   * @param {string} value - The input value
   * @returns {string} Formatted expiry date
   */
  function formatExpiryDate(value) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 4 digits
    const limited = digits.slice(0, 4);
    
    // Format as MM/YY
    if (limited.length > 2) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    
    return limited;
  }
  
  /**
   * Setup interactive elements
   */
  function setupInteractiveElements() {
    // Photo upload boxes
    const photoUploadBoxes = document.querySelectorAll('.photo-upload-box');
    photoUploadBoxes.forEach(box => {
      const input = box.querySelector('input[type="file"]');
      
      box.addEventListener('click', function() {
        input.click();
      });
      
      input.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            // Create image element
            const img = document.createElement('img');
            img.src = e.target.result;
            
            // Clear box content
            box.innerHTML = '';
            box.appendChild(img);
            
            // Add uploaded class
            box.classList.add('uploaded');
          };
          
          reader.readAsDataURL(this.files[0]);
        }
      });
    });
    
    // Connect wallet buttons
    const connectWalletBtns = document.querySelectorAll('.connect-wallet');
    connectWalletBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        showToast('Connecting to wallet...', 'info');
        
        // Simulate connection
        setTimeout(() => {
          // Show connected wallet UI
          const cryptoDetails = document.querySelector('.crypto-details');
          if (cryptoDetails) {
            cryptoDetails.style.display = 'block';
          }
          
          const connectedWallet = document.querySelector('.connected-wallet');
          const walletStatus = document.querySelector('.wallet-status');
          
          if (connectedWallet && walletStatus) {
            connectedWallet.style.display = 'block';
            walletStatus.style.display = 'none';
          }
          
          showToast('Wallet connected successfully', 'success');
        }, 1500);
      });
    });
    
    // Disconnect wallet buttons
    const disconnectWalletBtns = document.querySelectorAll('.disconnect-wallet');
    disconnectWalletBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        showToast('Disconnecting wallet...', 'info');
        
        // Simulate disconnection
        setTimeout(() => {
          // Hide connected wallet UI
          const cryptoDetails = document.querySelector('.crypto-details');
          if (cryptoDetails) {
            cryptoDetails.style.display = 'none';
          }
          
          const connectedWallet = document.querySelector('.connected-wallet');
          const walletStatus = document.querySelector('.wallet-status');
          
          if (connectedWallet && walletStatus) {
            connectedWallet.style.display = 'none';
            walletStatus.style.display = 'block';
          }
          
          showToast('Wallet disconnected', 'success');
        }, 1000);
      });
    });
    
    // Copy buttons
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const input = this.closest('.address-copy, .link-copy').querySelector('input');
        
        if (input) {
          // Select and copy text
          input.select();
          document.execCommand('copy');
          
          // Deselect
          input.blur();
          
          showToast('Copied to clipboard!', 'success');
        }
      });
    });
    
    // Theme toggle
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        themeBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get theme
        const theme = this.getAttribute('data-theme');
        
        // Apply theme
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        
        // Store preference
        localStorage.setItem('theme', theme);
        
        showToast(`Theme changed to ${theme}`, 'success');
      });
    });
    
    // Clear cache button
    const clearCacheBtn = document.querySelector('.clear-cache');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', function() {
        showToast('Clearing cache...', 'info');
        
        // Simulate clearing cache
        setTimeout(() => {
          // Clear sessionStorage (don't clear localStorage as it contains auth state)
          sessionStorage.clear();
          
          showToast('Cache cleared successfully', 'success');
        }, 1000);
      });
    }
    
    // Certificate action buttons
    const viewCertificateBtns = document.querySelectorAll('.btn-view-certificate');
    viewCertificateBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('certificate-modal');
      });
    });
    
    // Modal close buttons
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        closeModal();
      });
    });
    
    // Share certificate button
    const shareCertificateBtn = document.querySelector('.share-certificate');
    if (shareCertificateBtn) {
      shareCertificateBtn.addEventListener('click', function() {
        closeModal();
        setTimeout(() => {
          openModal('share-modal');
        }, 300);
      });
    }
    
    // QR code view
    const viewQRBtns = document.querySelectorAll('.certificate-actions-dropdown .dropdown-menu a:nth-child(3)');
    viewQRBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('qr-code-modal');
      });
    });
    
    // Package selection
    const packageBtns = document.querySelectorAll('.select-package');
    packageBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Update summary
        const packageName = this.closest('.package-card').querySelector('.package-name').textContent;
        const packageCredits = this.closest('.package-card').querySelector('.package-credits').textContent;
        const packagePrice = this.closest('.package-card').querySelector('.package-price').textContent;
        
        document.querySelector('.package-name-display').textContent = packageName;
        document.querySelector('.credits-display').textContent = packageCredits;
        document.querySelector('.total-display').textContent = packagePrice;
        
        // Scroll to payment section
        document.querySelector('.payment-section').scrollIntoView({ behavior: 'smooth' });
        
        // Highlight the button
        packageBtns.forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-outline');
        });
        this.classList.remove('btn-outline');
        this.classList.add('btn-primary');
      });
    });
    
    // Complete purchase button
    const purchaseBtn = document.querySelector('.complete-purchase');
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', function() {
        const activePaymentTab = document.querySelector('.payment-tab.active');
        const paymentMethod = activePaymentTab ? activePaymentTab.getAttribute('data-payment') : 'credit-card';
        
        // Show processing toast
        showToast('Processing payment...', 'info');
        
        // Simulate payment processing
        setTimeout(() => {
          // Show success toast
          showToast('Payment successful! Credits added to your account.', 'success');
          
          // Update credit balance
          const creditsDisplay = document.getElementById('user-credits');
          if (creditsDisplay) {
            const currentCredits = parseInt(creditsDisplay.textContent);
            const newCredits = currentCredits + 50; // Assuming standard package
            creditsDisplay.textContent = newCredits;
            
            // Update in localStorage
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.credits = newCredits;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
          
          // Redirect to dashboard
          setTimeout(() => {
            navigateToPage('dashboard');
          }, 1000);
        }, 2000);
      });
    }
  }
  
  /**
   * Setup testimonial slider
   */
  function setupTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-controls .prev-btn');
    const nextBtn = document.querySelector('.testimonial-controls .next-btn');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    
    // Show a specific slide
    function showSlide(index) {
      // Hide all slides
      slides.forEach(slide => {
        slide.classList.remove('active');
      });
      
      // Remove active class from all dots
      dots.forEach(dot => {
        dot.classList.remove('active');
      });
      
      // Show the current slide
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      
      // Update current slide index
      currentSlide = index;
    }
    
    // Setup dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
      });
    });
    
    // Setup prev/next buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
      });
    }
    
    // Auto-rotate slides
    setInterval(() => {
      const newIndex = (currentSlide + 1) % slides.length;
      showSlide(newIndex);
    }, 5000);
  }
  
  /**
   * Setup count animation for stats
   */
  function setupCountAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (!statNumbers.length) return;
    
    // Use Intersection Observer to trigger counting when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-count'));
          
          // Start from 0
          let current = 0;
          
          // Calculate step based on target value
          const step = Math.max(1, Math.floor(target / 100));
          
          // Set interval for counting animation
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            element.textContent = current.toLocaleString();
          }, 20);
          
          // Unobserve after triggering
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all stat numbers
    statNumbers.forEach(stat => {
      observer.observe(stat);
    });
  }
  
  /**
   * Initialize verification steps
   */
  function initVerificationSteps() {
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    if (!steps.length || !stepContents.length) return;
    
    // Go to a specific step
    function goToStep(stepNumber) {
      // Update steps
      steps.forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        if (stepNum <= stepNumber) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
      
      // Update step content
      stepContents.forEach(content => {
        const contentNum = parseInt(content.getAttribute('data-step-content'));
        if (contentNum === stepNumber) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
      
      // Scroll to top of step container
      const stepContainer = document.querySelector('.verify-steps');
      if (stepContainer) {
        stepContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Setup next buttons
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentStep = parseInt(this.closest('.step-content').getAttribute('data-step-content'));
        const nextStep = currentStep + 1;
        
        // If on the last step, simulate verification completion
        if (nextStep === 4) {
          // Start verification simulation
          simulateVerification();
        }
        
        goToStep(nextStep);
      });
    });
    
    // Setup previous buttons
    prevButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentStep = parseInt(this.closest('.step-content').getAttribute('data-step-content'));
        const prevStep = currentStep - 1;
        
        if (prevStep >= 1) {
          goToStep(prevStep);
        }
      });
    });
  }
  
  /**
   * Simulate the verification process
   */
  function simulateVerification() {
    // Get elements
    const progressBar = document.querySelector('.progress');
    const statusMessage = document.querySelector('.status-message');
    const verificationSteps = document.querySelectorAll('.verification-step');
    
    if (!progressBar || !statusMessage || !verificationSteps.length) return;
    
    // Initial progress
    let progress = 30;
    progressBar.style.width = `${progress}%`;
    
    // Update progress every 1.5 seconds
    const interval = setInterval(() => {
      progress += 20;
      progressBar.style.width = `${progress}%`;
      
      if (progress >= 50) {
        // Update step 2 status (AI Analysis)
        verificationSteps[1].classList.remove('active');
        verificationSteps[1].querySelector('.step-icon i').classList.remove('fa-spinner', 'fa-spin');
        verificationSteps[1].querySelector('.step-icon i').classList.add('fa-check');
        
        // Start step 3 (Expert Review)
        verificationSteps[2].classList.add('active');
        verificationSteps[2].querySelector('.step-icon i').classList.add('fa-spinner', 'fa-spin');
        statusMessage.textContent = 'Expert review in progress...';
      }
      
      if (progress >= 90) {
        // Update step 3 status (Expert Review)
        verificationSteps[2].classList.remove('active');
        verificationSteps[2].querySelector('.step-icon i').classList.remove('fa-spinner', 'fa-spin');
        verificationSteps[2].querySelector('.step-icon i').classList.add('fa-check');
        
        // Start step 4 (Certificate Issuance)
        verificationSteps[3].classList.add('active');
        verificationSteps[3].querySelector('.step-icon i').classList.add('fa-spinner', 'fa-spin');
        statusMessage.textContent = 'Creating blockchain certificate...';
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Complete verification
        progressBar.style.width = '100%';
        
        // Update final step
        verificationSteps[3].classList.remove('active');
        verificationSteps[3].querySelector('.step-icon i').classList.remove('fa-spinner', 'fa-spin');
        verificationSteps[3].querySelector('.step-icon i').classList.add('fa-check');
        
        // Update icon and status
        const verificationIcon = document.querySelector('.verification-icon');
        verificationIcon.classList.remove('processing');
        verificationIcon.classList.add('success');
        verificationIcon.innerHTML = '<i class="fas fa-check"></i>';
        
        document.querySelector('.verification-status h2').textContent = 'Verification Complete';
        statusMessage.textContent = 'Your sneakers have been authenticated!';
        
        // Show success toast
        showToast('Verification completed successfully!', 'success');
        
        // Show auth result modal after a delay
        setTimeout(() => {
          openModal('auth-result-modal');
        }, 1000);
      }
    }, 1500);
  }
  
  /**
   * Setup payment methods
   */
  function setupPaymentMethods() {
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentContents = document.querySelectorAll('.payment-content');
    
    if (!paymentTabs.length || !paymentContents.length) return;
    
    paymentTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const paymentMethod = this.getAttribute('data-payment');
        
        // Update active tab
        paymentTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding content
        paymentContents.forEach(content => {
          if (content.getAttribute('data-payment-content') === paymentMethod) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  }
  
  /**
   * Setup profile and settings tabs
   */
  function setupTabNavigation() {
    // Profile tabs
    setupTabSystem('.profile-navigation a', '[data-profile-tab]', '[data-profile-content]');
    
    // Settings tabs
    setupTabSystem('.settings-nav a', '[data-settings-tab]', '[data-settings-content]');
  }
  
  /**
   * Setup a tab navigation system
   * @param {string} tabSelector - Selector for tab links
   * @param {string} tabAttr - Data attribute for tabs
   * @param {string} contentAttr - Data attribute for content
   */
  function setupTabSystem(tabSelector, tabAttr, contentAttr) {
    const tabLinks = document.querySelectorAll(tabSelector);
    
    if (!tabLinks.length) return;
    
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const tabValue = this.getAttribute(tabAttr);
        
        // Update active tab
        tabLinks.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding content
        const contentElements = document.querySelectorAll(`[${contentAttr}]`);
        contentElements.forEach(content => {
          if (content.getAttribute(contentAttr) === tabValue) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  }
  
  /**
   * Setup mobile menu
   */
  function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenuBtn) return;
    
    // Create mobile menu if it doesn't exist
    if (!document.querySelector('.mobile-menu')) {
      createMobileMenu();
    }
    
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
      // Toggle mobile menu
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
      
      // Animate hamburger icon
      this.classList.toggle('active');
    });
  }
  
  /**
   * Create mobile menu structure
   */
  function createMobileMenu() {
    // Create mobile menu element
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Clone navigation links
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    navLinks.className = 'mobile-nav-links';
    
    // Clone auth buttons
    const authButtons = document.querySelector('.auth-buttons').cloneNode(true);
    authButtons.className = 'mobile-auth-buttons';
    
    // Clone user menu
    const userMenu = document.querySelector('.user-menu').cloneNode(true);
    userMenu.className = 'mobile-user-menu';
    userMenu.style.display = localStorage.getItem('isLoggedIn') === 'true' ? 'block' : 'none';
    
    // Add to mobile menu
    mobileMenu.appendChild(userMenu);
    mobileMenu.appendChild(navLinks);
    mobileMenu.appendChild(authButtons);
    
    // Add mobile menu to body
    document.body.appendChild(mobileMenu);
    
    // Setup mobile navigation
    mobileMenu.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetPage = this.getAttribute('data-page');
        navigateToPage(targetPage);
      });
    });
  }
  
  /**
   * Initialize animations
   */
  function initAnimations() {
    // Scroll animations using IntersectionObserver
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all animated elements
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }
  
  /**
   * Open a modal
   * @param {string} modalId - The ID of the modal to open
   */
  function openModal(modalId) {
    const modalContainer = document.getElementById('modal-container');
    const modal = document.getElementById(modalId);
    
    if (!modalContainer || !modal) return;
    
    // Close any open modals
    document.querySelectorAll('.modal').forEach(m => {
      m.classList.remove('active');
    });
    
    // Open modal container
    modalContainer.classList.add('active');
    
    // Open specific modal
    modal.classList.add('active');
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modalContainer.addEventListener('click', function(e) {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', handleEscKey);
  }
  
  /**
   * Close the open modal
   */
  function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    
    if (!modalContainer) return;
    
    // Close all modals
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
    
    // Close container
    modalContainer.classList.remove('active');
    
    // Allow scrolling
    document.body.style.overflow = '';
    
    // Remove escape key handler
    document.removeEventListener('keydown', handleEscKey);
  }
  
  /**
   * Handle escape key press to close modal
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleEscKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  
  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, warning, info)
   */
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    switch (type) {
      case 'success': icon = 'check-circle'; break;
      case 'error': icon = 'exclamation-circle'; break;
      case 'warning': icon = 'exclamation-triangle'; break;
    }
    
    // Set content
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Setup close button
    toast.querySelector('.toast-close').addEventListener('click', function() {
      toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  }