export const motionConfig = {
  revealDuration: 0.7,
  letterDuration: 0.45,
  letterStagger: 0.025,
  carouselSpeed: 14,
  carouselCardWidth: 220,

  // M06 Home: FoldText de React Bits, parámetros iniciales del ejemplo aportado.
  foldText: {
    foldStyle: "paper",
    splitBy: "char",
    hinge: "top",
    trigger: "scroll",
    foldAngle: 92,
    duration: 0.65,
    stagger: 0.045,
    staggerFrom: "start",
    ease: "power3.out",
    loopDelay: 1.4,
    hoverRefold: true,
    refoldRadius: 140,
    refoldAngle: 45,
    perspective: 700,
    creaseShading: 0.55,
  },

  // M05: valores propuestos para Home y Work, pendientes de calibración.
  scrollCurve: {
    breakpoint: 810,
    bend: 0.05,
    mobileBend: 0.04,
    edgeStart: 0.48,
    speedLimit: 1800,
    speedBoost: 0.45,
    response: 10,
    pixelRatio: 1.5,
    mobilePixelRatio: 1,
  },
};
