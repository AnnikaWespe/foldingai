document.addEventListener("DOMContentLoaded", function () {
  loadContent();
  loadEmailAddress();
  loadHeaderAndFooterFunctions();
  essayList();
});

cleanPath();

function cleanPath() {
  const allowedPaths = [
    "/",
    "/essays",
    "/essays.html",
    "/core",
    "/core.html",
    "/speaking",
    "/speaking.html",
    "/collaborate",
    "/collaborate.html",
    "/about",
    "/about.html",
  ];
  const currentPath = window.location.pathname;
  if (!allowedPaths.includes(currentPath)) {
    window.history.replaceState({}, "", "/");
  }
}

function loadHeaderAndFooterFunctions() {
  // Mobile menu toggle
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Year in footer
  document.getElementById("year").textContent = new Date().getFullYear();
}

function loadContent() {
    fetch("pages/core.html")
    .then((res) => res.text())
    .then((data) => {
      const element = document.getElementById("core");
      if (element) {
        element.innerHTML = data;
      }
    });
  fetch("pages/essays.html")
    .then((res) => res.text())
    .then((data) => {
      const element = document.getElementById("essays");
      if (element) {
        element.innerHTML = data;
      }
    });
}

function loadEmailAddress() {
  const user = "annika";
  const domain = "foldingai.org";
  const mail = `${user}@${domain}`;
  const linktext = `${mail}`;

  document.querySelectorAll(".mailadresse").forEach((el) => {
    el.innerHTML = `<a href="mailto:${mail}">${linktext}</a>`;
  });
}





function essayList() {
  return {
    sections: [],
    essays: [],
    currentEssay: null,
    essayContent: '',
    activeEssayId: null,

    async loadEssays() {
      const res = await fetch('pages/essays/essays.json');
      const data = await res.json();
      this.sections = data.sections;
      this.essays = data.essays;
    },

    filteredEssays(sectionId) {
      return this.essays.filter(e => e.section === sectionId);
    },

    async loadEssay(essay) {
      const res = await fetch(`pages/essays/${essay.file}`);
      this.essayContent = await res.text();
      this.currentEssay = essay;
      this.activeEssayId = essay.id;
    },

    openEssayDesktop(essay) {
      this.loadEssay(essay);
      document.getElementById(essay.id)?.scrollIntoView({ behavior: 'smooth' });
    },

      initScrollSpy() {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.activeEssayId = entry.target.id;
              }
            });
          },
          { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
        );

        this.$nextTick(() => {
          this.essays.forEach(e => {
            const el = document.getElementById(e.id);
            if (el) observer.observe(el);
          });
        });
      }
  };
}

