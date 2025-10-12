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

      // Auto-open essay if hash is present
      this.$nextTick(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          const essay = this.essays.find(e => e.id === hash);
          if (essay) {
            if (window.innerWidth < 1024) {
              // Mobile
              this.openEssay = essay.id;
              this.loadEssay(essay);
              this.$nextTick(() => this.scrollToWithOffset('m-' + essay.id));
            } else {
              // Desktop
              this.openEssayDesktop(essay);
            }
          }
        }
      });
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

    scrollToWithOffset(id, offset = 80) {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },

async openEssayDesktop(essay) {
  // toggle close if already open
  if (this.currentEssay && this.currentEssay.id === essay.id) {
    this.currentEssay = null;
    this.essayContent = '';
    this.activeEssayId = null;
    history.replaceState(null, '', '#');
    return;
  }

  await this.loadEssay(essay);
  await this.$nextTick();

  const article = document.getElementById(essay.id);
  const collapsible = article?.querySelector('[x-collapse]') || article;
  const scroll = () => this.scrollToWithOffset(essay.id);

  let done = false;
  const handler = () => {
    if (done) return;
    done = true;
    collapsible.removeEventListener('transitionend', handler);
    scroll();
  };

  // scroll when the height transition finishes…
  collapsible.addEventListener('transitionend', handler, { once: true });
  // …or after a fallback delay if no transition fires
  setTimeout(handler, 700);

  history.replaceState(null, '', `#${essay.id}`);
},

async openEssayMobile(essay) {
  const wasOpen = this.openEssay === essay.id;
  if (wasOpen) {
    this.openEssay = null;
    history.replaceState(null, '', '#');
    return;
  }

  this.openEssay = essay.id;
  await this.loadEssay(essay);
  await this.$nextTick();

  const liId = 'm-' + essay.id;
  const li = document.getElementById(liId);
  const collapsible = li?.querySelector('[x-collapse]') || li;
  const scroll = () => this.scrollToWithOffset(liId, 80);

  let done = false;
  const handler = () => {
    if (done) return;
    done = true;
    collapsible.removeEventListener('transitionend', handler);
    scroll();
  };

  collapsible.addEventListener('transitionend', handler, { once: true });
  setTimeout(handler, 700);

  history.replaceState(null, '', `#${essay.id}`);
}
,

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

