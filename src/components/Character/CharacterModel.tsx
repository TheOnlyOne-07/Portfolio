import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../../utils/loadingProgress";
import { portfolioConfig } from "../../config/portfolio";
import {
  buildWorkstationDesk,
  ProceduralCharacterRig,
} from "./proceduralCharacter";
import { buildMinecraftCharacter } from "./minecraftCharacter";

gsap.registerPlugin(ScrollTrigger);

interface BoneWorldTracker {
  bone: THREE.Object3D;
  restQuat: THREE.Quaternion;
  euler: THREE.Euler;
}

const _worldQ = new THREE.Quaternion();
const _parentWorldQ = new THREE.Quaternion();
const _parentInvQ = new THREE.Quaternion();
const _deltaQ = new THREE.Quaternion();
const _worldAxis = new THREE.Vector3();

function rotateBoneWorldAxis(
  bone: THREE.Object3D | undefined,
  axis: [number, number, number],
  angle: number
) {
  if (!bone) return;
  bone.updateMatrixWorld(true);
  if (bone.parent) {
    bone.parent.getWorldQuaternion(_parentWorldQ);
  } else {
    _parentWorldQ.identity();
  }
  bone.getWorldQuaternion(_worldQ);
  _worldAxis.set(axis[0], axis[1], axis[2]).normalize();
  _deltaQ.setFromAxisAngle(_worldAxis, angle);
  _worldQ.premultiply(_deltaQ);
  _parentInvQ.copy(_parentWorldQ).invert();
  bone.quaternion.copy(_parentInvQ.multiply(_worldQ));
}

function createBoneTracker(bone: THREE.Object3D): BoneWorldTracker {
  return {
    bone,
    restQuat: bone.quaternion.clone(),
    euler: new THREE.Euler(0, 0, 0, "YXZ"),
  };
}

function applyBoneTrackerDelta(
  tracker: BoneWorldTracker,
  deltaX: number,
  deltaY: number,
  deltaZ = 0
) {
  const { bone, restQuat, euler } = tracker;
  if (bone.parent) {
    bone.parent.updateMatrixWorld(true);
    bone.parent.getWorldQuaternion(_parentWorldQ);
  } else {
    _parentWorldQ.identity();
  }
  euler.set(deltaX, deltaY, deltaZ, "YXZ");
  _deltaQ.setFromEuler(euler);
  // Apply world-space delta around rest orientation
  _parentInvQ.copy(_parentWorldQ).invert();
  bone.quaternion
    .copy(_parentInvQ)
    .multiply(_deltaQ)
    .multiply(_parentWorldQ)
    .multiply(restQuat);
}

function poseHumanoidSeated(root: THREE.Object3D) {
  const get = (name: string) => root.getObjectByName(name);

  // Bent thighs & shins for seated desk posture
  rotateBoneWorldAxis(get("LeftUpLeg"), [1, 0, 0], -Math.PI / 2 + 0.08);
  rotateBoneWorldAxis(get("LeftUpLeg"), [0, 1, 0], 0.04);
  rotateBoneWorldAxis(get("RightUpLeg"), [1, 0, 0], -Math.PI / 2 + 0.08);
  rotateBoneWorldAxis(get("RightUpLeg"), [0, 1, 0], -0.04);

  rotateBoneWorldAxis(get("LeftLeg"), [1, 0, 0], Math.PI / 2 - 0.12);
  rotateBoneWorldAxis(get("RightLeg"), [1, 0, 0], Math.PI / 2 - 0.12);

  // Relaxed upper arms angled down and slightly forward
  rotateBoneWorldAxis(get("LeftArm"), [0, 0, 1], -1.32);
  rotateBoneWorldAxis(get("LeftArm"), [1, 0, 0], -0.36);
  rotateBoneWorldAxis(get("RightArm"), [0, 0, 1], 1.32);
  rotateBoneWorldAxis(get("RightArm"), [1, 0, 0], -0.36);

  // Forearms bent forward and inward cleanly above the keyboard
  rotateBoneWorldAxis(get("LeftForeArm"), [1, 0, 0], -1.38);
  rotateBoneWorldAxis(get("LeftForeArm"), [0, 1, 0], -0.48);
  rotateBoneWorldAxis(get("RightForeArm"), [1, 0, 0], -1.38);
  rotateBoneWorldAxis(get("RightForeArm"), [0, 1, 0], 0.48);

  // Subtle neutral palm angle over keys
  rotateBoneWorldAxis(get("LeftHand"), [1, 0, 0], 0.15);
  rotateBoneWorldAxis(get("RightHand"), [1, 0, 0], 0.15);
}

function setupScrollAnimations(
  character: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  screenlightMesh: THREE.Mesh | null,
  monitorScreenMesh: THREE.Mesh | null,
  deskGroup: THREE.Group | null,
  spineTracker: BoneWorldTracker | null,
  isCustomEulerSpine: boolean
) {
  let intensity = 0;
  const randInterval = window.setInterval(() => {
    intensity = Math.random();
  }, 200);

  if (screenlightMesh) {
    const mat = screenlightMesh.material as THREE.MeshStandardMaterial;
    mat.transparent = true;
    mat.opacity = 0;
    mat.emissive.set("#C8BFFF");
    gsap
      .timeline({ repeat: -1, repeatRefresh: true })
      .to(mat, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
  }

  if (deskGroup) {
    deskGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!Array.isArray(mesh.material)) {
          mesh.material.transparent = true;
          mesh.material.opacity = 0;
        }
      }
    });
  }

  const spine005 = character.getObjectByName("spine005");
  const spineProxy = { leanX: 0 };

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  if (window.innerWidth > 1024) {
    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
      .to(camera.position, { z: 22 }, 0)
      .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

    tl2
      .to(
        camera.position,
        { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
        0
      )
      .to(".about-section", { y: "30%", duration: 6 }, 0)
      .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
      .fromTo(
        ".character-model",
        { pointerEvents: "inherit" },
        { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
        0
      )
      .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

    if (spineTracker && !isCustomEulerSpine) {
      tl2.to(
        spineProxy,
        {
          leanX: 0.28,
          delay: 2,
          duration: 3,
          onUpdate: () => applyBoneTrackerDelta(spineTracker, spineProxy.leanX, 0),
        },
        0
      );
    } else if (spine005) {
      tl2.to(spine005.rotation, { x: 0.28, delay: 2, duration: 3 }, 0);
    }

    if (deskGroup) {
      deskGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.Material;
          tl2.to(mat, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
        }
      });
    }

    if (monitorScreenMesh) {
      tl2.fromTo(
        monitorScreenMesh.position,
        { y: -10, z: 2 },
        { y: 3.95, z: 2.38, delay: 1.5, duration: 3 },
        0
      );
    }

    if (screenlightMesh) {
      tl2.to(
        screenlightMesh.material as THREE.Material,
        { opacity: 1, duration: 0.8, delay: 4.5 },
        0
      );
    }

    tl2
      .fromTo(
        ".what-box-in",
        { display: "none" },
        { display: "flex", duration: 0.1, delay: 6 },
        0
      )
      .fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
        0.3
      );

    tl3
      .fromTo(
        ".character-model",
        { y: "0%" },
        { y: "-100%", duration: 4, ease: "none", delay: 1 },
        0
      )
      .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
      .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
  } else {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      })
      .to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
  }

  return () => {
    window.clearInterval(randInterval);
    tl1.kill();
    tl2.kill();
    tl3.kill();
  };
}

function setupCareerTimeline() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(
    ".career-timeline",
    { maxHeight: "0%" },
    { maxHeight: "100%", duration: 1, ease: "none" },
    0
  )
    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
      0
    );

  if (window.innerWidth > 1024) {
    tl.fromTo(".career-section", { y: 0 }, { y: "20%", duration: 0.5, delay: 0.2 }, 0);
  }

  return () => tl.kill();
}

const CharacterModel: React.FC = () => {
  const canvasDiv = useRef<HTMLDivElement>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;

    let disposed = false;
    const rect = container.getBoundingClientRect();
    const aspect = (rect.width || window.innerWidth) / (rect.height || window.innerHeight);
    const scene = sceneRef.current;

    const progress = setProgress((val) => setLoading(val));

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
    } catch {
      progress.clear();
      return () => {
        disposed = true;
      };
    }

    renderer.setSize(rect.width || window.innerWidth, rect.height || window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
    directionalLight.position.set(-0.47, -0.32, -1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
    pointLight.position.set(3, 12, 4);
    scene.add(pointLight);

    const pmrem = new THREE.PMREMGenerator(renderer);
    if (portfolioConfig.media.hdrEnvironmentUrl) {
      const hdrUrl = portfolioConfig.media.hdrEnvironmentUrl;
      void import("three/examples/jsm/loaders/RGBELoader.js").then(
        ({ RGBELoader }) => {
          if (disposed) return;
          new RGBELoader().load(hdrUrl, (hdr) => {
            if (disposed) return;
            hdr.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = hdr;
            scene.environmentIntensity = 0;
          });
        }
      );
    } else {
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0;
    }

    const turnOnLights = () => {
      gsap.to(scene, {
        environmentIntensity: 0.72,
        duration: 2,
        ease: "power2.inOut",
      });
      gsap.to(directionalLight, {
        intensity: 1.2,
        duration: 2,
        ease: "power2.inOut",
      });
      gsap.to(".character-rim", {
        y: "55%",
        opacity: 1,
        delay: 0.2,
        duration: 2,
      });
    };

    let headBone: THREE.Object3D | null = null;
    let headTracker: BoneWorldTracker | null = null;
    let useCustomEulerHead = true;
    let headCurX = 0;
    let headCurY = 0;
    let forearmLTracker: BoneWorldTracker | null = null;
    let forearmRTracker: BoneWorldTracker | null = null;
    let workstationKeys: THREE.Mesh[] = [];
    let screenLightMesh: THREE.Mesh | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let cleanupScroll: (() => void) | null = null;
    let cleanupCareer: (() => void) | null = null;
    let browHoverCleanup: (() => void) | null = null;

    // Procedural rig state
    let rig: ProceduralCharacterRig | null = null;
    let isHovered = false;
    let blinkTimer = 0;
    let nextBlink = 2.8;

    const initSceneContent = async () => {
      if (portfolioConfig.media.characterModelUrl) {
        const [
          { GLTFLoader },
          { DRACOLoader },
          { MeshoptDecoder },
        ] = await Promise.all([
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/loaders/DRACOLoader.js"),
          import("three/examples/jsm/libs/meshopt_decoder.module.js"),
        ]);
        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
        loader.setDRACOLoader(draco);
        await MeshoptDecoder.ready;
        loader.setMeshoptDecoder(MeshoptDecoder);

        try {
          const gltf = await loader.loadAsync(
            portfolioConfig.media.characterModelUrl
          );
          if (disposed) return;

          const gltfRoot = gltf.scene;
          const bespokeHead = gltfRoot.getObjectByName("spine006");

          if (bespokeHead) {
            // Custom Blender rig with native spine006/spine005/Plane004 naming
            scene.add(gltfRoot);
            headBone = bespokeHead;
            useCustomEulerHead = true;
            screenLightMesh =
              (gltfRoot.getObjectByName("screenlight") as THREE.Mesh) || null;
            mixer = new THREE.AnimationMixer(gltfRoot);
            gltf.animations.forEach((clip) => {
              mixer?.clipAction(clip).play();
            });
            cleanupScroll = setupScrollAnimations(
              gltfRoot,
              camera,
              screenLightMesh,
              null,
              (gltfRoot.getObjectByName("Plane004") as THREE.Group) || null,
              null,
              true
            );
          } else {
            // Standard rigged humanoid GLB (e.g. avatar.glb): pose seated & pair with workstation desk
            const sceneRoot = new THREE.Group();
            sceneRoot.name = "CharacterSceneRoot";

            const avatarWrapper = new THREE.Group();
            avatarWrapper.add(gltfRoot);
            poseHumanoidSeated(gltfRoot);

            const targetScale = 5.0;
            avatarWrapper.scale.setScalar(targetScale);
            avatarWrapper.updateMatrixWorld(true);

            const hips = gltfRoot.getObjectByName("Hips");
            if (hips) {
              const hipsWorld = hips.getWorldPosition(new THREE.Vector3());
              avatarWrapper.position.set(
                -hipsWorld.x,
                9.42 - hipsWorld.y,
                -0.18 - hipsWorld.z
              );
            } else {
              const box = new THREE.Box3().setFromObject(avatarWrapper);
              const size = box.getSize(new THREE.Vector3());
              const norm = size.y > 0 ? 7.8 / size.y : 1;
              avatarWrapper.scale.multiplyScalar(norm);
              const center = box.getCenter(new THREE.Vector3()).multiplyScalar(norm);
              avatarWrapper.position.set(-center.x, 10.6 - center.y, -center.z);
            }
            avatarWrapper.updateMatrixWorld(true);

            // Prevent frustum culling & soften studio specular sheen
            gltfRoot.traverse((obj) => {
              if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                mesh.frustumCulled = false;
                const mats = Array.isArray(mesh.material)
                  ? mesh.material
                  : [mesh.material];
                mats.forEach((m) => {
                  if (m instanceof THREE.MeshStandardMaterial) {
                    m.roughness = Math.max(m.roughness, 0.72);
                    m.envMapIntensity = 0.55;
                  }
                });
              }
            });

            sceneRoot.add(avatarWrapper);

            const workstation = buildWorkstationDesk(-0.68);
            workstation.deskGroup.position.set(0, 7.6, 0.08);
            sceneRoot.add(workstation.deskGroup);
            sceneRoot.add(workstation.screenlight);
            scene.add(sceneRoot);

            screenLightMesh = workstation.screenlight;
            workstationKeys = workstation.keys;

            const humanoidHead =
              gltfRoot.getObjectByName("Head") ||
              gltfRoot.getObjectByName("Neck") ||
              gltfRoot.getObjectByName("head") ||
              null;
            const humanoidSpine =
              gltfRoot.getObjectByName("Spine1") ||
              gltfRoot.getObjectByName("Spine") ||
              gltfRoot.getObjectByName("spine005") ||
              null;
            const forearmL =
              gltfRoot.getObjectByName("LeftForeArm") || null;
            const forearmR =
              gltfRoot.getObjectByName("RightForeArm") || null;

            headBone = humanoidHead;
            useCustomEulerHead = false;
            headTracker = humanoidHead ? createBoneTracker(humanoidHead) : null;
            const spineTracker = humanoidSpine
              ? createBoneTracker(humanoidSpine)
              : null;
            forearmLTracker = forearmL ? createBoneTracker(forearmL) : null;
            forearmRTracker = forearmR ? createBoneTracker(forearmR) : null;

            cleanupScroll = setupScrollAnimations(
              sceneRoot,
              camera,
              workstation.screenlight,
              workstation.monitorScreen,
              workstation.deskGroup,
              spineTracker,
              false
            );
          }

          cleanupCareer = setupCareerTimeline();
          draco.dispose();
        } catch (err) {
          console.warn("Failed to load characterModelUrl GLB, using fallback:", err);
          draco.dispose();
          // Fallback to procedural rig if GLB fails
        }
      }

      if (!headBone) {
        rig = buildMinecraftCharacter();
        scene.add(rig.scene);
        headBone = rig.spine006;
        useCustomEulerHead = true;
        screenLightMesh = rig.screenlight;
        workstationKeys = rig.keys;

        cleanupScroll = setupScrollAnimations(
          rig.scene,
          camera,
          rig.screenlight,
          rig.monitorScreen,
          rig.deskGroup,
          null,
          true
        );
        cleanupCareer = setupCareerTimeline();

        const hoverEl = hoverDivRef.current;
        if (hoverEl) {
          const onEnter = () => {
            isHovered = true;
          };
          const onLeave = () => {
            isHovered = false;
          };
          hoverEl.addEventListener("mouseenter", onEnter);
          hoverEl.addEventListener("mouseleave", onLeave);
          browHoverCleanup = () => {
            hoverEl.removeEventListener("mouseenter", onEnter);
            hoverEl.removeEventListener("mouseleave", onLeave);
          };
        }
      }

      await progress.loaded();
      if (disposed) return;
      window.setTimeout(() => {
        if (!disposed) turnOnLights();
      }, 1200);
    };

    initSceneContent();

    // Pointer tracking
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    let touchTimer: number | undefined;

    const onMouseMove = (e: MouseEvent) => {
      mouse = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse = {
          x: (e.touches[0].clientX / window.innerWidth) * 2 - 1,
          y: -(e.touches[0].clientY / window.innerHeight) * 2 + 1,
        };
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const target = e.target;
      touchTimer = window.setTimeout(() => {
        target?.addEventListener("touchmove", onTouchMove as EventListener);
      }, 200);
    };

    const onTouchEnd = () => {
      window.setTimeout(() => {
        mouse = { x: 0, y: 0 };
        interpolation = { x: 0.03, y: 0.03 };
        window.setTimeout(() => {
          interpolation = { x: 0.1, y: 0.2 };
        }, 1000);
      }, 2000);
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    landingDiv?.addEventListener("touchstart", onTouchStart);
    landingDiv?.addEventListener("touchend", onTouchEnd);

    const onResize = () => {
      if (!canvasDiv.current) return;
      const box = canvasDiv.current.getBoundingClientRect();
      renderer.setSize(box.width, box.height);
      camera.aspect = box.width / (box.height || 1);
      camera.updateProjectionMatrix();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      if (headBone) {
        if (useCustomEulerHead) {
          if (window.scrollY < 200) {
            const maxRot = Math.PI / 6;
            headBone.rotation.y = THREE.MathUtils.lerp(
              headBone.rotation.y,
              mouse.x * maxRot,
              interpolation.y
            );
            const minY = -0.3;
            const maxY = 0.4;
            const targetX =
              mouse.y > minY
                ? mouse.y < maxY
                  ? -mouse.y * 0.7 - 0.06
                  : -maxRot * 0.7 - 0.06
                : -minY * 0.7 - 0.06;
            headBone.rotation.x = THREE.MathUtils.lerp(
              headBone.rotation.x,
              targetX,
              interpolation.x
            );
          } else if (window.innerWidth > 1024) {
            headBone.rotation.x = THREE.MathUtils.lerp(
              headBone.rotation.x,
              0.08,
              0.03
            );
            headBone.rotation.y = THREE.MathUtils.lerp(
              headBone.rotation.y,
              -0.2,
              0.03
            );
          }
        } else if (headTracker) {
          if (window.scrollY < 200) {
            const maxYaw = Math.PI / 6;
            const targetY = mouse.x * maxYaw;
            const clampedY = THREE.MathUtils.clamp(mouse.y, -0.35, 0.4);
            const targetX = -clampedY * 0.65 - 0.04;
            headCurY = THREE.MathUtils.lerp(headCurY, targetY, interpolation.y);
            headCurX = THREE.MathUtils.lerp(headCurX, targetX, interpolation.x);
          } else if (window.innerWidth > 1024) {
            headCurX = THREE.MathUtils.lerp(headCurX, 0.14, 0.03);
            headCurY = THREE.MathUtils.lerp(headCurY, -0.18, 0.03);
          }
          applyBoneTrackerDelta(headTracker, headCurX, headCurY);
        }
      }

      if (workstationKeys.length > 0) {
        workstationKeys.forEach((k, idx) => {
          const mat = k.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity =
            0.4 + Math.max(0, Math.sin(elapsed * 7 + idx * 1.4)) * 1.1;
        });
      }

      if (forearmLTracker && forearmRTracker) {
        applyBoneTrackerDelta(
          forearmLTracker,
          Math.sin(elapsed * 8.5) * 0.045,
          0
        );
        applyBoneTrackerDelta(
          forearmRTracker,
          Math.cos(elapsed * 9.2) * 0.045,
          0
        );
      }

      // Rig subtle animations (typing, blinking, brow hover)
      if (rig) {
        blinkTimer += delta;
        let blinkRatio = 0;
        if (blinkTimer > nextBlink) {
          const blinkPhase = (blinkTimer - nextBlink) / 0.16;
          if (blinkPhase < 1) {
            blinkRatio = Math.sin(blinkPhase * Math.PI);
          } else {
            blinkTimer = 0;
            nextBlink = 2.4 + Math.random() * 2.6;
          }
        }

        if (rig.updateMotion) {
          rig.updateMotion(elapsed, blinkRatio, isHovered);
        } else {
          rig.forearmL.rotation.x = Math.sin(elapsed * 8.5) * 0.06;
          rig.forearmR.rotation.x = Math.cos(elapsed * 9.2) * 0.06;
          const lidRotX = -0.18 + blinkRatio * 1.15;
          rig.eyelidL.rotation.x = lidRotX;
          rig.eyelidR.rotation.x = lidRotX;
          const browTargetY = isHovered ? 0.25 : 0.19;
          rig.eyebrowL.position.y = THREE.MathUtils.lerp(
            rig.eyebrowL.position.y,
            browTargetY,
            0.14
          );
          rig.eyebrowR.position.y = THREE.MathUtils.lerp(
            rig.eyebrowR.position.y,
            browTargetY,
            0.14
          );
        }
      }

      if (screenLightMesh) {
        const sMat = screenLightMesh.material as THREE.MeshStandardMaterial;
        if (sMat.opacity > 0.9) {
          pointLight.intensity = sMat.emissiveIntensity * 20;
        } else {
          pointLight.intensity = 0;
        }
      }

      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (touchTimer !== undefined) window.clearTimeout(touchTimer);
      cleanupScroll?.();
      cleanupCareer?.();
      browHoverCleanup?.();
      progress.clear();
      document.removeEventListener("mousemove", onMouseMove);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      scene.clear();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim" />
        <div className="character-hover" ref={hoverDivRef} />
      </div>
    </div>
  );
};

export default CharacterModel;
