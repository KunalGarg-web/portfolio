
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".progress");
  const backtop = document.querySelector(".backtop");

  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 90);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    }
    backtop?.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", updateScroll, {passive:true});
  updateScroll();

  backtop?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:"0px 0px -40px"});
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("visible"));
  }

  // Hero greeting: Hi -> Hello with waving hand every 2 seconds
  const hiText = document.querySelector(".hi-text");
  const hiIcon = document.querySelector(".hi-icon");
  if (hiText && hiIcon) {
    const greetings = [
      ["Hi!", "✋"],
      ["Hello!", "👋"]
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % greetings.length;
      hiText.animate(
        [{opacity:0, transform:"translateY(8px)"}, {opacity:1, transform:"translateY(0)"}],
        {duration:380, easing:"cubic-bezier(.22,1,.36,1)"}
      );
      hiIcon.animate(
        [{opacity:0, transform:"rotate(-15deg) scale(.8)"}, {opacity:1, transform:"rotate(0) scale(1)"}],
        {duration:450, easing:"cubic-bezier(.22,1,.36,1)"}
      );
      hiText.textContent = greetings[i][0];
      hiIcon.textContent = greetings[i][1];
    }, 2000);
  }

  // Services filter
  const filterButtons = document.querySelectorAll(".filter-btn");
  const serviceCards = document.querySelectorAll(".service-card");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      serviceCards.forEach((card, index) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) {
          card.classList.remove("visible");
          card.style.transitionDelay = `${Math.min(index % 4, 3) * 50}ms`;
          requestAnimationFrame(() => card.classList.add("visible"));
        }
      });
    });
  });

  // Testimonial slider
  const slides = [...document.querySelectorAll(".testimonial-slide")];
  const dots = [...document.querySelectorAll(".slider-dot")];
  const prev = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");
  let current = 0;
  let timer;

  const showSlide = (index) => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  };
  const restart = () => {
    clearInterval(timer);
    if (slides.length > 1) timer = setInterval(() => showSlide(current + 1), 6000);
  };
  prev?.addEventListener("click", () => { showSlide(current - 1); restart(); });
  next?.addEventListener("click", () => { showSlide(current + 1); restart(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); restart(); }));
  if (slides.length) { showSlide(0); restart(); }

  // Portfolio image/video lightbox
  const modal = document.querySelector(".media-modal");
  const modalInner = document.querySelector(".modal-inner");

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modalInner.innerHTML = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".work-card[data-media]").forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      if (!modal || !modalInner) return;
      const src = card.dataset.media;
      const type = card.dataset.type || "image";
      modalInner.innerHTML = `
        <button class="modal-close" aria-label="Close">&times;</button>
        ${type === "video"
          ? `<video src="${src}" controls autoplay playsinline></video>`
          : `<img src="${src}" alt="${card.querySelector("h3")?.textContent || "Portfolio work"}">`}
      `;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      modalInner.querySelector(".modal-close")?.addEventListener("click", closeModal);
    });
  });

  modal?.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // Contact form demo behavior
  const form = document.querySelector("#contactForm");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    const original = button.innerHTML;
    button.innerHTML = "Thanks — I’ll get back to you <i class='bi bi-check2'></i>";
    button.disabled = true;
    setTimeout(() => {
      button.innerHTML = original;
      button.disabled = false;
      form.reset();
    }, 3000);
  });

  // Make videos on portfolio cards play quietly in previews
  document.querySelectorAll(".work-card video").forEach(video => {
    video.muted = true;
    video.play().catch(() => {});
  });
});


/* =========================================================
   ABOUT PAGE - ANIMATED COUNTERS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const counters = document.querySelectorAll(".counter");

    if (!counters.length) return;


    const runCounter = (counter) => {

        const target = parseInt(
            counter.getAttribute("data-target"),
            10
        );

        const duration = 1800;

        const startTime = performance.now();


        const updateCounter = (currentTime) => {

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );


            /*
             * Ease-out effect.
             * Starts quickly and slows near the final number.
             */

            const easedProgress =
                1 - Math.pow(1 - progress, 4);


            const currentValue = Math.floor(
                easedProgress * target
            );


            counter.textContent = currentValue;


            if (progress < 1) {

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent = target;

            }

        };


        requestAnimationFrame(updateCounter);

    };


    /* =====================================================
       RUN ONLY WHEN STATS ENTER VIEW
    ====================================================== */

    const observer = new IntersectionObserver(

        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    counters.forEach((counter, index) => {

                        setTimeout(() => {

                            runCounter(counter);

                        }, index * 150);

                    });


                    observer.disconnect();

                }

            });

        },

        {
            threshold: 0.35
        }

    );


    const statsSection =
        document.querySelector(".about-stats");


    if (statsSection) {

        observer.observe(statsSection);

    }

});

