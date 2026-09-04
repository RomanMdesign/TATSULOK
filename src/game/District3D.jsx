import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/*
  TATSULOK — DISTRICT 3D
  ---------------------------------------------------------
  THIRD-PERSON / ROBLOX-STYLE DISTRICT

  MOBILE / IPAD
  • Left joystick  = movement
  • Drag right side = camera
  • RUN             = sprint
  • INTERACT        = interact

  DESKTOP
  • WASD / ARROWS   = movement
  • SHIFT           = run
  • Mouse drag      = camera
  • E              = interact

  MISSION 01 ROUTE
  START
    ↓
  STREET
    ↓
  FLOODED AREA
    ↓
  SURVIVOR
    ↓
  CLUE
    ↓
  BLOCKED ROAD
    ↓
  SIDE STREET
    ↓
  RELIEF SUPPLIES
    ↓
  EVACUATION CENTER
*/

export default function District3D({
  mission,
  activeCharacter,
  onExit,
  onComplete,
}) {
  const mountRef = useRef(null);

  const playerRef = useRef({
    position: new THREE.Vector3(0, 0, 12),
    velocity: new THREE.Vector3(),
    yaw: 0,
    cameraYaw: 0,
    cameraPitch: 0.34,
    running: false,
    grounded: true,
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
    x: 0,
    y: 0,
  });

  const playerGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const frameRef = useRef(null);

  const worldRef = useRef({
    objectiveMarker: null,
    objectiveArrow: null,
    survivor: null,
    clue: null,
    supplies: null,
    routeBlock: null,
  });

  const [objective, setObjective] = useState(
    "REACH THE FLOODED AREA"
  );

  const [distance, setDistance] = useState(0);
  const [canInteract, setCanInteract] = useState(false);
  const [interactLabel, setInteractLabel] =
    useState("APPROACH");

  const [dialogue, setDialogue] = useState(null);
  const [running, setRunning] = useState(false);

  const [stage, setStage] = useState(0);

  const missionTitle =
    mission?.title || "EVACUATION CENTER";

  const missionNumber =
    mission?.number || "01";

  const district =
    mission?.district || "DISTRICT 7";

  const characterName =
    activeCharacter?.name || "PLAYER";

  /* ========================================================
     MISSION POSITIONS
  ======================================================== */

  const ROUTE = {
    flood: new THREE.Vector3(0, 0, -18),
    survivor: new THREE.Vector3(5, 0, -38),
    clue: new THREE.Vector3(-5, 0, -52),
    sideStreet: new THREE.Vector3(7, 0, -72),
    supplies: new THREE.Vector3(-6, 0, -88),
    evacuation: new THREE.Vector3(0, 0, -122),
  };

  const stages = [
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

  /* ========================================================
     HELPERS
  ======================================================== */

  const makeMaterial = (
    color,
    options = {}
  ) => {
    return new THREE.MeshLambertMaterial({
      color,
      ...options,
    });
  };

  const createBox = (
    scene,
    width,
    height,
    depth,
    material,
    x,
    y,
    z
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),
      material
    );

    mesh.position.set(x, y, z);
    scene.add(mesh);

    return mesh;
  };

  /* ========================================================
     KEYBOARD
  ======================================================== */

  useEffect(() => {
    const down = (event) => {
      keysRef.current[event.code] = true;

      if (
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight"
      ) {
        playerRef.current.running = true;
        setRunning(true);
      }

      if (event.code === "KeyE") {
        window.dispatchEvent(
          new CustomEvent(
            "tatsulok-interact"
          )
        );
      }
    };

    const up = (event) => {
      keysRef.current[event.code] = false;

      if (
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight"
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

  /* ========================================================
     THREE WORLD
  ======================================================== */

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    const scene = new THREE.Scene();

    scene.background =
      new THREE.Color(0x182a35);

    scene.fog = new THREE.Fog(
      0x182a35,
      70,
      185
    );

    sceneRef.current = scene;

    /* CAMERA */

    const camera =
      new THREE.PerspectiveCamera(
        62,
        mount.clientWidth /
          mount.clientHeight,
        0.1,
        250
      );

    camera.position.set(
      0,
      4,
      18
    );

    cameraRef.current = camera;

    /* RENDERER */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: false,
        powerPreference:
          "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.25
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

    rendererRef.current = renderer;

    /* ======================================================
       MATERIALS
    ====================================================== */

    const groundMat =
      makeMaterial(0x676d6d);

    const roadMat =
      makeMaterial(0x202a2d);

    const sidewalkMat =
      makeMaterial(0x9a9b98);

    const concreteMat =
      makeMaterial(0x747a79);

    const darkConcrete =
      makeMaterial(0x444a4b);

    const brickMat =
      makeMaterial(0x80594a);

    const roofMat =
      makeMaterial(0x303637);

    const windowMat =
      makeMaterial(0x24566b, {
        emissive: 0x08242e,
      });

    const yellowMat =
      new THREE.MeshBasicMaterial({
        color: 0xffc52e,
      });

    const redMat =
      makeMaterial(0x8e2626);

    const woodMat =
      makeMaterial(0x714529);

    const greenMat =
      makeMaterial(0x245d3a);

    const waterMat =
      new THREE.MeshLambertMaterial({
        color: 0x245f76,
        transparent: true,
        opacity: 0.78,
      });

    /* ======================================================
       WORLD GROUND
    ====================================================== */

    createBox(
      scene,
      120,
      0.35,
      230,
      groundMat,
      0,
      -0.2,
      -55
    );

    /* ======================================================
       MAIN STREET
    ====================================================== */

    createBox(
      scene,
      20,
      0.12,
      210,
      roadMat,
      0,
      0,
      -55
    );

    createBox(
      scene,
      8,
      0.2,
      210,
      sidewalkMat,
      -14,
      0.1,
      -55
    );

    createBox(
      scene,
      8,
      0.2,
      210,
      sidewalkMat,
      14,
      0.1,
      -55
    );

    /* ROAD CENTER */

    for (
      let z = 12;
      z > -165;
      z -= 8
    ) {
      createBox(
        scene,
        0.18,
        0.035,
        3.5,
        yellowMat,
        0,
        0.08,
        z
      );
    }

    /* ======================================================
       SIDE ROADS
    ====================================================== */

    createBox(
      scene,
      42,
      0.12,
      12,
      roadMat,
      -18,
      0,
      -74
    );

    createBox(
      scene,
      38,
      0.12,
      12,
      roadMat,
      18,
      0,
      -101
    );

    /* ======================================================
       BUILDINGS
    ====================================================== */

    const createBuilding = ({
      x,
      z,
      width,
      depth,
      height,
      color,
    }) => {
      const body =
        createBox(
          scene,
          width,
          height,
          depth,
          makeMaterial(color),
          x,
          height / 2,
          z
        );

      body.userData.blocking = true;

      createBox(
        scene,
        width + 0.5,
        0.35,
        depth + 0.5,
        roofMat,
        x,
        height + 0.15,
        z
      );

      /* front windows */

      const frontZ =
        z + depth / 2 + 0.03;

      const columns =
        Math.max(
          2,
          Math.floor(width / 3)
        );

      const rows =
        Math.max(
          2,
          Math.floor(height / 3)
        );

      for (
        let row = 0;
        row < rows;
        row++
      ) {
        for (
          let col = 0;
          col < columns;
          col++
        ) {
          const wx =
            x -
            width / 2 +
            1.4 +
            col * 2.7;

          const wy =
            2 +
            row * 2.7;

          createBox(
            scene,
            1.15,
            1.1,
            0.08,
            windowMat,
            wx,
            wy,
            frontZ
          );
        }
      }
    };

    /* LEFT DISTRICT */

    createBuilding({
      x: -25,
      z: -5,
      width: 18,
      depth: 17,
      height: 14,
      color: 0x6e7372,
    });

    createBuilding({
      x: -25,
      z: -32,
      width: 16,
      depth: 16,
      height: 10,
      color: 0x825d4f,
    });

    createBuilding({
      x: -25,
      z: -58,
      width: 18,
      depth: 18,
      height: 15,
      color: 0x666c6b,
    });

    createBuilding({
      x: -25,
      z: -91,
      width: 17,
      depth: 17,
      height: 12,
      color: 0x7c6256,
    });

    createBuilding({
      x: -25,
      z: -122,
      width: 19,
      depth: 17,
      height: 14,
      color: 0x646b6b,
    });

    /* RIGHT DISTRICT */

    createBuilding({
      x: 25,
      z: -8,
      width: 18,
      depth: 18,
      height: 17,
      color: 0x60696b,
    });

    createBuilding({
      x: 25,
      z: -35,
      width: 17,
      depth: 17,
      height: 13,
      color: 0x78584c,
    });

    createBuilding({
      x: 25,
      z: -61,
      width: 18,
      depth: 18,
      height: 16,
      color: 0x696f6f,
    });

    createBuilding({
      x: 25,
      z: -92,
      width: 17,
      depth: 17,
      height: 11,
      color: 0x7b6155,
    });

    createBuilding({
      x: 25,
      z: -122,
      width: 20,
      depth: 18,
      height: 15,
      color: 0x626a6b,
    });

    /* ======================================================
       STREET POLES
    ====================================================== */

    for (
      let z = 8;
      z > -155;
      z -= 13
    ) {
      [-1, 1].forEach(
        (side) => {
          const x =
            side * 8.8;

          createBox(
            scene,
            0.12,
            5,
            0.12,
            darkConcrete,
            x,
            2.5,
            z
          );

          createBox(
            scene,
            0.55,
            0.18,
            0.55,
            yellowMat,
            x,
            5.05,
            z
          );
        }
      );
    }

    /* ======================================================
       PALM / TREES
    ====================================================== */

    const createTree = (
      x,
      z
    ) => {
      createBox(
        scene,
        0.45,
        4.5,
        0.45,
        woodMat,
        x,
        2.25,
        z
      );

      const crown =
        new THREE.Group();

      crown.position.set(
        x,
        5,
        z
      );

      scene.add(crown);

      for (
        let i = 0;
        i < 7;
        i++
      ) {
        const leaf =
          new THREE.Mesh(
            new THREE.ConeGeometry(
              0.7,
              3.2,
              5
            ),
            greenMat
          );

        leaf.rotation.z =
          Math.PI / 2.2;

        leaf.rotation.y =
          (Math.PI * 2 * i) /
          7;

        crown.add(leaf);
      }
    };

    createTree(-9, -14);
    createTree(9, -23);
    createTree(-9, -45);
    createTree(9, -51);
    createTree(-9, -78);
    createTree(9, -82);
    createTree(-9, -112);
    createTree(9, -116);

    /* ======================================================
       FLOODED AREA
    ====================================================== */

    const water =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          19,
          0.16,
          22
        ),
        waterMat
      );

    water.position.set(
      0,
      0.12,
      -20
    );

    scene.add(water);

    /* water debris */

    for (
      let i = 0;
      i < 12;
      i++
    ) {
      const debris =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.8 +
              Math.random(),
            0.22,
            0.4
          ),
          woodMat
        );

      debris.position.set(
        -8 +
          Math.random() * 16,
        0.35,
        -12 -
          Math.random() * 17
      );

      debris.rotation.y =
        Math.random() * Math.PI;

      scene.add(debris);
    }

    /* ======================================================
       SURVIVOR
    ====================================================== */

    const createNPC = (
      x,
      z
    ) => {
      const npc =
        new THREE.Group();

      npc.position.set(
        x,
        0,
        z
      );

      scene.add(npc);

      const body =
        new THREE.Mesh(
          new THREE.CapsuleGeometry(
            0.42,
            0.9,
            4,
            8
          ),
          makeMaterial(0x274a56)
        );

      body.position.y =
        1.0;

      npc.add(body);

      const head =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.42,
            10,
            8
          ),
          makeMaterial(0xc88b69)
        );

      head.position.y =
        2.05;

      npc.add(head);

      return npc;
    };

    const survivor =
      createNPC(
        5,
        -38
      );

    worldRef.current.survivor =
      survivor;

    /* ======================================================
       CLUE
    ====================================================== */

    const clue =
      new THREE.Group();

    clue.position.set(
      -5,
      0,
      -52
    );

    scene.add(clue);

    const clueBox =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.4,
          0.9,
          0.18
        ),
        yellowMat
      );

    clueBox.position.y =
      0.8;

    clue.add(clueBox);

    worldRef.current.clue =
      clue;

    /* ======================================================
       BLOCKADE
    ====================================================== */

    const blockade =
      new THREE.Group();

    blockade.position.set(
      0,
      0,
      -68
    );

    scene.add(blockade);

    createBox(
      blockade,
      14,
      1.0,
      0.4,
      redMat,
      0,
      1.0,
      0
    );

    createBox(
      blockade,
      0.3,
      2.5,
      0.3,
      darkConcrete,
      -6,
      1.25,
      0
    );

    createBox(
      blockade,
      0.3,
      2.5,
      0.3,
      darkConcrete,
      6,
      1.25,
      0
    );

    worldRef.current.routeBlock =
      blockade;

    /* ======================================================
       RELIEF SUPPLIES
    ====================================================== */

    const supplies =
      new THREE.Group();

    supplies.position.set(
      -6,
      0,
      -88
    );

    scene.add(supplies);

    for (
      let i = 0;
      i < 3;
      i++
    ) {
      createBox(
        supplies,
        1.1,
        0.8,
        1.0,
        woodMat,
        i * 1.15,
        0.4,
        0
      );
    }

    worldRef.current.supplies =
      supplies;

    /* ======================================================
       EVACUATION CENTER
    ====================================================== */

    const evac =
      new THREE.Group();

    evac.position.set(
      0,
      0,
      -122
    );

    scene.add(evac);

    createBox(
      evac,
      22,
      9,
      16,
      concreteMat,
      0,
      4.5,
      0
    );

    createBox(
      evac,
      23,
      0.4,
      17,
      roofMat,
      0,
      9.2,
      0
    );

    /* entrance */

    createBox(
      evac,
      5,
      5,
      0.25,
      darkConcrete,
      0,
      2.5,
      8.1
    );

    /* sign */

    createBox(
      evac,
      12,
      0.7,
      0.3,
      redMat,
      0,
      6.5,
      8.25
    );

    /* ======================================================
       OBJECTIVE MARKER
    ====================================================== */

    const marker =
      new THREE.Group();

    scene.add(marker);

    const markerDiamond =
      new THREE.Mesh(
        new THREE.OctahedronGeometry(
          0.75,
          0
        ),
        yellowMat
      );

    markerDiamond.position.y =
      6;

    marker.add(markerDiamond);

    const markerBeam =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.035,
          0.035,
          5,
          6
        ),
        yellowMat
      );

    markerBeam.position.y =
      3;

    marker.add(markerBeam);

    worldRef.current.objectiveMarker =
      marker;

    /* ======================================================
       LIGHTING
    ====================================================== */

    scene.add(
      new THREE.HemisphereLight(
        0xcee8ff,
        0x18211f,
        1.8
      )
    );

    const sun =
      new THREE.DirectionalLight(
        0xfff0d0,
        1.35
      );

    sun.position.set(
      -30,
      60,
      20
    );

    scene.add(sun);

    /* ======================================================
       PLAYER
    ====================================================== */

    const player =
      new THREE.Group();

    scene.add(player);

    playerGroupRef.current =
      player;

    /*
      Try loading the actual character GLB.
      If it doesn't exist, automatically use
      the lightweight fallback character.
    */

    const loader =
      new GLTFLoader();

    const modelPath =
      `/assets/models/${
        activeCharacter?.id ||
        "misteryo"
      }.glb`;

    loader.load(
      modelPath,
      (gltf) => {
        const model =
          gltf.scene;

        const box3 =
          new THREE.Box3()
            .setFromObject(model);

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

        const scale =
          2.15 / maxSize;

        model.scale.setScalar(
          scale
        );

        const normalized =
          new THREE.Box3()
            .setFromObject(model);

        const center =
          normalized.getCenter(
            new THREE.Vector3()
          );

        model.position.sub(
          center
        );

        model.position.y =
          1.05;

        player.add(model);
      },
      undefined,
      () => {
        createFallbackPlayer();
      }
    );

    function createFallbackPlayer() {
      if (
        player.children.length
      ) {
        return;
      }

      const faction =
        activeCharacter?.faction;

      const bodyColor =
        faction === "PANGINOON"
          ? 0x9e2525
          : faction === "MALAKAS"
          ? 0x20586a
          : 0x147c7c;

      const body =
        new THREE.Mesh(
          new THREE.CapsuleGeometry(
            0.42,
            1.0,
            4,
            8
          ),
          makeMaterial(bodyColor)
        );

      body.position.y =
        1.15;

      player.add(body);

      const head =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.43,
            10,
            8
          ),
          makeMaterial(0xc78966)
        );

      head.position.y =
        2.35;

      player.add(head);

      const legMaterial =
        makeMaterial(0x1b2022);

      const leftLeg =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.32,
            0.9,
            0.38
          ),
          legMaterial
        );

      leftLeg.position.set(
        -0.22,
        0.45,
        0
      );

      player.add(leftLeg);

      const rightLeg =
        leftLeg.clone();

      rightLeg.position.x =
        0.22;

      player.add(rightLeg);
    }

    /* ======================================================
       COLLISION SYSTEM
    ====================================================== */

    const collisionBoxes = [];

    const addCollision = (
      x,
      z,
      width,
      depth
    ) => {
      collisionBoxes.push({
        x,
        z,
        halfW:
          width / 2,
        halfD:
          depth / 2,
      });
    };

    /*
      Building collision zones.
    */

    addCollision(
      -25,
      -5,
      18,
      17
    );

    addCollision(
      25,
      -8,
      18,
      18
    );

    addCollision(
      -25,
      -32,
      16,
      16
    );

    addCollision(
      25,
      -35,
      17,
      17
    );

    addCollision(
      -25,
      -58,
      18,
      18
    );

    addCollision(
      25,
      -61,
      18,
      18
    );

    addCollision(
      -25,
      -91,
      17,
      17
    );

    addCollision(
      25,
      -92,
      17,
      17
    );

    addCollision(
      -25,
      -122,
      19,
      17
    );

    addCollision(
      25,
      -122,
      20,
      18
    );

    const isBlocked = (
      x,
      z
    ) => {
      const radius =
        0.65;

      /*
        World boundaries
      */

      if (
        x < -8.9 ||
        x > 8.9
      ) {
        /*
          allow side streets
        */

        if (
          z > -79 &&
          z < -69
        ) {
          return false;
        }

        if (
          z > -106 &&
          z < -96
        ) {
          return false;
        }

        return true;
      }

      /*
        Building collision
      */

      for (
        const box of collisionBoxes
      ) {
        if (
          x >
            box.x -
              box.halfW -
              radius &&
          x <
            box.x +
              box.halfW +
              radius &&
          z >
            box.z -
              box.halfD -
              radius &&
          z <
            box.z +
              box.halfD +
              radius
        ) {
          return true;
        }
      }

      /*
        Blockade
      */

      if (
        z < -67 &&
        z > -70 &&
        Math.abs(x) < 6.8
      ) {
        return true;
      }

      /*
        Evacuation building
      */

      if (
        z < -114 &&
        Math.abs(x) < 10
      ) {
        /*
          entrance opening
        */

        if (
          Math.abs(x) > 2.8
        ) {
          return true;
        }
      }

      return false;
    };

    /* ======================================================
       SMOOTH MOVEMENT
    ====================================================== */

    const getInput = () => {
      let x = 0;
      let y = 0;

      const keys =
        keysRef.current;

      if (
        keys.KeyA ||
        keys.ArrowLeft
      ) {
        x -= 1;
      }

      if (
        keys.KeyD ||
        keys.ArrowRight
      ) {
        x += 1;
      }

      if (
        keys.KeyW ||
        keys.ArrowUp
      ) {
        y += 1;
      }

      if (
        keys.KeyS ||
        keys.ArrowDown
      ) {
        y -= 1;
      }

      /*
        Mobile joystick.

        Dead zone:
        tiny accidental movements
        do not move the player.

        Curve:
        low joystick movement =
        slow movement.

        This is the important part
        that fixes the "sobrang bilis"
        problem.
      */

      const joy =
        joystickRef.current;

      const magnitude =
        Math.sqrt(
          joy.x * joy.x +
            joy.y * joy.y
        );

      if (
        magnitude > 0.12
      ) {
        const deadZone =
          0.12;

        const normalized =
          Math.min(
            1,
            (magnitude -
              deadZone) /
              (1 -
                deadZone)
          );

        const curved =
          normalized *
          normalized *
          (3 -
            2 *
              normalized);

        x +=
          (joy.x /
            magnitude) *
          curved;

        y +=
          (-joy.y /
            magnitude) *
          curved;
      }

      const length =
        Math.sqrt(
          x * x +
            y * y
        );

      if (length > 1) {
        x /= length;
        y /= length;
      }

      return {
        x,
        y,
        active:
          Math.abs(x) >
            0.015 ||
          Math.abs(y) >
            0.015,
      };
    };

    /* ======================================================
       MISSION UPDATE
    ====================================================== */

    let currentStage = 0;
    let lastDistance = -1;

    const updateMission =
      (playerPosition) => {
        const current =
          stages[currentStage];

        if (!current) return;

        const dx =
          current.position.x -
          playerPosition.x;

        const dz =
          current.position.z -
          playerPosition.z;

        const meters =
          Math.max(
            0,
            Math.round(
              Math.sqrt(
                dx * dx +
                  dz * dz
              )
            )
          );

        if (
          meters !==
          lastDistance
        ) {
          lastDistance =
            meters;

          setDistance(
            meters
          );
        }

        /*
          FLOOD
        */

        if (
          currentStage === 0 &&
          meters <= 6
        ) {
          currentStage = 1;

          setStage(1);

          setObjective(
            stages[1].name
          );

          lastDistance = -1;
        }

        /*
          SURVIVOR
        */

        if (
          currentStage === 1 &&
          Math.abs(
            playerPosition.x -
              ROUTE.survivor.x
          ) < 3 &&
          Math.abs(
            playerPosition.z -
              ROUTE.survivor.z
          ) < 3
        ) {
          setCanInteract(true);
          setInteractLabel(
            "TALK"
          );
        } else if (
          currentStage === 1
        ) {
          setCanInteract(false);
          setInteractLabel(
            "APPROACH"
          );
        }

        /*
          CLUE
        */

        if (
          currentStage === 2 &&
          Math.abs(
            playerPosition.x -
              ROUTE.clue.x
          ) < 3 &&
          Math.abs(
            playerPosition.z -
              ROUTE.clue.z
          ) < 3
        ) {
          setCanInteract(true);
          setInteractLabel(
            "INVESTIGATE"
          );
        } else if (
          currentStage === 2
        ) {
          setCanInteract(false);
          setInteractLabel(
            "APPROACH"
          );
        }

        /*
          SIDE STREET
        */

        if (
          currentStage === 3 &&
          playerPosition.z <
            -72
        ) {
          currentStage = 4;

          setStage(4);

          setObjective(
            stages[4].name
          );

          lastDistance = -1;
        }

        /*
          SUPPLIES
        */

        if (
          currentStage === 4 &&
          Math.abs(
            playerPosition.x -
              ROUTE.supplies.x
          ) < 3 &&
          Math.abs(
            playerPosition.z -
              ROUTE.supplies.z
          ) < 3
        ) {
          setCanInteract(true);
          setInteractLabel(
            "COLLECT"
          );
        } else if (
          currentStage === 4
        ) {
          setCanInteract(false);
          setInteractLabel(
            "APPROACH"
          );
        }

        /*
          EVACUATION
        */

        if (
          currentStage === 5 &&
          Math.abs(
            playerPosition.x -
              ROUTE.evacuation.x
          ) < 5 &&
          Math.abs(
            playerPosition.z -
              ROUTE.evacuation.z
          ) < 7
        ) {
          setCanInteract(true);
          setInteractLabel(
            "INTERACT"
          );
        } else if (
          currentStage === 5
        ) {
          setCanInteract(false);
          setInteractLabel(
            "APPROACH"
          );
        }

        /*
          Move from clue to
          alternate route after
          interaction.
        */

        if (
          currentStage === 2 &&
          playerPosition.z <
            -57
        ) {
          currentStage = 3;

          setStage(3);

          setObjective(
            stages[3].name
          );

          setCanInteract(false);

          lastDistance = -1;
        }
      };

    /* ======================================================
       INTERACTION
    ====================================================== */

    const interact =
      () => {
        const p =
          playerRef.current
            .position;

        /*
          SURVIVOR
        */

        if (
          currentStage === 1 &&
          Math.abs(
            p.x -
              ROUTE.survivor.x
          ) < 3 &&
          Math.abs(
            p.z -
              ROUTE.survivor.z
          ) < 3
        ) {
          setDialogue({
            type: "survivor",
            title:
              "SURVIVOR",
            text:
              "Tulungan mo kami. Maraming residente ang naiwan dahil mabilis na tumaas ang tubig.",
          });

          return;
        }

        /*
          CLUE
        */

        if (
          currentStage === 2 &&
          Math.abs(
            p.x -
              ROUTE.clue.x
          ) < 3 &&
          Math.abs(
            p.z -
              ROUTE.clue.z
          ) < 3
        ) {
          setDialogue({
            type: "clue",
            title:
              "DAMAGED REPORT",
            text:
              "May report tungkol sa paglikas ng mga residente. Ang evacuation center ay nasa kabilang bahagi ng district.",
          });

          return;
        }

        /*
          SUPPLIES
        */

        if (
          currentStage === 4 &&
          Math.abs(
            p.x -
              ROUTE.supplies.x
          ) < 3 &&
          Math.abs(
            p.z -
              ROUTE.supplies.z
          ) < 3
        ) {
          setDialogue({
            type: "supplies",
            title:
              "RELIEF SUPPLIES",
            text:
              "Nakuha mo ang mga relief supplies. Dalhin ang mga ito sa evacuation center.",
          });

          return;
        }

        /*
          EVAC CENTER
        */

        if (
          currentStage === 5 &&
          Math.abs(
            p.x -
              ROUTE.evacuation.x
          ) < 5 &&
          Math.abs(
            p.z -
              ROUTE.evacuation.z
          ) < 7
        ) {
          setDialogue({
            type: "complete",
            title:
              "EVACUATION CENTER",
            text:
              "Nakarating ka sa evacuation center. Handa na ang mga residente para sa susunod na hakbang.",
          });
        }
      };

    window.addEventListener(
      "tatsulok-interact",
      interact
    );

    /* ======================================================
       GAME LOOP
    ====================================================== */

    const clock =
      clockRef.current;

    const animate = () => {
      frameRef.current =
        requestAnimationFrame(
          animate
        );

      const delta =
        Math.min(
          clock.getDelta(),
          0.033
        );

      const p =
        playerRef.current;

      const input =
        getInput();

      /*
        Movement speeds are deliberately
        controlled for mobile.
      */

      const walkSpeed =
        4.0;

      const runSpeed =
        6.4;

      const targetSpeed =
        p.running
          ? runSpeed
          : walkSpeed;

      const targetVelocity =
        new THREE.Vector3(
          input.x *
            targetSpeed,
          0,
          input.y *
            targetSpeed
        );

      /*
        Smooth acceleration.
      */

      p.velocity.lerp(
        targetVelocity,
        1 -
          Math.pow(
            0.001,
            delta
          )
      );

      /*
        Stop cleanly.
      */

      if (!input.active) {
        p.velocity.multiplyScalar(
          Math.pow(
            0.001,
            delta
          )
        );
      }

      /*
        Camera-relative movement.
      */

      const forward =
        new THREE.Vector3(
          -Math.sin(
            p.cameraYaw
          ),
          0,
          -Math.cos(
            p.cameraYaw
          )
        );

      const right =
        new THREE.Vector3(
          Math.cos(
            p.cameraYaw
          ),
          0,
          -Math.sin(
            p.cameraYaw
          )
        );

      const movement =
        new THREE.Vector3();

      movement.addScaledVector(
        right,
        input.x
      );

      movement.addScaledVector(
        forward,
        input.y
      );

      if (
        movement.lengthSq() >
        0.0001
      ) {
        movement.normalize();

        const velocity =
          movement.multiplyScalar(
            targetSpeed
          );

        p.velocity.lerp(
          velocity,
          1 -
            Math.pow(
              0.0001,
              delta
            )
        );
      }

      const nextX =
        p.position.x +
        p.velocity.x *
          delta;

      const nextZ =
        p.position.z +
        p.velocity.z *
          delta;

      /*
        Axis-separated collision.
        This prevents the player from
        getting stuck against corners.
      */

      if (
        !isBlocked(
          nextX,
          p.position.z
        )
      ) {
        p.position.x =
          nextX;
      } else {
        p.velocity.x = 0;
      }

      if (
        !isBlocked(
          p.position.x,
          nextZ
        )
      ) {
        p.position.z =
          nextZ;
      } else {
        p.velocity.z = 0;
      }

      /*
        Character position.
      */

      if (
        playerGroupRef.current
      ) {
        playerGroupRef.current.position.copy(
          p.position
        );

        /*
          Character faces direction
          of movement.
        */

        if (
          p.velocity.lengthSq() >
          0.08
        ) {
          const targetYaw =
            Math.atan2(
              p.velocity.x,
              p.velocity.z
            );

          let diff =
            targetYaw -
            playerGroupRef.current
              .rotation.y;

          diff =
            Math.atan2(
              Math.sin(diff),
              Math.cos(diff)
            );

          playerGroupRef.current.rotation.y +=
            diff *
            Math.min(
              1,
              delta * 10
            );
        }

        /*
          Simple walking animation
          for fallback character.
        */

        const walkTime =
          performance.now() *
          (p.running
            ? 0.018
            : 0.013);

        playerGroupRef.current
          .children.forEach(
            (child, index) => {
              if (
                child.isMesh &&
                child.position.y <
                  0.9
              ) {
                child.rotation.x =
                  Math.sin(
                    walkTime
                  ) * 0.15;
              }
            }
          );
      }

      /* ====================================================
         THIRD-PERSON CAMERA
      ==================================================== */

      const cameraDistance =
        7.2;

      const horizontal =
        Math.cos(
          p.cameraPitch
        ) *
        cameraDistance;

      const desiredCamera =
        new THREE.Vector3(
          p.position.x +
            Math.sin(
              p.cameraYaw
            ) *
              horizontal,

          p.position.y +
            2.8 +
            Math.sin(
              p.cameraPitch
            ) *
              cameraDistance,

          p.position.z +
            Math.cos(
              p.cameraYaw
            ) *
              horizontal
        );

      /*
        Camera collision:
        prevents camera from going
        inside buildings.
      */

      const rayOrigin =
        p.position.clone();

      rayOrigin.y +=
        2.0;

      const rayDirection =
        desiredCamera
          .clone()
          .sub(rayOrigin)
          .normalize();

      const raycaster =
        new THREE.Raycaster(
          rayOrigin,
          rayDirection,
          0.1,
          cameraDistance
        );

      const objects =
        scene.children.filter(
          (obj) =>
            obj !==
              playerGroupRef.current &&
            obj.visible
        );

      const hits =
        raycaster.intersectObjects(
          objects,
          true
        );

      let finalCamera =
        desiredCamera;

      if (
        hits.length > 0 &&
        hits[0].distance <
          cameraDistance
      ) {
        finalCamera =
          rayOrigin
            .clone()
            .add(
              rayDirection.multiplyScalar(
                Math.max(
                  1.8,
                  hits[0]
                    .distance -
                    0.35
                )
              )
            );
      }

      camera.position.lerp(
        finalCamera,
        1 -
          Math.pow(
            0.0001,
            delta
          )
      );

      const lookTarget =
        p.position.clone();

      lookTarget.y +=
        1.45;

      camera.lookAt(
        lookTarget
      );

      /* ====================================================
         OBJECTIVE MARKER
      ==================================================== */

      const current =
        stages[currentStage];

      if (
        current &&
        worldRef.current
          .objectiveMarker
      ) {
        const marker =
          worldRef.current
            .objectiveMarker;

        marker.position.copy(
          current.position
        );

        marker.position.y =
          0;

        marker.children[0]
          .rotation.y +=
          delta * 2.2;

        marker.children[0]
          .position.y =
          5.6 +
          Math.sin(
            performance.now() *
              0.003
          ) *
            0.35;
      }

      /* ====================================================
         NPC ANIMATION
      ==================================================== */

      if (
        worldRef.current
          .survivor
      ) {
        worldRef.current
          .survivor.rotation.y =
          Math.sin(
            performance.now() *
              0.0008
          ) * 0.12;
      }

      /* ====================================================
         CLUE ANIMATION
      ==================================================== */

      if (
        worldRef.current.clue
      ) {
        worldRef.current.clue.rotation.y +=
          delta * 1.3;

        worldRef.current.clue.position.y =
          Math.sin(
            performance.now() *
              0.002
          ) *
          0.12;
      }

      /* ====================================================
         MISSION
      ==================================================== */

      updateMission(
        p.position
      );

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    /* ======================================================
       RESIZE
    ====================================================== */

    const resize = () => {
      const width =
        mount.clientWidth;

      const height =
        mount.clientHeight;

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

    /* ======================================================
       CLEANUP
    ====================================================== */

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
        interact
      );

      renderer.dispose();

      if (
        renderer.domElement.parentNode
      ) {
        renderer.domElement.parentNode.removeChild(
          renderer.domElement
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
    };
  }, [activeCharacter]);

  /* ========================================================
     MOBILE JOYSTICK
  ======================================================== */

  const joystickPointerDown = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const joystick =
      event.currentTarget;

    joystickRef.current.active =
      true;

    joystickRef.current.pointerId =
      event.pointerId;

    joystick.setPointerCapture(
      event.pointerId
    );

    updateJoystick(
      event,
      joystick
    );
  };

  const joystickPointerMove = (
    event
  ) => {
    if (
      !joystickRef.current.active ||
      joystickRef.current.pointerId !==
        event.pointerId
    ) {
      return;
    }

    event.preventDefault();

    updateJoystick(
      event,
      event.currentTarget
    );
  };

  const joystickPointerUp = (
    event
  ) => {
    if (
      joystickRef.current.pointerId !==
      event.pointerId
    ) {
      return;
    }

    joystickRef.current.active =
      false;

    joystickRef.current.pointerId =
      null;

    joystickRef.current.x = 0;
    joystickRef.current.y = 0;
  };

  const updateJoystick = (
    event,
    element
  ) => {
    const rect =
      element.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height / 2;

    /*
      Use actual touch position
      relative to joystick center.
    */

    let x =
      (event.clientX -
        centerX) /
      (rect.width / 2);

    let y =
      (event.clientY -
        centerY) /
      (rect.height / 2);

    const length =
      Math.sqrt(
        x * x +
          y * y
      );

    if (length > 1) {
      x /= length;
      y /= length;
    }

    /*
      Slight response reduction
      prevents hyper-sensitive movement.
    */

    const sensitivity =
      0.82;

    joystickRef.current.x =
      x * sensitivity;

    joystickRef.current.y =
      y * sensitivity;
  };

  /* ========================================================
     CAMERA TOUCH
  ======================================================== */

  const lookPointerDown = (
    event
  ) => {
    if (
      event.target.closest(
        ".td-controls"
      ) ||
      event.target.closest(
        ".td-back"
      ) ||
      event.target.closest(
        ".td-dialogue"
      )
    ) {
      return;
    }

    lookRef.current.active =
      true;

    lookRef.current.pointerId =
      event.pointerId;

    lookRef.current.x =
      event.clientX;

    lookRef.current.y =
      event.clientY;
  };

  const lookPointerMove = (
    event
  ) => {
    if (
      !lookRef.current.active ||
      lookRef.current.pointerId !==
        event.pointerId
    ) {
      return;
    }

    const dx =
      event.clientX -
      lookRef.current.x;

    const dy =
      event.clientY -
      lookRef.current.y;

    lookRef.current.x =
      event.clientX;

    lookRef.current.y =
      event.clientY;

    const p =
      playerRef.current;

    /*
      Controlled camera sensitivity.
    */

    p.cameraYaw -=
      dx * 0.0038;

    p.cameraPitch =
      THREE.MathUtils.clamp(
        p.cameraPitch +
          dy * 0.0022,
        0.18,
        0.72
      );
  };

  const lookPointerUp = (
    event
  ) => {
    if (
      lookRef.current.pointerId !==
      event.pointerId
    ) {
      return;
    }

    lookRef.current.active =
      false;

    lookRef.current.pointerId =
      null;
  };

  /* ========================================================
     RUN
  ======================================================== */

  const startRun = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    playerRef.current.running =
      true;

    setRunning(true);
  };

  const stopRun = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    playerRef.current.running =
      false;

    setRunning(false);
  };

  /* ========================================================
     DIALOGUE
  ======================================================== */

  const continueDialogue = () => {
    if (!dialogue) return;

    if (
      dialogue.type ===
      "survivor"
    ) {
      setDialogue(null);

      setStage(2);

      setObjective(
        stages[2].name
      );

      setCanInteract(false);

      return;
    }

    if (
      dialogue.type ===
      "clue"
    ) {
      setDialogue(null);

      setStage(3);

      setObjective(
        stages[3].name
      );

      setCanInteract(false);

      return;
    }

    if (
      dialogue.type ===
      "supplies"
    ) {
      setDialogue(null);

      setStage(5);

      setObjective(
        stages[5].name
      );

      setCanInteract(false);

      return;
    }

    if (
      dialogue.type ===
      "complete"
    ) {
      setDialogue(null);

      if (onComplete) {
        onComplete({
          mission,
          character:
            activeCharacter,
          result:
            "EVACUATION_CENTER_REACHED",
        });
      }
    }
  };

  /* ========================================================
     JSX
  ======================================================== */

  return (
    <div
      ref={mountRef}
      className="tatsulok-district"
      onPointerDown={
        lookPointerDown
      }
      onPointerMove={
        lookPointerMove
      }
      onPointerUp={
        lookPointerUp
      }
      onPointerCancel={
        lookPointerUp
      }
    >
      <style>{`
        .tatsulok-district {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: #182a35;
          color: white;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }

        .tatsulok-district canvas {
          position: absolute;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        /* ================================
           HUD
        ================================= */

        .td-hud {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
        }

        .td-top {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          text-shadow:
            0 3px 8px rgba(0,0,0,.8);
        }

        .td-mission-number {
          color: #ffd43b;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 4px;
        }

        .td-title {
          margin-top: 3px;
          font-size: clamp(25px,4vw,47px);
          font-weight: 950;
          line-height: 1;
          white-space: nowrap;
        }

        .td-district {
          margin-top: 7px;
          opacity: .8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .td-back {
          position: absolute;
          top: 22px;
          left: 22px;
          width: 125px;
          height: 50px;
          pointer-events: auto;
          cursor: pointer;
          color: white;
          background: rgba(0,0,0,.58);
          border: 1px solid rgba(255,255,255,.4);
          font-size: 14px;
          font-weight: 900;
          backdrop-filter: blur(6px);
        }

        .td-objective {
          position: absolute;
          top: 22px;
          right: 22px;
          width: 205px;
          min-height: 86px;
          padding: 12px 14px;
          box-sizing: border-box;
          text-align: center;
          background: rgba(0,0,0,.58);
          border: 1px solid rgba(255,212,59,.7);
          backdrop-filter: blur(6px);
        }

        .td-objective-label {
          color: #ffd43b;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .td-objective-name {
          margin-top: 5px;
          font-size: 11px;
          line-height: 1.25;
          font-weight: 900;
        }

        .td-distance {
          margin-top: 3px;
          font-size: 27px;
          font-weight: 950;
        }

        /* ================================
           WORLD MARKER HUD
        ================================= */

        .td-world-info {
          position: absolute;
          left: 50%;
          bottom: 108px;
          transform: translateX(-50%);
          padding: 9px 18px;
          min-width: 190px;
          text-align: center;
          background: rgba(0,0,0,.54);
          border: 1px solid rgba(255,212,59,.55);
          pointer-events: none;
          text-shadow: 0 2px 5px black;
        }

        .td-world-marker {
          width: 17px;
          height: 17px;
          margin: 0 auto 8px;
          transform: rotate(45deg);
          background: #ffd43b;
          box-shadow:
            0 0 18px rgba(255,212,59,.8);
        }

        .td-world-name {
          font-size: 12px;
          font-weight: 950;
        }

        /* ================================
           CONTROLS
        ================================= */

        .td-controls {
          position: absolute;
          inset: 0;
          z-index: 50;
          pointer-events: none;
        }

        .td-joystick {
          position: absolute;
          left: 24px;
          bottom: 25px;
          width: 142px;
          height: 142px;
          border-radius: 50%;
          pointer-events: auto;
          background: rgba(0,0,0,.25);
          border: 1px solid rgba(255,255,255,.28);
          box-shadow:
            inset 0 0 30px rgba(0,0,0,.2);
        }

        .td-joystick-inner {
          position: absolute;
          inset: 17px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.15);
          pointer-events: none;
        }

        .td-knob {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 55px;
          height: 55px;
          transform: translate(-50%,-50%);
          border-radius: 50%;
          background: rgba(210,220,225,.32);
          border: 1px solid rgba(255,255,255,.5);
          box-shadow:
            0 5px 15px rgba(0,0,0,.3);
          pointer-events: none;
        }

        .td-joystick-label {
          position: absolute;
          left: 50%;
          bottom: -21px;
          transform: translateX(-50%);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          opacity: .55;
          pointer-events: none;
        }

        .td-actions {
          position: absolute;
          right: 25px;
          bottom: 25px;
          display: flex;
          gap: 9px;
          align-items: flex-end;
          pointer-events: auto;
        }

        .td-action {
          height: 57px;
          min-width: 78px;
          padding: 0 14px;
          color: white;
          background: rgba(0,0,0,.58);
          border: 1px solid rgba(255,255,255,.35);
          font-size: 10px;
          font-weight: 950;
          cursor: pointer;
          touch-action: manipulation;
        }

        .td-run {
          border-color: #ffd43b;
        }

        .td-interact {
          min-width: 130px;
          color: #ffd43b;
          border-color: #ffd43b;
          opacity: .5;
        }

        .td-interact.ready {
          opacity: 1;
          background: rgba(62,48,5,.85);
          box-shadow:
            0 0 20px rgba(255,212,59,.16);
        }

        /* ================================
           DIALOGUE
        ================================= */

        .td-dialogue {
          position: absolute;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 22px;
          box-sizing: border-box;
          background: rgba(0,0,0,.5);
          pointer-events: auto;
        }

        .td-dialogue-box {
          width: min(850px,94vw);
          padding: 25px;
          box-sizing: border-box;
          background: rgba(5,8,9,.97);
          border: 1px solid #ffd43b;
          box-shadow:
            0 20px 70px rgba(0,0,0,.7);
        }

        .td-dialogue-label {
          color: #ffd43b;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 4px;
        }

        .td-dialogue-title {
          margin-top: 7px;
          font-size: 27px;
          font-weight: 950;
        }

        .td-dialogue-text {
          margin-top: 12px;
          color: #cbd0cf;
          font-size: 15px;
          line-height: 1.55;
        }

        .td-dialogue-button {
          width: 100%;
          height: 54px;
          margin-top: 20px;
          border: 0;
          background: #ffd43b;
          color: #111;
          font-weight: 950;
          cursor: pointer;
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 800px) {
          .td-top {
            top: 11px;
          }

          .td-mission-number {
            font-size: 8px;
          }

          .td-title {
            font-size: 22px;
          }

          .td-district {
            margin-top: 4px;
            font-size: 8px;
            letter-spacing: 3px;
          }

          .td-back {
            top: 12px;
            left: 12px;
            width: 90px;
            height: 42px;
            font-size: 11px;
          }

          .td-objective {
            top: 12px;
            right: 12px;
            width: 135px;
            min-height: 70px;
            padding: 8px;
          }

          .td-objective-label {
            font-size: 7px;
          }

          .td-objective-name {
            font-size: 8px;
          }

          .td-distance {
            font-size: 21px;
          }

          .td-world-info {
            bottom: 145px;
            min-width: 165px;
            padding: 8px 13px;
          }

          .td-world-name {
            font-size: 10px;
          }

          .td-joystick {
            left: 14px;
            bottom: 16px;
            width: 128px;
            height: 128px;
          }

          .td-actions {
            right: 14px;
            bottom: 16px;
            gap: 6px;
          }

          .td-action {
            height: 50px;
            min-width: 62px;
            padding: 0 9px;
            font-size: 8px;
          }

          .td-interact {
            min-width: 95px;
          }

          .td-dialogue {
            padding: 12px;
          }

          .td-dialogue-box {
            padding: 19px;
          }

          .td-dialogue-title {
            font-size: 21px;
          }

          .td-dialogue-text {
            font-size: 13px;
          }
        }
      `}</style>

      {/* ====================================================
          HUD
      ==================================================== */}

      <div className="td-hud">
        <div className="td-top">
          <div className="td-mission-number">
            MISSION {missionNumber}
          </div>

          <div className="td-title">
            {missionTitle}
          </div>

          <div className="td-district">
            {district}
          </div>
        </div>

        <button
          className="td-back"
          onClick={onExit}
        >
          ← BACK
        </button>

        <div className="td-objective">
          <div className="td-objective-label">
            OBJECTIVE
          </div>

          <div className="td-objective-name">
            {objective}
          </div>

          <div className="td-distance">
            {distance}m
          </div>
        </div>

        <div className="td-world-info">
          <div className="td-world-marker" />
          <div className="td-world-name">
            {objective}
          </div>
        </div>
      </div>

      {/* ====================================================
          CONTROLS
      ==================================================== */}

      <div className="td-controls">
        <div
          className="td-joystick"
          onPointerDown={
            joystickPointerDown
          }
          onPointerMove={
            joystickPointerMove
          }
          onPointerUp={
            joystickPointerUp
          }
          onPointerCancel={
            joystickPointerUp
          }
        >
          <div className="td-joystick-inner" />

          <div className="td-knob" />

          <div className="td-joystick-label">
            MOVE
          </div>
        </div>

        <div className="td-actions">
          <button
            className="td-action td-run"
            onPointerDown={
              startRun
            }
            onPointerUp={
              stopRun
            }
            onPointerCancel={
              stopRun
            }
            onPointerLeave={
              stopRun
            }
          >
            {running
              ? "RUNNING"
              : "RUN"}
          </button>

          <button
            className={
              "td-action td-interact " +
              (canInteract
                ? "ready"
                : "")
            }
            disabled={
              !canInteract
            }
            onClick={() => {
              if (
                canInteract
              ) {
                window.dispatchEvent(
                  new CustomEvent(
                    "tatsulok-interact"
                  )
                );
              }
            }}
          >
            {canInteract
              ? interactLabel
              : "APPROACH"}
          </button>
        </div>
      </div>

      {/* ====================================================
          DIALOGUE
      ==================================================== */}

      {dialogue && (
        <div className="td-dialogue">
          <div className="td-dialogue-box">
            <div className="td-dialogue-label">
              {dialogue.type ===
              "survivor"
                ? "SURVIVOR"
                : dialogue.type ===
                  "clue"
                ? "INVESTIGATION"
                : dialogue.type ===
                  "supplies"
                ? "RELIEF SUPPLIES"
                : "MISSION"}
            </div>

            <div className="td-dialogue-title">
              {dialogue.title}
            </div>

            <div className="td-dialogue-text">
              {dialogue.text}
            </div>

            <button
              className="td-dialogue-button"
              onClick={
                continueDialogue
              }
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
