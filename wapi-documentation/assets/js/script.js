(function ($, window, document, undefined) {
  "use strict";
  var $ripple = $(".js-ripple");
  $ripple.on("click.ui.ripple", function (e) {
    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find(".c-ripple__circle");
    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;
    $circle.css({
      top: y + "px",
      left: x + "px",
    });
    $this.addClass("is-active");
  });
  $ripple.on("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function (e) {
    $(this).removeClass("is-active");
  });
})(jQuery, window, document);
var scrollLink = $("#myScrollspy");

$(document).ready(function () {
  var scrollLink = $('#myScrollspy .nav-item a[href^="#"]');

  // Smooth scrolling
  scrollLink.click(function (e) {
    e.preventDefault();
    $("body,html").animate(
      {
        scrollTop: $(this.hash).offset().top - 20,
      },
      500
    );
  });
});
$(document).ready(function () {
  $(".view-more-btn").on("click", function () {
    var $this = $(this);
    var $content = $this.prev(".features-hide-content");
    var $core = $this.closest(".core-features");

    $content.toggleClass("show");

    if ($content.hasClass("show")) {
      $this.html('View Less <i class="fa fa-angle-down" aria-hidden="true"></i>');
      $core.addClass("active");
    } else {
      $this.html('View More <i class="fa fa-angle-up" aria-hidden="true"></i>');
      $core.removeClass("active");
    }
  });
});








document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop();

  // Find all links
  document.querySelectorAll(".nav-link").forEach(link => {
    const linkHref = link.getAttribute("href");

    if (linkHref === currentPage) {
      // Highlight active link
      link.classList.add("active");

      // Open parent menus
      let parent = link.closest(".nav-item");
      while (parent) {
        if (parent.classList.contains("menu")) {
          parent.classList.add("active"); // highlight parent
          let submenu = parent.querySelector(".sub-menu");
          if (submenu) submenu.style.display = "block"; // keep open
        }
        parent = parent.parentElement.closest(".nav-item");
      }
    }
  });
});

/* ==========================================================================
   Advanced Features Page Specific Logic
   ========================================================================== */

(function () {
  const initAdvancedFeatures = () => {
    // View More Expand logic
    const viewMoreBtns = document.querySelectorAll(".pro-view-more");
    viewMoreBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const card = this.closest(".pro-feature-card");
        if (!card) return;
        
        const isExpanded = card.classList.toggle("is-expanded");

        if (isExpanded) {
          this.innerHTML = 'View Less <i class="fa fa-chevron-up"></i>';
        } else {
          this.innerHTML = 'View More <i class="fa fa-chevron-down"></i>';
        }
      });
    });

    // Scroll Tracking for Sticky Nav
    const strategicNavLinks = document.querySelectorAll(".strategic-nav a");
    const sections = ["modules", "flow", "use-cases"];

    if (strategicNavLinks.length > 0) {
      window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
          const element = document.getElementById(section);
          if (element) {
            const elementTop = element.offsetTop;
            if (window.pageYOffset >= elementTop - 150) {
              current = section;
            }
          }
        });

        strategicNavLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
          }
        });
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdvancedFeatures);
  } else {
    initAdvancedFeatures();
  }
})();

/* ==========================================================================
   Global Image Lightbox Logic
   ========================================================================== */

(function () {
  const initLightbox = () => {
    // 1. Create Lightbox Markup
    const lightboxHTML = `
      <div class="wp-lightbox-overlay" id="wpLightbox">
        <div class="wp-lightbox-container">
          <button class="wp-lightbox-close" id="closeLightbox">&times;</button>
          <img src="" alt="Lightbox Preview" class="wp-lightbox-img" id="lightboxImg">
        </div>
      </div>
    `;

    // Inject if not already present
    if (!document.getElementById('wpLightbox')) {
      document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    const lightbox = document.getElementById('wpLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('closeLightbox');

    const openLightbox = (src) => {
      lightboxImg.src = src;
      lightbox.classList.add('is-active');
      document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-active');
      document.body.classList.remove('lightbox-open');
      // Wait for transition before clearing src
      setTimeout(() => {
        if (!lightbox.classList.contains('is-active')) {
          lightboxImg.src = '';
        }
      }, 400);
    };

    // 2. Global Click Event for Images
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Check if clicked element is an image and is inside preferred containers
      const isEligibleImg = target.tagName === 'IMG' && (
        target.closest('.content') || 
        target.closest('.card-body') || 
        target.closest('.pro-feature-card')
      );

      if (isEligibleImg) {
        openLightbox(target.src);
      }
    });

    // 3. Close Listeners
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
        closeLightbox();
      }
    });
  };

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
  } else {
    initLightbox();
  }
})();