// Configurações globais
const CONFIG = {
  ANIMATION_DURATION: 300,
  SCROLL_THRESHOLD: 300,
  HEADER_HIDE_THRESHOLD: 100,
  FORM_SUBMIT_DELAY: 1500,
  SUCCESS_MESSAGE_DURATION: 2000
};

// Estado da aplicação
const AppState = {
  isMenuOpen: false,
  isLoading: false,
  lastScrollTop: 0
};

// Elementos DOM
const Elements = {
  hamburger: null,
  sidebar: null,
  sidebarOverlay: null,
  closeSidebarBtn: null,
  header: null,
  backToTopBtn: null,
  contactForm: null,
  loadingOverlay: null,
  cards: null
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  initializeEventListeners();
  initializeAnimations();
  initializeFormValidation();
  
  // Remove loading overlay após carregamento completo
  window.addEventListener('load', function() {
    hideLoadingOverlay();
  });
});

// Inicializar elementos DOM
function initializeElements() {
  Elements.hamburger = document.getElementById('hamburger');
  Elements.sidebar = document.getElementById('sidebar');
  Elements.sidebarOverlay = document.getElementById('sidebarOverlay');
  Elements.closeSidebarBtn = document.getElementById('closeSidebar');
  Elements.header = document.querySelector('.header');
  Elements.backToTopBtn = document.getElementById('backToTop');
  Elements.contactForm = document.getElementById('contactForm');
  Elements.loadingOverlay = document.getElementById('loadingOverlay');
  Elements.cards = document.querySelectorAll('.card');
}

// Inicializar event listeners
function initializeEventListeners() {
  // Menu mobile
  if (Elements.hamburger) {
    Elements.hamburger.addEventListener('click', toggleSidebar);
  }
  
  if (Elements.closeSidebarBtn) {
    Elements.closeSidebarBtn.addEventListener('click', closeSidebar);
  }
  
  if (Elements.sidebarOverlay) {
    Elements.sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Scroll events
  window.addEventListener('scroll', throttle(handleScroll, 16));
  
  // Back to top button
  if (Elements.backToTopBtn) {
    Elements.backToTopBtn.addEventListener('click', scrollToTop);
  }

  // Smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll);
  });

  // Links do sidebar
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // Form submission
  if (Elements.contactForm) {
    Elements.contactForm.addEventListener('submit', handleFormSubmit);
  }

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Menu mobile functions
function toggleSidebar() {
  if (AppState.isMenuOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  if (!Elements.sidebar || !Elements.hamburger || !Elements.sidebarOverlay) return;
  
  AppState.isMenuOpen = true;
  Elements.sidebar.classList.add('open');
  Elements.hamburger.classList.add('active');
  Elements.hamburger.setAttribute('aria-expanded', 'true');
  Elements.sidebarOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Focus no primeiro link do menu
  const firstLink = Elements.sidebar.querySelector('a');
  if (firstLink) {
    setTimeout(() => firstLink.focus(), CONFIG.ANIMATION_DURATION);
  }
}

function closeSidebar() {
  if (!Elements.sidebar || !Elements.hamburger || !Elements.sidebarOverlay) return;
  
  AppState.isMenuOpen = false;
  Elements.sidebar.classList.remove('open');
  Elements.hamburger.classList.remove('active');
  Elements.hamburger.setAttribute('aria-expanded', 'false');
  Elements.sidebarOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

// Scroll handling
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Header hide/show
  if (Elements.header) {
    if (scrollTop > AppState.lastScrollTop && scrollTop > CONFIG.HEADER_HIDE_THRESHOLD) {
      Elements.header.style.transform = 'translateY(-100%)';
    } else {
      Elements.header.style.transform = 'translateY(0)';
    }
  }
  
  // Back to top button
  if (Elements.backToTopBtn) {
    if (scrollTop > CONFIG.SCROLL_THRESHOLD) {
      Elements.backToTopBtn.classList.add('visible');
    } else {
      Elements.backToTopBtn.classList.remove('visible');
    }
  }
  
  AppState.lastScrollTop = scrollTop;
}

// Smooth scroll
function handleSmoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  if (targetElement) {
    const headerHeight = Elements.header ? Elements.header.offsetHeight : 0;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Animações de entrada
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observar cards
  Elements.cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
    observer.observe(card);
  });
}

// Validação de formulário
function initializeFormValidation() {
  if (!Elements.contactForm) return;

  const inputs = Elements.contactForm.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = '';

  // Limpar erro anterior
  clearFieldError(field);

  // Validações específicas
  switch (fieldName) {
    case 'nome':
      if (!value) {
        errorMessage = 'Nome é obrigatório';
        isValid = false;
      } else if (value.length < 2) {
        errorMessage = 'Nome deve ter pelo menos 2 caracteres';
        isValid = false;
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMessage = 'E-mail é obrigatório';
        isValid = false;
      } else if (!emailRegex.test(value)) {
        errorMessage = 'E-mail inválido';
        isValid = false;
      }
      break;

    case 'telefone':
      if (value) {
        const phoneRegex = /^[\d\s$$$$\-\+]+$/;
        if (!phoneRegex.test(value)) {
          errorMessage = 'Telefone inválido';
          isValid = false;
        }
      }
      break;

    case 'mensagem':
      if (!value) {
        errorMessage = 'Mensagem é obrigatória';
        isValid = false;
      } else if (value.length < 10) {
        errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
        isValid = false;
      }
      break;
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorElement = document.getElementById(`${field.name}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function clearFieldError(field) {
  field.classList.remove('error');
  const errorElement = document.getElementById(`${field.name}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

// Submissão do formulário
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (AppState.isLoading) return;

  const formData = new FormData(Elements.contactForm);
  const fields = Elements.contactForm.querySelectorAll('input[required], textarea[required]');
  let isFormValid = true;

  // Validar todos os campos obrigatórios
  fields.forEach(field => {
    if (!validateField(field)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    // Focar no primeiro campo com erro
    const firstError = Elements.contactForm.querySelector('.error');
    if (firstError) {
      firstError.focus();
    }
    return;
  }

  // Simular envio
  submitForm(formData);
}

function submitForm(formData) {
  const submitBtn = document.getElementById('submitBtn');
  const originalContent = submitBtn.innerHTML;
  
  AppState.isLoading = true;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Enviando...</span>';
  
  showLoadingOverlay();

  // Simular delay de envio
  setTimeout(() => {
    hideLoadingOverlay();
    submitBtn.innerHTML = '<span>Mensagem Enviada!</span>';
    
    // Resetar formulário após sucesso
    setTimeout(() => {
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
      Elements.contactForm.reset();
      AppState.isLoading = false;
      
      // Mostrar mensagem de sucesso
      showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    }, CONFIG.SUCCESS_MESSAGE_DURATION);
    
  }, CONFIG.FORM_SUBMIT_DELAY);
}

// Loading overlay
function showLoadingOverlay() {
  if (Elements.loadingOverlay) {
    Elements.loadingOverlay.classList.add('active');
  }
}

function hideLoadingOverlay() {
  if (Elements.loadingOverlay) {
    Elements.loadingOverlay.classList.remove('active');
  }
}

// Mensagem de sucesso
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div class="success-content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  // Adicionar estilos inline
  successDiv.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  
  successDiv.querySelector('.success-content').style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  
  document.body.appendChild(successDiv);
  
  // Animar entrada
  setTimeout(() => {
    successDiv.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 5 segundos
  setTimeout(() => {
    successDiv.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 300);
  }, 5000);
}

// Navegação por teclado
function handleKeyboardNavigation(e) {
  // Fechar sidebar com ESC
  if (e.key === 'Escape' && AppState.isMenuOpen) {
    closeSidebar();
  }
  
  // Atalhos de teclado
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'k':
        e.preventDefault();
        // Focar no primeiro link de navegação
        const firstNavLink = document.querySelector('.nav a');
        if (firstNavLink) firstNavLink.focus();
        break;
    }
  }
}

// Utility functions
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Formatação de telefone
function formatPhone(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length >= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length >= 7) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length >= 3) {
    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  }
  
  input.value = value;
}

// Aplicar formatação de telefone
document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('telefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      formatPhone(this);
    });
  }
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
  });
}

// Service Worker registration (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
      })
      .catch(function(registrationError) {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
