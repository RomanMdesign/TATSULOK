import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/*
  TATSULOK
  DISTRICT 3D — PLAYABLE VERSION

  MOBILE / IPAD
  -------------------------
  LEFT JOYSTICK  = MOVE
  RIGHT SIDE     = CAMERA
  RUN            = SPRINT
  INTERACT       = ACTION

  DESKTOP
  -------------------------
  WASD / ARROWS  = MOVE
  SHIFT          = RUN
  MOUSE DRAG     = CAMERA
  E              = INTERACT

  DESIGN
  -------------------------
  Third-person Roblox-style
  Flooded Philippine urban district
  Ruined buildings
  Wet streets
  Debris
  Survivors
  Clues
  Relief supplies
  Evacuation center

  PERFORMANCE
  -------------------------
  No shadows
  Low-poly geometry
  Shared materials
  Pixel ratio capped
  Limited lights
  No physics engine
  No heavy post-processing
*/

export default function District3D({
  mission,
  activeCharacter,
  onExit,
  onComplete,
}) {
  const mountRef = useRef(null);

  const playerRef = useRef({
    position: new THREE.Vector3(0, 0, 10),

    velocity: new THREE.Vector3(0, 0, 0),

    yaw: Math.PI,

    cameraYaw: Math.PI,

    cameraPitch: 0.28,

    running: false,

    moving: false,
  });

  const keysRef = useRef({});

  const joystickRef = useRef({
    active: false,
    pointerId: null,
    x: 0,
    y: 0,
  });

  const lookRef = useRef({
    active: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
  });

  const playerGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const clockRef = useRef(null);
  const frameRef = useRef(null);

  const worldRef = useRef({
    marker: null,
    markerRing: null,
    survivor: null,
    clue: null,
    supplies: null,
    blockedRoad: null,
  });

  const [objective, setObjective] = useState(
    "REACH THE FLOODED AREA"
  );

  const [distance, setDistance] = useState(0);

  const [canInteract, setCanInteract] =
    useState(false);

  const [interactLabel, setInteractLabel] =
    useState("APPROACH");

  const [dialogue, setDialogue] =
    useState(null);

  const [running, setRunning] =
    useState(false);

  const [stage, setStage] =
    useState(0);

  const missionTitle =
    mission?.title || "EVACUATION CENTER";

  const missionNumber =
    mission?.number || "01";

  const district =
    mission?.district || "DISTRICT 7";

  /*
  ============================================================
  ROUTE
  ============================================================
  */

  const ROUTE = {
    flood: new THREE.Vector3(0, 0, -18),

    survivor: new THREE.Vector3(
      5,
      0,
      -38
    ),

    clue: new THREE.Vector3(
      -5,
      0,
      -55
    ),

    sideStreet: new THREE.Vector3(
      7,
      0,
      -72
    ),

    supplies: new THREE.Vector3(
      -6,
      0,
      -92
    ),

    evacuation: new THREE.Vector3(
      0,
      0,
      -125
    ),
  };

  const STAGES = [
    {
      name: "REACH THE FLOODED AREA",
      position: ROUTE.flood,
      interact: false,
    },

    {
      name: "FIND THE SURVIVOR",
      position: ROUTE.survivor,
      interact: true,
      label: "TALK",
    },

    {
      name: "INVESTIGATE THE CLUE",
      position: ROUTE.clue,
      interact: true,
      label: "INVESTIGATE",
    },

    {
      name: "FIND ANOTHER WAY THROUGH",
      position: ROUTE.sideStreet,
      interact: false,
    },

    {
      name: "COLLECT RELIEF SUPPLIES",
      position: ROUTE.supplies,
      interact: true,
      label: "COLLECT",
    },

    {
      name: "REACH THE EVACUATION CENTER",
      position: ROUTE.evacuation,
      interact: true,
      label: "INTERACT",
    },
  ];

  /*
  ============================================================
  HELPERS
  ============================================================
  */

  function material(
    color,
    options = {}
  ) {
    return new THREE.MeshLambertMaterial({
      color,
      ...options,
    });
  }

  function box(
    scene,
    width,
    height,
    depth,
    mat,
    x,
    y,
    z
  ) {
    const mesh =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          width,
          height,
          depth
        ),
        mat
      );

    mesh.position.set(
      x,
      y,
      z
    );

    scene.add(mesh);

    return mesh;
  }

  function cylinder(
    scene,
    radiusTop,
    radiusBottom,
    height,
    mat,
    x,
    y,
    z
  ) {
    const mesh =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          height,
          8
        ),
        mat
      );

    mesh.position.set(
      x,
      y,
      z
    );

    scene.add(mesh);

    return mesh;
  }

  /*
  ============================================================
  KEYBOARD
  ============================================================
  */

  useEffect(() => {
    const down = (e) => {
      keysRef.current[e.code] = true;

      if (
        e.code === "ShiftLeft" ||
        e.code === "ShiftRight"
      ) {
        playerRef.current.running = true;
        setRunning(true);
      }

      if (
        e.code === "KeyE" ||
        e.code === "Enter"
      ) {
        window.dispatchEvent(
          new CustomEvent(
            "tatsulok-interact"
          )
        );
      }
    };

    const up = (e) => {
      keysRef.current[e.code] = false;

      if (
        e.code === "ShiftLeft" ||
        e.code === "ShiftRight"
      ) {
        playerRef.current.running = false;
        setRunning(false);
      }
    };

    window.addEventListener(
      "keydown",
      down
    );

    window.addEventListener(
      "keyup",
      up
    );

    return () => {
      window.removeEventListener(
        "keydown",
        down
      );

      window.removeEventListener(
        "keyup",
        up
      );
    };
  }, []);

  /*
  ============================================================
  THREE WORLD
  ============================================================
  */

  useEffect(() => {
    const mount =
      mountRef.current;

    if (!mount) return;

    /*
    SCENE
    */

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x11191d
      );

    scene.fog =
      new THREE.Fog(
        0x11191d,
        55,
        170
      );

    sceneRef.current =
      scene;

    /*
    CAMERA
    */

    const camera =
      new THREE.PerspectiveCamera(
        60,
        mount.clientWidth /
          Math.max(
            mount.clientHeight,
            1
          ),
        0.1,
        220
      );

    camera.position.set(
      0,
      4,
      15
    );

    cameraRef.current =
      camera;

    /*
    RENDERER
    */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: false,
        powerPreference:
          "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.15
      )
    );

    renderer.setSize(
      mount.clientWidth,
      mount.clientHeight,
      false
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.domElement.style.touchAction =
      "none";

    mount.appendChild(
      renderer.domElement
    );

    rendererRef.current =
      renderer;

    /*
    LIGHT
    */

    scene.add(
      new THREE.HemisphereLight(
        0x78909c,
        0x111111,
        1.35
      )
    );

    const moonLight =
      new THREE.DirectionalLight(
        0xa8b9c7,
        0.55
      );

    moonLight.position.set(
      -30,
      50,
      20
    );

    scene.add(
      moonLight
    );

    /*
    =========================================================
    MATERIALS
    =========================================================
    */

    const groundMat =
      material(0x444b4c);

    const roadMat =
      material(0x20292b);

    const sidewalkMat =
      material(0x676c6c);

    const concreteMat =
      material(0x555d5e);

    const concreteDark =
      material(0x303738);

    const brickMat =
      material(0x6b463b);

    const roofMat =
      material(0x252b2c);

    const glassMat =
      material(
        0x315967,
        {
          emissive: 0x08171c,
        }
      );

    const yellowMat =
      new THREE.MeshBasicMaterial({
        color: 0xffc52d,
      });

    const redMat =
      material(0x792b29);

    const woodMat =
      material(0x63412f);

    const waterMat =
      new THREE.MeshLambertMaterial({
        color: 0x315c69,
        transparent: true,
        opacity: 0.72,
      });

    /*
    =========================================================
    GROUND
    =========================================================
    */

    box(
      scene,
      120,
      0.3,
      230,
      groundMat,
      0,
      -0.2,
      -55
    );

    /*
    MAIN ROAD
    */

    box(
      scene,
      22,
      0.12,
      220,
      roadMat,
      0,
      0,
      -55
    );

    /*
    SIDEWALKS
    */

    box(
      scene,
      8,
      0.18,
      220,
      sidewalkMat,
      -15,
      0.08,
      -55
    );

    box(
      scene,
      8,
      0.18,
      220,
      sidewalkMat,
      15,
      0.08,
      -55
    );

    /*
    ROAD MARKINGS
    */

    for (
      let z = 10;
      z > -170;
      z -= 9
    ) {
      box(
        scene,
        0.18,
        0.04,
        3.4,
        yellowMat,
        0,
        0.09,
        z
      );
    }

    /*
    =========================================================
    FLOODED AREA
    =========================================================
    */

    box(
      scene,
      18,
      0.045,
      24,
      waterMat,
      0,
      0.15,
      -18
    );

    box(
      scene,
      15,
      0.04,
      18,
      waterMat,
      5,
      0.16,
      -38
    );

    box(
      scene,
      17,
      0.04,
      20,
      waterMat,
      -3,
      0.16,
      -56
    );

    /*
    =========================================================
    BUILDINGS
    =========================================================
    */

    function createBuilding({
      x,
      z,
      width,
      depth,
      height,
      color,
    }) {
      const body =
        box(
          scene,
          width,
          height,
          depth,
          material(color),
          x,
          height / 2,
          z
        );

      body.userData.blocking =
        true;

      /*
      ROOF
      */

      box(
        scene,
        width + 0.5,
        0.35,
        depth + 0.5,
        roofMat,
        x,
        height + 0.15,
        z
      );

      /*
      WINDOWS
      */

      const cols =
        Math.max(
          2,
          Math.floor(
            width / 3
          )
        );

      const rows =
        Math.max(
          2,
          Math.floor(
            height / 3
          )
        );

      const frontZ =
        z +
        depth / 2 +
        0.03;

      for (
        let row = 0;
        row < rows;
        row++
      ) {
        for (
          let col = 0;
          col < cols;
          col++
        ) {
          const wx =
            x -
            width / 2 +
            1.4 +
            col * 2.7;

          const wy =
            2.2 +
            row * 2.7;

          box(
            scene,
            1.15,
            1.05,
            0.08,
            glassMat,
            wx,
            wy,
            frontZ
          );
        }
      }

      /*
      BROKEN PANELS
      */

      if (height > 12) {
        box(
          scene,
          2.2,
          1.2,
          0.12,
          brickMat,
          x + 2,
          height * 0.55,
          frontZ + 0.05
        );
      }
    }

    /*
    LEFT
    */

    createBuilding({
      x: -25,
      z: -5,
      width: 18,
      depth: 18,
      height: 15,
      color: 0x535a5b,
    });

    createBuilding({
      x: -25,
      z: -32,
      width: 17,
      depth: 17,
      height: 11,
      color: 0x704b40,
    });

    createBuilding({
      x: -25,
      z: -60,
      width: 19,
      depth: 18,
      height: 16,
      color: 0x4d5556,
    });

    createBuilding({
      x: -25,
      z: -92,
      width: 17,
      depth: 17,
      height: 12,
      color: 0x68483e,
    });

    createBuilding({
      x: -25,
      z: -123,
      width: 19,
      depth: 18,
      height: 15,
      color: 0x4c5455,
    });

    /*
    RIGHT
    */

    createBuilding({
      x: 25,
      z: -7,
      width: 19,
      depth: 18,
      height: 17,
      color: 0x50595b,
    });

    createBuilding({
      x: 25,
      z: -35,
      width: 18,
      depth: 17,
      height: 13,
      color: 0x714a40,
    });

    createBuilding({
      x: 25,
      z: -62,
      width: 19,
      depth: 19,
      height: 16,
      color: 0x51595a,
    });

    createBuilding({
      x: 25,
      z: -93,
      width: 18,
      depth: 18,
      height: 12,
      color: 0x684a40,
    });

    createBuilding({
      x: 25,
      z: -123,
      width: 20,
      depth: 18,
      height: 15,
      color: 0x50585a,
    });

    /*
    =========================================================
    DEBRIS
    =========================================================
    */

    for (
      let i = 0;
      i < 34;
      i++
    ) {
      const side =
        i % 2 === 0
          ? -1
          : 1;

      const x =
        side *
        (8 +
          Math.random() * 7);

      const z =
        -5 -
        Math.random() * 125;

      const size =
        0.3 +
        Math.random() * 1.1;

      const debris =
        box(
          scene,
          size * 2,
          size,
          size,
          concreteDark,
          x,
          size / 2,
          z
        );

      debris.rotation.y =
        Math.random() *
        Math.PI;
    }

    /*
    =========================================================
    WOOD / BOARDS
    =========================================================
    */

    for (
      let z = -20;
      z > -130;
      z -= 24
    ) {
      box(
        scene,
        3.2,
        0.18,
        0.5,
        woodMat,
        -8.8,
        0.35,
        z
      );

      box(
        scene,
        2.6,
        0.18,
        0.45,
        woodMat,
        8.5,
        0.35,
        z - 5
      );
    }

    /*
    =========================================================
    STREET LIGHTS
    =========================================================
    */

    for (
      let z = 5;
      z > -155;
      z -= 15
    ) {
      [-1, 1].forEach(
        (side) => {
          const x =
            side * 8.5;

          cylinder(
            scene,
            0.08,
            0.11,
            5.5,
            concreteDark,
            x,
            2.75,
            z
          );

          const lamp =
            new THREE.Mesh(
              new THREE.BoxGeometry(
                0.45,
                0.25,
                0.45
              ),
              yellowMat
            );

          lamp.position.set(
            x,
            5.5,
            z
          );

          scene.add(lamp);
        }
      );
    }

    /*
    =========================================================
    BLOCKED ROAD
    =========================================================
    */

    const block =
      new THREE.Group();

    block.position.set(
      0,
      0,
      -72
    );

    scene.add(block);

    box(
      block,
      3.2,
      1.4,
      1.4,
      concreteMat,
      -2,
      0.7,
      0
    );

    box(
      block,
      3.2,
      1.4,
      1.4,
      concreteMat,
      2,
      0.7,
      0
    );

    box(
      block,
      5.8,
      0.18,
      0.18,
      redMat,
      0,
      1.7,
      0
    );

    worldRef.current.blockedRoad =
      block;

    /*
    =========================================================
    EVACUATION CENTER
    =========================================================
    */

    const centerX = 0;
    const centerZ = -125;

    /*
    BUILDING
    */

    box(
      scene,
      18,
      7,
      12,
      concreteMat,
      centerX,
      3.5,
      centerZ
    );

    /*
    ROOF
    */

    box(
      scene,
      19,
      0.45,
      13,
      roofMat,
      centerX,
      7.25,
      centerZ
    );

    /*
    RED CROSS / SIGN
    */

    box(
      scene,
      5,
      1.2,
      0.15,
      redMat,
      0,
      4.8,
      centerZ - 6.1
    );

    box(
      scene,
      1.2,
      5,
      0.15,
      redMat,
      0,
      4.8,
      centerZ - 6.2
    );

    /*
    ENTRANCE
    */

    box(
      scene,
      3,
      3.5,
      0.25,
      concreteDark,
      0,
      1.75,
      centerZ - 6.25
    );

    /*
    =========================================================
    SIMPLE PLAYER CHARACTER
    =========================================================
    */

    const player =
      new THREE.Group();

    playerGroupRef.current =
      player;

    scene.add(player);

    /*
    BODY
    */

    const body =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.05,
          1.45,
          0.62
        ),
        material(0x111519)
      );

    body.position.y =
      1.55;

    player.add(body);

    /*
    HEAD
    */

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.43,
          12,
          8
        ),
        material(0x9b6548)
      );

    head.position.y =
      2.65;

    player.add(head);

    /*
    HAIR
    */

    const hair =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.46,
          10,
          6
        ),
        material(0x090a0a)
      );

    hair.scale.y =
      0.65;

    hair.position.y =
      2.92;

    player.add(hair);

    /*
    LEGS
    */

    const leftLeg =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.43,
          1.2,
          0.45
        ),
        material(0x111316)
      );

    leftLeg.position.set(
      -0.27,
      0.65,
      0
    );

    player.add(leftLeg);

    const rightLeg =
      leftLeg.clone();

    rightLeg.position.x =
      0.27;

    player.add(rightLeg);

    /*
    ARMS
    */

    const leftArm =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.35,
          1.15,
          0.4
        ),
        material(0x161b1d)
      );

    leftArm.position.set(
      -0.7,
      1.65,
      0
    );

    player.add(leftArm);

    const rightArm =
      leftArm.clone();

    rightArm.position.x =
      0.7;

    player.add(rightArm);

    player.position.copy(
      playerRef.current.position
    );

    /*
    =========================================================
    OPTIONAL GLB CHARACTER
    =========================================================
    */

    const modelPath =
      activeCharacter?.model ||
      (
        activeCharacter?.id
          ? `/assets/models/${activeCharacter.id}.glb`
          : null
      );

    if (modelPath) {
      const loader =
        new GLTFLoader();

      loader.load(
        modelPath,
        (gltf) => {
          /*
          Hide fallback avatar
          */

          body.visible = false;
          head.visible = false;
          hair.visible = false;
          leftLeg.visible = false;
          rightLeg.visible = false;
          leftArm.visible = false;
          rightArm.visible = false;

          const model =
            gltf.scene;

          model.traverse(
            (obj) => {
              if (
                obj.isMesh
              ) {
                obj.frustumCulled =
                  true;
              }
            }
          );

          /*
          Normalize model
          */

          const box3 =
            new THREE.Box3().setFromObject(
              model
            );

          const size =
            box3.getSize(
              new THREE.Vector3()
            );

          const maxSize =
            Math.max(
              size.x,
              size.y,
              size.z
            );

          if (maxSize > 0) {
            const scale =
              3.0 / maxSize;

            model.scale.setScalar(
              scale
            );
          }

          const modelBox =
            new THREE.Box3().setFromObject(
              model
            );

          const minY =
            modelBox.min.y;

          model.position.y -=
            minY;

          player.add(
            model
          );
        },
        undefined,
        () => {
          /*
          Fallback avatar remains visible.
          */
        }
      );
    }

    /*
    =========================================================
    RESIZE
    =========================================================
    */

    const resize = () => {
      if (!mount) return;

      const width =
        mount.clientWidth;

      const height =
        Math.max(
          mount.clientHeight,
          1
        );

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height,
        false
      );
    };

    window.addEventListener(
      "resize",
      resize
    );

    /*
    =========================================================
    GAME LOOP
    =========================================================
    */

    const clock =
      new THREE.Clock();

    clockRef.current =
      clock;

    let lastHUD =
      0;

    const animate = () => {
      frameRef.current =
        requestAnimationFrame(
          animate
        );

      /*
      DELTA
      */

      let dt =
        clock.getDelta();

      /*
      Prevent huge jumps
      when browser sleeps.
      */

      dt =
        Math.min(
          dt,
          0.05
        );

      const player =
        playerRef.current;

      /*
      =======================================================
      INPUT
      =======================================================
      */

      let inputX = 0;
      let inputY = 0;

      const keys =
        keysRef.current;

      if (
        keys.KeyA ||
        keys.ArrowLeft
      ) {
        inputX -= 1;
      }

      if (
        keys.KeyD ||
        keys.ArrowRight
      ) {
        inputX += 1;
      }

      if (
        keys.KeyW ||
        keys.ArrowUp
      ) {
        inputY += 1;
      }

      if (
        keys.KeyS ||
        keys.ArrowDown
      ) {
        inputY -= 1;
      }

      /*
      MOBILE JOYSTICK
      */

      if (
        joystickRef.current.active
      ) {
        inputX =
          joystickRef.current.x;

        inputY =
          joystickRef.current.y;
      }

      /*
      Normalize keyboard
      */

      const inputLength =
        Math.sqrt(
          inputX * inputX +
          inputY * inputY
        );

      if (
        inputLength > 1
      ) {
        inputX /=
          inputLength;

        inputY /=
          inputLength;
      }

      /*
      =======================================================
      CAMERA-RELATIVE MOVEMENT
      =======================================================
      */

      const cameraYaw =
        player.cameraYaw;

      const forwardX =
        -Math.sin(
          cameraYaw
        );

      const forwardZ =
        -Math.cos(
          cameraYaw
        );

      const rightX =
        Math.cos(
          cameraYaw
        );

      const rightZ =
        -Math.sin(
          cameraYaw
        );

      const moveX =
        rightX * inputX +
        forwardX * inputY;

      const moveZ =
        rightZ * inputX +
        forwardZ * inputY;

      const moveLength =
        Math.sqrt(
          moveX * moveX +
          moveZ * moveZ
        );

      /*
      =======================================================
      MOVEMENT
      =======================================================
      */

      const isMoving =
        moveLength >
        0.05;

      player.moving =
        isMoving;

      /*
      RUN
      */

      const sprint =
        player.running ||
        keys.ShiftLeft ||
        keys.ShiftRight;

      const WALK_SPEED =
        5.4;

      const RUN_SPEED =
        8.2;

      const maxSpeed =
        sprint
          ? RUN_SPEED
          : WALK_SPEED;

      /*
      Desired velocity
      */

      const targetVX =
        isMoving
          ? (moveX /
              moveLength) *
            maxSpeed *
            Math.min(
              moveLength,
              1
            )
          : 0;

      const targetVZ =
        isMoving
          ? (moveZ /
              moveLength) *
            maxSpeed *
            Math.min(
              moveLength,
              1
            )
          : 0;

      /*
      ACCELERATION

      This is what makes the joystick
      feel controlled instead of
      instantly jumping to full speed.
      */

      const acceleration =
        isMoving
          ? 18
          : 24;

      const blend =
        Math.min(
          acceleration * dt,
          1
        );

      player.velocity.x +=
        (
          targetVX -
          player.velocity.x
        ) * blend;

      player.velocity.z +=
        (
          targetVZ -
          player.velocity.z
        ) * blend;

      /*
      Apply movement
      */

      const nextX =
        player.position.x +
        player.velocity.x *
          dt;

      const nextZ =
        player.position.z +
        player.velocity.z *
          dt;

      /*
      =======================================================
      WORLD LIMITS
      =======================================================
      */

      player.position.x =
        THREE.MathUtils.clamp(
          nextX,
          -9.2,
          9.2
        );

      player.position.z =
        THREE.MathUtils.clamp(
          nextZ,
          -157,
          15
        );

      /*
      =======================================================
      BLOCKED ROAD COLLISION
      =======================================================
      */

      const blockZ =
        -72;

      if (
        player.position.z <
          blockZ + 2.5 &&
        player.position.z >
          blockZ - 2.5 &&
        Math.abs(
          player.position.x
        ) < 3.5
      ) {
        /*
        Push player to the
        nearest side of barrier.
        */

        if (
          player.position.x >= 0
        ) {
          player.position.x =
            3.6;
        } else {
          player.position.x =
            -3.6;
        }
      }

      /*
      =======================================================
      PLAYER ROTATION
      =======================================================
      */

      if (
        isMoving
      ) {
        const desiredYaw =
          Math.atan2(
            player.velocity.x,
            player.velocity.z
          );

        let angleDifference =
          desiredYaw -
          player.yaw;

        angleDifference =
          Math.atan2(
            Math.sin(
              angleDifference
            ),
            Math.cos(
              angleDifference
            )
          );

        player.yaw +=
          angleDifference *
          Math.min(
            12 * dt,
            1
          );
      }

      /*
      =======================================================
      PLAYER ANIMATION
      =======================================================
      */

      if (
        playerGroupRef.current
      ) {
        const group =
          playerGroupRef.current;

        group.position.copy(
          player.position
        );

        group.rotation.y =
          player.yaw;

        /*
        Simple walking bounce
        */

        if (
          isMoving
        ) {
          const t =
            performance.now() *
            0.012 *
            (
              sprint
                ? 1.35
                : 1
            );

          group.position.y =
            Math.abs(
              Math.sin(t)
            ) *
            0.07;

          group.children.forEach(
            (child) => {
              if (
                child.isMesh
              ) {
                /*
                very subtle movement
                */
              }
            }
          );
        } else {
          group.position.y = 0;
        }
      }

      /*
      =======================================================
      THIRD PERSON CAMERA
      =======================================================
      */

      const cameraDistance =
        6.2;

      const cameraHeight =
        3.1;

      const cameraX =
        player.position.x +
        Math.sin(
          player.cameraYaw
        ) *
        cameraDistance;

      const cameraZ =
        player.position.z +
        Math.cos(
          player.cameraYaw
        ) *
        cameraDistance;

      const desiredCamera =
        new THREE.Vector3(
          cameraX,
          cameraHeight,
          cameraZ
        );

      camera.position.lerp(
        desiredCamera,
        Math.min(
          10 * dt,
          1
        )
      );

      const lookTarget =
        new THREE.Vector3(
          player.position.x,
          1.65,
          player.position.z
        );

      /*
      Pitch
      */

      const pitchOffset =
        Math.sin(
          player.cameraPitch
        ) *
        1.8;

      lookTarget.y +=
        pitchOffset;

      camera.lookAt(
        lookTarget
      );

      /*
      =======================================================
      OBJECTIVE
      =======================================================
      */

      const currentStage =
        STAGES[
          Math.min(
            stage,
            STAGES.length - 1
          )
        ];

      const target =
        currentStage.position;

      const dx =
        player.position.x -
        target.x;

      const dz =
        player.position.z -
        target.z;

      const currentDistance =
        Math.sqrt(
          dx * dx +
          dz * dz
        );

      /*
      HUD update only ~8 FPS
      */

      const now =
        performance.now();

      if (
        now - lastHUD >
        120
      ) {
        lastHUD = now;

        setDistance(
          Math.round(
            currentDistance
          )
        );
      }

      /*
      INTERACT RANGE
      */

      const interactionRange =
        3.2;

      const near =
        currentDistance <=
        interactionRange;

      setCanInteract(
        near &&
        currentStage.interact
      );

      setInteractLabel(
        near &&
        currentStage.interact
          ? currentStage.label
          : "APPROACH"
      );

      /*
      =======================================================
      MARKER
      =======================================================
      */

      const marker =
        worldRef.current.marker;

      const ring =
        worldRef.current.markerRing;

      if (marker) {
        marker.position.set(
          target.x,
          2.7 +
            Math.sin(
              now * 0.004
            ) *
              0.25,
          target.z
        );

        marker.rotation.y +=
          dt * 1.8;
      }

      if (ring) {
        ring.position.set(
          target.x,
          0.06,
          target.z
        );

        ring.scale.setScalar(
          1 +
            Math.sin(
              now * 0.004
            ) *
              0.08
        );
      }

      renderer.render(
        scene,
        camera
      );
    };

    /*
    =========================================================
    OBJECTIVE MARKER
    =========================================================
    */

    const marker =
      new THREE.Mesh(
        new THREE.OctahedronGeometry(
          0.75,
          0
        ),
        yellowMat
      );

    marker.position.set(
      ROUTE.flood.x,
      2.8,
      ROUTE.flood.z
    );

    scene.add(marker);

    worldRef.current.marker =
      marker;

    /*
    MARKER RING
    */

    const ring =
      new THREE.Mesh(
        new THREE.RingGeometry(
          1.1,
          1.35,
          24
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffc52d,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide,
        })
      );

    ring.rotation.x =
      -Math.PI / 2;

    ring.position.set(
      ROUTE.flood.x,
      0.06,
      ROUTE.flood.z
    );

    scene.add(ring);

    worldRef.current.markerRing =
      ring;

    /*
    =========================================================
    SURVIVOR
    =========================================================
    */

    const survivor =
      new THREE.Group();

    survivor.position.copy(
      ROUTE.survivor
    );

    scene.add(
      survivor
    );

    const survivorBody =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.9,
          1.4,
          0.55
        ),
        material(0x40514d)
      );

    survivorBody.position.y =
      0.9;

    survivor.add(
      survivorBody
    );

    const survivorHead =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.35,
          10,
          8
        ),
        material(0x9b674d)
      );

    survivorHead.position.y =
      1.85;

    survivor.add(
      survivorHead
    );

    worldRef.current.survivor =
      survivor;

    /*
    =========================================================
    CLUE
    =========================================================
    */

    const clue =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.9,
          0.12,
          0.65
        ),
        yellowMat
      );

    clue.position.copy(
      ROUTE.clue
    );

    clue.position.y =
      0.45;

    scene.add(clue);

    worldRef.current.clue =
      clue;

    /*
    =========================================================
    SUPPLIES
    =========================================================
    */

    const supplies =
      new THREE.Group();

    supplies.position.copy(
      ROUTE.supplies
    );

    scene.add(
      supplies
    );

    for (
      let i = 0;
      i < 3;
      i++
    ) {
      box(
        supplies,
        0.8,
        0.8,
        0.8,
        material(0x9b6b38),
        (i - 1) *
          0.9,
        0.4,
        0
      );
    }

    worldRef.current.supplies =
      supplies;

    /*
    =========================================================
    INTERACTION
    =========================================================
    */

    const interact =
      () => {
        const current =
          STAGES[
            Math.min(
              stage,
              STAGES.length - 1
            )
          ];

        if (
          !current.interact
        ) {
          return;
        }

        const p =
          playerRef.current;

        const dx =
          p.position.x -
          current.position.x;

        const dz =
          p.position.z -
          current.position.z;

        const d =
          Math.sqrt(
            dx * dx +
            dz * dz
          );

        if (
          d > 3.2
        ) {
          return;
        }

        /*
        =====================================================
        SURVIVOR
        =====================================================
        */

        if (
          stage === 1
        ) {
          setDialogue({
            type: "survivor",
            title: "SURVIVOR",
            text:
              "Tulungan mo kami. May mga residente pang naiwan sa kabilang bahagi ng distrito.",
            choices: [
              "TULUNGAN ANG MGA RESIDENTE",
              "ALAMIN KUNG ANO ANG NANGYARI",
            ],
          });

          return;
        }

        /*
        CLUE
        */

        if (
          stage === 2
        ) {
          setDialogue({
            type: "clue",
            title: "THE CLUE",
            text:
              "May mga bakas ng sasakyan at mga dokumentong iniwan sa baha. May mali sa nangyari rito.",
            choices: [
              "IMBESTIGAHAN ANG MGA BAKAS",
              "IPAGPATULOY ANG PAGLIKAS",
            ],
          });

          return;
        }

        /*
        SUPPLIES
        */

        if (
          stage === 4
        ) {
          setStage(5);

          setObjective(
            STAGES[5].name
          );

          return;
        }

        /*
        EVACUATION
        */

        if (
          stage === 5
        ) {
          setDialogue({
            type: "finish",
            title:
              "EVACUATION CENTER",
            text:
              "Nakarating ka sa evacuation center. Ngunit may mas malaking misteryo sa likod ng baha.",
            choices: [
              "IPAGPATULOY",
              "BUMALIK SA DISTRICT",
            ],
          });
        }
      };

    const interactionHandler =
      () => {
        interact();
      };

    window.addEventListener(
      "tatsulok-interact",
      interactionHandler
    );

    /*
    =========================================================
    TOUCH / JOYSTICK
    =========================================================
    */

    const getJoystick =
      () =>
        document.querySelector(
          ".tatsulok-joystick"
        );

    const joystickMove =
      (e) => {
        const joystick =
          getJoystick();

        if (!joystick) return;

        if (
          !joystickRef.current.active
        ) {
          return;
        }

        if (
          e.pointerId !==
          joystickRef.current.pointerId
        ) {
          return;
        }

        const rect =
          joystick.getBoundingClientRect();

        const centerX =
          rect.left +
          rect.width / 2;

        const centerY =
          rect.top +
          rect.height / 2;

        let x =
          e.clientX -
          centerX;

        let y =
          e.clientY -
          centerY;

        const radius =
          rect.width * 0.34;

        const length =
          Math.sqrt(
            x * x +
            y * y
          );

        if (
          length > radius
        ) {
          x =
            (x / length) *
            radius;

          y =
            (y / length) *
            radius;
        }

        /*
        DEAD ZONE

        Prevent tiny accidental
        movements.
        */

        const deadZone =
          radius * 0.12;

        const rawLength =
          Math.sqrt(
            x * x +
            y * y
          );

        if (
          rawLength <
          deadZone
        ) {
          joystickRef.current.x =
            0;

          joystickRef.current.y =
            0;
        } else {
          const adjusted =
            Math.min(
              1,
              (
                rawLength -
                deadZone
              ) /
                (
                  radius -
                  deadZone
                )
            );

          const nx =
            x / rawLength;

          const ny =
            y / rawLength;

          joystickRef.current.x =
            nx * adjusted;

          /*
          Screen Y is inverted.
          Up = positive forward.
          */

          joystickRef.current.y =
            -ny * adjusted;
        }

        const knob =
          joystick.querySelector(
            ".tatsulok-joystick-knob"
          );

        if (knob) {
          knob.style.transform =
            `translate(${x}px, ${y}px)`;
        }
      };

    const joystickDown =
      (e) => {
        e.preventDefault();

        const joystick =
          getJoystick();

        if (!joystick) return;

        joystickRef.current.active =
          true;

        joystickRef.current.pointerId =
          e.pointerId;

        try {
          joystick.setPointerCapture(
            e.pointerId
          );
        } catch {}

        joystickMove(e);
      };

    const joystickUp =
      (e) => {
        if (
          joystickRef.current.pointerId !==
          e.pointerId
        ) {
          return;
        }

        joystickRef.current.active =
          false;

        joystickRef.current.pointerId =
          null;

        joystickRef.current.x =
          0;

        joystickRef.current.y =
          0;

        const joystick =
          getJoystick();

        const knob =
          joystick?.querySelector(
            ".tatsulok-joystick-knob"
          );

        if (knob) {
          knob.style.transform =
            "translate(0px, 0px)";
        }
      };

    /*
    =========================================================
    CAMERA TOUCH
    =========================================================
    */

    const touchStart =
      (e) => {
        if (
          e.target.closest(
            ".tatsulok-joystick"
          )
        ) {
          return;
        }

        if (
          e.target.closest(
            ".tatsulok-control"
          )
        ) {
          return;
        }

        lookRef.current.active =
          true;

        lookRef.current.pointerId =
          e.pointerId;

        lookRef.current.lastX =
          e.clientX;

        lookRef.current.lastY =
          e.clientY;
      };

    const touchMove =
      (e) => {
        if (
          !lookRef.current.active
        ) {
          return;
        }

        if (
          e.pointerId !==
          lookRef.current.pointerId
        ) {
          return;
        }

        const dx =
          e.clientX -
          lookRef.current.lastX;

        const dy =
          e.clientY -
          lookRef.current.lastY;

        lookRef.current.lastX =
          e.clientX;

        lookRef.current.lastY =
          e.clientY;

        /*
        MOBILE CAMERA SENSITIVITY

        Intentionally moderate.
        */

        const sensitivity =
          0.004;

        playerRef.current.cameraYaw -=
          dx *
          sensitivity;

        playerRef.current.cameraPitch -=
          dy *
          sensitivity;

        playerRef.current.cameraPitch =
          THREE.MathUtils.clamp(
            playerRef.current.cameraPitch,
            -0.05,
            0.7
          );
      };

    const touchEnd =
      (e) => {
        if (
          e.pointerId ===
          lookRef.current.pointerId
        ) {
          lookRef.current.active =
            false;

          lookRef.current.pointerId =
            null;
        }
      };

    /*
    =========================================================
    RUN BUTTON
    =========================================================
    */

    const runDown =
      () => {
        playerRef.current.running =
          true;

        setRunning(true);
      };

    const runUp =
      () => {
        playerRef.current.running =
          false;

        setRunning(false);
      };

    const runButton =
      document.querySelector(
        ".tatsulok-run"
      );

    if (runButton) {
      runButton.addEventListener(
        "pointerdown",
        runDown
      );

      runButton.addEventListener(
        "pointerup",
        runUp
      );

      runButton.addEventListener(
        "pointercancel",
        runUp
      );

      runButton.addEventListener(
        "pointerleave",
        runUp
      );
    }

    const joystick =
      document.querySelector(
        ".tatsulok-joystick"
      );

    if (joystick) {
      joystick.addEventListener(
        "pointerdown",
        joystickDown
      );

      joystick.addEventListener(
        "pointermove",
        joystickMove
      );

      joystick.addEventListener(
        "pointerup",
        joystickUp
      );

      joystick.addEventListener(
        "pointercancel",
        joystickUp
      );
    }

    const canvas =
      renderer.domElement;

    canvas.addEventListener(
      "pointerdown",
      touchStart
    );

    canvas.addEventListener(
      "pointermove",
      touchMove
    );

    canvas.addEventListener(
      "pointerup",
      touchEnd
    );

    canvas.addEventListener(
      "pointercancel",
      touchEnd
    );

    /*
    =========================================================
    START
    =========================================================
    */

    resize();
    animate();

    /*
    =========================================================
    CLEANUP
    =========================================================
    */

    return () => {
      cancelAnimationFrame(
        frameRef.current
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "tatsulok-interact",
        interactionHandler
      );

      canvas.removeEventListener(
        "pointerdown",
        touchStart
      );

      canvas.removeEventListener(
        "pointermove",
        touchMove
      );

      canvas.removeEventListener(
        "pointerup",
        touchEnd
      );

      canvas.removeEventListener(
        "pointercancel",
        touchEnd
      );

      if (joystick) {
        joystick.removeEventListener(
          "pointerdown",
          joystickDown
        );

        joystick.removeEventListener(
          "pointermove",
          joystickMove
        );

        joystick.removeEventListener(
          "pointerup",
          joystickUp
        );

        joystick.removeEventListener(
          "pointercancel",
          joystickUp
        );
      }

      if (runButton) {
        runButton.removeEventListener(
          "pointerdown",
          runDown
        );

        runButton.removeEventListener(
          "pointerup",
          runUp
        );

        runButton.removeEventListener(
          "pointercancel",
          runUp
        );

        runButton.removeEventListener(
          "pointerleave",
          runUp
        );
      }

      scene.traverse(
        (object) => {
          if (
            object.geometry
          ) {
            object.geometry.dispose();
          }

          if (
            object.material
          ) {
            if (
              Array.isArray(
                object.material
              )
            ) {
              object.material.forEach(
                (m) =>
                  m.dispose()
              );
            } else {
              object.material.dispose();
            }
          }
        }
      );

      renderer.dispose();

      if (
        mount.contains(
          renderer.domElement
        )
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }

      sceneRef.current =
        null;

      rendererRef.current =
        null;

      cameraRef.current =
        null;

      playerGroupRef.current =
        null;
    };
  }, [activeCharacter, stage]);

  /*
  ============================================================
  UPDATE OBJECTIVE WHEN STAGE CHANGES
  ============================================================
  */

  useEffect(() => {
    const current =
      STAGES[
        Math.min(
          stage,
          STAGES.length - 1
        )
      ];

    setObjective(
      current.name
    );
  }, [stage]);

  /*
  ============================================================
  DIALOGUE CHOICE
  ============================================================
  */

  const chooseDialogue =
    (choice) => {
      const type =
        dialogue?.type;

      setDialogue(null);

      /*
      Survivor
      */

      if (
        type === "survivor"
      ) {
        setStage(2);
        return;
      }

      /*
      Clue
      */

      if (
        type === "clue"
      ) {
        setStage(3);
        return;
      }

      /*
      Finish
      */

      if (
        type === "finish"
      ) {
        if (
          typeof onComplete ===
          "function"
        ) {
          onComplete({
            choice,
            mission,
          });
        }
      }
    };

  /*
  ============================================================
  UI
  ============================================================
  */

  return (
    <div
      className="district-game"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#101719",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <div
        ref={mountRef}
        className="district-canvas"
        style={{
          position: "absolute",
          inset: 0,
        }}
      />

      {/* =====================================================
          TOP HUD
      ===================================================== */}

      <div
        className="game-ui"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <button
          className="game-back tatsulok-control"
          onClick={onExit}
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            pointerEvents: "auto",
            padding:
              "14px 24px",
            background:
              "rgba(8,12,13,.86)",
            color: "#fff",
            border:
              "1px solid rgba(255,197,45,.55)",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          ← BACK
        </button>

        <div
          style={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform:
              "translateX(-50%)",
            textAlign: "center",
            color: "#fff",
            textShadow:
              "0 3px 12px #000",
          }}
        >
          <div
            style={{
              color: "#ffc52d",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 4,
            }}
          >
            MISSION {missionNumber}
          </div>

          <div
            style={{
              fontSize:
                "clamp(24px,4vw,46px)",
              fontWeight: 900,
              letterSpacing: 1,
            }}
          >
            {missionTitle}
          </div>

          <div
            style={{
              opacity: 0.65,
              letterSpacing: 4,
              fontSize: 13,
            }}
          >
            {district}
          </div>
        </div>

        {/* OBJECTIVE */}

        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            minWidth: 190,
            padding:
              "14px 20px",
            background:
              "rgba(8,12,13,.88)",
            border:
              "1px solid rgba(255,197,45,.55)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#ffc52d",
              fontSize: 11,
              letterSpacing: 3,
              fontWeight: 900,
            }}
          >
            OBJECTIVE
          </div>

          <div
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 14,
              marginTop: 5,
            }}
          >
            {objective}
          </div>

          <div
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 29,
              marginTop: 2,
            }}
          >
            {distance}m
          </div>
        </div>

        {/* CHARACTER */}

        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform:
              "translateX(-50%)",
            color: "#fff",
            background:
              "rgba(7,11,12,.68)",
            border:
              "1px solid rgba(255,255,255,.15)",
            padding:
              "7px 16px",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          {characterName}
        </div>

        {/* CROSSHAIR */}

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform:
              "translate(-50%,-50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background:
              "#fff",
            boxShadow:
              "0 0 8px rgba(255,255,255,.9)",
          }}
        />
      </div>

      {/* =====================================================
          MOBILE JOYSTICK
      ===================================================== */}

      <div
        className="tatsulok-joystick"
        style={{
          position: "absolute",
          left: 28,
          bottom: 32,
          width: 128,
          height: 128,
          borderRadius: "50%",
          border:
            "1px solid rgba(255,255,255,.28)",
          background:
            "rgba(8,13,15,.42)",
          boxShadow:
            "inset 0 0 20px rgba(0,0,0,.45)",
          pointerEvents: "auto",
          touchAction: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            border:
              "1px solid rgba(255,255,255,.16)",
          }}
        />

        <div
          className="tatsulok-joystick-knob"
          style={{
            position: "absolute",
            width: 58,
            height: 58,
            left: "50%",
            top: "50%",
            marginLeft: -29,
            marginTop: -29,
            borderRadius: "50%",
            background:
              "rgba(180,190,193,.72)",
            border:
              "1px solid rgba(255,255,255,.45)",
            boxShadow:
              "0 5px 15px rgba(0,0,0,.4)",
            transition:
              "transform .04s linear",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* =====================================================
          RIGHT CONTROLS
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          right: 28,
          bottom: 30,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <button
          className="tatsulok-run tatsulok-control"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            pointerEvents: "auto",
            touchAction: "none",
            border:
              running
                ? "2px solid #ffc52d"
                : "1px solid rgba(255,255,255,.35)",
            background:
              running
                ? "rgba(255,197,45,.24)"
                : "rgba(8,13,15,.78)",
            color: "#fff",
            fontWeight: 900,
          }}
        >
          🏃
          <br />
          RUN
        </button>

        <button
          className="tatsulok-control"
          disabled={!canInteract}
          onPointerDown={() =>
            canInteract &&
            interact()
          }
          style={{
            width: 145,
            height: 54,
            pointerEvents: "auto",
            background:
              canInteract
                ? "rgba(255,197,45,.16)"
                : "rgba(8,13,15,.72)",
            border:
              canInteract
                ? "1px solid #ffc52d"
                : "1px solid rgba(255,255,255,.2)",
            color:
              canInteract
                ? "#ffc52d"
                : "rgba(255,255,255,.4)",
            fontWeight: 900,
            letterSpacing: 1,
          }}
        >
          {interactLabel}
        </button>
      </div>

      {/* =====================================================
          OBJECTIVE WORLD CARD
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 90,
          transform:
            "translateX(-50%)",
          minWidth: 250,
          textAlign: "center",
          padding:
            "13px 22px",
          background:
            "rgba(7,11,12,.86)",
          border:
            "1px solid rgba(255,197,45,.55)",
          color: "#fff",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "#ffc52d",
            fontSize: 23,
          }}
        >
          ◆
        </div>

        <div
          style={{
            fontWeight: 900,
            fontSize: 15,
          }}
        >
          {objective}
        </div>

        <div
          style={{
            fontWeight: 900,
            fontSize: 20,
          }}
        >
          {distance}m
        </div>
      </div>

      {/* =====================================================
          DIALOGUE
      ===================================================== */}

      {dialogue && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "rgba(0,0,0,.58)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding:
              "20px 20px 30px",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              width:
                "min(720px,100%)",
              background:
                "rgba(10,14,15,.97)",
              border:
                "1px solid rgba(255,197,45,.55)",
              padding:
                "24px",
              boxShadow:
                "0 15px 60px rgba(0,0,0,.6)",
            }}
          >
            <div
              style={{
                color: "#ffc52d",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 3,
              }}
            >
              INTERACTION
            </div>

            <div
              style={{
                color: "#fff",
                fontSize: 25,
                fontWeight: 900,
                marginTop: 5,
              }}
            >
              {dialogue.title}
            </div>

            <div
              style={{
                color:
                  "rgba(255,255,255,.78)",
                lineHeight: 1.6,
                marginTop: 12,
                fontSize: 15,
              }}
            >
              {dialogue.text}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 9,
                marginTop: 20,
              }}
            >
              {dialogue.choices.map(
                (choice, index) => (
                  <button
                    key={choice}
                    onClick={() =>
                      chooseDialogue(
                        choice
                      )
                    }
                    style={{
                      width: "100%",
                      padding:
                        "14px 18px",
                      background:
                        index === 0
                          ? "rgba(255,197,45,.15)"
                          : "rgba(255,255,255,.04)",
                      border:
                        index === 0
                          ? "1px solid #ffc52d"
                          : "1px solid rgba(255,255,255,.18)",
                      color:
                        index === 0
                          ? "#ffc52d"
                          : "#fff",
                      textAlign:
                        "left",
                      fontWeight: 900,
                      cursor:
                        "pointer",
                    }}
                  >
                    {choice}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE CAMERA HINT
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform:
            "translateY(-50%)",
          color:
            "rgba(255,255,255,.35)",
          fontSize: 10,
          letterSpacing: 2,
          pointerEvents: "none",
          writingMode:
            "vertical-rl",
        }}
      >
        DRAG TO LOOK
      </div>
    </div>
  );
}
