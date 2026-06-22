import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Wrap every word in a masked span so it can slide up from behind a clip edge.
// <br> and other elements are preserved.
function splitWords(el: HTMLElement): HTMLElement[] {
  const nodes = Array.from(el.childNodes);
  el.textContent = "";
  const inners: HTMLElement[] = [];

  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? "").split(/(\s+)/);
      for (const token of parts) {
        if (token === "") continue;
        if (/^\s+$/.test(token)) {
          el.appendChild(document.createTextNode(token));
          continue;
        }
        const word = document.createElement("span");
        word.className = "word";
        const inner = document.createElement("span");
        inner.className = "word__inner";
        inner.textContent = token;
        word.appendChild(inner);
        el.appendChild(word);
        inners.push(inner);
      }
    } else {
      el.appendChild(node);
    }
  }
  return inners;
}

if (!reduce) {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // --- Hero intro ---------------------------------------------------------
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  const heroCover = document.querySelector<HTMLElement>("[data-hero-cover]");
  if (heroCover) {
    heroTl.to(heroCover, {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1.1,
      ease: "power3.inOut",
    });
  }
  heroTl.from(
    "[data-hero-media] img",
    { scale: 1.35, duration: 1.8 },
    0
  );

  // --- Masked heading reveals --------------------------------------------
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const inners = splitWords(el);
    gsap.set(inners, { yPercent: 120 });

    if (el.hasAttribute("data-hero")) {
      heroTl.to(inners, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.25);
    } else {
      gsap.to(inners, {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    }
  });

  // --- Generic reveals ----------------------------------------------------
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 42,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
    gsap.from(Array.from(group.children), {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: "top 84%" },
    });
  });

  // --- Image wipe reveals -------------------------------------------------
  gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
    const cover = el.querySelector<HTMLElement>(".reveal__cover");
    const img = el.querySelector<HTMLElement>("img");
    if (cover) gsap.set(cover, { scaleY: 1, transformOrigin: "bottom" });
    if (img) gsap.set(img, { scale: 1.3 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 82%" },
    });
    if (cover) tl.to(cover, { scaleY: 0, duration: 1.1, ease: "power3.inOut" });
    if (img) tl.to(img, { scale: 1, duration: 1.4, ease: "power3.out" }, 0.05);
  });

  // --- Scrubbed parallax --------------------------------------------------
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax || "14");
    gsap.to(el, {
      yPercent: amount,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // --- Counters -----------------------------------------------------------
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count || "0");
    const proxy = { value: 0 };
    gsap.to(proxy, {
      value: target,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: () => {
        el.textContent = Math.round(proxy.value).toString();
      },
    });
  });

  // --- Pinned horizontal lineup (desktop) --------------------------------
  const mm = gsap.matchMedia();
  mm.add("(min-width: 860px)", () => {
    const section = document.querySelector<HTMLElement>("[data-horizontal]");
    const track = section?.querySelector<HTMLElement>("[data-track]");
    if (!section || !track) return;

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - section.clientWidth),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + (track.scrollWidth - section.clientWidth),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Measure this pinned trigger before the ones below it, so their
        // start/end positions account for the space the pin adds.
        refreshPriority: 1,
      },
    });

    return () => tween.kill();
  });

  // Layout settles once fonts and images are in.
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
