document.addEventListener('DOMContentLoaded', function() {
    // Load all components
    loadComponent('nav-container', 'components/nav.html');
    loadComponent('home-page-container', 'components/home-page.html');
    loadComponent('auth-pages-container', 'components/auth-pages.html');
    loadComponent('verify-page-container', 'components/verify-page.html');
    loadComponent('verification-result-container', 'components/verification-result.html');
    loadComponent('certificate-page-container', 'components/certificate-page.html');
    loadComponent('certificates-gallery-container', 'components/certificates-gallery.html');
    loadComponent('credits-page-container', 'components/credits-page.html');
    loadComponent('modals-container', 'components/modals.html');
});

// Function to load a component into a container
function loadComponent(containerId, componentPath) {
    const container = document.getElementById(containerId);
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            
            // Dispatch an event to notify that the component has been loaded
            const event = new CustomEvent('componentLoaded', {
                detail: { containerId, componentPath }
            });
            document.dispatchEvent(event);
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 p-4">Failed to load component: ${componentPath}</div>`;
        });
}