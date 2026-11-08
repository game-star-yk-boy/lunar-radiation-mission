# Lunar Radiation Mission — Game Requirements

## 1. Player experience

Lunar Radiation Mission is a short, cinematic lunar survival game about radiation risk and scientific discovery. The player is an astronaut who leaves a lander, explores a hazardous lunar surface, discovers an unusual crystalline rock, and responds to an approaching solar flare.

The central lesson is that crew safety takes priority over recovering a scientific sample. The game presents radiation values as accelerated gameplay values, not as a real-world exposure model.

## 2. Presentation and setting

- The setting is a dark lunar landscape with a visible Earth, distant ridges, a lander, an astronaut, surface rocks, and a glowing crystalline anomaly.
- Star fields, a drifting lander on the title screen, a glowing anomaly, and brief motion during travel, walking, warnings, and results give the mission a sense of movement.
- The visual style is cinematic and futuristic, using a near-black/navy space palette with cyan, amber, red, and lunar-grey accents.
- Instrument readouts, mission labels, and warnings should be concise and easy to read during play.
- A surrounding frame shows the game name, mission number, movement reminder, and a note that radiation values are accelerated for the simulation.
- The title experience identifies the game as Mission 01 and presents “A decision under the sun.” and “Land • Explore • Survive.”
- The opening sequence depicts travel from Earth toward the Moon, descent, and landing at Mare Tranquillitatis. It shows a 384,400 km distance-to-surface readout, descent and contact messages, and a 0.4 m/s landing-velocity readout. The player can skip it.
- Before play begins, show an initialization indicator. If the game cannot start, show a clear failure message with a suggested recovery action.
- The game must remain understandable on desktop and touch-screen displays. The lunar play area should scale to the available screen while preserving its complete view.

## 3. Game flow

1. **Title:** Present the mission identity, starting resilience, baseline exposure rate, controls, and a Begin Mission action.
2. **Journey and landing:** Show a short animated journey and landing. Provide a Skip Cinematic action that starts surface play immediately.
3. **EVA and exploration:** The astronaut exits the lander, receives an exploration objective, and travels across the lunar surface.
4. **Discovery:** Near the crystalline anomaly, stop forward exploration and introduce an urgent solar-flare decision.
5. **Decision:** Give the player a brief, timed opportunity to choose whether to abandon or secure the sample.
6. **Outcome:** Show whether the crew survived, whether the sample was recovered, the final resilience value, and a concise safety lesson.
7. **Replay:** Return to the title screen. Starting again begins a fresh journey with a reset resilience meter, decision, timer, and collected-item state.

## 4. Controls

- Move left and right with the keyboard arrow keys or A/D keys.
- On touch screens, provide on-screen left and right controls that respond while pressed and stop on release or when the pointer leaves the control.
- During the flare decision, allow the player to choose by clicking/tapping an option or pressing 1 for “Leave Sample” and 2 for “Secure Sample.”
- After the player chooses, the astronaut completes the return automatically; the player no longer steers the astronaut during that return.
- Show the available movement controls before and during play.

## 5. Lunar exploration

- The surface journey begins near the lander and continues toward a single glowing crystalline anomaly farther across the lunar plain.
- The lander area is visibly identified as a shield zone.
- The astronaut is the player-controlled character during exploration. Movement should include a subtle walking motion and face the direction of travel.
- The view should follow the astronaut along the extended surface route.
- A distance readout should communicate the astronaut’s distance from the lander in metres, indicate the direction back, and never show a negative distance.
- An exploration task panel should show the current objective and brief messages when mission events or radiation-related items activate.

## 6. Radiation resilience

- The astronaut begins with 600 points of suit resilience. The interface labels the value in mSv as an accelerated game value.
- While outside the lander shield zone, resilience decreases at a baseline rate of 10 points per second.
- While within the lander shield zone during exploration, resilience recovers at 10 points per second.
- Radiation resilience stays unchanged while the timed flare decision is on screen. During the automatic return, surface exposure continues until the mission ends, even when the astronaut nears the lander.
- Resilience cannot exceed 600 or fall below zero.
- Show current resilience numerically and with a status bar. Use cyan above 55%, amber above 25% through 55%, and red at or below 25%.
- Show the current surface-drain or lander-recovery rate beside the meter.
- If resilience reaches zero before the mission ends, the crew fails the mission from suit-limit exhaustion.
- Radiation values and timing are gameplay abstractions and must be described as such in player-facing information.

## 7. Crystalline anomaly and solar-flare decision

- When the astronaut reaches the anomaly area, show a discovery message and pause forward movement.
- After a brief warning transition, display a prominent solar-flare alert and start a five-second decision timer.
- Show the remaining decision time to one decimal place and keep the warning and choices prominent over the lunar scene.
- Clearly state that failing to choose before time expires results in mission failure.
- After a decision is made, start a visible 10-second countdown to flare impact, shown to one decimal place. Any collected flare-warning aid may add time.
- Offer two distinct choices:
  - **Leave Sample — Sprint to Shelter:** Abandon the sample and make the fastest return to the lander.
  - **Secure Sample — Risk the Return:** Spend time collecting the sample, then return at a reduced speed.
- Permit only one decision to take effect. Ignore extra pointer or key input after a choice is resolved.
- If no decision is made within five seconds, apply the flare impact immediately and fail the mission without starting a return route.

## 8. Return routes and outcomes

### Leave the sample

- Communicate that the sample was abandoned and the astronaut is sprinting to shelter.
- Move the astronaut rapidly toward the lander.
- Reaching the lander shield zone before flare impact produces a partial success: the crew is safe, but the sample is lost.
- If flare impact occurs before shelter is reached, the mission fails.

### Secure the sample

- Communicate that the astronaut is collecting the sample, then that it is secured.
- Sample collection takes 2.35 seconds by default, and the return is slower than the emergency sprint (125 versus 510 game movement units per second).
- With the default collection time, slower return, and 10-second flare countdown, the sample route cannot reach shelter in time. A suitable item effect or extra warning time can make success possible.
- Reaching the lander shield zone before flare impact produces a successful sample return.
- If the flare arrives first, show a flare impact and mission failure.

### Flare impact and results

- Show the flare with a screen flash and shake, then reduce resilience by 520 points, not below zero.
- Show a critical solar-particle exposure warning and present the appropriate failure result.
- The results screen distinguishes safe crew status from critical crew status, gives a headline and short explanation, displays final resilience against the 600-point maximum, and reinforces the safety lesson.
- Outcomes should clearly distinguish suit-limit failure, missed decision, flare-impact failure, partial crew-survival success, and safe sample return.
- Safe outcomes use the lesson “Scientific value never outranks crew survival.” Failed outcomes use “A valuable discovery is not worth an unsafe return.”

## 9. Radiation-related item interactions

- An item activates once when the astronaut comes within a short distance of its marker while exploring.
- Each activated item fades and updates the task panel with its name and result.
- Item effects may adjust resilience, surface drain, flare warning time, or sample recovery time, provided they remain clearly related to lunar radiation risk and crew safety.
- Item messages must be short and visible during play.

## 10. Mission states and consistency

- The mission progresses through entry, exploration, decision, return, and final-result phases.
- Trigger the crystalline anomaly decision once per mission.
- Activate each radiation-related item at most once per mission.
- Stop astronaut movement when presenting the flare decision, on impact, and on the results screen.
- Replay returns to the title screen. Starting from there creates a clean mission with resilience reset to 600 and no prior decisions, collected items, or flare timer carried over.

## 11. Game acceptance criteria

The game meets these requirements when a player can:

1. Start the mission from the title and skip the journey sequence.
2. Explore the lunar surface using either keyboard or touch controls.
3. Read the resilience meter, exposure rate, current task, and distance from the lander.
4. Reach the crystalline anomaly and make either flare decision using a pointer or the specified number key.
5. See a failure if the five-second decision window expires without a choice.
6. Reach a clear outcome showing crew safety, sample recovery status, final resilience, and the mission’s safety lesson.
7. Return to the title screen after selecting Replay, then begin a mission with all mission state reset.
