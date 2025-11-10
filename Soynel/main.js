/**
 * Scripts principales - Página Dra. Soynel Marciany
 * Funcionalidad de UI, navegación y seguridad
 */

// Protección contra clickjacking
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// Validar URLs externas
function validateExternalUrl(url) {
    const allowedDomains = ['wa.me', 'api.whatsapp.com', 'cdn.tailwindcss.com', 'google.com', 'maps.google.com'];
    try {
        const urlObj = new URL(url);
        return allowedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch (e) {
        return false;
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Validar enlaces externos
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!validateExternalUrl(this.href)) {
                e.preventDefault();
                console.warn('URL externa bloqueada:', this.href);
            }
        });
    });
});