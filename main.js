(() => {
  "use strict";

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Math.min(i * 60, 180);
          setTimeout(() => el.classList.add("is-visible"), delay);
          io.unobserve(el);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  // YouTube lite facade — carrega o iframe só no clique do usuário
  document.querySelectorAll(".video-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      if (!parent) return;
      const id = parent.dataset.videoId;
      if (!id) return;
      const params = new URLSearchParams({
        autoplay: "1",
        rel: "0",
        modestbranding: "1",
      });
      const start = parent.dataset.videoStart;
      if (start) params.set("start", start);

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("title", "Depoimento em vídeo — YouTube");
      btn.replaceWith(iframe);
    });
  });
})();
