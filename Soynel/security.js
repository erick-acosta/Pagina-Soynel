/**
 * Módulo de Seguridad Web - Página Médica Dra. Soynel Marciany
 * Implementa validaciones y protecciones del lado cliente
 */

// Protección contra XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validación de formularios (para futuras implementaciones)
function validateForm(formData) {
    const errors = [];
    
    // Validar nombre
    if (formData.name && formData.name.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Email inválido');
    }
    
    // Validar teléfono
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        errors.push('Teléfono inválido');
    }
    
    return errors;
}

// Protección contra clickjacking
function preventClickjacking() {
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
}

// Validar URLs externas antes de redirección
function validateExternalUrl(url) {
    const allowedDomains = [
        'wa.me',
        'api.whatsapp.com',
        'www.google.com',
        'maps.google.com',
        'cdn.tailwindcss.com'
    ];
    
    try {
        const urlObj = new URL(url);
        return allowedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch (e) {
        return false;
    }
}

// Protección contra ataques de timing
function secureCompare(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
}

// Rate limiting básico para formularios
const rateLimiter = {
    attempts: new Map(),
    maxAttempts: 5,
    timeWindow: 300000, // 5 minutos
    
    isAllowed(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || { count: 0, firstAttempt: now };
        
        // Resetear si ha pasado el tiempo
        if (now - userAttempts.firstAttempt > this.timeWindow) {
            userAttempts.count = 0;
            userAttempts.firstAttempt = now;
        }
        
        if (userAttempts.count >= this.maxAttempts) {
            return false;
        }
        
        userAttempts.count++;
        this.attempts.set(identifier, userAttempts);
        return true;
    }
};

// Detectar y prevenir ataques automatizados
function detectBot() {
    // Verificar si hay propiedades típicas de bots
    const botIndicators = [
        !window.navigator.webdriver === undefined,
        window.navigator.plugins.length === 0,
        window.navigator.languages.length === 0,
        /HeadlessChrome/.test(window.navigator.userAgent)
    ];
    
    return botIndicators.some(indicator => indicator);
}

// Inicialización de seguridad
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar protecciones
    preventClickjacking();
    
    // Validar enlaces externos
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!validateExternalUrl(this.href)) {
                e.preventDefault();
                console.warn('URL externa bloqueada por seguridad:', this.href);
            }
        });
    });
    
    // Detectar posibles bots
    if (detectBot()) {
        console.warn('Posible bot detectado');
    }
    
    // Proteger contra copiar contenido sensible
    document.addEventListener('selectstart', function(e) {
        if (e.target.classList.contains('no-select')) {
            e.preventDefault();
        }
    });
});

// Exportar funciones para uso global
window.SecurityModule = {
    sanitizeInput,
    validateForm,
    validateExternalUrl,
    rateLimiter,
    detectBot
};