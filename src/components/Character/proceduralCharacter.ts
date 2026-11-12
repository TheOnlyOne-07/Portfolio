import * as THREE from "three";

export interface WorkstationDeskRig {
  chairGroup: THREE.Group;
  deskGroup: THREE.Group;
  monitorScreen: THREE.Mesh;
  screenlight: THREE.Mesh;
  keys: THREE.Mesh[];
}

export function buildWorkstationDesk(floorY = 0.28): WorkstationDeskRig {
  const chairMat = new THREE.MeshStandardMaterial({
    color: 0xede9f2,
    roughness: 0.62,
    metalness: 0.04,
    transparent: true,
    opacity: 0,
  });
  const chairLegMat = new THREE.MeshStandardMaterial({
    color: 0xdad3e3,
    roughness: 0.68,
    metalness: 0.04,
    transparent: true,
    opacity: 0,
  });
  const deskWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf4f1f8,
    roughness: 0.38,
    metalness: 0.12,
    transparent: true,
    opacity: 0,
  });
  const deskFrameMat = new THREE.MeshStandardMaterial({
    color: 0xe2dce9,
    roughness: 0.35,
    metalness: 0.3,
    transparent: true,
    opacity: 0,
  });
  const kbBaseMat = new THREE.MeshStandardMaterial({
    color: 0x221b2b,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0,
  });

  const deskGroup = new THREE.Group();
  deskGroup.name = "Plane004";

  // Minimalist white molded chair (fades in with desk in side view)
  const chairGroup = new THREE.Group();
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 0.22, 1.85),
    chairMat
  );
  seat.position.set(0, 1.4, -0.35);
  const backrest = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 2.35, 0.18),
    chairMat
  );
  backrest.position.set(0, 2.62, -1.24);
  backrest.rotation.x = -0.09;

  const chairLegLen = 1.38 - floorY;
  const chairLegCenterY = (1.38 + floorY) / 2;

  [
    [-0.76, -1.05, 0.1, 0.1],
    [0.76, -1.05, 0.1, -0.1],
    [-0.76, 0.35, -0.1, 0.1],
    [0.76, 0.35, -0.1, -0.1],
  ].forEach(([lx, lz, rx, rz]) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.055, chairLegLen, 14),
      chairLegMat
    );
    leg.position.set(lx, chairLegCenterY, lz);
    leg.rotation.x = rx;
    leg.rotation.z = rz;
    chairGroup.add(leg);
  });
  chairGroup.add(seat, backrest);
  deskGroup.add(chairGroup);

  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.12, 2.2),
    deskWhiteMat
  );
  deskTop.position.set(0, 2.55, 2.15);
  deskGroup.add(deskTop);

  const railY = floorY + 0.04;
  const deskLegLen = Math.max(1.0, 2.55 - railY);
  const deskLegCenterY = (2.55 + railY) / 2;

  [-2.05, 2.05].forEach((lx) => {
    const legFront = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, deskLegLen, 0.1),
      deskFrameMat
    );
    legFront.position.set(lx, deskLegCenterY, 2.95);
    const legBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, deskLegLen, 0.1),
      deskFrameMat
    );
    legBack.position.set(lx, deskLegCenterY, 1.35);
    const footRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 1.9),
      deskWhiteMat
    );
    footRail.position.set(lx, railY, 2.15);
    deskGroup.add(legFront, legBack, footRail);
  });

  const kbBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.07, 0.65),
    kbBaseMat
  );
  kbBase.position.set(0, 2.64, 1.58);
  deskGroup.add(kbBase);

  const keys: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0xf4f1f8,
      emissive: 0xc2a4ff,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0,
    });
    const keyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.05, 0.16),
      keyMat
    );
    keyMesh.name = `key${i + 1}`;
    keyMesh.position.set(-0.65 + i * 0.26, 2.7, 1.58);
    deskGroup.add(keyMesh);
    keys.push(keyMesh);
  }

  const monitorBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.06, 0.52),
    deskWhiteMat
  );
  monitorBase.position.set(0, 2.64, 2.55);
  const monitorStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.92, 0.14),
    deskFrameMat
  );
  monitorStand.position.set(0, 3.1, 2.62);
  monitorStand.rotation.x = 0.12;
  deskGroup.add(monitorBase, monitorStand);

  const monitorBackMat = new THREE.MeshStandardMaterial({
    color: 0xd9a7c7,
    emissive: 0x9b5de5,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.25,
    transparent: true,
    opacity: 0,
  });
  const monitorBezel = new THREE.Mesh(
    new THREE.BoxGeometry(3.05, 1.82, 0.09),
    monitorBackMat
  );
  monitorBezel.position.set(0, 3.95, 2.48);
  monitorBezel.rotation.x = -0.05;
  deskGroup.add(monitorBezel);

  const screenMat = new THREE.MeshStandardMaterial({
    map: createCodeScreenTexture(),
    emissive: 0xffffff,
    emissiveMap: createCodeScreenTexture(),
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0,
  });
  screenMat.name = "Material.027";

  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 1.66),
    screenMat
  );
  monitorScreen.position.set(0, 3.95, 2.42);
  monitorScreen.rotation.y = Math.PI;
  monitorScreen.rotation.x = 0.05;
  deskGroup.add(monitorScreen);

  const screenlightMat = new THREE.MeshStandardMaterial({
    color: 0xc8bfff,
    emissive: 0xc8bfff,
    emissiveIntensity: 2.0,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const screenlight = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 1.5),
    screenlightMat
  );
  screenlight.name = "screenlight";
  screenlight.position.set(0, 11.55, 2.38);
  screenlight.rotation.y = Math.PI;

  return { chairGroup, deskGroup, monitorScreen, screenlight, keys };
}

export interface ProceduralCharacterRig {
  scene: THREE.Group;
  spine005: THREE.Object3D;
  spine006: THREE.Object3D;
  screenlight: THREE.Mesh;
  monitorScreen: THREE.Mesh;
  deskGroup: THREE.Group;
  eyebrowL: THREE.Object3D;
  eyebrowR: THREE.Object3D;
  eyelidL: THREE.Object3D;
  eyelidR: THREE.Object3D;
  forearmL: THREE.Object3D;
  forearmR: THREE.Object3D;
  keys: THREE.Mesh[];
  updateMotion?: (elapsed: number, blinkAmount: number, hovered: boolean) => void;
}

function createCodeScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#160d20";
    ctx.fillRect(0, 0, 512, 320);

    const grad = ctx.createLinearGradient(0, 0, 512, 320);
    grad.addColorStop(0, "rgba(251, 141, 255, 0.25)");
    grad.addColorStop(1, "rgba(194, 164, 255, 0.08)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 320);

    const lines = [
      { indent: 28, w: 140, color: "#fb8dff" },
      { indent: 46, w: 230, color: "#eae5ec" },
      { indent: 46, w: 180, color: "#c2a4ff" },
      { indent: 64, w: 260, color: "#fb8dff" },
      { indent: 64, w: 190, color: "#c2a4ff" },
      { indent: 46, w: 145, color: "#eae5ec" },
      { indent: 28, w: 105, color: "#fb8dff" },
      { indent: 28, w: 215, color: "#c2a4ff" },
      { indent: 46, w: 270, color: "#eae5ec" },
    ];
    lines.forEach((line, idx) => {
      ctx.fillStyle = line.color;
      ctx.fillRect(line.indent, 48 + idx * 26, line.w, 8);
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildProceduralCharacter(): ProceduralCharacterRig {
  const root = new THREE.Group();
  root.name = "CharacterRoot";

  // Clean off-white clay/vinyl materials matching the reference 3D character & workstation
  const clayMat = new THREE.MeshStandardMaterial({
    color: 0xede9f2,
    roughness: 0.62,
    metalness: 0.04,
  });
  const clayShadowMat = new THREE.MeshStandardMaterial({
    color: 0xdad3e3,
    roughness: 0.68,
    metalness: 0.04,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x0f0b14,
    roughness: 0.34,
    metalness: 0.14,
  });
  const browMat = new THREE.MeshStandardMaterial({
    color: 0x110c17,
    roughness: 0.45,
    metalness: 0.08,
  });
  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x261547,
    roughness: 0.2,
    metalness: 0.1,
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09060f });
  const scleraMat = new THREE.MeshStandardMaterial({
    color: 0xf7f5fa,
    roughness: 0.35,
  });
  const character = new THREE.Group();
  character.position.set(0, 7.6, 0);
  root.add(character);

  // Hips, legs & rounded white shoes (feet at y = 3.36 world / 0.45 local)
  const hip = new THREE.Mesh(
    new THREE.SphereGeometry(0.84, 24, 18),
    clayMat
  );
  hip.scale.set(1.02, 0.58, 0.78);
  hip.position.set(0, 1.92, -0.2);
  character.add(hip);

  [-0.44, 0.44].forEach((xOff, idx) => {
    const thigh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.32, 1.05, 10, 18),
      clayMat
    );
    thigh.rotation.x = Math.PI / 2.08;
    thigh.position.set(xOff, 1.92, 0.52);

    const shin = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.28, 1.15, 10, 18),
      clayMat
    );
    shin.position.set(xOff, 1.16, 1.14);

    const shoe = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.25, 0.46, 10, 16),
      clayMat
    );
    shoe.name = idx === 0 ? "footL" : "footR";
    shoe.rotation.x = Math.PI / 2;
    shoe.scale.set(1.05, 1.0, 0.78);
    shoe.position.set(xOff, 0.44, 1.32);
    character.add(thigh, shin, shoe);
  });

  // Lower torso
  const lowerTorso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 0.84, 1.15, 28),
    clayMat
  );
  lowerTorso.scale.set(1.06, 1.0, 0.78);
  lowerTorso.position.set(0, 2.55, -0.2);
  character.add(lowerTorso);

  // spine005 (sculpted rounded clay sweater torso + soft shoulder slope + crew collar)
  const spine005 = new THREE.Group();
  spine005.name = "spine005";
  spine005.position.set(0, 3.02, -0.2);
  character.add(spine005);

  const torsoProfile = [
    new THREE.Vector2(0.78, 0.0),
    new THREE.Vector2(0.85, 0.42),
    new THREE.Vector2(0.98, 0.92),
    new THREE.Vector2(1.04, 1.18),
    new THREE.Vector2(0.84, 1.38),
    new THREE.Vector2(0.46, 1.48),
    new THREE.Vector2(0.32, 1.54),
  ];
  const chest = new THREE.Mesh(
    new THREE.LatheGeometry(torsoProfile, 36),
    clayMat
  );
  chest.scale.set(1.12, 1.0, 0.74);
  spine005.add(chest);

  // Crewneck sweater collar ring
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.075, 14, 32),
    clayShadowMat
  );
  collar.rotation.x = Math.PI / 2 - 0.1;
  collar.position.set(0, 1.48, 0.02);
  spine005.add(collar);

  // Smooth puffed sleeves, ribbed cuffs, and 5-fingered typing hands
  const makeArm = (side: -1 | 1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.86, 1.15, 0.02);
    spine005.add(shoulder);

    const shoulderSmooth = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 20, 18),
      clayMat
    );
    shoulder.add(shoulderSmooth);

    const upperArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.26, 0.86, 10, 18),
      clayMat
    );
    upperArm.position.set(side * 0.08, -0.44, 0.16);
    upperArm.rotation.x = -0.55;
    upperArm.rotation.z = side * 0.16;
    shoulder.add(upperArm);

    const forearm = new THREE.Group();
    forearm.name = side < 0 ? "forearmL" : "forearmR";
    forearm.position.set(side * 0.18, -0.92, 0.42);
    shoulder.add(forearm);

    const forearmSleeve = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.25, 0.78, 10, 18),
      clayMat
    );
    forearmSleeve.rotation.x = Math.PI / 2.15;
    forearmSleeve.position.set(-side * 0.16, -0.1, 0.42);
    forearm.add(forearmSleeve);

    const cuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.19, 0.12, 18),
      clayShadowMat
    );
    cuff.rotation.x = Math.PI / 2.15;
    cuff.position.set(-side * 0.24, -0.15, 0.82);
    forearm.add(cuff);

    // Sculpted palm + finger row over keyboard
    const handGroup = new THREE.Group();
    handGroup.position.set(-side * 0.27, -0.17, 0.96);
    const palm = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 14, 14),
      clayMat
    );
    palm.scale.set(1.0, 0.65, 1.25);
    handGroup.add(palm);

    [-0.08, -0.025, 0.03, 0.085].forEach((fx) => {
      const finger = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.026, 0.12, 6, 8),
        clayMat
      );
      finger.rotation.x = Math.PI / 2 + 0.35;
      finger.position.set(fx, -0.03, 0.16);
      handGroup.add(finger);
    });
    forearm.add(handGroup);

    return forearm;
  };

  const forearmL = makeArm(-1);
  const forearmR = makeArm(1);

  // spine006 (Head pivot for mouse tracking)
  const spine006 = new THREE.Group();
  spine006.name = "spine006";
  spine006.position.set(0, 1.48, 0.04);
  spine005.add(spine006);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.38, 22),
    clayMat
  );
  neck.position.set(0, 0.2, 0);
  spine006.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.9, 0.06);
  spine006.add(headGroup);

  // Sculpted stylized clay head matching Image 2 (smooth brow, cheek taper, soft chin)
  const headProfile = [
    new THREE.Vector2(0.0, -0.7),
    new THREE.Vector2(0.29, -0.64),
    new THREE.Vector2(0.49, -0.4),
    new THREE.Vector2(0.62, -0.06),
    new THREE.Vector2(0.64, 0.26),
    new THREE.Vector2(0.56, 0.54),
    new THREE.Vector2(0.32, 0.72),
    new THREE.Vector2(0.0, 0.76),
  ];
  const headMesh = new THREE.Mesh(
    new THREE.LatheGeometry(headProfile, 36),
    clayMat
  );
  headMesh.scale.set(0.95, 1.0, 0.98);
  headGroup.add(headMesh);

  // Big stylized C-shaped ears matching Image 2
  [-0.63, 0.63].forEach((x) => {
    const earGroup = new THREE.Group();
    earGroup.position.set(x, -0.04, -0.04);
    earGroup.rotation.y = x > 0 ? 0.25 : -0.25;
    const earOuter = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.055, 12, 24),
      clayMat
    );
    earOuter.scale.set(0.85, 1.15, 0.75);
    const earInner = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 14, 14),
      clayShadowMat
    );
    earInner.scale.set(0.75, 1.0, 0.4);
    earGroup.add(earOuter, earInner);
    headGroup.add(earGroup);
  });

  // Glossy black swept hair matching Image 2 (smooth blended crown + side-part + sideburns)
  const hairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.67, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52),
    hairMat
  );
  hairCrown.scale.set(0.96, 1.04, 1.04);
  hairCrown.position.set(0, 0.25, -0.07);
  hairCrown.rotation.x = -0.34;
  headGroup.add(hairCrown);

  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.53, 28, 20),
    hairMat
  );
  hairTop.scale.set(1.04, 0.42, 0.98);
  hairTop.position.set(-0.02, 0.57, 0.04);
  hairTop.rotation.z = -0.08;
  hairTop.rotation.x = 0.05;
  headGroup.add(hairTop);

  // Sideburns framing forehead
  [-0.56, 0.56].forEach((x) => {
    const sideburn = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.34, 0.24),
      hairMat
    );
    sideburn.position.set(x, 0.22, 0.08);
    headGroup.add(sideburn);
  });

  // Clean sculpted white-clay nose matching Image 2
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.085, 18, 16),
    clayMat
  );
  nose.scale.set(0.92, 1.25, 1.15);
  nose.position.set(0, -0.1, 0.62);
  headGroup.add(nose);

  // Confident asymmetrical smirk curve matching Image 2
  const smirkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.22, -0.33, 0.54),
    new THREE.Vector3(-0.04, -0.35, 0.59),
    new THREE.Vector3(0.14, -0.32, 0.57),
    new THREE.Vector3(0.23, -0.27, 0.52),
  ]);
  const smirk = new THREE.Mesh(
    new THREE.TubeGeometry(smirkCurve, 16, 0.015, 8, false),
    clayShadowMat
  );
  headGroup.add(smirk);

  // Calm half-lidded purple-iris eyes & thick expressive black eyebrows (NO glasses)
  const makeEye = (side: -1 | 1) => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.23, 0.06, 0.54);

    const eyeball = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 20, 18),
      scleraMat
    );
    eyeball.scale.set(1.08, 0.92, 0.65);

    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.078, 18, 16),
      irisMat
    );
    iris.scale.set(1.0, 1.0, 0.5);
    iris.position.set(0, -0.01, 0.062);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 14, 14),
      pupilMat
    );
    pupil.scale.set(1.0, 1.0, 0.5);
    pupil.position.set(0, -0.01, 0.084);

    // Upper half-lidded eyelid covering top ~40% of eye cleanly
    const eyelid = new THREE.Mesh(
      new THREE.SphereGeometry(0.138, 18, 16, 0, Math.PI * 2, 0, Math.PI * 0.52),
      clayMat
    );
    eyelid.scale.set(1.12, 0.96, 0.72);
    eyelid.rotation.x = -0.18;
    eyelid.name = side < 0 ? "eyelid_L" : "eyelid_R";

    // Thick expressive black eyebrow
    const eyebrow = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.058, 0.08),
      browMat
    );
    eyebrow.position.set(0, 0.19, 0.06);
    eyebrow.rotation.z = side * -0.07;
    eyebrow.name = side < 0 ? "eyebrow_L" : "eyebrow_R";

    eyeGroup.add(eyeball, iris, pupil, eyelid, eyebrow);
    headGroup.add(eyeGroup);
    return { eyebrow, eyelid };
  };

  const leftEye = makeEye(-1);
  const rightEye = makeEye(1);

  const workstation = buildWorkstationDesk();
  character.add(workstation.deskGroup);
  root.add(workstation.screenlight);

  return {
    scene: root,
    spine005,
    spine006,
    screenlight: workstation.screenlight,
    monitorScreen: workstation.monitorScreen,
    deskGroup: workstation.deskGroup,
    eyebrowL: leftEye.eyebrow,
    eyebrowR: rightEye.eyebrow,
    eyelidL: leftEye.eyelid,
    eyelidR: rightEye.eyelid,
    forearmL,
    forearmR,
    keys: workstation.keys,
  };
}
