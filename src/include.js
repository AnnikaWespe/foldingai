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
    openEssay: null, // for mobile

async loadEssays() {
  const res = await fetch('pages/essays/essays.json');
  const data = await res.json();
  this.sections = data.sections;
  this.essays = data.essays;

  const handleDeepLink = () => {
    const raw = (window.location.hash || "").slice(1); // "essays:slug"
    const [route, sub] = raw.split(":");
    if (route === "essays" && sub) {
      const essay = this.essays.find(e => e.id === sub);
      if (!essay) return;
      if (window.innerWidth < 1024) {
        // mobile open (no toggle-close on arrival)
        this.openEssay = essay.id;
        this.loadEssay(essay).then(() => {
          this.$nextTick(() => setTimeout(() => this.scrollToWithOffset('m-' + essay.id), 50));
        });
      } else {
        // desktop open
        this.openEssayDesktop(essay);
      }
    }
  };

  this.$nextTick(handleDeepLink);
  window.addEventListener('hashchange', handleDeepLink);
}
,
    filteredEssays(sectionId) {
      return this.essays.filter(e => e.section === sectionId);
    },

    async loadEssay(essay) {
      const res = await fetch(`pages/essays/${essay.file}`);
      this.essayContent = await res.text();
      this.currentEssay = essay;
      this.activeEssayId = essay.id;
    },

    scrollToWithOffset(id, offset = 40) {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },

openEssayMobile(essay) {
  const wasOpen = this.openEssay === essay.id;

  if (wasOpen) {
    // Close if already open
    this.openEssay = null;
    history.replaceState(null, '', '#essays');
    return;
  }

  this.openEssay = essay.id;
  this.loadEssay(essay).then(() => {
    this.$nextTick(() => {
      // wait a bit for x-collapse to finish before scrolling
      setTimeout(() => {
        this.scrollToWithOffset('m-' + essay.id);
      }, 350);
    });
    history.replaceState(null, '', `#essays:${essay.id}`);
  });
},

async openEssayDesktop(essay) {
  const wasOpen = this.currentEssay && this.currentEssay.id === essay.id;

  if (wasOpen) {
    // Close essay if clicked again
    this.currentEssay = null;
    this.essayContent = '';
    this.activeEssayId = null;
    history.replaceState(null, '', '#essays');
    return;
  }

  await this.loadEssay(essay);
  await this.$nextTick();
  // Wait for collapse animation to finish before scrolling
  setTimeout(() => {
    this.scrollToWithOffset(essay.id);
  }, 350);

  history.replaceState(null, '', `#essays:${essay.id}`);
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

