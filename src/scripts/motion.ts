import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReduced) {
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scrolling, wired into ScrollTrigger so the two stay in step.
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Single elements ease up as they enter the viewport.
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 38,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  // Groups stagger their children in.
  gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
    gsap.from(Array.from(group.children), {
      y: 44,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: "top 82%" },
    });
  });

  // Gentle parallax on tagged images.
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const section = el.closest("section") ?? el;
    gsap.to(el, {
      yPercent: 14,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
