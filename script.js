document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuLinks = mobileMenu?.querySelectorAll('a'); // Get links inside the menu
  const focusableElements = mobileMenu?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusableElement = focusableElements ? focusableElements[0] : null;
  const lastFocusableElement = focusableElements ? focusableElements[focusableElements.length - 1] : null;

  if (menuButton && mobileMenu) {
    const toggleMenu = () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden'); // Prevent scrolling when menu is open

      if (!expanded) {
        // Menu is opening, trap focus
        if (firstFocusableElement) {
          setTimeout(() => { // Wait for menu to be visible before focusing
            firstFocusableElement.focus();
          }, 100);
        }
        document.addEventListener('keydown', trapFocus);
      } else {
        // Menu is closing, remove focus trap
        document.removeEventListener('keydown', trapFocus);
      }
    };

    menuButton.addEventListener('click', toggleMenu);

    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        toggleMenu();
        menuButton.focus(); // Return focus to the menu button
      }
    });

    // Focus Trap (when menu is open)
    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };

    //Close menu on link click (optional, adjust as needed)
    if (menuLinks) {
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (menuButton.getAttribute('aria-expanded') === 'true') {
            toggleMenu();
          }
        });
      });
    }
  }



  // Smooth Scroll and Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('[data-back-to-top]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        // Update the URL hash without triggering scroll (optional)
        history.pushState(null, null, targetId);
      }
    });
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
      } else {
        backToTopButton.classList.add('hidden');
      }
    });
  }



  // Testimonial Slider
  const sliderContainer = document.querySelector('[data-testimonial-slider]');

  if (sliderContainer) {
    const slides = sliderContainer.querySelectorAll('[data-testimonial-slide]');
    const prevButton = sliderContainer.querySelector('[data-testimonial-prev]');
    const nextButton = sliderContainer.querySelector('[data-testimonial-next]');
    let currentIndex = 0;
    let intervalId;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('hidden', i !== index);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    };

    const startSlider = () => {
      intervalId = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    };

    const stopSlider = () => {
      clearInterval(intervalId);
    };

    showSlide(currentIndex); // Initialize
    startSlider();

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
      });
    }

    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);
  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('[data-faq-item]');

  faqItems.forEach(item => {
    const button = item.querySelector('[data-faq-button]');
    const content = item.querySelector('[data-faq-content]');

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherButton = otherItem.querySelector('[data-faq-button]');
          const otherContent = otherItem.querySelector('[data-faq-content]');
          otherButton.setAttribute('aria-expanded', 'false');
          otherContent.classList.add('hidden');
        }
      });

      // Toggle current item
      button.setAttribute('aria-expanded', !expanded);
      content.classList.toggle('hidden');
    });
  });


  // Email Capture Validation
  const emailForm = document.querySelector('[data-email-form]');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('[data-email-input]');
      const email = emailInput.value.trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (isValidEmail) {
        console.log('Email submitted:', email);
        // Optionally clear the input
        emailInput.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }


  // UTM-aware CTA click logging (stub)
  const ctaLinks = document.querySelectorAll('[data-cta-link]');

  ctaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const utmParams = getUtmParams();
      console.log('CTA Clicked:', href, utmParams);
      //send to analytics service (GA, etc.)
    });
  });

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of params) {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    }
    return utmParams;
  }


});

//Defer loading of non-critical assets (example)
function loadDeferredAssets() {
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
  // Add other deferred loading logic here (e.g., iframes, videos)
}

window.addEventListener('load', loadDeferredAssets); // Use 'load' to ensure initial render is fast