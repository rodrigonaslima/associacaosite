// Função para inicializar AOS (Animate On Scroll)
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
        console.log("AOS Initialized");
    } else {
        console.error("AOS library not loaded or init failed.");
    }
}

// Função para inicializar rolagem suave e fechar menu mobile
function initSmoothScrollAndMobileMenu() {
    // Seleciona links DEPOIS que o header for carregado
    const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link[href^="#"], a.btn[href^="#"], .mobile-bottom-nav a[href^="#"]'); 
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Tenta pegar a altura da navbar DEPOIS de carregada
                    const navbarElement = document.querySelector('#navbar-placeholder .navbar');
                    const headerHeight = navbarElement ? navbarElement.offsetHeight : 70; // Usa 70px como fallback
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // Offset extra

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Fechar menu mobile após clicar (se navbar estiver carregada)
                    if (navbarElement) {
                         const navbarCollapse = navbarElement.querySelector('.navbar-collapse');
                         const navbarToggler = navbarElement.querySelector('.navbar-toggler');
                         if (navbarCollapse && navbarToggler && navbarCollapse.classList.contains('show')) {
                            navbarToggler.click();
                         }
                    }
                     // Fechar menu mobile inferior se clicar nele mesmo (se existir)
                     const mobileNav = document.querySelector('.mobile-bottom-nav');
                     if (mobileNav && this.closest('.mobile-bottom-nav')) {
                         // Lógica para fechar se necessário (normalmente não precisa)
                     }
                }
            }
        });
    });
    console.log("Smooth Scroll Initialized");
}

// Função para destacar item de menu ativo no scroll (Scrollspy)
function initScrollspy() {
    const navbarElement = document.querySelector('#navbar-placeholder .navbar');
    if (!navbarElement) return; // Não faz nada se a navbar não carregou

    const navLinks = navbarElement.querySelectorAll('.navbar-nav .nav-link[href^="#"]'); // Apenas links internos
    const sections = document.querySelectorAll('section[id]');

    // Remove a classe active inicial fixa do HTML (o JS vai controlar)
    navLinks.forEach(link => link.classList.remove('active')); 

    function highlightActiveMenuItem() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - (navbarElement.offsetHeight + 50); // Ajuste offset
            const sectionHeight = section.offsetHeight;
            
            // Verifica se a seção está visível
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Adiciona/Remove classe active
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // Verifica se o link corresponde à seção atual E se o link é interno
             if (linkHref === `#${currentSectionId}` && sections.length > 0) { 
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Caso especial: Se estiver no topo, ativa o link 'Início' (se houver)
        const homeLink = navbarElement.querySelector('.navbar-nav .nav-link[href="index.html"]'); // Ou o link exato da home
         if (scrollPosition < sections[0].offsetTop - (navbarElement.offsetHeight + 50) && homeLink && sections.length > 0) {
             navLinks.forEach(link => link.classList.remove('active'));
             // Ativa o link da Home se existir (ajuste o seletor se necessário)
             // homeLink.classList.add('active'); 
         }
    }

    // Otimização: Usar throttle/debounce seria melhor aqui
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(highlightActiveMenuItem, 100); // Executa 100ms após parar de rolar (simples debounce)
    });
    highlightActiveMenuItem(); // Executa uma vez ao carregar
    console.log("Scrollspy Initialized");
}


// Função para inicializar botão de voltar ao topo
function initBackToTop() {
     const backToTopButton = document.getElementById('back-to-top'); // Seleciona DEPOIS do footer carregar
     if (backToTopButton) {
         // Listener de scroll para mostrar/esconder
         window.addEventListener('scroll', function() {
             if (window.pageYOffset > 300) {
                 backToTopButton.classList.add('show');
             } else {
                 backToTopButton.classList.remove('show');
             }
         });
         // Listener de clique para rolar ao topo
          backToTopButton.addEventListener('click', () => {
             window.scrollTo({ top: 0, behavior: 'smooth' });
         });
         console.log("Back-to-Top Initialized");
     } else {
         console.error("Back-to-Top button not found after footer load.");
     }
}

// Função para inicializar efeito de scroll na navbar
function initNavbarScrollEffect() {
    const navbarElement = document.querySelector('#navbar-placeholder .navbar'); // Seleciona DEPOIS de carregar
    if (navbarElement) {
         const handleScroll = () => {
             navbarElement.classList.toggle('scrolled', window.pageYOffset > 50);
         };
         
         window.addEventListener('scroll', handleScroll);
         handleScroll(); // Verifica o estado inicial
         console.log("Navbar Scroll Effect Initialized");
    } else {
         console.error("Navbar element not found after header load.");
    }
}

// Função para inicializar contadores (melhorada)
function initCounters() {
    const counters = document.querySelectorAll('.counter, .counter-value'); // Seleciona ambos os tipos
    if (counters.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const counterOptions = { root: null, threshold: 0.5 };

    const animateCounter = (counter) => {
        // Tenta pegar de 'data-count' ou 'data-target', senão usa o texto
        const target = +counter.getAttribute('data-count') || +counter.getAttribute('data-target') || parseInt(counter.innerText.replace(/\D/g,'')) || 0;
        const duration = 1500; 
        const incrementTime = 10; 
        const totalSteps = duration / incrementTime;
        const incrementValue = target / totalSteps;
        let currentValue = 0;
        const suffix = counter.innerText.includes('+') ? '+' : ''; // Guarda o sufixo se existir
        counter.innerText = '0' + suffix; // Começa do zero, mantendo sufixo

        const updateCount = () => {
            currentValue += incrementValue;
            if (currentValue < target) {
                counter.innerText = Math.ceil(currentValue) + suffix;
                setTimeout(updateCount, incrementTime);
            } else {
                counter.innerText = target + suffix; 
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); 
            }
        });
    }, counterOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
    console.log("Counters Initialized");
}

// Função para inicializar formulários (Doação, Voluntário, Parceria)
function initForms() {
    // Lógica do formulário de doação (valor, pagamento)
     const donationForms = document.querySelectorAll('.donation-form'); // Seleciona todos os forms de doação
     donationForms.forEach(form => {
         const amountButtons = form.querySelectorAll('.amount-btn');
         const customAmountInput = form.querySelector('.custom-amount input');

         amountButtons.forEach(button => {
             button.addEventListener('click', function() {
                 amountButtons.forEach(btn => btn.classList.remove('active'));
                 this.classList.add('active');
                 if (customAmountInput) customAmountInput.value = ''; 
                 const mainValueInput = form.querySelector('input[name="donation_value"], input[name="donation_value_monthly"]');
                 if(mainValueInput) mainValueInput.value = this.getAttribute('data-value');
             });
         });

         if (customAmountInput) {
             customAmountInput.addEventListener('input', function() { 
                 const valueExists = Array.from(amountButtons).some(btn => btn.getAttribute('data-value') === this.value);
                  if(!valueExists){
                     amountButtons.forEach(btn => btn.classList.remove('active'));
                  } else {
                      amountButtons.forEach(btn => {
                          btn.classList.toggle('active', btn.getAttribute('data-value') === this.value);
                      });
                  }
                  const mainValueInput = form.querySelector('input[name="donation_value"], input[name="donation_value_monthly"]');
                  if(mainValueInput) mainValueInput.value = this.value;
             });
             if(customAmountInput.value) customAmountInput.dispatchEvent(new Event('input')); 
         }

         // Lógica de visibilidade dos campos de pagamento (unificada)
         const setupPaymentFields = (formSelector, paymentSelector, ccFieldsId, debitFieldsId = null) => {
            const paymentMethods = document.querySelectorAll(`${formSelector} input[name="${paymentSelector}"]`);
            const creditCardFields = document.getElementById(ccFieldsId);
            const debitFields = debitFieldsId ? document.getElementById(debitFieldsId) : null;

            if (!paymentMethods.length || !creditCardFields) return;

             const updateFields = (selectedValue) => {
                 const isCreditCard = (selectedValue === 'credit-card');
                 const isDebit = (selectedValue === 'debit');
                 
                 creditCardFields.classList.toggle('d-none', !isCreditCard);
                 creditCardFields.querySelectorAll('input').forEach(input => input.required = isCreditCard);

                 if (debitFields) {
                    debitFields.classList.toggle('d-none', !isDebit);
                    debitFields.querySelectorAll('input, select').forEach(input => input.required = isDebit);
                 }
             };

            paymentMethods.forEach(method => method.addEventListener('change', (e) => updateFields(e.target.value)));
            const checkedMethod = document.querySelector(`${formSelector} input[name="${paymentSelector}"]:checked`);
            updateFields(checkedMethod ? checkedMethod.value : paymentMethods[0].value); // Inicializa com o primeiro ou o checado
         };

         if (form.id === 'donation-form-single') {
             setupPaymentFields('#donation-form-single', 'payment_method', 'credit-card-fields');
         } else if (form.id === 'donation-form-monthly') {
             setupPaymentFields('#donation-form-monthly', 'payment_method_monthly', 'credit-card-fields-monthly', 'debit-fields-monthly');
         }

         // Submissão (exemplo)
         form.addEventListener('submit', function(e) {
             e.preventDefault();
             // Validação básica interna
             let isValid = true;
             const requiredFields = form.querySelectorAll('[required]:not([disabled])'); // Ignora campos desabilitados
             requiredFields.forEach(field => {
                 // Verifica se campos visíveis estão preenchidos
                  const parentHidden = field.closest('.d-none'); // Verifica se o campo está dentro de uma div escondida
                 if (!parentHidden && !field.value.trim()) {
                     field.classList.add('is-invalid');
                     isValid = false;
                 } else {
                     field.classList.remove('is-invalid');
                 }
             });

              if (!isValid) {
                 alert('Por favor, preencha todos os campos obrigatórios.');
                 return; 
             }

             // Se válido, simula envio
             const submitButton = this.querySelector('button[type="submit"]');
             const originalText = submitButton.innerText;
             submitButton.disabled = true;
             submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...`;

             setTimeout(() => {
                 alert('Formulário enviado com sucesso! (Simulação)'); // Mensagem genérica
                 this.reset(); 
                 submitButton.disabled = false;
                 submitButton.innerText = originalText;
                 
                 // Resetar estado visual dos formulários de doação
                 const defaultAmountBtn = this.querySelector('.amount-btn:nth-child(2)'); 
                  amountButtons.forEach(btn => btn.classList.remove('active')); 
                  if(defaultAmountBtn){
                     defaultAmountBtn.classList.add('active'); 
                     const mainValueInput = form.querySelector('input[name="donation_value"], input[name="donation_value_monthly"]');
                     if(mainValueInput) mainValueInput.value = defaultAmountBtn.getAttribute('data-value'); 
                  } else if (customAmountInput) {
                      customAmountInput.value = ''; 
                  }
                 const paymentRadios = form.querySelectorAll('input[type="radio"][name^="payment_method"]');
                 if (paymentRadios.length > 0) {
                     paymentRadios[0].checked = true; 
                     paymentRadios[0].dispatchEvent(new Event('change')); 
                 }
                 form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));


             }, 1500);
         });
          // Limpar erro ao digitar
          form.querySelectorAll('input, textarea, select').forEach(field => {
             field.addEventListener('input', function() {
                 if (this.value.trim()) { this.classList.remove('is-invalid'); }
             });
             field.addEventListener('change', function() { // Para selects
                 if (this.value) { this.classList.remove('is-invalid'); }
             });
         });
     });

    // Lógica para forms de voluntário e parceria (apenas o reset e alerta)
     document.querySelectorAll('.volunteer-form, .partnership-form').forEach(form => {
         form.addEventListener('submit', function(e) {
              e.preventDefault();
               // Adicionar validação se necessário
               alert('Formulário enviado com sucesso! (Simulação)');
               this.reset();
         });
     });


    console.log("Forms Initialized");
}

// Função para inicializar componentes mobile específicos (nav, accordion, etc.)
function initMobileFunctions() {
    if (window.innerWidth >= 768) return; // Roda só em mobile

    // Ativar classe no body se bottom nav existir
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (bottomNav) {
         document.body.classList.add('has-bottom-nav');
          // Ativar link ativo no bottom nav (similar ao loadPartials)
         const mobileNavLinks = bottomNav.querySelectorAll('a');
         const currentPath = window.location.pathname.split('/').pop();
         mobileNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
             link.classList.remove('active');
             if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.html')) {
                 if (!link.classList.contains('mobile-donate')) { // Não ativa o botão DOE
                    link.classList.add('active');
                 }
             }
         });
    }

    // Ativar acordeões mobile
    document.querySelectorAll('.mobile-accordion-button').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content && content.classList.contains('mobile-accordion-content')) {
                 // Animação simples com max-height
                 if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                 } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                 }
            }
        });
    });

     // Implementar feedback tátil (vibração)
     if ('vibrate' in navigator) {
         document.querySelectorAll('button, .btn, .nav-link, a[href^="#"]').forEach(element => {
             element.addEventListener('click', () => {
                 try { navigator.vibrate(5); } catch(e) {} // Vibração sutil, ignora erros
             });
         });
     }
     console.log("Mobile Functions Initialized");
}

// Função para inicializar Swipers (Herói, Depoimentos)
function initSwipers() {
     if (typeof Swiper === 'undefined') {
        console.error("Swiper library not loaded.");
        return; 
     }

     // Swiper do Hero (se existir na página)
     const heroSwiperEl = document.querySelector('.hero-swiper');
     if (heroSwiperEl) {
         new Swiper(heroSwiperEl, {
             slidesPerView: 1, spaceBetween: 0, loop: true,
             autoplay: { delay: 5000, disableOnInteraction: false },
             effect: 'fade', fadeEffect: { crossFade: true }, speed: 1000,
             pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
             navigation: { nextEl: '.hero-swiper .swiper-button-next', prevEl: '.hero-swiper .swiper-button-prev' },
         });
         console.log("Hero Swiper Initialized");
     }

     // Swiper de Depoimentos (se existir na página)
     const testimonialSwiperEl = document.querySelector('.testimonials-swiper');
     if (testimonialSwiperEl) {
         new Swiper(testimonialSwiperEl, {
             slidesPerView: 1, spaceBetween: 30, loop: true,
             autoplay: { delay: 4500, disableOnInteraction: false },
             pagination: { el: '.testimonials-swiper .swiper-pagination', clickable: true },
             breakpoints: {
                 768: { slidesPerView: 2 },
                 992: { slidesPerView: 3 },
             },
         });
          console.log("Testimonial Swiper Initialized");
     }
}

// Função para inicializar GLightbox (Galeria, Vídeos)
function initGLightbox() {
     if (typeof GLightbox === 'undefined') {
          console.error("GLightbox library not loaded.");
          return;
     }

     const galleryLightbox = GLightbox({
          selector: '.gallery-link, .glightbox', // Seletores para imagens da galeria
          touchNavigation: true,
          loop: true
     });

      const videoLightbox = GLightbox({
         selector: '.video-play-btn, .glightbox-video', // Seletores para vídeos
         touchNavigation: true,
         autoplayVideos: true
     });
      console.log("GLightbox Initialized");
}

// Função para inicializar Isotope (Filtro de Galeria - Página Multimídia)
function initIsotope() {
     const galleryContainer = document.querySelector('.gallery-container');
     if (!galleryContainer || typeof Isotope === 'undefined') {
         if(document.getElementById('photos')) console.error("Isotope library or .gallery-container not found for gallery filter."); // Só loga erro se estiver na aba de fotos
         return;
     }

     const iso = new Isotope(galleryContainer, {
         itemSelector: '.gallery-item',
         layoutMode: 'fitRows' // Ou 'masonry'
     });

     document.querySelectorAll('.gallery-filter button').forEach(button => {
         button.addEventListener('click', function() {
             document.querySelector('.gallery-filter .active').classList.remove('active');
             this.classList.add('active');
             iso.arrange({ filter: this.getAttribute('data-filter') });
         });
     });
     console.log("Isotope Initialized");
}


// == Função Central de Inicialização ==
// Esta função será chamada pelo loadPartials.js DEPOIS que header/footer carregarem
function initializePageComponents() {
    console.log("Initializing Page Components...");
    initAOS();
    initSmoothScrollAndMobileMenu(); 
    initNavbarScrollEffect(); // Precisa da navbar carregada
    initScrollspy(); // Precisa da navbar carregada
    initBackToTop(); // Precisa do footer carregado
    initCounters(); // Precisa que os elementos .counter estejam no DOM
    initForms(); // Inicializa todos os formulários da página
    initMobileFunctions(); // Roda lógicas mobile que dependem do footer/nav
    initSwipers(); // Inicializa sliders se existirem
    initGLightbox(); // Inicializa lightboxes se existirem
    initIsotope(); // Inicializa filtro da galeria se existir
    // Adicione outras inicializações que dependem do DOM completo aqui
}


// == Execução Inicial (Coisas que NÃO dependem do header/footer) ==
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded. Running initial setup.");
    // Remover preloader (pode rodar imediatamente)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => preloader.style.display = 'none', { once: true });
        }, 300); // Tempo menor
    }

    // O loadPartials.js será chamado no HTML e ele chamará initializePageComponents()
});