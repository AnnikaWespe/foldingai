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
    essayContent: "",
    activeEssayId: null,

    async loadEssays() {
      const res = await fetch("pages/essays/essays.json");
      const data = await res.json();
      this.sections = data.sections;
      this.essays = data.essays;

      // 👇 Handle direct hash links on page load
      this.$nextTick(() => {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          const essay = this.essays.find((e) => e.id === hash);
          if (essay) {
            this.loadEssay(essay);
            document
              .getElementById(essay.id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    },

    filteredEssays(sectionId) {
      return this.essays.filter((e) => e.section === sectionId);
    },

    async loadEssay(essay) {
      const res = await fetch(`pages/essays/${essay.file}`);
      this.essayContent = await res.text();
      this.currentEssay = essay;
      this.activeEssayId = essay.id;
      history.replaceState(null, "", `#${essay.id}`); // 👈 Update URL hash
    },

    // ✅ Desktop: toggle open/close + scroll
openEssayDesktop(essay) {
  if (this.currentEssay && this.currentEssay.id === essay.id) {
    // Close if already open
    this.currentEssay = null;
    this.essayContent = '';
    this.activeEssayId = null;
    history.replaceState(null, '', '#');
    return;
  }

  this.loadEssay(essay);

  this.$nextTick(() => {
    // Give x-collapse some time to expand fully before scrolling
    setTimeout(() => {
      const el = document.getElementById(essay.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300); // 300ms works well with typical collapse animations
  });
},


    // ✅ Scroll Spy remains active
    initScrollSpy() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.activeEssayId = entry.target.id;
            }
          });
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );

      this.$nextTick(() => {
        this.essays.forEach((e) => {
          const el = document.getElementById(e.id);
          if (el) observer.observe(el);
        });
      });
    },
  };
}
