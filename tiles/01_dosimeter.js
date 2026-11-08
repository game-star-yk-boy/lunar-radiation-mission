// Dosimeter tile: surveys the surface and reduces ongoing exposure by 20%.
(() => {
  'use strict';

  window.LunarRadiationTiles = window.LunarRadiationTiles || [];
  window.LunarRadiationTiles.push({
    x: 520,
    label: 'DOSIMETER SURVEY',
    symbol: 'D',
    color: 0x50e6ff,
    onEnter(scene) {
      scene.exposureMultiplier = 0.8;
      return 'Radiation survey complete: surface exposure reduced by 20%.';
    },
  });
})();
