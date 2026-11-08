# Lunar Radiation Mission — Software Requirements

## 1. Purpose and scope

Lunar Radiation Mission is a browser-based, single-player lunar exploration game. The player leaves a lander, crosses the Moon's surface while a suit resilience meter drains, encounters an anomalous rock, then responds to a solar flare by choosing between immediate evacuation and attempting to secure a sample. The game teaches that crew safety has priority over scientific recovery.

This specification describes the behavior and interfaces present in the repository at the time of inspection. It is intended to guide a compatible reconstruction. It does not claim that unimplemented tile objectives already work.

## 2. Repository and runtime

### 2.1 Technology

- The game is JavaScript built with Phaser 4.2.1.
- Phaser is vendored locally as `phaser.min.js`; the game must not require a CDN or network connection to start.
- `index.html` loads the game shell, styles, Phaser, tile scripts, and `game.js` in that order.
- `Radiation1.py` uses Python's standard library to serve the repository root over HTTP. It is a launcher, not the game implementation.
- `radiation_1.py` is a compatibility entry point which imports and runs `Radiation1.main()`.
- The game has no package manifest or runtime package installation step.

### 2.2 Local launch behavior

Running `python Radiation1.py` from any working directory must:

1. Resolve the project root relative to `Radiation1.py`.
2. Verify that `index.html` exists and exit with an explanatory error if it does not.
3. Start a reusable TCP server bound only to `127.0.0.1`, using port `8000` by default.
4. Open `http://127.0.0.1:<port>` in the default browser unless `--no-browser` is supplied.
5. Accept a custom port through `--port <integer>`.
6. Serve files from the repository root, so requests for `game.js`, `styles.css`, `phaser.min.js`, and `tiles/*.js` resolve relative to the root.
7. Continue serving until interrupted; on Ctrl+C, stop cleanly and print a stop message.

The compatibility launcher must preserve the same command-line behavior by delegating to `Radiation1.main()`.

### 2.3 Static package and source-of-truth requirement

`.openai/hosting.json` configures the static hosting directory as `dist`. The repository also contains root-level editable source files and copies under `dist/`.

At inspection time, the root `game.js` and `tiles/01_dosimeter.js` contain newer edits than their `dist/` copies. The root `game.js` restarts the mission when Replay is activated and initializes tile-effect settings; `dist/game.js` does not contain those edits. The root dosimeter script implements the feature, while `dist/tiles/01_dosimeter.js` is still a placeholder. A reconstruction or release process must establish the root files as canonical source and synchronize all runtime assets into `dist/` before publishing. The `dist` directory is intentionally tracked and must not be ignored wholesale.

## 3. Web page requirements

### 3.1 Document structure

`index.html` must provide:

- An English-language HTML document with UTF-8 encoding and a responsive viewport.
- Page title `Lunar Radiation Mission` and a description identifying a Phaser lunar exploration game about radiation risk and scientific discovery.
- A dark theme color and a local `styles.css` reference.
- A centered game shell with an accessible main label, top brand line, engine version label, `#game-container`, loading status, hidden load-error panel, and footer.
- Footer guidance for arrow keys/WASD and a note that gameplay radiation values are accelerated.
- A local Phaser script, each tile script, then the main `game.js` script. Tile scripts must run before `game.js` so they can register entries in the shared tile registry.
- A load-error state shown when Phaser is unavailable; the error must say that mission systems could not start and advise checking the connection and reloading.

### 3.2 Page layout and responsive behavior

The CSS must create a dark, space-themed shell with cyan and amber accents, a subtle grid, a framed canvas, status header/footer, and an animated loading orbit. The game canvas must preserve a 16:9 aspect ratio and fit within the available viewport.

- At viewport widths of 700 px or less, reduce header branding, hide engine and science-note labels, and tighten horizontal padding.
- At viewport heights of 600 px or less, reduce shell header/footer heights and adjust loading/error overlay insets.
- The game canvas must fill its container and remain clipped within it.
- The page must not require external fonts, images, or other network resources.

## 4. Game-wide technical requirements

- Logical game size: 1280 × 720 pixels.
- Rendering: Phaser `AUTO`, antialiasing on, pixel-art mode off, rounded pixels off.
- Scale: `FIT`, centered in the parent `#game-container`.
- Background: near-black space (`#02070c` in the Phaser configuration).
- Physics: Arcade Physics, zero horizontal and vertical gravity, no debug overlay.
- Active pointers: three, allowing touch controls and pointer interaction.
- The world is drawn with Phaser graphics and text; it uses no external sprite assets.
- Global visual palette includes space navy, cyan, amber, red, moon grey, white, and deep black.
- Text styles use Segoe UI/Arial for interface text and Consolas/monospace for instrument labels.

## 5. Scene flow

The game registers three Phaser scenes in this order: `Title`, `Cinematic`, and `Mission`.

### 5.1 Title scene

The title scene must:

- Show a star field, a large Moon with surface details, an orbital ellipse, and an animated lander.
- Display the mission identifier, `LUNAR RADIATION`, the tagline `A decision under the sun.`, and the sequence `LAND • EXPLORE • SURVIVE`.
- Show the starting suit resilience as 600 mSv and the baseline surface exposure rate as 10 mSv per second.
- Provide a `BEGIN MISSION` button which transitions to the cinematic scene.
- Show keyboard/touch control guidance.

### 5.2 Cinematic scene

The cinematic scene must:

- Show Earth, the Moon, a lander, a travel trail, and a progress line.
- Animate a trans-lunar injection, descent, and landing, then transition to `Mission`.
- Provide a `SKIP CINEMATIC` button which transitions directly to `Mission`.
- Update its labels for descent and contact light; all transitions must remain local and deterministic.

### 5.3 Mission scene initialization

Mission initialization must:

- Set the mission state to `intro`, resilience to 600, baseline exposure multiplier to 1, flare bonus to 0, sample pickup delay override to 0, and sample return speed override to 0.
- Initialize single-use discovery/decision state, movement animation timing, flare countdown state, pointer/keyboard decision handlers, and automatic return mode.
- Set physics and camera bounds to the mission world and follow the astronaut with smoothing and a leftward camera offset.
- Draw a 2700 × 720 lunar surface, the lander at approximately x=250, and the anomaly rock at x=1770.
- Spawn the astronaut near the lander, initially invisible and very small; disable gravity and constrain movement to world bounds.
- Create the HUD, touch controls, and all registered radiation tiles.
- Show an EVA check task, then animate the astronaut out of the lander. After the exit animation, enter `explore` and show the primary objective.

## 6. Mission environment and interface

### 6.1 Lunar world

- World width is 2700 px and height is 720 px; ground baseline is y=584.
- Draw distant lunar ridges, an Earth background that scrolls at 0.2 camera factor, a grey ground surface, scattered rocks, and small surface marks.
- Draw the lander shield zone around x=250 with a radius of 175 and label it `LANDER SHIELD ZONE +10 mSv/s`.
- Draw one glowing crystalline anomaly at x=1770 and label it `ANOMALY 01`.

### 6.2 HUD

The fixed camera HUD must include:

- A panel titled `SUIT / RADIATION RESILIENCE`.
- A 278 px progress bar, numeric resilience value, and mSv unit.
- A text line showing the current shielding recovery rate or current surface drain rate.
- A task panel with a short tag and description.
- A distance-to-lander readout which is zero-clamped and derived from the astronaut's distance from x=250 at five world units per displayed metre.
- A cyan fill above 55% resilience, amber above 25%, and red at or below 25%.

The displayed meter value is rounded up to an integer. Radiation rates are gameplay simulation values, not real exposure measurements.

### 6.3 Controls

- Desktop movement: left/right arrows or A/D. Horizontal speed is 225 world units per second.
- Touch movement: two on-screen left/right pads positioned near the lower-left of the canvas. Press/hold moves; release or pointer-out stops movement.
- Movement has a small sinusoidal vertical bob and body rotation. The astronaut mirrors horizontally when moving left.
- During flare decisions, the player can click a choice or press `1` for leave sample and `2` for secure sample.
- The game must support browser resizing through Phaser's FIT scale mode.

## 7. Radiation tile extension contract

### 7.1 Registration and display

Each tile script runs before `game.js` and registers one entry by initializing `window.LunarRadiationTiles` to an array if needed, then pushing a tile object. The game must accept:

- `x`: world-space horizontal coordinate (required).
- `label`: display label shown under the marker (required).
- `symbol`: marker character; defaults to `R` if omitted.
- `color`: Phaser numeric color; defaults to cyan (`0x50e6ff`) if omitted.
- `onEnter(scene)`: callback invoked once when the astronaut reaches the tile; it must return a short string shown in the task panel.

The game displays each marker at y=535 with a glowing circle, symbol, and label. While in `explore`, a tile activates once when the astronaut is within 45 horizontal units of its x coordinate. Activation fades the marker to 35% alpha and updates the task panel with the tile label and callback result. Tile behavior is not triggered in other mission states.

Tile callbacks may alter the supplied mission scene's documented extension values. They must not depend on editing shared scene code for their assigned feature.

### 7.2 Implemented tile

`tiles/01_dosimeter.js` currently registers:

- Position x=520.
- Label `DOSIMETER SURVEY`, symbol `D`, cyan color.
- On activation, sets `scene.exposureMultiplier` to 0.8 and displays a message that the survey reduced surface exposure by 20%.

`MissionScene.updateRadiation` must multiply the baseline drain by `exposureMultiplier` and display that adjusted drain rate in the HUD.

### 7.3 Unimplemented tile placeholders

`tiles/02_shielding.js`, `tiles/03_forecast.js`, and `tiles/04_sample_tools.js` currently contain instructional comments only. They do not register visible tiles or implement effects. The scene initializes `shieldingBoost`, `flareBonus`, `samplePickupDelay`, and `sampleReturnSpeed` extension properties; only the flare and sample overrides are consumed by the existing core flow. The shielding flag is currently reserved and unused.

The four-person activity document describes proposed objectives for these placeholders. Those objectives become product behavior only when implemented in the corresponding tile files.

## 8. Radiation and mission progression

### 8.1 Resilience meter

- Maximum resilience: 600 game units, displayed with the label mSv.
- Baseline surface drain: 10 units per second, multiplied by `scene.exposureMultiplier` (default 1).
- Lander recovery: 10 units per second while the astronaut is within 165 units of x=250 and mission state is `explore`.
- The resilience value is clamped to [0, 600].
- During `explore`, `escape`, or `sample`, update the HUD each frame.
- If resilience reaches zero before an ended/failed state, end the mission as a suit-limit failure.
- The numerical values are intentionally accelerated for gameplay and must be described as non-realistic in the UI/documentation.

### 8.2 Discovery trigger and solar flare

- Once, when the astronaut passes x=1640 while exploring, stop horizontal motion, transition to `decision`, update the task panel to discovery, and show the flare choice after an 850 ms delay.
- The flare choice modal shows a solar flare warning, a five-second decision timer, a clear failure warning for no response, and two choices: leave the sample and sprint to shelter, or secure the sample and risk the return.
- The choice timer decreases in real time. If it reaches zero, automatically fail the mission through a flare impact.
- Buttons and scene-level pointer hit testing must both accept the two decisions. Scene-level hit testing uses the left-choice rectangle x=295–635 and right-choice rectangle x=645–985, y=340–450.
- The player can also choose with number keys 1 and 2.

### 8.3 Flare countdown

- After a choice, start a 10 second flare impact countdown plus `scene.flareBonus` (default 0).
- Show the remaining time in a fixed red countdown panel.
- The countdown advances during automatic escape/sample sequences.
- If the countdown expires while an automatic sequence is active, apply a flare impact and fail the mission.

### 8.4 Leave-sample route

- On choice 1, dismiss the modal, set state to `escape`, set automatic mode to `escape`, and communicate that the sample was abandoned.
- Move the astronaut back toward the lander at 510 units per second.
- If the astronaut reaches x<405 before impact, end with a safe, partial success: the crew survives and the sample is lost.
- Fade the anomaly marker during the return.

### 8.5 Secure-sample route

- On choice 2, dismiss the modal, set state to `sample`, set automatic mode to `pickup`, and communicate that the sample is being secured.
- Default sample pickup delay is 2350 ms; a positive `scene.samplePickupDelay` overrides it.
- After pickup, change automatic mode to `sample`, show the secured message, and return toward the lander.
- Default return speed is 125 units per second; a positive `scene.sampleReturnSpeed` overrides it.
- If the astronaut reaches x<405 before the flare countdown expires, end with `SAMPLE RETURNED SAFELY` and a successful crew status.
- Otherwise the flare impact causes mission failure.

### 8.6 Flare impact and mission ending

- Flare impact sets state to `failed`, shakes and flashes the camera, briefly overlays a red blast, reduces resilience by 520 (not below zero), and updates HUD text/color to critical solar particle exposure.
- After 1200 ms, show the failed mission end panel with the appropriate failure description.
- The end panel displays crew status, outcome headline, description, final resilience, and a radiation-safety lesson.
- Safe outcomes use cyan styling; failed outcomes use red styling.
- The Replay Mission button restarts the Mission scene after the pointer event finishes, rebuilding mission state.

## 9. Visual and motion requirements

- Star fields use deterministic random generation seeded with `lunar-radiation`.
- Lander and astronaut are drawn from Phaser graphics, shapes, and containers.
- Mission camera follows the astronaut smoothly and supports the long horizontal world.
- Animated elements include title-screen lander drift, cinematic flight/landing, anomaly glow, task-panel transitions, astronaut walking, flare warning/impact, and end-panel appearance.
- UI layers must remain fixed to the viewport where designated (HUD, choices, timer, touch controls, end overlays), while world art scrolls with the camera.

## 10. State model and invariants

The mission uses these state names: `intro`, `explore`, `decision`, `escape`, `sample`, `failed`, and `ended`.

- The flare decision can be triggered only once per mission.
- Only one flare choice may resolve; pointer and keyboard choices after resolution are ignored.
- A tile activates at most once per mission.
- Radiation values remain within zero and the 600 maximum.
- A mission end panel must not be created twice.
- The game must stop astronaut horizontal movement when opening the decision, starting an ending, or showing impact.
- Scene restart must reset mission state, tile activation flags, resilience, exposure modifier, flare bonus, and sample overrides by recreating the scene.

## 11. Error handling and accessibility

- If the Phaser library is missing, hide the loading state and reveal `#load-error`; do not attempt to instantiate the game.
- The page must expose accessible labels for the game shell, game canvas, and loading status.
- Controls and mission status must be visible in the game UI, with keyboard support for movement and flare choices.
- If `index.html` is absent, the launcher exits with a message identifying the missing path. If the selected port cannot be bound, the standard socket-server exception is allowed to stop launch.

## 12. Acceptance requirements

A reconstruction meets this specification when:

1. `python Radiation1.py` serves the project on `127.0.0.1:8000`, opens a browser by default, and supports `--port` and `--no-browser`.
2. The page loads the local Phaser library and starts without an external network dependency.
3. The title, cinematic, skip path, and lunar mission scenes transition as specified.
4. The astronaut moves with arrows, A/D, and touch controls across the lunar world.
5. The resilience HUD drains outdoors, recovers in the lander zone during exploration, reflects the dosimeter effect, and fails at zero.
6. The flare decision appears once, accepts click and keyboard input, times out after five seconds, and applies the correct return sequence.
7. Leaving the sample allows a partial crew-survival success; sample recovery succeeds only if the astronaut reaches shelter before impact.
8. Replay reconstructs mission state and allows the mission to be played again.
9. The implemented dosimeter tile renders and activates once at x=520. The other three tiles remain absent until their placeholder scripts are implemented.
10. Before publishing, `dist/` contains a synchronized copy of all runtime files referenced by the hosted `index.html`.

## 13. Repository-specific notes

- The authoritative editable runtime is currently the root-level `index.html`, `styles.css`, `game.js`, `Radiation1.py`, and `tiles/*.js`.
- `dist/` is the configured static hosting directory and contains copies of runtime files, so it must be kept in sync for published behavior.
- `radiation_1.py` remains as a compatibility wrapper.
- `README.md` gives quick-start instructions; `FOUR_PERSON_ACTIVITY.md` gives the educational, four-branch Codex activity.
- `phaser.min.js` is a vendored dependency and must remain available alongside the page that references it.
- `.gitignore` should omit local caches, environments, editor state, and credentials while retaining the intentionally tracked `dist/` package.
