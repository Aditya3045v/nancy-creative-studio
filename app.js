(function () {
  const config = window.NANCY_CONFIG || {};
  const placeholderNumber = "919999999999";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toast = $("[data-toast]");

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
  };

  const hasWhatsApp = config.whatsappNumber && config.whatsappNumber !== placeholderNumber;
  const whatsappUrl = (message = "Hello Nancy, I'd like to discuss a design project.") =>
    `https://wa.me/${String(config.whatsappNumber || "").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  $$('[data-year]').forEach((node) => (node.textContent = new Date().getFullYear()));
  $$('[data-instagram-link]').forEach((link) => {
    if (config.instagramUrl && !config.instagramUrl.includes("yourhandle")) {
      link.href = config.instagramUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
    } else {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showToast("Add your Instagram URL in settings.js before publishing.");
      });
    }
  });
  $$('[data-whatsapp-link]').forEach((link) => {
    if (hasWhatsApp) {
      link.href = whatsappUrl();
      link.target = "_blank";
      link.rel = "noreferrer";
    } else {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        $("#contact").scrollIntoView({ behavior: "smooth" });
        showToast("Add your WhatsApp number in settings.js to activate this link.");
      });
    }
  });

  const header = $('[data-header]');
  const nav = $('[data-nav]');
  const menuButton = $('[data-menu-toggle]');
  menuButton.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$('a', nav).forEach((link) => link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }));

  const filters = $$('[data-filter]');
  const projects = $$('.project');
  filters.forEach((filter) => filter.addEventListener("click", () => {
    const value = filter.dataset.filter;
    filters.forEach((item) => item.classList.toggle("is-active", item === filter));
    projects.forEach((project) => {
      const visible = value === "all" || project.dataset.category.split(" ").includes(value);
      project.classList.toggle("is-hidden", !visible);
    });
  }));

  const lightbox = $('[data-lightbox]');
  const lightboxImage = $('[data-lightbox-image]');
  const lightboxTitle = $('[data-lightbox-title]');
  const lightboxKind = $('[data-lightbox-kind]');
  const closeLightbox = () => lightbox.close();
  projects.forEach((project) => {
    $('.project-image', project).addEventListener("click", () => {
      lightboxImage.src = project.dataset.image;
      lightboxImage.alt = project.dataset.alt;
      lightboxTitle.textContent = project.dataset.title;
      lightboxKind.textContent = project.dataset.kind;
      lightbox.showModal();
    });
  });
  $('[data-lightbox-close]').addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });

  const packageSelect = $('#package');
  const focusForm = (packageName) => {
    packageSelect.value = packageName;
    $('#contact').scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => packageSelect.focus({ preventScroll: true }), 600);
  };
  $$('.package-button').forEach((button) => button.addEventListener("click", () => focusForm(button.dataset.package)));
  $$('[data-enquiry-type]').forEach((button) => button.addEventListener("click", () => focusForm(button.dataset.enquiryType)));

  const form = $('[data-enquiry-form]');
  const status = $('[data-form-status]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const message = `Hello Nancy, I’d like to discuss a project.\n\nName: ${data.name}\nBusiness: ${data.business}\nContact: ${data.contact}\nPackage: ${data.package}\n\nBrief:\n${data.details}`;
    const submit = $('.form-submit', form);
    submit.disabled = true;
    status.textContent = "Preparing your enquiry…";

    try {
      if (config.formEndpoint) {
        const response = await fetch(config.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...data, source: "Nancy Creative Studio website" }),
        });
        if (!response.ok) throw new Error("Form endpoint request failed");
        form.reset();
        status.textContent = "Thank you — your enquiry has been sent.";
      } else if (hasWhatsApp) {
        window.open(whatsappUrl(message), "_blank", "noopener");
        form.reset();
        status.textContent = "Your WhatsApp message is ready to send.";
      } else {
        const drafts = JSON.parse(localStorage.getItem("nancyEnquiryDrafts") || "[]");
        drafts.push({ ...data, savedAt: new Date().toISOString() });
        localStorage.setItem("nancyEnquiryDrafts", JSON.stringify(drafts.slice(-10)));
        status.textContent = "Your brief has been saved in this browser. Add a WhatsApp number or form endpoint in settings.js to receive enquiries.";
      }
    } catch (error) {
      status.textContent = "That message could not be sent. Please try again or contact Nancy directly.";
    } finally {
      submit.disabled = false;
    }
  });

  if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-in-view");
    }), { threshold: 0.12 });
    $$('.statement, .work, .process, .partner-section, .contact').forEach((section) => observer.observe(section));
  }
}());
