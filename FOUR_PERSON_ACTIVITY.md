# Lunar Radiation Mission: learn Codex together

## Activity goal

In 25 minutes, four people will each use Codex to create one radiation-themed feature, add their own generated code to a separate branch, and combine all four features into one playable game.

Everyone starts from the same `Lunar-Radiation-Mission` repository and launches it with `Radiation1.py`. That Python file starts the local web server; Phaser game code lives in `game.js`. The starter includes four separate tile files and a shared tile hook. Each person should use Codex to develop their assigned feature, then copy Codex's code into only their assigned tile file.

## Before the activity

The facilitator should make sure this starter version is pushed to `main` at `https://github.com/game-star-yk-boy/lunar-radiation-mission` and give all four people write access. Each device needs Codex, Python 3, Git, a browser, and a code editor. Keep `phaser.min.js` in the repository; no package installation is needed.

## Assign one objective to each person

| Person | Branch | File to update | Objective |
| --- | --- | --- | --- |
| 1 | `tile/dosimeter` | `tiles/01_dosimeter.js` | Create a dosimeter tile at x=520. When the astronaut reaches it, show a radiation survey message and reduce the ongoing surface drain by 20%. The HUD should show the adjusted rate. |
| 2 | `tile/shielding` | `tiles/02_shielding.js` | Create a portable shielding tile at x=800. When collected, restore up to 50 points of game resilience, never exceeding the 600 point maximum, and show a confirmation message. |
| 3 | `tile/forecast` | `tiles/03_forecast.js` | Create a solar forecast tile at x=1080. Collecting it before the flare warning should add 3 seconds to the flare return countdown. Show a warning received message. |
| 4 | `tile/sample-tools` | `tiles/04_sample_tools.js` | Create a sample tools tile at x=1370. It should shorten sample pickup to about 1.2 seconds and make the return fast enough to reach shelter before the flare. |

These are gameplay values, not a real radiation exposure model. The in-game resilience meter is a game resource.

## How each person uses Codex

Each person opens their own clone of the repository in Codex. Read the assigned objective and inspect the existing tile hookup before writing a prompt. Then write a prompt in your own words. Include enough context for Codex to understand:

- what the game is and where the feature belongs;
- your assigned objective and how a player should see it work;
- that the feature must stay on the lunar radiation theme;
- the one tile file you are responsible for;
- any existing shared game code or files Codex must leave alone; and
- what code and explanation you want Codex to return.

Read Codex's response before using it. Check that it meets the objective, uses the existing tile registration hook, and does not require edits to another person's file. Ask Codex to revise anything that is unclear or incomplete. Copy the final code into your assigned file, save it, and try the feature in the browser. The objective belongs to the participant; Codex supplies coding help, and the participant reviews and tests the result.

## 25-minute tutorial

### 0:00–4:00 — Open and run the starter

Each person clones the repository, opens that folder in Codex, and starts the game:

```powershell
git clone https://github.com/game-star-yk-boy/lunar-radiation-mission.git
cd lunar-radiation-mission
python Radiation1.py
```

Open `http://127.0.0.1:8000` if it does not open automatically. Click **Begin Mission**, then **Skip Cinematic**. Check that the astronaut moves with arrow keys or A/D. If `python` is unavailable on Windows, try `py Radiation1.py`.

### 4:00–6:00 — Assign objectives and branches

Each person uses a separate clone and creates the branch shown in the table. For example:

```powershell
git switch -c tile/dosimeter
```

Open only your assigned tile file. The shared hook expects each file to register a tile with a position, label, symbol, color, and an `onEnter(scene)` behavior. The game displays the tile in the world and calls its behavior when the astronaut reaches it.

### 6:00–8:00 — Write your own Codex prompt

Read **How each person uses Codex** and your assigned objective. Inspect `game.js` and one of the tile placeholders to understand how features connect. Write your own prompt to Codex; the facilitator should help participants improve their prompts by asking what context, constraints, or success criteria are missing, without writing the prompt for them.

### 8:00–15:00 — Generate, review, and add your code

Ask Codex to create your feature. Read its response, request revisions if needed, and copy the code into your assigned file. Save, reload the browser, walk to the tile, and check the visible effect. Keep the feature code in that one tile file; if Codex suggests editing shared files, explain the starter's tile hook and ask it for a version that fits your assigned file.

### 15:00–18:00 — Commit and open pull requests

Each person checks that only their assigned tile file changed, then commits and pushes their branch. Example for Person 1:

```powershell
git status --short
git add tiles/01_dosimeter.js
git commit -m "Add dosimeter radiation tile"
git push -u origin tile/dosimeter
```

Use your own file, commit message, and branch from the table. On GitHub, open a pull request from your branch into `main`.

### 18:00–22:00 — Combine the four contributions

Choose one person to integrate. Merge the four pull requests into `main`, one at a time. Each person works in a separate tile file. If GitHub reports a conflict, check whether someone edited `game.js`, `index.html`, or another person's tile file.

Everyone updates their local copy:

```powershell
git switch main
git pull origin main
```

### 22:00–25:00 — Play and review the combined game

Restart `python Radiation1.py` if needed and reload the browser. Skip the cinematic and walk right. Confirm the four tiles appear in order and that each one shows its effect. The dosimeter should adjust the surface drain, shielding should restore resilience, and the forecast should extend the flare timer. Continue to the crystal, choose **2 / Secure Sample**, and check whether the sample tools make a safe return possible. Replay and choose **1 / Leave Sample** to check that route still works.

If a feature is missing, check that its pull request was merged, the code is in the correct tile file, and the browser was reloaded. The combined result is one radiation-themed game on `main`, built from four participant-written Codex prompts and four reviewed code contributions.
