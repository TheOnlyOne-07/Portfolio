import * as THREE from "three";
import {
  buildWorkstationDesk,
  ProceduralCharacterRig,
} from "./proceduralCharacter";

type Palette = Record<string, string>;

const SKIN_PALETTE: Palette = {
  s: "#d99d73", // base skin
  d: "#c78961", // warm shadow
  l: "#e5af87", // highlight
  m: "#b37350", // nose / mouth shade
  h: "#16121e", // hair dark
  k: "#211b2d", // hair mid
  u: "#2c243c", // hair sheen
  w: "#f5f2fa", // sclera
  p: "#6b3fd6", // violet iris
  i: "#2c1763", // dark iris/pupil
  c: "#1d1826", // hoodie charcoal
  g: "#262033", // hoodie mid
  b: "#14101c", // hoodie deep shadow
  v: "#b994ff", // violet accent
  n: "#8a5cf6", // purple mid accent
  j: "#25293d", // denim mid
  o: "#1b1f30", // denim dark
  q: "#30364f", // denim highlight
  e: "#eae5ec", // sneaker white
};

function makePixelTexture(rows: string[], palette: Palette): THREE.CanvasTexture {
  const h = rows.length;
  const w = rows[0]?.length || 1;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    for (let y = 0; y < h; y++) {
      const row = rows[y];
      for (let x = 0; x < w; x++) {
        const ch = row[x];
        ctx.fillStyle = palette[ch] || "#ff00ff";
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

function makePixelMat(
  rows: string[],
  palette: Palette = SKIN_PALETTE
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: makePixelTexture(rows, palette),
    roughness: 0.82,
    metalness: 0.04,
  });
}

function makeSolidRows(w: number, h: number, ch: string): string[] {
  return Array.from({ length: h }, () => ch.repeat(w));
}

function makeVoxelBox(
  w: number,
  h: number,
  d: number,
  mats: THREE.Material | THREE.Material[]
): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
}

/**
 * Builds an articulated pixel-textured Minecraft-style developer character with specs,
 * seated at the portfolio workstation desk and wired to ProceduralCharacterRig controls.
 */
export function buildMinecraftCharacter(): ProceduralCharacterRig {
  const PX = 0.205;
  const root = new THREE.Group();
  root.name = "MinecraftCharacterRoot";

  const character = new THREE.Group();
  character.position.set(0, 7.75, 0);
  root.add(character);

  // Legs: upper thighs resting forward on seat (4x6x4 px), shins down to floor
  const denimFrontRows = [
    "oooooooo",
    "ojjjjjjo",
    "ojqjjjqo",
    "ojjjjjjo",
    "ojjjjjjo",
    "oojoojoo",
  ];
  const denimSideRows = ["oooo", "ojjo", "ojqo", "ojjo", "ojjo", "oooo"];
  const shinFrontRows = [
    "oojoojoo",
    "ojjjjjjo",
    "oooooooo",
    "vvvvvvvv",
    "eeeeeeee",
    "eeeeeeee",
  ];
  const shinSideRows = ["oooo", "ojjo", "oooo", "vvvv", "eeee", "eeee"];

  const thighMatSide = makePixelMat(denimSideRows);
  const thighMatTop = makePixelMat(makeSolidRows(4, 4, "j"));
  const thighMatFront = makePixelMat(denimFrontRows);
  const thighMats = [
    thighMatSide,
    thighMatSide,
    thighMatTop,
    thighMatTop,
    thighMatFront,
    thighMatSide,
  ];

  const shinMatSide = makePixelMat(shinSideRows);
  const shinMatTop = makePixelMat(makeSolidRows(4, 4, "o"));
  const shinMatBottom = makePixelMat(makeSolidRows(4, 4, "b"));
  const shinMatFront = makePixelMat(shinFrontRows);
  const shinMats = [
    shinMatSide,
    shinMatSide,
    shinMatTop,
    shinMatBottom,
    shinMatFront,
    shinMatSide,
  ];

  const legW = 4 * PX;
  const legLen = 6 * PX;
  const thighY = 1.84;
  [-2 * PX - 0.03, 2 * PX + 0.03].forEach((xOff, idx) => {
    const legHip = new THREE.Group();
    legHip.position.set(xOff, thighY, -0.1);

    const thigh = makeVoxelBox(legW, legW, legLen, thighMats);
    thigh.position.set(0, 0, legLen * 0.5);
    legHip.add(thigh);

    const shin = makeVoxelBox(legW, legLen, legW, shinMats);
    shin.name = idx === 0 ? "legL" : "legR";
    shin.position.set(0, -legLen * 0.5 + 0.06, legLen - legW * 0.35);
    legHip.add(shin);

    const shoeToe = makeVoxelBox(
      legW * 1.02,
      1.6 * PX,
      1.2 * PX,
      makePixelMat(makeSolidRows(4, 2, "e"))
    );
    shoeToe.position.set(0, -legLen + 0.85 * PX, legLen + legW * 0.3);
    legHip.add(shoeToe);

    character.add(legHip);
  });

  // spine005 (Torso + Hood + Arms pivot)
  const spine005 = new THREE.Group();
  spine005.name = "spine005";
  spine005.position.set(0, 1.98, -0.18);
  character.add(spine005);

  const torsoW = 8 * PX;
  const torsoH = 12 * PX;
  const torsoD = 4 * PX;

  const torsoFrontRows = [
    "cccssscc",
    "ccgddgcc",
    "ccvccvcc",
    "ccvccvcc",
    "ccvnnvcc",
    "ccgccgcc",
    "cccggccc",
    "cccccccc",
    "bbccccbb",
    "bccccccb",
    "bbgbbgbb",
    "bbbbbbbb",
  ];
  const torsoBackRows = [
    "bbbbbbbb",
    "bccccccb",
    "ccgccgcc",
    "ccgvvgcc",
    "ccgccgcc",
    "cccccccc",
    "bccccccb",
    "bccccccb",
    "bbccccbb",
    "bbbbbbbb",
    "bbbbbbbb",
    "bbbbbbbb",
  ];
  const torsoSideRows = [
    "cccc",
    "cggc",
    "cggc",
    "cccc",
    "cccc",
    "cccc",
    "bccb",
    "bccb",
    "bbbb",
    "bbbb",
    "bbbb",
    "bbbb",
  ];
  const hoodieTopRows = ["cccssscc", "ccgddgcc", "cccccccc", "bbbbbbbb"];

  const torsoMats = [
    makePixelMat(torsoSideRows),
    makePixelMat(torsoSideRows),
    makePixelMat(hoodieTopRows),
    makePixelMat(makeSolidRows(4, 4, "b")),
    makePixelMat(torsoFrontRows),
    makePixelMat(torsoBackRows),
  ];

  const torsoMesh = makeVoxelBox(torsoW, torsoH, torsoD, torsoMats);
  torsoMesh.position.set(0, torsoH * 0.5, 0);
  spine005.add(torsoMesh);

  const hoodBack = makeVoxelBox(
    torsoW * 0.94,
    2.2 * PX,
    1.8 * PX,
    makePixelMat(makeSolidRows(4, 2, "c"))
  );
  hoodBack.position.set(0, torsoH - 0.8 * PX, -torsoD * 0.52);
  spine005.add(hoodBack);

  const pocket = makeVoxelBox(
    5.5 * PX,
    2.8 * PX,
    0.35 * PX,
    makePixelMat(["bggggggb", "bccccccb", "bbbbbbbb"])
  );
  pocket.position.set(0, 2.8 * PX, torsoD * 0.5 + 0.12 * PX);
  spine005.add(pocket);

  const neck = makeVoxelBox(
    3.2 * PX,
    1.4 * PX,
    3.2 * PX,
    makePixelMat(makeSolidRows(4, 2, "d"))
  );
  neck.position.set(0, torsoH + 0.45 * PX, 0);
  spine005.add(neck);

  // Articulated Blocky Arms
  const armW = 3.8 * PX;
  const upperArmLen = 6 * PX;
  const forearmLen = 6 * PX;

  const upperArmSide = makePixelMat([
    "cccc",
    "cggc",
    "cggc",
    "cccc",
    "cccc",
    "bbbb",
  ]);
  const upperArmMats = [
    upperArmSide,
    upperArmSide,
    makePixelMat(makeSolidRows(4, 4, "g")),
    makePixelMat(makeSolidRows(4, 4, "b")),
    upperArmSide,
    upperArmSide,
  ];

  const forearmSideLeft = ["cccvss", "cccvsd", "cccvsd", "bbcvdd"];
  const forearmSideRight = forearmSideLeft.map((r) => [...r].reverse().join(""));
  const forearmTopRows = ["cccc", "cggc", "cggc", "vvvv", "ssss", "sdds"];
  const forearmBottomRows = ["sdds", "ssss", "vvvv", "bbbb", "bbbb", "bbbb"];
  const forearmMats = [
    makePixelMat(forearmSideRight),
    makePixelMat(forearmSideLeft),
    makePixelMat(forearmTopRows),
    makePixelMat(forearmBottomRows),
    makePixelMat(["ssss", "slls", "sdds", "dddd"]),
    makePixelMat(makeSolidRows(4, 4, "c")),
  ];

  const makeArm = (side: -1 | 1) => {
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(
      side * (torsoW * 0.5 + armW * 0.52),
      torsoH - 1.2 * PX,
      0.02
    );
    spine005.add(shoulderPivot);

    const upperArm = makeVoxelBox(armW, upperArmLen, armW, upperArmMats);
    upperArm.position.set(0, -upperArmLen * 0.44, 0.16);
    upperArm.rotation.x = -0.34;
    upperArm.rotation.z = side * 0.08;
    shoulderPivot.add(upperArm);

    const elbowOrient = new THREE.Group();
    elbowOrient.position.set(side * 0.08, -upperArmLen * 0.84, 0.36);
    elbowOrient.rotation.y = -side * 0.36;
    elbowOrient.rotation.x = 0.06;
    shoulderPivot.add(elbowOrient);

    const forearm = new THREE.Group();
    forearm.name = side < 0 ? "forearmL" : "forearmR";
    elbowOrient.add(forearm);

    const forearmMesh = makeVoxelBox(
      armW * 0.96,
      armW * 0.96,
      forearmLen,
      forearmMats
    );
    forearmMesh.position.set(0, 0, forearmLen * 0.45);
    forearm.add(forearmMesh);

    return forearm;
  };

  const forearmL = makeArm(-1);
  const forearmR = makeArm(1);

  // spine006 (Head pivot for cursor tracking)
  const spine006 = new THREE.Group();
  spine006.name = "spine006";
  spine006.position.set(0, torsoH + 0.9 * PX, 0);
  spine005.add(spine006);

  const headSize = 8 * PX;
  const headCenterY = headSize * 0.5;

  const faceRows = [
    "hhhkuhhh",
    "hkhkhhkh",
    "hssssssh",
    "ssllssls",
    "swwsswws",
    "sssmmsss",
    "ssmmmmss",
    "ddssssdd",
  ];
  const headSideLRows = [
    "hhhkuhhh",
    "hkhkhhkh",
    "hhkhkhhh",
    "hhssssss",
    "hsssssss",
    "hssssdds",
    "ssssssss",
    "dddddddd",
  ];
  const headSideRRows = headSideLRows.map((r) => [...r].reverse().join(""));
  const headBackRows = [
    "hkhkhhkh",
    "hhhkuhhh",
    "khhhhhkh",
    "hhhkhkhh",
    "hkhkhhkh",
    "hhhhhhhh",
    "hhddddhh",
    "dddddddd",
  ];
  const headTopRows = [
    "hhhkuhhh",
    "hkhkhhkh",
    "kuhhhkhh",
    "hhhhhhhh",
    "hkhkhhkh",
    "hhhkuhhh",
    "khhhhkhh",
    "hkhkhhkh",
  ];

  const headMats = [
    makePixelMat(headSideRRows),
    makePixelMat(headSideLRows),
    makePixelMat(headTopRows),
    makePixelMat(makeSolidRows(8, 8, "d")),
    makePixelMat(faceRows),
    makePixelMat(headBackRows),
  ];

  const headBox = makeVoxelBox(headSize, headSize, headSize, headMats);
  headBox.position.set(0, headCenterY, 0);
  spine006.add(headBox);

  // 3D Outer Minecraft Hair Layer
  const hairOuterMat = makePixelMat([
    "hhhkuhhh",
    "khhhhhkh",
    "hkhkhhkh",
    "hhhkuhhh",
  ]);
  const hairCap = makeVoxelBox(
    headSize + 0.12,
    2.2 * PX,
    headSize + 0.14,
    hairOuterMat
  );
  hairCap.position.set(0, headSize - 0.9 * PX, -0.01);
  spine006.add(hairCap);

  const bangLeft = makeVoxelBox(3 * PX, 1.3 * PX, 0.1, hairOuterMat);
  bangLeft.position.set(-2.2 * PX, headSize - 2.1 * PX, headSize * 0.5 + 0.03);
  const bangRight = makeVoxelBox(2.4 * PX, 1.1 * PX, 0.1, hairOuterMat);
  bangRight.position.set(2.5 * PX, headSize - 2.0 * PX, headSize * 0.5 + 0.03);
  const hairBackSlab = makeVoxelBox(
    headSize + 0.1,
    4.2 * PX,
    0.1,
    hairOuterMat
  );
  hairBackSlab.position.set(0, headSize - 2.8 * PX, -headSize * 0.5 - 0.03);
  spine006.add(bangLeft, bangRight, hairBackSlab);

  // Crisp blocky eyes + blinking eyelids + hover brows
  const browMat = new THREE.MeshStandardMaterial({
    color: 0x130e1c,
    roughness: 0.55,
  });
  const lidMat = new THREE.MeshStandardMaterial({
    color: 0xd3946a,
    roughness: 0.82,
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf7f4fc,
    roughness: 0.35,
  });
  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x6b3fd6,
    emissive: 0x3b1e8a,
    emissiveIntensity: 0.25,
    roughness: 0.25,
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x160a2e });

  const eyeBaseY = headCenterY - 0.5 * PX;
  const eyeZ = headSize * 0.5 + 0.015;
  const browRestY = eyeBaseY + 0.85 * PX;

  const makeBlockyEye = (side: -1 | 1) => {
    const xCenter = side * 2.0 * PX;

    const sclera = makeVoxelBox(2.0 * PX, 1.05 * PX, 0.04, whiteMat);
    sclera.position.set(xCenter, eyeBaseY, eyeZ);

    const iris = makeVoxelBox(1.0 * PX, 1.05 * PX, 0.05, irisMat);
    iris.position.set(xCenter - side * 0.45 * PX, eyeBaseY, eyeZ + 0.012);

    const pupil = makeVoxelBox(0.55 * PX, 0.65 * PX, 0.055, pupilMat);
    pupil.position.set(
      xCenter - side * 0.45 * PX,
      eyeBaseY - 0.05 * PX,
      eyeZ + 0.018
    );

    const eyelidPivot = new THREE.Group();
    eyelidPivot.position.set(xCenter, eyeBaseY + 0.55 * PX, eyeZ + 0.025);
    const eyelidSlab = makeVoxelBox(2.06 * PX, 1.1 * PX, 0.06, lidMat);
    eyelidSlab.position.set(0, -0.55 * PX, 0);
    eyelidPivot.add(eyelidSlab);
    eyelidPivot.scale.y = 0.01;
    eyelidPivot.visible = false;

    const eyebrow = makeVoxelBox(2.1 * PX, 0.58 * PX, 0.07, browMat);
    eyebrow.position.set(xCenter, browRestY, eyeZ + 0.022);
    eyebrow.rotation.z = side * -0.05;

    spine006.add(sclera, iris, pupil, eyelidPivot, eyebrow);
    return { eyebrow, eyelid: eyelidPivot };
  };

  const leftEye = makeBlockyEye(-1);
  const rightEye = makeBlockyEye(1);

  // Voxel glasses / specs attached to spine006
  const specsGroup = new THREE.Group();
  specsGroup.name = "MinecraftSpecs";
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x181322,
    roughness: 0.35,
    metalness: 0.48,
  });
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0xdccbff,
    emissive: 0x6f42c1,
    emissiveIntensity: 0.14,
    transparent: true,
    opacity: 0.2,
    roughness: 0.12,
    metalness: 0.25,
    depthWrite: false,
  });
  const glintMat = new THREE.MeshBasicMaterial({
    color: 0xf4edff,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });

  const frameZ = eyeZ + 0.085;
  const frameY = eyeBaseY - 0.02 * PX;
  const rimThick = 0.24 * PX;
  const rimDepth = 0.075;
  const lensW = 2.55 * PX;
  const lensH = 1.25 * PX;

  [-1, 1].forEach((side) => {
    const cx = side * 2.0 * PX;

    const topBar = makeVoxelBox(lensW + rimThick * 1.4, rimThick, rimDepth, frameMat);
    topBar.position.set(cx, frameY + lensH * 0.5 + rimThick * 0.4, frameZ);

    const bottomBar = makeVoxelBox(
      lensW + rimThick * 1.4,
      rimThick,
      rimDepth,
      frameMat
    );
    bottomBar.position.set(cx, frameY - lensH * 0.5 - rimThick * 0.4, frameZ);

    const outerPost = makeVoxelBox(
      rimThick,
      lensH + rimThick * 1.6,
      rimDepth,
      frameMat
    );
    outerPost.position.set(cx + side * (lensW * 0.5 + rimThick * 0.35), frameY, frameZ);

    const innerPost = makeVoxelBox(
      rimThick,
      lensH + rimThick * 1.6,
      rimDepth,
      frameMat
    );
    innerPost.position.set(cx - side * (lensW * 0.5 + rimThick * 0.35), frameY, frameZ);

    const lens = makeVoxelBox(lensW, lensH, 0.02, lensMat);
    lens.position.set(cx, frameY, frameZ - 0.01);

    const glint = makeVoxelBox(0.45 * PX, 0.25 * PX, 0.022, glintMat);
    glint.position.set(cx - 0.65 * PX, frameY + 0.3 * PX, frameZ);

    const temple = makeVoxelBox(0.06, rimThick * 1.05, 4.6 * PX, frameMat);
    temple.position.set(
      side * (headSize * 0.5 + 0.045),
      frameY + 0.28 * PX,
      frameZ - 2.25 * PX
    );

    specsGroup.add(topBar, bottomBar, outerPost, innerPost, lens, glint, temple);
  });

  const bridge = makeVoxelBox(1.5 * PX, rimThick, rimDepth, frameMat);
  bridge.position.set(0, frameY + 0.26 * PX, frameZ);
  specsGroup.add(bridge);

  [-1, 1].forEach((side) => {
    const corner = makeVoxelBox(0.75 * PX, rimThick, rimDepth, frameMat);
    corner.position.set(
      side * (headSize * 0.5 - 0.1 * PX),
      frameY + 0.28 * PX,
      frameZ
    );
    specsGroup.add(corner);
  });

  spine006.add(specsGroup);

  const workstation = buildWorkstationDesk(0.42);
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
    updateMotion: (elapsed: number, blinkAmount: number, hovered: boolean) => {
      forearmL.rotation.x = Math.sin(elapsed * 8.5) * 0.07;
      forearmR.rotation.x = Math.cos(elapsed * 9.2) * 0.07;

      const lidScaleY = Math.max(0.01, blinkAmount);
      leftEye.eyelid.visible = blinkAmount > 0.02;
      rightEye.eyelid.visible = blinkAmount > 0.02;
      leftEye.eyelid.scale.y = lidScaleY;
      rightEye.eyelid.scale.y = lidScaleY;

      const browTarget = hovered ? browRestY + 0.09 : browRestY;
      leftEye.eyebrow.position.y = THREE.MathUtils.lerp(
        leftEye.eyebrow.position.y,
        browTarget,
        0.16
      );
      rightEye.eyebrow.position.y = THREE.MathUtils.lerp(
        rightEye.eyebrow.position.y,
        browTarget,
        0.16
      );
    },
  };
}
