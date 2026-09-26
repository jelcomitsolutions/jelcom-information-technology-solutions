(function () {
    "use strict";

    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-menu]");
    const toast = document.querySelector("[data-toast]");

    function updateHeader() {
        header?.classList.toggle("scrolled", window.scrollY > 20);
    }

    function setMenu(open) {
        if (!menuToggle || !menu || !header) return;
        menuToggle.setAttribute("aria-expanded", String(open));
        menu.classList.toggle("open", open);
        header.classList.toggle("menu-active", open);
        document.body.classList.toggle("menu-open", open);
    }

    menuToggle?.addEventListener("click", function () {
        setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    menu?.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setMenu(false);
        });
    });

    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", function () {
        if (window.innerWidth > 820) setMenu(false);
    });
    updateHeader();

    const tabs = Array.from(document.querySelectorAll("[role='tab'][data-tab]"));
    const panels = Array.from(document.querySelectorAll("[role='tabpanel'][data-panel]"));

    function activateTab(tab) {
        const target = tab.dataset.tab;
        tabs.forEach(function (item) {
            const selected = item === tab;
            item.setAttribute("aria-selected", String(selected));
            item.tabIndex = selected ? 0 : -1;
        });
        panels.forEach(function (panel) {
            panel.hidden = panel.dataset.panel !== target;
        });
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
            activateTab(tab);
        });
        tab.addEventListener("keydown", function (event) {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            let nextIndex = index;
            if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
            if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
            if (event.key === "Home") nextIndex = 0;
            if (event.key === "End") nextIndex = tabs.length - 1;
            tabs[nextIndex].focus();
            activateTab(tabs[nextIndex]);
        });
    });

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("visible");
        window.clearTimeout(showToast.timeoutId);
        showToast.timeoutId = window.setTimeout(function () {
            toast.classList.remove("visible");
        }, 4200);
    }

    const contactForm = document.querySelector("#contact-form");

    function setError(field, message) {
        const error = contactForm?.querySelector(`[data-error-for="${field.name}"]`);
        field.setAttribute("aria-invalid", message ? "true" : "false");
        if (error) error.textContent = message;
    }

    function validateForm() {
        if (!contactForm) return false;
        let valid = true;
        const name = contactForm.elements.name;
        const email = contactForm.elements.email;
        const interest = contactForm.elements.interest;
        const message = contactForm.elements.message;

        setError(name, name.value.trim() ? "" : "Please enter your name.");
        if (!name.value.trim()) valid = false;

        const emailValue = email.value.trim();
        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        setError(email, emailIsValid ? "" : "Enter a valid email address.");
        if (!emailIsValid) valid = false;

        setError(interest, interest.value ? "" : "Choose an area of interest.");
        if (!interest.value) valid = false;

        const messageValue = message.value.trim();
        setError(message, messageValue.length >= 20 ? "" : "Please add at least 20 characters.");
        if (messageValue.length < 20) valid = false;

        return valid;
    }

    contactForm?.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateForm()) {
            contactForm.querySelector("[aria-invalid='true']")?.focus();
            showToast("Please review the highlighted fields.");
            return;
        }

        const formData = new FormData(contactForm);
        const lines = [
            "Hello Jelcom Information Technology Solutions,",
            "",
            `My name is ${formData.get("name")}.`,
            formData.get("organisation") ? `Organisation: ${formData.get("organisation")}` : "",
            `Email: ${formData.get("email")}`,
            `Interest: ${formData.get("interest")}`,
            "",
            String(formData.get("message")),
        ].filter(Boolean);

        const whatsappUrl = `https://wa.me/233246775922?text=${encodeURIComponent(lines.join("\n"))}`;
        const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        if (!opened) window.location.href = whatsappUrl;
        showToast("Your enquiry is ready to review in WhatsApp.");
    });

    contactForm?.querySelectorAll("input, select, textarea").forEach(function (field) {
        field.addEventListener("input", function () {
            if (field.getAttribute("aria-invalid") === "true") setError(field, "");
        });
    });

    document.querySelectorAll("[data-year]").forEach(function (element) {
        element.textContent = String(new Date().getFullYear());
    });

    const revealItems = document.querySelectorAll(".reveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("in-view");
        });
    }
})();
