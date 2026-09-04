import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/*
TATSULOK — DISTRICT 3D
Roblox-style third-person mission district

MISSION 01 FLOW:
START
 ↓
Residential street
 ↓
Flooded road
 ↓
Resident NPC
 ↓
Investigate clue
 ↓
Blocked street
 ↓
Alternate route
 ↓
Evacuation Center
 ↓
INTERACT

DESKTOP:
WASD / ARROWS = Move
SHIFT = Run
Mouse drag = Camera

MOBILE / IPAD:
Left joystick = Move
Drag right side = Camera
RUN = Run
INTERACT = Interact
*/

export default function District3D({
  mission,
  activeCharacter,
  onExit,
  onComplete,
}) {
  const mountRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  const playerRef = useRef({
    x: 0,
    z: 8,
    yaw: 0,
    cameraYaw: 0,
    cameraPitch: 0.38,
    speed: 4.8,
    running: false,
  });

  const keysRef = useRef({});
  const joystickRef = useRef({
    active: false,
    x: 0,
    y: 0,
  });

  const lookRef = useRef({
    active: false,
    x: 0,
    y: 0,
  });

  const avatarRef = useRef(null);
  const animationRef = useRef(null);

  const [distance, setDistance] = useState(0);
  const [objective, setObjective] = useState(
    "REACH THE FLOODED STREET"
  );
  const [interactText, setInteractText] =
    useState("");
  const [canInteract, setCanInteract] =
    useState(false);

  const [dialogue, setDialogue] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [running, setRunning] = useState(false);

  const missionTitle =
    mission?.title || "EVACUATION CENTER";

  const missionNumber =
    mission?.number || "01";

  const district =
    mission?.district || "DISTRICT 7";

  const characterName =
    activeCharacter?.name || "PLAYER";

  /* =========================================================
     KEYBOARD
  ========================================================= */

  useEffect(() => {
    const down = (e) => {
      keysRef.current[e.code] = true;

      if (
        e.code === "ShiftLeft" ||
        e.code === "ShiftRight"
      ) {
        setRunning(true);
        playerRef.current.running = true;
      }

      if (
        e.code === "KeyE" ||
        e.code === "Enter"
      ) {
        window.dispatchEvent(
          new CustomEvent("tatsulok-interact")
        );
      }
    };

    const up = (e) => {
      keysRef.current[e.code] = false;

      if (
        e.code === "ShiftLeft" ||
        e.code === "ShiftRight"
      ) {
        setRunning(false);
        playerRef.current.running = false;
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  /* =========================================================
     THREE WORLD
  ========================================================= */

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    scene.background =
      new THREE.Color(0x8ed8ff);

    scene.fog = new THREE.Fog(
      0x8ed8ff,
      70,
      190
    );

    sceneRef.current = scene;

    /* CAMERA */

    const camera =
      new THREE.PerspectiveCamera(
        65,
        mount.clientWidth /
          mount.clientHeight,
        0.1,
        300
      );

    camera.position.set(
      0,
      5,
      13
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
        1.35
      )
    );

    renderer.setSize(
      mount.clientWidth,
      mount.clientHeight,
      false
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    mount.appendChild(
      renderer.domElement
    );

    rendererRef.current = renderer;

    /* =======================================================
       MATERIALS
    ======================================================= */

    const mat = (color) =>
      new THREE.MeshLambertMaterial({
        color,
      });

    const groundMat = mat(0xc7c7bf);
    const roadMat = mat(0x182d3d);
    const sidewalkMat = mat(0xd9d9d2);
    const buildingMat = mat(0xe0e1dc);
    const buildingDark = mat(0x8e969b);
    const brickMat = mat(0xb9795e);
    const roofMat = mat(0x53616a);
    const glassMat =
      new THREE.MeshLambertMaterial({
        color: 0x197fd0,
        emissive: 0x063b70,
      });

    const woodMat = mat(0x8c4c24);
    const treeMat = mat(0x08732c);
    const trunkMat = mat(0x6a3e1f);
    const yellowMat =
      new THREE.MeshBasicMaterial({
        color: 0xffc83d,
      });

    const redMat =
      new THREE.MeshBasicMaterial({
        color: 0xd92727,
      });

    const whiteMat = mat(0xffffff);

    /* =======================================================
       HELPERS
    ======================================================= */

    const box = (
      w,
      h,
      d,
      material,
      x,
      y,
      z
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(
          w,
          h,
          d
        ),
        material
      );

      mesh.position.set(
        x,
        y,
        z
      );

      scene.add(mesh);

      return mesh;
    };

    const cylinder = (
      radius,
      height,
      material,
      x,
      y,
      z
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          radius,
          radius,
          height,
          8
        ),
        material
      );

      mesh.position.set(
        x,
        y,
        z
      );

      scene.add(mesh);

      return mesh;
    };

    /* =======================================================
       GROUND
    ======================================================= */

    box(
      130,
      0.3,
      220,
      groundMat,
      0,
      -0.15,
      -70
    );

    /* =======================================================
       MAIN ROAD
    ======================================================= */

    box(
      18,
      0.12,
      210,
      roadMat,
      0,
      0,
      -70
    );

    /* SIDEWALKS */

    box(
      8,
      0.25,
      210,
      sidewalkMat,
      -13,
      0.1,
      -70
    );

    box(
      8,
      0.25,
      210,
      sidewalkMat,
      13,
      0.1,
      -70
    );

    /* ROAD MARKINGS */

    for (
      let z = 5;
      z > -175;
      z -= 8
    ) {
      box(
        0.18,
        0.03,
        3.5,
        yellowMat,
        0,
        0.08,
        z
      );
    }

    /* =======================================================
       BUILDING FUNCTION
    ======================================================= */

    const building = (
      x,
      z,
      w,
      h,
      d,
      type = 0
    ) => {
      box(
        w,
        h,
        d,
        type === 0
          ? buildingMat
          : buildingDark,
        x,
        h / 2,
        z
      );

      /* roof */

      box(
        w + 0.4,
        0.3,
        d + 0.4,
        roofMat,
        x,
        h + 0.15,
        z
      );

      /* windows */

      const side =
        x < 0 ? 1 : -1;

      const frontX =
        x +
        side *
          (w / 2 + 0.025);

      for (
        let row = 0;
        row < Math.min(
          4,
          Math.floor(h / 2.5)
        );
        row++
      ) {
        for (
          let col = 0;
          col < 3;
          col++
        ) {
          box(
            0.08,
            1.0,
            1.45,
            glassMat,
            frontX,
            1.8 +
              row * 2.25,
            z -
              d / 2 +
              2 +
              col * 2.4
          );
        }
      }
    };

    /* =======================================================
       DISTRICT BUILDINGS
    ======================================================= */

    building(
      -23,
      -5,
      15,
      13,
      15,
      0
    );

    building(
      24,
      -10,
      16,
      16,
      17,
      1
    );

    building(
      -24,
      -29,
      17,
      11,
      16,
      1
    );

    building(
      23,
      -34,
      15,
      14,
      15,
      0
    );

    building(
      -24,
      -58,
      16,
      15,
      17,
      0
    );

    building(
      24,
      -61,
      17,
      12,
      15,
      1
    );

    building(
      -24,
      -90,
      16,
      14,
      16,
      1
    );

    building(
      23,
      -93,
      17,
      17,
      18,
      0
    );

    building(
      -24,
      -121,
      17,
      11,
      15,
      0
    );

    building(
      24,
      -126,
      18,
      15,
      16,
      1
    );

    /* =======================================================
       TREES
    ======================================================= */

    const palm = (
      x,
      z
    ) => {
      cylinder(
        0.25,
        5,
        trunkMat,
        x,
        2.5,
        z
      );

      const crown =
        new THREE.Group();

      crown.position.set(
        x,
        5.2,
        z
      );

      scene.add(crown);

      for (
        let i = 0;
        i < 6;
        i++
      ) {
        const leaf =
          new THREE.Mesh(
            new THREE.ConeGeometry(
              0.8,
              4,
              5
            ),
            treeMat
          );

        leaf.rotation.z =
          Math.PI / 2.5;

        leaf.rotation.y =
          (i / 6) *
          Math.PI *
          2;

        leaf.position.y = 0;

        crown.add(leaf);
      }
    };

    palm(-8, -18);
    palm(8, -25);
    palm(-8, -47);
    palm(8, -52);
    palm(-8, -83);
    palm(8, -88);
    palm(-8, -112);
    palm(8, -118);

    /* =======================================================
       BENCHES
    ======================================================= */

    const bench = (
      x,
      z
    ) => {
      box(
        2.6,
        0.22,
        0.55,
        woodMat,
        x,
        1,
        z
      );

      box(
        0.18,
        0.9,
        0.18,
        woodMat,
        x - 0.9,
        0.5,
        z
      );

      box(
        0.18,
        0.9,
        0.18,
        woodMat,
        x + 0.9,
        0.5,
        z
      );
    };

    bench(-7, -17);
    bench(7, -22);
    bench(-7, -42);
    bench(7, -45);

    /* =======================================================
       STREET LIGHTS
    ======================================================= */

    for (
      let z = 2;
      z > -145;
      z -= 14
    ) {
      [-1, 1].forEach(
        (side) => {
          const x =
            side * 8.7;

          cylinder(
            0.08,
            4.5,
            buildingDark,
            x,
            2.25,
            z
          );

          box(
            0.5,
            0.22,
            0.5,
            yellowMat,
            x,
            4.5,
            z
          );
        }
      );
    }

    /* =======================================================
       FLOODED STREET
    ======================================================= */

    const water =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          17,
          0.12,
          18
        ),
        new THREE.MeshLambertMaterial({
          color: 0x2278a5,
          transparent: true,
          opacity: 0.72,
        })
      );

    water.position.set(
      0,
      0.12,
      -37
    );

    scene.add(water);

    /* floating debris */

    for (
      let i = 0;
      i < 8;
      i++
    ) {
      box(
        0.8 + Math.random(),
        0.25,
        0.4,
        woodMat,
        -6 +
          Math.random() *
            12,
        0.35,
        -31 -
          Math.random() *
            12
      );
    }

    /* =======================================================
       NPC RESIDENT
    ======================================================= */

    const createNPC = (
      x,
      z
    ) => {
      const group =
        new THREE.Group();

      group.position.set(
        x,
        0,
        z
      );

      scene.add(group);

      const body =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.48,
            0.58,
            1.5,
            8
          ),
          new THREE.MeshLambertMaterial({
            color: 0x273d63,
          })
        );

      body.position.y =
        1.1;

      group.add(body);

      const head =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.43,
            8,
            6
          ),
          new THREE.MeshLambertMaterial({
            color: 0xc88963,
          })
        );

      head.position.y =
        2.25;

      group.add(head);

      const arm1 =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.22,
            1.1,
            0.22
          ),
          whiteMat
        );

      arm1.position.set(
        -0.65,
        1.2,
        0
      );

      group.add(arm1);

      const arm2 =
        arm1.clone();

      arm2.position.x =
        0.65;

      group.add(arm2);

      return group;
    };

    const npc =
      createNPC(
        5.2,
        -50
      );

    /* =======================================================
       BLOCKADE
    ======================================================= */

    const blockadeZ =
      -67;

    box(
      12,
      1.1,
      0.4,
      redMat,
      0,
      1,
      blockadeZ
    );

    box(
      0.3,
      2.5,
      0.3,
      buildingDark,
      -6,
      1.25,
      blockadeZ
    );

    box(
      0.3,
      2.5,
      0.3,
      buildingDark,
      6,
      1.25,
      blockadeZ
    );

    /* =======================================================
       CLUE OBJECT
    ======================================================= */

    const clue =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.0,
          1.0,
          0.15
        ),
        yellowMat
      );

    clue.position.set(
      -5,
      0.7,
      -56
    );

    scene.add(clue);

    /* =======================================================
       EVACUATION CENTER
    ======================================================= */

    const evacZ =
      -108;

    box(
      18,
      8,
      14,
      buildingMat,
      0,
      4,
      evacZ
    );

    box(
      19,
      0.4,
      15,
      roofMat,
      0,
      8.2,
      evacZ
    );

    /* entrance */

    box(
      5,
      5,
      0.25,
      buildingDark,
      0,
      2.5,
      evacZ + 7.1
    );

    /* red emergency sign */

    box(
      10,
      0.5,
      0.2,
      redMat,
      0,
      6.4,
      evacZ + 7.2
    );

    /* =======================================================
       OBJECTIVE BEACON
    ======================================================= */

    const beacon =
      new THREE.Group();

    beacon.position.set(
      0,
      5,
      evacZ + 8
    );

    scene.add(beacon);

    const diamond =
      new THREE.Mesh(
        new THREE.OctahedronGeometry(
          0.8,
          0
        ),
        yellowMat
      );

    beacon.add(diamond);

    /* =======================================================
       LIGHTING
    ======================================================= */

    scene.add(
      new THREE.HemisphereLight(
        0xffffff,
        0x43534a,
        1.7
      )
    );

    const sun =
      new THREE.DirectionalLight(
        0xffffff,
        1.8
      );

    sun.position.set(
      -30,
      60,
      20
    );

    scene.add(sun);

    /* =======================================================
       PLAYER AVATAR
    ======================================================= */

    const player =
      new THREE.Group();

    scene.add(player);

    const playerBody =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.42,
          0.95,
          4,
          8
        ),
        new THREE.MeshLambertMaterial({
          color:
            activeCharacter?.faction ===
            "PANGINOON"
              ? 0x22252b
              : activeCharacter?.faction ===
                "MALAKAS"
              ? 0x234f58
              : 0x1d6972,
        })
      );

    playerBody.position.y =
      1.05;

    player.add(playerBody);

    const playerHead =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.42,
          8,
          6
        ),
        new THREE.MeshLambertMaterial({
          color: 0xc78a67,
        })
      );

    playerHead.position.y =
      2.05;

    player.add(playerHead);

    const leg1 =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.3,
          0.9,
          0.35
        ),
        buildingDark
      );

    leg1.position.set(
      -0.22,
      0.45,
      0
    );

    player.add(leg1);

    const leg2 =
      leg1.clone();

    leg2.position.x =
      0.22;

    player.add(leg2);

    avatarRef.current =
      player;

    /* =======================================================
       COLLISION
    ======================================================= */

    const blocked = (
      x,
      z
    ) => {
      /*
        Keep player in playable streets.
      */

      if (x < -8.4) {
        return true;
      }

      if (x > 8.4) {
        return true;
      }

      /*
        Evacuation center.
      */

      if (
        Math.abs(x) < 9 &&
        Math.abs(z - evacZ) < 7
      ) {
        return true;
      }

      /*
        Building zones.
      */

      const zones = [
        [-23, -5, 8, 8],
        [24, -10, 9, 9],
        [-24, -29, 9, 9],
        [23, -34, 8, 8],
        [-24, -58, 9, 9],
        [24, -61, 9, 9],
        [-24, -90, 9, 9],
        [23, -93, 9, 9],
      ];

      for (const zone of zones) {
        if (
          Math.abs(x - zone[0]) <
            zone[2] &&
          Math.abs(z - zone[1]) <
            zone[3]
        ) {
          return true;
        }
      }

      return false;
    };

    /* =======================================================
       MISSION STATE
    ======================================================= */

    let missionStage = 0;

    const stageData = [
      {
        text: "REACH THE FLOODED STREET",
        z: -30,
      },
      {
        text: "FIND THE RESIDENT",
        z: -50,
      },
      {
        text: "INVESTIGATE THE CLUE",
        z: -56,
      },
      {
        text: "FIND ANOTHER WAY THROUGH",
        z: -75,
      },
      {
        text: "REACH THE EVACUATION CENTER",
        z: evacZ,
      },
    ];

    const updateMission = (
      px,
      pz
    ) => {
      const stage =
        stageData[
          missionStage
        ];

      if (!stage) return;

      const dx =
        stage.z - pz;

      const d = Math.max(
        0,
        Math.round(
          Math.abs(dx)
        )
      );

      setDistance(d);

      /*
        Stage progression.
      */

      if (
        missionStage === 0 &&
        pz < -29
      ) {
        missionStage = 1;
        setObjective(
          stageData[1].text
        );
      }

      else if (
        missionStage === 1 &&
        pz < -47
      ) {
        missionStage = 2;
        setObjective(
          stageData[2].text
        );
      }

      else if (
        missionStage === 2 &&
        Math.abs(px + 5) < 3 &&
        Math.abs(pz + 56) < 3
      ) {
        missionStage = 3;
        setObjective(
          stageData[3].text
        );

        setInteractText(
          "INVESTIGATE"
        );

        setCanInteract(true);
      }

      else if (
        missionStage === 3 &&
        pz < -74
      ) {
        missionStage = 4;
        setObjective(
          stageData[4].text
        );

        setCanInteract(false);
        setInteractText("");
      }

      else if (
        missionStage === 4 &&
        Math.abs(pz - evacZ) < 5 &&
        Math.abs(px) < 5
      ) {
        setDistance(3);
        setCanInteract(true);
        setInteractText(
          "INTERACT"
        );
      }
    };

    /* =======================================================
       INTERACTION
    ======================================================= */

    const interactHandler = () => {
      const p =
        playerRef.current;

      /*
        clue
      */

      if (
        missionStage === 2 &&
        Math.abs(p.x + 5) < 3 &&
        Math.abs(p.z + 56) < 3
      ) {
        setDialogue({
          type: "clue",
          title:
            "A FLOOD REPORT",
          text:
            "You found a damaged report. It indicates that residents were moved toward the evacuation center.",
        });

        return;
      }

      /*
        evacuation
      */

      if (
        missionStage === 4 &&
        Math.abs(p.x) < 5 &&
        Math.abs(p.z - evacZ) < 5
      ) {
        setDialogue({
          type: "evacuation",
          title:
            "EVACUATION CENTER",
          text:
            "The evacuation center is finally within reach. People inside are waiting for help.",
        });
      }
    };

    window.addEventListener(
      "tatsulok-interact",
      interactHandler
    );

    /* =======================================================
       ANIMATION
    ======================================================= */

    const clock =
      new THREE.Clock();

    const animate = () => {
      animationRef.current =
        requestAnimationFrame(
          animate
        );

      const delta =
        Math.min(
          clock.getDelta(),
          0.05
        );

      const p =
        playerRef.current;

      const keys =
        keysRef.current;

      const joystick =
        joystickRef.current;

      let forward = 0;
      let side = 0;

      if (
        keys.KeyW ||
        keys.ArrowUp
      ) {
        forward += 1;
      }

      if (
        keys.KeyS ||
        keys.ArrowDown
      ) {
        forward -= 1;
      }

      if (
        keys.KeyA ||
        keys.ArrowLeft
      ) {
        side -= 1;
      }

      if (
        keys.KeyD ||
        keys.ArrowRight
      ) {
        side += 1;
      }

      forward +=
        -joystick.y;

      side +=
        joystick.x;

      const length =
        Math.sqrt(
          forward *
            forward +
            side * side
        );

      if (length > 1) {
        forward /= length;
        side /= length;
      }

      const isMoving =
        Math.abs(forward) >
          0.05 ||
        Math.abs(side) >
          0.05;

      const speed =
        p.running
          ? 8
          : 4.8;

      /*
        Character movement.
      */

      const angle =
        p.cameraYaw;

      const dx =
        (
          side *
            Math.cos(angle) -
          forward *
            Math.sin(angle)
        ) *
        speed *
        delta;

      const dz =
        (
          side *
            Math.sin(angle) +
          forward *
            Math.cos(angle)
        ) *
        speed *
        delta;

      const nx =
        p.x + dx;

      const nz =
        p.z + dz;

      if (!blocked(nx, p.z)) {
        p.x = nx;
      }

      if (!blocked(p.x, nz)) {
        p.z = nz;
      }

      /*
        Rotate character in direction of movement.
      */

      if (isMoving) {
        p.yaw =
          Math.atan2(
            dx,
            dz
          );

        player.rotation.y =
          p.yaw;

        /*
          Simple walking animation.
        */

        const walk =
          Math.sin(
            performance.now() *
              0.012
          ) * 0.12;

        leg1.rotation.x =
          walk;

        leg2.rotation.x =
          -walk;
      }

      player.position.set(
        p.x,
        0,
        p.z
      );

      /*
        Third-person camera.
      */

      const cameraDistance =
        7.5;

      const horizontal =
        Math.cos(
          p.cameraPitch
        ) *
        cameraDistance;

      const cameraX =
        p.x +
        Math.sin(
          p.cameraYaw
        ) *
        horizontal;

      const cameraZ =
        p.z +
        Math.cos(
          p.cameraYaw
        ) *
        horizontal;

      const cameraY =
        2.4 +
        Math.sin(
          p.cameraPitch
        ) *
        cameraDistance;

      camera.position.lerp(
        new THREE.Vector3(
          cameraX,
          cameraY,
          cameraZ
        ),
        0.12
      );

      camera.lookAt(
        p.x,
        1.3,
        p.z
      );

      /*
        Mission.
      */

      updateMission(
        p.x,
        p.z
      );

      /*
        Objective beacon.
      */

      diamond.rotation.y +=
        delta * 2.2;

      diamond.position.y =
        Math.sin(
          performance.now() *
            0.002
        ) *
        0.35;

      /*
        NPC idle animation.
      */

      npc.rotation.y =
        Math.sin(
          performance.now() *
            0.001
        ) *
        0.15;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    /* =======================================================
       RESIZE
    ======================================================= */

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

    /* =======================================================
       CLEANUP
    ======================================================= */

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "tatsulok-interact",
        interactHandler
      );

      renderer.dispose();

      if (
        renderer.domElement
          .parentNode
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
        }
      );
    };
  }, [activeCharacter]);

  /* =========================================================
     MOBILE JOYSTICK
  ========================================================= */

  const joystickMove = (
    event
  ) => {
    const element =
      event.currentTarget;

    const rect =
      element.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height / 2;

    let x =
      (event.clientX -
        centerX) /
      (rect.width / 2);

    let y =
      (event.clientY -
        centerY) /
      (rect.height / 2);

    const magnitude =
      Math.sqrt(
        x * x +
          y * y
      );

    if (magnitude > 1) {
      x /= magnitude;
      y /= magnitude;
    }

    joystickRef.current.x =
      x;

    joystickRef.current.y =
      y;
  };

  const joystickStart = (
    e
  ) => {
    e.preventDefault();

    joystickRef.current.active =
      true;

    joystickMove(e);
  };

  const joystickStop = () => {
    joystickRef.current.active =
      false;

    joystickRef.current.x = 0;
    joystickRef.current.y = 0;
  };

  /* =========================================================
     TOUCH CAMERA
  ========================================================= */

  const lookStart = (e) => {
    if (
      e.target.closest(
        ".touch-ui"
      )
    ) {
      return;
    }

    lookRef.current.active =
      true;

    lookRef.current.x =
      e.clientX;

    lookRef.current.y =
      e.clientY;
  };

  const lookMove = (e) => {
    if (
      !lookRef.current.active
    ) {
      return;
    }

    const dx =
      e.clientX -
      lookRef.current.x;

    const dy =
      e.clientY -
      lookRef.current.y;

    lookRef.current.x =
      e.clientX;

    lookRef.current.y =
      e.clientY;

    const p =
      playerRef.current;

    p.cameraYaw -=
      dx * 0.006;

    p.cameraPitch =
      THREE.MathUtils.clamp(
        p.cameraPitch +
          dy * 0.003,
        0.15,
        0.85
      );
  };

  const lookStop = () => {
    lookRef.current.active =
      false;
  };

  /* =========================================================
     RUN
  ========================================================= */

  const runStart = (e) => {
    e.preventDefault();

    playerRef.current.running =
      true;

    setRunning(true);
  };

  const runStop = (e) => {
    e.preventDefault();

    playerRef.current.running =
      false;

    setRunning(false);
  };

  /* =========================================================
     INTERACT
  ========================================================= */

  const interact = () => {
    if (!canInteract) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "tatsulok-interact"
      )
    );
  };

  /* =========================================================
     DIALOGUE CONTINUE
  ========================================================= */

  const continueDialogue = () => {
    if (!dialogue) return;

    if (
      dialogue.type ===
      "clue"
    ) {
      setDialogue(null);
      setCanInteract(false);
      setInteractText("");
      return;
    }

    if (
      dialogue.type ===
      "evacuation"
    ) {
      setDialogue(null);
      setCompleted(true);

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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="tatsulok-district"
      ref={mountRef}
      onPointerDown={lookStart}
      onPointerMove={lookMove}
      onPointerUp={lookStop}
      onPointerCancel={lookStop}
    >
      <style>{`
        .tatsulok-district {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: #8ed8ff;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: white;
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

        /* ==================================================
           HUD
        ================================================== */

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
            0 3px 8px rgba(0,0,0,.65);
        }

        .td-mission-number {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #ffd447;
        }

        .td-title {
          margin-top: 2px;
          font-size: clamp(25px, 4vw, 48px);
          font-weight: 950;
          line-height: 1;
        }

        .td-district {
          margin-top: 5px;
          font-size: 13px;
          letter-spacing: 4px;
          font-weight: 800;
          opacity: .8;
        }

        /* BACK */

        .td-back {
          position: absolute;
          top: 25px;
          left: 25px;
          pointer-events: auto;
          width: 135px;
          height: 52px;
          border: 1px solid rgba(255,255,255,.55);
          background: rgba(0,0,0,.48);
          color: white;
          font-weight: 950;
          font-size: 15px;
          cursor: pointer;
          backdrop-filter: blur(5px);
        }

        /* OBJECTIVE */

        .td-objective {
          position: absolute;
          top: 25px;
          right: 25px;
          width: 190px;
          min-height: 82px;
          padding: 13px;
          box-sizing: border-box;
          text-align: center;
          background: rgba(0,0,0,.48);
          border: 1px solid rgba(255,213,72,.65);
          backdrop-filter: blur(5px);
        }

        .td-objective-label {
          color: #ffd447;
          font-size: 10px;
          letter-spacing: 3px;
          font-weight: 950;
        }

        .td-objective-text {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 900;
        }

        .td-distance {
          margin-top: 3px;
          font-size: 27px;
          font-weight: 950;
        }

        /* PLAYER */

        .td-player {
          position: absolute;
          left: 25px;
          bottom: 25px;
          padding: 9px 13px;
          background: rgba(0,0,0,.48);
          border: 1px solid rgba(255,255,255,.18);
          font-size: 12px;
          font-weight: 900;
        }

        /* CENTER OBJECTIVE */

        .td-center-objective {
          position: absolute;
          left: 50%;
          bottom: 125px;
          transform: translateX(-50%);
          text-align: center;
          padding: 12px 22px;
          background: rgba(0,0,0,.5);
          border: 1px solid rgba(255,213,72,.55);
          text-shadow:
            0 2px 5px black;
        }

        .td-marker {
          width: 20px;
          height: 20px;
          margin: 0 auto 10px;
          background: #ffd447;
          transform: rotate(45deg);
          box-shadow:
            0 0 20px rgba(255,212,71,.9);
        }

        .td-center-text {
          font-size: 15px;
          font-weight: 950;
        }

        /* ==================================================
           CONTROLS
        ================================================== */

        .touch-ui {
          position: absolute;
          z-index: 50;
          pointer-events: auto;
        }

        .td-joystick {
          left: 25px;
          bottom: 30px;
          width: 145px;
          height: 145px;
          border-radius: 50%;
          background: rgba(0,0,0,.27);
          border: 1px solid rgba(255,255,255,.3);
        }

        .td-joystick-ring {
          position: absolute;
          inset: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.16);
        }

        .td-knob {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 55px;
          height: 55px;
          transform: translate(-50%,-50%);
          border-radius: 50%;
          background: rgba(255,255,255,.2);
          border: 1px solid rgba(255,255,255,.45);
          pointer-events: none;
        }

        .td-arrow {
          position: absolute;
          color: rgba(255,255,255,.4);
          font-size: 11px;
          font-weight: 900;
          pointer-events: none;
        }

        .td-up {
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .td-down {
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .td-left {
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .td-right {
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        /* RIGHT BUTTONS */

        .td-actions {
          right: 25px;
          bottom: 30px;
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .td-action {
          min-width: 75px;
          height: 58px;
          border: 1px solid rgba(255,255,255,.35);
          background: rgba(0,0,0,.48);
          color: white;
          font-weight: 950;
          font-size: 11px;
          cursor: pointer;
          touch-action: manipulation;
        }

        .td-run {
          border-color: #ffd447;
        }

        .td-interact {
          min-width: 135px;
          color: #ffd447;
          border-color: #ffd447;
          opacity: .45;
        }

        .td-interact.ready {
          opacity: 1;
          background: rgba(74,52,0,.78);
          box-shadow:
            0 0 25px rgba(255,212,71,.2);
        }

        /* ==================================================
           DIALOGUE
        ================================================== */

        .td-dialogue {
          position: absolute;
          z-index: 100;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding: 25px;
          background: rgba(0,0,0,.48);
          pointer-events: auto;
        }

        .td-dialogue-box {
          width: min(850px, 94vw);
          padding: 27px;
          background: rgba(5,9,8,.97);
          border: 1px solid #ffd447;
          box-shadow:
            0 20px 70px rgba(0,0,0,.7);
        }

        .td-dialogue-label {
          color: #ffd447;
          font-size: 11px;
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
          color: #cbd1cc;
          line-height: 1.55;
          font-size: 15px;
        }

        .td-dialogue-button {
          width: 100%;
          height: 55px;
          margin-top: 22px;
          background: #ffd447;
          color: #111;
          border: 0;
          font-weight: 950;
          cursor: pointer;
        }

        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 800px) {

          .td-top {
            top: 12px;
          }

          .td-mission-number {
            font-size: 9px;
          }

          .td-title {
            font-size: 24px;
          }

          .td-district {
            font-size: 9px;
            letter-spacing: 3px;
          }

          .td-back {
            top: 13px;
            left: 13px;
            width: 90px;
            height: 43px;
            font-size: 12px;
          }

          .td-objective {
            top: 13px;
            right: 13px;
            width: 120px;
            min-height: 67px;
            padding: 8px;
          }

          .td-objective-label {
            font-size: 8px;
          }

          .td-objective-text {
            font-size: 9px;
          }

          .td-distance {
            font-size: 22px;
          }

          .td-center-objective {
            bottom: 155px;
            padding: 9px 15px;
          }

          .td-center-text {
            font-size: 12px;
          }

          .td-joystick {
            left: 15px;
            bottom: 15px;
            width: 125px;
            height: 125px;
          }

          .td-actions {
            right: 15px;
            bottom: 15px;
            gap: 6px;
          }

          .td-action {
            min-width: 58px;
            height: 50px;
            font-size: 9px;
          }

          .td-interact {
            min-width: 98px;
          }

          .td-player {
            display: none;
          }

          .td-dialogue {
            padding: 12px;
          }

          .td-dialogue-box {
            padding: 20px;
          }

          .td-dialogue-title {
            font-size: 22px;
          }
        }
      `}</style>

      {/* =====================================================
          HUD
      ===================================================== */}

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
          className="td-back touch-ui"
          onClick={onExit}
        >
          ← BACK
        </button>

        <div className="td-objective">
          <div className="td-objective-label">
            OBJECTIVE
          </div>

          <div className="td-objective-text">
            {objective}
          </div>

          <div className="td-distance">
            {distance}m
          </div>
        </div>

        <div className="td-player">
          {characterName}
        </div>

        <div className="td-center-objective">
          <div className="td-marker" />
          <div className="td-center-text">
            {objective}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE JOYSTICK
      ===================================================== */}

      <div
        className="td-joystick touch-ui"
        onPointerDown={joystickStart}
        onPointerMove={(e) => {
          if (
            joystickRef.current.active
          ) {
            joystickMove(e);
          }
        }}
        onPointerUp={joystickStop}
        onPointerCancel={joystickStop}
      >
        <div className="td-joystick-ring" />

        <div className="td-arrow td-up">
          ▲
        </div>

        <div className="td-arrow td-down">
          ▼
        </div>

        <div className="td-arrow td-left">
          ◀
        </div>

        <div className="td-arrow td-right">
          ▶
        </div>

        <div className="td-knob" />
      </div>

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="td-actions touch-ui">
        <button
          className="td-action td-run"
          onPointerDown={runStart}
          onPointerUp={runStop}
          onPointerCancel={runStop}
          onPointerLeave={runStop}
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
          onClick={interact}
          disabled={!canInteract}
        >
          {canInteract
            ? interactText ||
              "INTERACT"
            : "APPROACH"}
        </button>
      </div>

      {/* =====================================================
          DIALOGUE
      ===================================================== */}

      {dialogue && (
        <div className="td-dialogue">
          <div className="td-dialogue-box">
            <div className="td-dialogue-label">
              {dialogue.type ===
              "clue"
                ? "INVESTIGATION"
                : "EVACUATION CENTER"}
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

      {/* =====================================================
          COMPLETED
      ===================================================== */}

      {completed && (
        <div className="td-dialogue">
          <div className="td-dialogue-box">
            <div className="td-dialogue-label">
              MISSION COMPLETE
            </div>

            <div className="td-dialogue-title">
              EVACUATION CENTER REACHED
            </div>

            <div className="td-dialogue-text">
              You made it through the
              district and reached the
              evacuation center.
            </div>

            <button
              className="td-dialogue-button"
              onClick={onExit}
            >
              RETURN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
