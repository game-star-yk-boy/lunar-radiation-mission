# Lunar Radiation Mission: four-person build activity (25 minutes)

## Goal

Four people start from the same `Lunar-Radiation-Mission` repository and launch it with `Radiation1.py`. Each person adds one **radiation-themed game tile** in a separate file. Merge the four branches into `main` and play one combined game.

The Python file starts the local web server. The game itself is Phaser code in `game.js`. The starter already loads the four tile files and provides the `onEnter(scene)` hook, so no participant needs to edit the shared game code.

## Before the 25-minute session (facilitator)

Make sure this starter version, including `Radiation1.py`, the `tiles` folder, and the tile hookup in `game.js` and `index.html`, is committed and pushed to `main` at `https://github.com/game-star-yk-boy/lunar-radiation-mission`. Give all four people write access to the repository. Each device needs Python 3, Git, a browser, and a code editor. Keep `phaser.min.js` in the repository; no package installation is needed.

## Four objectives

| Person | Branch | Only file to edit | Tile and visible effect |
| --- | --- | --- | --- |
| 1 | `tile/dosimeter` | `tiles/01_dosimeter.js` | Dosimeter at x=520: survey a safer route, reducing later surface drain by 20%. |
| 2 | `tile/shielding` | `tiles/02_shielding.js` | Portable shielding at x=800: restore 50 points of the game's radiation resilience. |
| 3 | `tile/forecast` | `tiles/03_forecast.js` | Solar forecast at x=1080: add 3 seconds to the flare return countdown. |
| 4 | `tile/sample-tools` | `tiles/04_sample_tools.js` | Sample tools at x=1370: shorten pickup and speed up the sample return, making safe sample recovery possible. |

These are gameplay values, not a real radiation exposure model. The in-game resilience meter is a game resource.

## Minute-by-minute tutorial

### 0:00–3:00 — Everyone opens the same starter

On each device, clone the repository and run the starting Python file:

```powershell
git clone https://github.com/game-star-yk-boy/lunar-radiation-mission.git
cd lunar-radiation-mission
python Radiation1.py
```

Open `http://127.0.0.1:8000` if it does not open automatically. Click **Begin Mission**, then **Skip Cinematic**. Check that the astronaut moves with arrow keys or A/D. Keep the server running while editing; reload the browser after saving a file. If `python` is unavailable on Windows, try `py Radiation1.py`.

### 3:00–5:00 — Split the work

Each person creates their assigned branch in a **separate clone**:

```powershell
git switch -c tile/dosimeter
```

Replace `tile/dosimeter` with the branch in the table. Open only your assigned file. The shared tile format is `label`, `x`, `symbol`, `color`, and `onEnter(scene)`. The game calls `onEnter` once when the astronaut walks into the tile; its returned sentence appears in the task panel.

### 5:00–15:00 — Build the four tiles in parallel

**Person 1 — Dosimeter.** Replace the contents of `tiles/01_dosimeter.js` with:

```javascript
window.LunarRadiationTiles = window.LunarRadiationTiles || [];
window.LunarRadiationTiles.push({
  x: 520,
  label: 'DOSIMETER SCAN',
  symbol: 'D',
  color: 0x50e6ff,
  onEnter(scene) {
    scene.exposureMultiplier = 0.8;
    return 'Survey complete: safer route reduces surface drain by 20%.';
  },
});
```

**Person 2 — Shielding.** Replace the contents of `tiles/02_shielding.js` with:

```javascript
window.LunarRadiationTiles = window.LunarRadiationTiles || [];
window.LunarRadiationTiles.push({
  x: 800,
  label: 'SHIELDING CACHE',
  symbol: 'S',
  color: 0x80dca5,
  onEnter(scene) {
    scene.resilience = Phaser.Math.Clamp(scene.resilience + 50, 0, 600);
    return 'Portable shielding collected: +50 game resilience.';
  },
});
```

**Person 3 — Solar forecast.** Replace the contents of `tiles/03_forecast.js` with:

```javascript
window.LunarRadiationTiles = window.LunarRadiationTiles || [];
window.LunarRadiationTiles.push({
  x: 1080,
  label: 'SOLAR FORECAST',
  symbol: 'F',
  color: 0xffbf4b,
  onEnter(scene) {
    scene.flareBonus = 3;
    return 'Solar warning received: +3 seconds for flare evacuation.';
  },
});
```

**Person 4 — Sample tools.** Replace the contents of `tiles/04_sample_tools.js` with:

```javascript
window.LunarRadiationTiles = window.LunarRadiationTiles || [];
window.LunarRadiationTiles.push({
  x: 1370,
  label: 'SAMPLE TOOLS',
  symbol: 'T',
  color: 0xd6a9ff,
  onEnter(scene) {
    scene.samplePickupDelay = 1200;
    scene.sampleReturnSpeed = 220;
    return 'Sample tools ready: faster collection and return.';
  },
});
```

Each person saves, reloads the browser, walks right from the lander, and confirms their tile appears and changes the task message when touched. The other three tiles will remain absent in that person's branch until the merge.

### 15:00–18:00 — Commit and share

Each person checks that only their tile file changed, then commits and pushes their own branch:

```powershell
git status --short
git add tiles/01_dosimeter.js
git commit -m "Add dosimeter radiation tile"
git push -u origin tile/dosimeter
```

Use your own filename, message, and branch from the table. On GitHub, open a pull request from your branch into `main`.

### 18:00–22:00 — Combine the four projects

Choose one person to integrate. On GitHub, merge the four pull requests into `main`, one at a time. Each branch edits a different tile file, so the changes should combine without a code conflict. If GitHub reports a conflict, check that no participant edited `game.js`, `index.html`, or another person's tile file. Resolve that extra edit before merging.

All four people then update their local copy:

```powershell
git switch main
git pull origin main
```

### 22:00–25:00 — Play the combined game

Restart `python Radiation1.py` if needed and reload the browser. Skip the cinematic and walk right. Confirm **four tiles appear in order**: dosimeter, shielding, forecast, sample tools. Touch each one and check the task message. Continue to the crystal, choose **2 / Secure Sample**, and verify the astronaut reaches the lander before the extended flare countdown ends. Replay and choose **1 / Leave Sample** to confirm that route still finishes. The final result is one working game on `main` containing all four contributions.

If the sample route fails, check that the astronaut touched all four tiles before reaching the crystal and that the merged `tiles/04_sample_tools.js` contains both sample settings.
