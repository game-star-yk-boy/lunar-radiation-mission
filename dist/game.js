/* global Phaser */

(() => {
  'use strict';

  const WIDTH = 1280;
  const HEIGHT = 720;
  const GROUND_Y = 584;
  const WORLD_WIDTH = 2700;
  const MAX_RESILIENCE = 600;
  const DRAIN_RATE = 5;
  const RECOVERY_RATE = 10;

  const COLORS = {
    space: 0x02070c,
    navy: 0x071722,
    cyan: 0x50e6ff,
    amber: 0xffbf4b,
    red: 0xff5b4a,
    moon: 0xc6cbd0,
    moonDark: 0x666f78,
    white: 0xf3fbff,
    black: 0x02080d,
    blue: 0x2d6d91,
  };

  const uiText = (size = 18, color = '#eaf7ff') => ({
    fontFamily: 'Segoe UI, Arial, sans-serif',
    fontSize: `${size}px`,
    color,
  });

  const monoText = (size = 13, color = '#8ba2b2') => ({
    fontFamily: 'Consolas, ui-monospace, monospace',
    fontSize: `${size}px`,
    color,
    letterSpacing: 1,
  });

  function addStars(scene, count, width = WIDTH, height = HEIGHT, scrollFactor = 0) {
    const g = scene.add.graphics().setScrollFactor(scrollFactor);
    const rand = new Phaser.Math.RandomDataGenerator(['lunar-radiation']);
    for (let i = 0; i < count; i += 1) {
      const alpha = rand.realInRange(0.2, 0.9);
      const radius = rand.pick([0.7, 0.9, 1.2, 1.6]);
      g.fillStyle(i % 9 === 0 ? 0x9deaff : 0xffffff, alpha);
      g.fillCircle(rand.between(8, width - 8), rand.between(8, height - 80), radius);
    }
    return g;
  }

  function drawLander(scene, x, y, scale = 1) {
    const c = scene.add.container(x, y).setScale(scale);
    const g = scene.add.graphics();
    g.lineStyle(4, 0x8b969f, 1);
    g.lineBetween(-34, 30, -62, 73);
    g.lineBetween(34, 30, 62, 73);
    g.lineBetween(-62, 73, -83, 73);
    g.lineBetween(62, 73, 83, 73);
    g.fillStyle(0xe9eef0, 1);
    g.fillTriangle(-47, 24, 47, 24, 0, -58);
    g.fillStyle(0xb7c1c8, 1);
    g.fillRect(-39, 14, 78, 25);
    g.fillStyle(0x182935, 1);
    g.fillCircle(0, -12, 16);
    g.lineStyle(3, COLORS.cyan, .85);
    g.strokeCircle(0, -12, 16);
    g.fillStyle(0xd89f2c, 1);
    g.fillTriangle(-25, 39, 25, 39, 0, 58);
    g.fillStyle(0x233642, 1);
    g.fillRect(-31, 24, 62, 10);
    c.add(g);
    return c;
  }

  function drawAstronaut(scene, x, y) {
    const c = scene.add.container(x, y);
    const shadow = scene.add.ellipse(0, 37, 45, 10, 0x000000, .32);
    const g = scene.add.graphics();
    g.fillStyle(0xdfe7ea, 1);
    g.fillRoundedRect(-16, -3, 32, 39, 7);
    g.fillStyle(0xf4f7f8, 1);
    g.fillCircle(0, -19, 18);
    g.fillStyle(0x14232d, 1);
    g.fillRoundedRect(-13, -27, 26, 16, 7);
    g.fillStyle(0x4e8199, .7);
    g.fillRoundedRect(-10, -24, 20, 10, 5);
    g.fillStyle(0x9eabb2, 1);
    g.fillRect(-14, 33, 11, 19);
    g.fillRect(3, 33, 11, 19);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-15, 8, 6);
    g.fillCircle(15, 8, 6);
    g.fillStyle(COLORS.cyan, 1);
    g.fillRect(-11, 4, 22, 4);
    const pack = scene.add.rectangle(-20, 10, 10, 28, 0x8b999f);
    c.add([shadow, pack, g]);
    c.setSize(38, 96);
    return c;
  }

  function button(scene, x, y, w, h, label, fill, callback) {
    const c = scene.add.container(x, y);
    const bg = scene.add.rectangle(0, 0, w, h, fill, .95).setStrokeStyle(1, 0xffffff, .22);
    const t = scene.add.text(0, 0, label, { ...monoText(14, '#f6fbff'), fontStyle: 'bold' }).setOrigin(.5);
    c.add([bg, t]);
    c.setSize(w, h).setInteractive({ useHandCursor: true });
    c.on('pointerover', () => { bg.setFillStyle(fill, 1); c.setScale(1.025); });
    c.on('pointerout', () => { bg.setFillStyle(fill, .95); c.setScale(1); });
    c.on('pointerdown', callback);
    return c;
  }

  class TitleScene extends Phaser.Scene {
    constructor() { super('Title'); }

    create() {
      this.cameras.main.setBackgroundColor(COLORS.space);
      addStars(this, 145);

      const moon = this.add.graphics();
      moon.fillStyle(0xd1d5d7, 1);
      moon.fillCircle(1035, 650, 328);
      moon.fillStyle(0x9ca3a8, .4);
      moon.fillCircle(925, 520, 48);
      moon.fillCircle(1110, 450, 70);
      moon.fillCircle(1205, 610, 38);

      const orbit = this.add.graphics();
      orbit.lineStyle(1, COLORS.cyan, .18);
      orbit.strokeEllipse(1035, 650, 790, 300);

      const craft = drawLander(this, 745, 490, .32).setRotation(.22);
      this.tweens.add({ targets: craft, x: 765, y: 480, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

      this.add.text(74, 82, 'MISSION / 01', monoText(14, '#50e6ff'));
      this.add.text(70, 120, 'LUNAR\nRADIATION', { ...uiText(64), fontStyle: '800', lineSpacing: -4 });
      this.add.text(74, 268, 'A decision under the sun.', { ...uiText(21, '#9cb3c2'), fontStyle: '300' });
      this.add.rectangle(74, 330, 420, 1, 0x417088, .55).setOrigin(0, .5);
      this.add.text(74, 358, 'LAND  •  EXPLORE  •  SURVIVE', monoText(12, '#8098a8'));

      const start = button(this, 74 + 116, 467, 232, 58, 'BEGIN MISSION  →', 0x12667b, () => this.scene.start('Cinematic'));
      start.setDepth(5);
      this.add.text(74, 522, 'ARROW KEYS / WASD / TOUCH', monoText(11, '#617789'));

      this.add.text(1184, 78, '600', { ...monoText(54, '#ffbf4b'), fontStyle: 'bold' }).setOrigin(1, 0);
      this.add.text(1184, 140, 'mSv SUIT RESILIENCE', monoText(11, '#8ba2b2')).setOrigin(1, 0);
      this.add.text(1184, 175, '−5 mSv / SEC', monoText(11, '#ff816f')).setOrigin(1, 0);
    }
  }

  class CinematicScene extends Phaser.Scene {
    constructor() { super('Cinematic'); }

    create() {
      this.cameras.main.setBackgroundColor(COLORS.space);
      addStars(this, 170);
      const earth = this.add.graphics();
      earth.fillStyle(0x2b82b0, 1); earth.fillCircle(150, 142, 83);
      earth.fillStyle(0x6aa462, .8); earth.fillEllipse(128, 122, 58, 27); earth.fillEllipse(180, 169, 46, 24);
      earth.lineStyle(3, 0xa9e9ff, .35); earth.strokeCircle(150, 142, 86);

      const moon = this.add.graphics();
      moon.fillStyle(0xaab0b4, 1); moon.fillCircle(1085, 630, 350);
      moon.fillStyle(0x7d858b, .55); moon.fillCircle(955, 518, 43); moon.fillCircle(1135, 460, 68); moon.fillCircle(1220, 612, 31);

      const craft = drawLander(this, 310, 285, .45).setRotation(Math.PI / 2);
      const trail = this.add.graphics();
      trail.lineStyle(3, COLORS.cyan, .35); trail.lineBetween(195, 285, 265, 285);
      trail.lineStyle(1, COLORS.cyan, .25); trail.lineBetween(150, 270, 260, 270); trail.lineBetween(175, 300, 260, 300);

      const label = this.add.text(58, 590, 'TRANS-LUNAR INJECTION', monoText(13, '#50e6ff'));
      const sub = this.add.text(58, 620, 'Distance to surface: 384,400 km', monoText(12, '#8ba2b2'));
      const line = this.add.rectangle(58, 653, 0, 2, COLORS.cyan).setOrigin(0, .5);

      button(this, 1165, 38, 160, 34, 'SKIP CINEMATIC', 0x172b38, () => this.scene.start('Mission'));

      const land = () => {
        label.setText('CONTACT LIGHT');
        sub.setText('Velocity 0.4 m/s • Surface lock confirmed');
        this.tweens.add({
          targets: craft, y: 525, duration: 1100, ease: 'Sine.In',
          onComplete: () => {
            const dust = this.add.graphics();
            dust.fillStyle(0xd5d1c7, .45);
            for (let i = 0; i < 20; i += 1) dust.fillCircle(1005 + Phaser.Math.Between(-70, 70), 590 + Phaser.Math.Between(-8, 10), Phaser.Math.Between(2, 7));
            this.tweens.add({ targets: dust, alpha: 0, scaleX: 1.8, duration: 900 });
            this.time.delayedCall(1100, () => this.scene.start('Mission'));
          },
        });
      };

      const descend = () => {
        label.setText('DESCENT PHASE');
        sub.setText('Autopilot locked • Landing site: Mare Tranquillitatis');
        this.tweens.add({ targets: trail, alpha: 0, duration: 300 });
        this.tweens.add({ targets: craft, x: 1005, y: 470, rotation: 0, scale: .72, duration: 1700, ease: 'Quad.InOut', onComplete: land });
      };

      this.tweens.add({ targets: line, width: 540, duration: 3100 });
      this.tweens.add({ targets: [craft, trail], x: '+=555', y: '+=65', duration: 3200, ease: 'Sine.InOut', onComplete: descend });
    }
  }

  class MissionScene extends Phaser.Scene {
    constructor() { super('Mission'); }

    create() {
      this.state = 'intro';
      this.resilience = MAX_RESILIENCE;
      this.elapsedDrain = 0;
      this.walkTime = 0;
      this.choiceLocked = false;
      this.autoMode = null;
      this.flareTime = 10;

      this.physics.world.setBounds(0, 0, WORLD_WIDTH, HEIGHT);
      this.cameras.main.setBounds(0, 0, WORLD_WIDTH, HEIGHT);
      this.cameras.main.setBackgroundColor(COLORS.space);
      addStars(this, 270, WORLD_WIDTH, 500, 1);

      this.drawWorld();
      this.lander = drawLander(this, 250, 486, .9);
      this.lander.setDepth(6);
      this.drawShelterZone();
      this.rock = this.drawRock(1770, 548);

      this.astronaut = drawAstronaut(this, 265, 522).setDepth(8).setScale(.05).setAlpha(0);
      this.physics.add.existing(this.astronaut);
      this.astronaut.body.setSize(36, 88).setOffset(-18, -48).setCollideWorldBounds(true);
      this.astronaut.body.setAllowGravity(false);
      this.cameras.main.startFollow(this.astronaut, true, .08, .08, -210, 40);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE');
      this.buildHUD();
      this.buildTouchControls();

      this.task('EVA CHECK', 'Exit the lander and assess the surface.');
      this.time.delayedCall(550, () => this.exitLander());
    }

    drawWorld() {
      const far = this.add.graphics();
      far.fillStyle(0x333d45, 1);
      far.fillTriangle(0, 520, 330, 300, 670, 520);
      far.fillTriangle(410, 520, 810, 350, 1190, 520);
      far.fillTriangle(1040, 520, 1450, 250, 1840, 520);
      far.fillTriangle(1650, 520, 2140, 320, 2700, 520);
      far.setAlpha(.72);

      const earth = this.add.graphics().setScrollFactor(.2);
      earth.fillStyle(0x2f84ae, 1); earth.fillCircle(1040, 120, 47);
      earth.fillStyle(0x78a766, .8); earth.fillEllipse(1024, 109, 37, 19);
      earth.lineStyle(2, 0xb6eeff, .4); earth.strokeCircle(1040, 120, 49);

      const ground = this.add.graphics();
      ground.fillStyle(0x949ba0, 1);
      ground.fillRect(0, GROUND_Y, WORLD_WIDTH, HEIGHT - GROUND_Y);
      ground.fillStyle(0xb9bdc0, 1);
      ground.fillPoints([
        { x: 0, y: 584 }, { x: 260, y: 572 }, { x: 510, y: 590 },
        { x: 790, y: 566 }, { x: 1110, y: 584 }, { x: 1430, y: 562 },
        { x: 1730, y: 582 }, { x: 2030, y: 565 }, { x: 2360, y: 587 },
        { x: 2700, y: 572 }, { x: 2700, y: 720 }, { x: 0, y: 720 },
      ], true);
      ground.fillStyle(0x747d84, .58);
      [[510,620,90,24],[920,650,140,32],[1370,610,75,20],[2100,640,150,35],[2490,610,95,25]].forEach(([x,y,w,h]) => ground.fillEllipse(x,y,w,h));
      ground.lineStyle(2, 0xdfe3e5, .12);
      for (let x = 40; x < WORLD_WIDTH; x += 95) ground.lineBetween(x, 600 + (x % 4) * 8, x + 30, 596 + (x % 3) * 11);
    }

    drawShelterZone() {
      const zone = this.add.graphics();
      zone.fillStyle(0x50e6ff, .055); zone.fillCircle(250, 545, 175);
      zone.lineStyle(2, 0x50e6ff, .16); zone.strokeCircle(250, 545, 175);
      zone.setDepth(2);
      this.add.text(250, 670, 'LANDER SHIELD ZONE  +10 mSv/s', monoText(11, '#5eb3c4')).setOrigin(.5).setDepth(7);
    }

    drawRock(x, y) {
      const c = this.add.container(x, y).setDepth(7);
      const glow = this.add.graphics();
      glow.fillStyle(0x55e1ff, .12); glow.fillCircle(0, -8, 48);
      glow.lineStyle(1, 0x55e1ff, .35); glow.strokeCircle(0, -8, 34);
      const g = this.add.graphics();
      g.fillStyle(0x324a57, 1);
      g.fillTriangle(-32, 27, 31, 27, 14, -23);
      g.fillTriangle(-32, 27, -10, -16, 14, -23);
      g.fillStyle(0x50e6ff, .85);
      g.fillTriangle(-8, 9, 7, -9, 15, 15);
      g.fillStyle(0xcff8ff, .9); g.fillCircle(3, 2, 3);
      c.add([glow, g]);
      this.tweens.add({ targets: glow, alpha: .45, scale: 1.15, duration: 1100, yoyo: true, repeat: -1 });
      this.add.text(x, y + 48, 'ANOMALY 01', monoText(10, '#50e6ff')).setOrigin(.5);
      return c;
    }

    buildHUD() {
      this.hud = this.add.container(0, 0).setScrollFactor(0).setDepth(30);
      const panel = this.add.rectangle(28, 28, 350, 96, 0x06121b, .9).setOrigin(0).setStrokeStyle(1, 0x3d6578, .55);
      const title = this.add.text(46, 42, 'SUIT / RADIATION RESILIENCE', monoText(11, '#9bb0bc'));
      this.healthBack = this.add.rectangle(46, 71, 278, 15, 0x1d2a31, 1).setOrigin(0, .5);
      this.healthFill = this.add.rectangle(46, 71, 278, 15, COLORS.cyan, 1).setOrigin(0, .5);
      this.healthValue = this.add.text(356, 61, '600', { ...monoText(18, '#eaf7ff'), fontStyle: 'bold' }).setOrigin(1, 0);
      const unit = this.add.text(356, 82, 'mSv', monoText(10, '#8098a8')).setOrigin(1, 0);
      this.rateText = this.add.text(46, 96, 'SURFACE EXPOSURE  −5 mSv/s', monoText(11, '#ff9c87'));
      this.hud.add([panel, title, this.healthBack, this.healthFill, this.healthValue, unit, this.rateText]);

      this.taskPanel = this.add.container(640, 34).setScrollFactor(0).setDepth(31);
      const taskBg = this.add.rectangle(0, 0, 470, 70, 0x06121b, .9).setOrigin(.5, 0).setStrokeStyle(1, 0x3d6578, .45);
      this.taskTag = this.add.text(-215, 13, 'TASK', monoText(10, '#50e6ff'));
      this.taskText = this.add.text(-215, 33, '', { ...uiText(16), fontStyle: '600', wordWrap: { width: 420 } });
      this.taskPanel.add([taskBg, this.taskTag, this.taskText]);

      this.distanceText = this.add.text(1235, 128, '', monoText(12, '#8ba2b2')).setOrigin(1, 0).setScrollFactor(0).setDepth(31);
    }

    buildTouchControls() {
      this.touchLeft = false;
      this.touchRight = false;
      const makePad = (x, symbol, direction) => {
        const c = this.add.container(x, 637).setScrollFactor(0).setDepth(40);
        const bg = this.add.circle(0, 0, 31, 0x071722, .72).setStrokeStyle(1, 0x75aabc, .5);
        const text = this.add.text(0, -2, symbol, { ...uiText(25, '#bdeeff'), fontStyle: 'bold' }).setOrigin(.5);
        c.add([bg, text]).setSize(68, 68).setInteractive();
        c.on('pointerdown', () => { this[direction] = true; bg.setFillStyle(0x12667b, .9); });
        c.on('pointerup', () => { this[direction] = false; bg.setFillStyle(0x071722, .72); });
        c.on('pointerout', () => { this[direction] = false; bg.setFillStyle(0x071722, .72); });
      };
      makePad(65, '‹', 'touchLeft');
      makePad(137, '›', 'touchRight');
    }

    task(tag, text) {
      this.taskTag.setText(tag);
      this.taskText.setText(text);
      this.tweens.add({ targets: this.taskPanel, y: { from: 15, to: 34 }, alpha: { from: 0, to: 1 }, duration: 350, ease: 'Quad.Out' });
    }

    exitLander() {
      this.tweens.add({
        targets: this.astronaut, alpha: 1, scale: .9, x: 355, duration: 1200, ease: 'Sine.Out',
        onComplete: () => {
          this.state = 'explore';
          this.task('PRIMARY OBJECTIVE', 'Move forward and explore the lunar surface.');
        },
      });
    }

    update(_time, delta) {
      if (!this.astronaut || !this.astronaut.body) return;

      if (this.state === 'explore') this.playerMovement(delta);
      if (this.autoMode) this.autoSequence(delta);

      if (['explore', 'escape', 'sample'].includes(this.state)) this.updateRadiation(delta);

      if (this.state === 'explore' && !this.choiceLocked && this.astronaut.x > 1640) {
        this.choiceLocked = true;
        this.astronaut.body.setVelocityX(0);
        this.state = 'decision';
        this.task('DISCOVERY', 'Investigate more of these unusual crystalline rocks.');
        this.time.delayedCall(850, () => this.showFlareDecision());
      }

      this.distanceText.setText(`LANDER  ${Math.max(0, Math.round(Math.abs(this.astronaut.x - 250) / 5))} m  ◀`);
    }

    playerMovement(delta) {
      const left = this.cursors.left.isDown || this.keys.A.isDown || this.touchLeft;
      const right = this.cursors.right.isDown || this.keys.D.isDown || this.touchRight;
      const speed = 225;
      this.astronaut.body.setVelocityX(left ? -speed : right ? speed : 0);
      if (left || right) {
        this.astronaut.setScale(left ? -.9 : .9, .9);
        this.walkTime += delta * .012;
        this.astronaut.y = 522 + Math.sin(this.walkTime) * 3;
        this.astronaut.rotation = Math.sin(this.walkTime * .5) * .025;
      } else {
        this.astronaut.rotation = 0;
      }
    }

    updateRadiation(delta) {
      const sheltered = Math.abs(this.astronaut.x - 250) < 165 && this.state === 'explore';
      const rate = sheltered ? RECOVERY_RATE : -DRAIN_RATE;
      this.resilience = Phaser.Math.Clamp(this.resilience + rate * (delta / 1000), 0, MAX_RESILIENCE);
      const ratio = this.resilience / MAX_RESILIENCE;
      this.healthFill.width = 278 * ratio;
      this.healthFill.setFillStyle(ratio > .55 ? COLORS.cyan : ratio > .25 ? COLORS.amber : COLORS.red);
      this.healthValue.setText(`${Math.ceil(this.resilience)}`);
      this.rateText.setText(sheltered ? 'LANDER SHIELDING  +10 mSv/s' : 'SURFACE EXPOSURE  −5 mSv/s');
      this.rateText.setColor(sheltered ? '#69e5ff' : '#ff9c87');
      if (this.resilience <= 0 && !['ended', 'failed'].includes(this.state)) this.endMission(false, 'SUIT LIMIT EXCEEDED', 'Radiation resilience reached zero before shelter.');
    }

    showFlareDecision() {
      this.alarm = this.add.container(640, 0).setScrollFactor(0).setDepth(80);
      const shade = this.add.rectangle(0, 360, 1280, 720, 0x010407, .72);
      const panel = this.add.rectangle(0, 360, 780, 430, 0x100d0d, .98).setStrokeStyle(2, COLORS.red, .75);
      const warning = this.add.text(0, 193, '⚠  SOLAR FLARE DETECTED', { ...monoText(16, '#ff7869'), fontStyle: 'bold' }).setOrigin(.5);
      const title = this.add.text(0, 237, 'PARTICLE FRONT ARRIVES IN 10 SECONDS', { ...uiText(29), fontStyle: '800' }).setOrigin(.5);
      const body = this.add.text(0, 286, 'The sample is scientifically valuable—but carrying it will slow your return.\nChoose now. The Moon will not wait.', { ...uiText(16, '#aebdc6'), align: 'center', lineSpacing: 7 }).setOrigin(.5);
      const divider = this.add.rectangle(0, 333, 660, 1, 0x77403a, .6);
      const leave = button(this, -175, 395, 300, 78, 'LEAVE SAMPLE\nSPRINT TO SHELTER', 0x12667b, () => this.chooseEscape());
      const take = button(this, 175, 395, 300, 78, 'SECURE SAMPLE\nRISK THE RETURN', 0x6e332e, () => this.chooseSample());
      const note = this.add.text(0, 465, 'Decision locks immediately', monoText(10, '#7c8b94')).setOrigin(.5);
      this.alarm.add([shade, panel, warning, title, body, divider, leave, take, note]);
      this.alarm.setY(-35).setAlpha(0);
      this.tweens.add({ targets: this.alarm, y: 0, alpha: 1, duration: 350, ease: 'Back.Out' });
      this.cameras.main.flash(250, 255, 70, 45, false);
    }

    dismissAlarm() {
      if (this.alarm) this.alarm.destroy(true);
      this.buildCountdown();
    }

    buildCountdown() {
      this.countdownBox = this.add.container(1084, 30).setScrollFactor(0).setDepth(50);
      const bg = this.add.rectangle(0, 0, 160, 92, 0x250b09, .94).setOrigin(0).setStrokeStyle(1, COLORS.red, .8);
      const label = this.add.text(80, 13, 'FLARE IMPACT', monoText(10, '#ff8b7e')).setOrigin(.5, 0);
      this.countdownText = this.add.text(80, 32, '10.0', { ...monoText(38, '#ff6d5e'), fontStyle: 'bold' }).setOrigin(.5, 0);
      this.countdownBox.add([bg, label, this.countdownText]);
    }

    chooseEscape() {
      this.dismissAlarm();
      this.state = 'escape';
      this.autoMode = 'escape';
      this.task('EMERGENCY RETURN', 'Sample abandoned. Sprint to the lander shield zone.');
      this.rock.setAlpha(.55);
    }

    chooseSample() {
      this.dismissAlarm();
      this.state = 'sample';
      this.autoMode = 'pickup';
      this.pickupDelay = 2350;
      this.task('HIGH-RISK RETURN', 'Securing sample… evacuation speed reduced.');
      this.astronaut.body.setVelocityX(0);
      this.tweens.add({ targets: this.rock, y: this.rock.y - 35, x: this.astronaut.x + 22, scale: .45, duration: 800, ease: 'Back.In' });
    }

    autoSequence(delta) {
      this.flareTime -= delta / 1000;
      if (this.countdownText) this.countdownText.setText(Math.max(0, this.flareTime).toFixed(1));

      if (this.autoMode === 'pickup') {
        this.pickupDelay -= delta;
        if (this.pickupDelay <= 0) {
          this.autoMode = 'sample';
          this.task('HIGH-RISK RETURN', 'Sample secured. Reach shelter before impact.');
        }
      } else {
        const speed = this.autoMode === 'escape' ? 510 : 125;
        this.astronaut.body.setVelocityX(-speed);
        this.astronaut.setScale(-.9, .9);
        this.walkTime += delta * .02;
        this.astronaut.y = 522 + Math.sin(this.walkTime) * 4;
      }

      if (this.autoMode === 'escape' && this.astronaut.x < 405) {
        this.autoMode = null;
        this.astronaut.body.setVelocityX(0);
        this.endMission(true, 'MISSION PARTIALLY SUCCEEDED', 'Astronaut safe. The sample was lost, but the crew survived.');
      } else if (this.flareTime <= 0 && this.autoMode) {
        this.autoMode = null;
        this.astronaut.body.setVelocityX(0);
        this.flareImpact();
      }
    }

    flareImpact() {
      this.state = 'failed';
      this.cameras.main.shake(950, .02);
      this.cameras.main.flash(500, 255, 80, 32, false);
      const blast = this.add.rectangle(640, 360, 1280, 720, 0xff4e2e, .52).setScrollFactor(0).setDepth(70);
      this.tweens.add({ targets: blast, alpha: 0, duration: 1150 });
      this.resilience = Math.max(0, this.resilience - 520);
      this.healthFill.width = 278 * (this.resilience / MAX_RESILIENCE);
      this.healthFill.setFillStyle(COLORS.red);
      this.healthValue.setText(`${Math.ceil(this.resilience)}`);
      this.rateText.setText('CRITICAL SOLAR PARTICLE EXPOSURE');
      this.rateText.setColor('#ff5b4a');
      this.time.delayedCall(1200, () => this.endMission(false, 'MISSION FAILED', 'The sample delayed evacuation. The solar flare overwhelmed the suit.'));
    }

    endMission(success, title, description) {
      if (this.state === 'ended') return;
      this.state = 'ended';
      this.astronaut.body.setVelocityX(0);
      if (this.countdownBox) this.countdownBox.destroy(true);

      const overlay = this.add.container(640, 360).setScrollFactor(0).setDepth(100);
      const shade = this.add.rectangle(0, 0, 1280, 720, 0x010407, .82);
      const panel = this.add.rectangle(0, 0, 720, 390, 0x06121b, .98).setStrokeStyle(2, success ? COLORS.cyan : COLORS.red, .7);
      const tag = this.add.text(0, -132, success ? 'CREW STATUS / SAFE' : 'CREW STATUS / CRITICAL', monoText(12, success ? '#50e6ff' : '#ff6d5e')).setOrigin(.5);
      const headline = this.add.text(0, -85, title, { ...uiText(31), fontStyle: '800', align: 'center' }).setOrigin(.5);
      const desc = this.add.text(0, -25, description, { ...uiText(17, '#a9bbc5'), align: 'center', wordWrap: { width: 570 }, lineSpacing: 6 }).setOrigin(.5);
      const result = this.add.text(0, 48, `FINAL RESILIENCE  ${Math.ceil(this.resilience)} / ${MAX_RESILIENCE} mSv`, monoText(13, success ? '#75e9ff' : '#ff9b88')).setOrigin(.5);
      const lesson = this.add.text(0, 83, success ? 'Scientific value never outranks crew survival.' : 'A valuable discovery is not worth an unsafe return.', monoText(11, '#7f929e')).setOrigin(.5);
      const replay = button(this, 0, 139, 220, 52, 'REPLAY MISSION', success ? 0x12667b : 0x6e332e, () => this.scene.start('Title'));
      overlay.add([shade, panel, tag, headline, desc, result, lesson, replay]);
      overlay.setScale(.96).setAlpha(0);
      this.tweens.add({ targets: overlay, scale: 1, alpha: 1, duration: 420, ease: 'Back.Out' });
    }
  }

  function boot() {
    const loading = document.getElementById('loading');
    if (typeof Phaser === 'undefined') {
      loading.hidden = true;
      document.getElementById('load-error').hidden = false;
      return;
    }

    new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game-container',
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: '#02070c',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scene: [TitleScene, CinematicScene, MissionScene],
      render: { antialias: true, pixelArt: false, roundPixels: false },
      input: { activePointers: 3 },
    });
    loading.hidden = true;
  }

  window.addEventListener('load', boot);
})();
