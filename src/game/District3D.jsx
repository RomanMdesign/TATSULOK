import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/*
  TATSULOK — OPTIMIZED DISTRICT 3D
  --------------------------------
  Lightweight first-person mission gameplay.

  CONTROLS
  Desktop:
    W A S D / Arrow Keys = Move
    Mouse Drag           = Look
    E                    = Interact
    Shift                = Run

  Mobile / iPad:
    Left joystick         = Move
    Swipe right side      = Look
    RUN button            = Sprint
    INTERACT button       = Objective interaction

  PERFORMANCE
    - No real-time shadows
    - Low-poly environment
    - Limited lights
    - Pixel ratio capped
    - Shared materials
    - No physics engine
    - HUD updates are throttled
*/

export default function District3D({
  mission,
  onExit,
  onComplete,
}) {
  const mountRef = useRef(null);

  const keysRef = useRef({});
  const playerRef = useRef({
    x: 0,
    y: 1.65,
    z: 8,
    yaw: 0,
    pitch: 0,
  });

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

  const sprintRef = useRef(false);
  const completedRef = useRef(false);

  const [distance, setDistance] = useState(88);
  const [nearObjective, setNearObjective] = useState(false);
  const [sprinting, setSprinting] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [choiceMade, setChoiceMade] = useState(false);

  const audioRef = useRef(null);

  const missionTitle =
    mission?.title || "BAHA";

  const missionNumber =
    mission?.number || "01";

  /*
   * =========================================================
   * THREE.JS WORLD
   * =========================================================
   */

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x07100f);

    scene.fog = new THREE.Fog(
      0x07100f,
      18,
      115
    );

    /*
     * CAMERA
     */

    const camera =
      new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
          window.innerHeight,
        0.1,
        180
      );

    const player = playerRef.current;

    camera.position.set(
      player.x,
      player.y,
      player.z
    );

    /*
     * RENDERER
     *
     * Deliberately low-cost.
     */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.25
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight,
      false
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    /*
     * NO REAL-TIME SHADOWS
     *
     * This is intentional for mobile
     * performance.
     */

    renderer.shadowMap.enabled = false;

    container.appendChild(
      renderer.domElement
    );

    /*
     * =========================================================
     * LIGHTING
     * =========================================================
     */

    const ambient =
      new THREE.HemisphereLight(
        0x8ca9a3,
        0x17130d,
        1.45
      );

    scene.add(ambient);

    const moon =
      new THREE.DirectionalLight(
        0xc9d9d5,
        0.55
      );

    moon.position.set(
      -20,
      30,
      20
    );

    scene.add(moon);

    /*
     * Only a few point lights.
     */

    const streetLightMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x22251e,
      });

    const lampMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xffd05a,
      });

    /*
     * =========================================================
     * MATERIALS
     * =========================================================
     */

    const groundMaterial =
      new THREE.MeshLambertMaterial({
        color: 0x27291e,
      });

    const roadMaterial =
      new THREE.MeshLambertMaterial({
        color: 0x20231f,
      });

    const sidewalkMaterial =
      new THREE.MeshLambertMaterial({
        color: 0x38382d,
      });

    const buildingMaterials = [
      new THREE.MeshLambertMaterial({
        color: 0x151a18,
      }),
      new THREE.MeshLambertMaterial({
        color: 0x1b211e,
      }),
      new THREE.MeshLambertMaterial({
        color: 0x24251f,
      }),
      new THREE.MeshLambertMaterial({
        color: 0x191d1b,
      }),
    ];

    const roofMaterial =
      new THREE.MeshLambertMaterial({
        color: 0x101311,
      });

    const windowMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xc1a14c,
      });

    const debrisMaterial =
      new THREE.MeshLambertMaterial({
        color: 0x34352c,
      });

    /*
     * =========================================================
     * GROUND
     * =========================================================
     */

    const ground =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          180,
          180
        ),
        groundMaterial
      );

    ground.rotation.x =
      -Math.PI / 2;

    scene.add(ground);

    /*
     * =========================================================
     * MAIN ROAD
     * =========================================================
     */

    const road =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          18,
          180
        ),
        roadMaterial
      );

    road.rotation.x =
      -Math.PI / 2;

    road.position.y = 0.015;

    scene.add(road);

    /*
     * ROAD CENTER MARKERS
     */

    const lineMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x6d6440,
      });

    for (
      let z = -90;
      z < 90;
      z += 10
    ) {
      const line =
        new THREE.Mesh(
          new THREE.PlaneGeometry(
            0.16,
            4
          ),
          lineMaterial
        );

      line.rotation.x =
        -Math.PI / 2;

      line.position.set(
        0,
        0.025,
        z
      );

      scene.add(line);
    }

    /*
     * =========================================================
     * SIDEWALKS
     * =========================================================
     */

    [-12, 12].forEach(
      (x) => {
        const sidewalk =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              5,
              0.22,
              180
            ),
            sidewalkMaterial
          );

        sidewalk.position.set(
          x,
          0.11,
          0
        );

        scene.add(sidewalk);
      }
    );

    /*
     * =========================================================
     * BUILDINGS
     *
     * Low-poly boxes.
     * No shadows.
     * Limited number.
     * =========================================================
     */

    const buildingColliders = [];

    const buildingGeometry =
      new THREE.BoxGeometry(
        1,
        1,
        1
      );

    const roofGeometry =
      new THREE.BoxGeometry(
        1.02,
        0.35,
        1.02
      );

    const windowGeometry =
      new THREE.BoxGeometry(
        0.7,
        0.65,
        0.08
      );

    for (
      let z = -96;
      z <= 88;
      z += 18
    ) {
      /*
       * LEFT
       */

      {
        const width =
          11 + (Math.random() * 2);

        const height =
          8 + (Math.random() * 7);

        const depth =
          12 + (Math.random() * 3);

        const material =
          buildingMaterials[
            Math.floor(
              Math.random() *
                buildingMaterials.length
            )
          ];

        const building =
          new THREE.Mesh(
            buildingGeometry,
            material
          );

        building.scale.set(
          width,
          height,
          depth
        );

        building.position.set(
          -22,
          height / 2,
          z
        );

        scene.add(building);

        const roof =
          new THREE.Mesh(
            roofGeometry,
            roofMaterial
          );

        roof.scale.set(
          width,
          1,
          depth
        );

        roof.position.set(
          -22,
          height + 0.1,
          z
        );

        scene.add(roof);

        /*
         * Simple windows
         */

        const window1 =
          new THREE.Mesh(
            windowGeometry,
            windowMaterial
          );

        window1.position.set(
          -15.95,
          height * 0.58,
          z - 3
        );

        scene.add(window1);

        const window2 =
          new THREE.Mesh(
            windowGeometry,
            windowMaterial
          );

        window2.position.set(
          -15.95,
          height * 0.58,
          z + 3
        );

        scene.add(window2);

        buildingColliders.push({
          minX: -22 - width / 2,
          maxX: -22 + width / 2,
          minZ: z - depth / 2,
          maxZ: z + depth / 2,
        });
      }

      /*
       * RIGHT
       */

      {
        const width =
          11 + (Math.random() * 2);

        const height =
          8 + (Math.random() * 7);

        const depth =
          12 + (Math.random() * 3);

        const material =
          buildingMaterials[
            Math.floor(
              Math.random() *
                buildingMaterials.length
            )
          ];

        const building =
          new THREE.Mesh(
            buildingGeometry,
            material
          );

        building.scale.set(
          width,
          height,
          depth
        );

        building.position.set(
          22,
          height / 2,
          z
        );

        scene.add(building);

        const roof =
          new THREE.Mesh(
            roofGeometry,
            roofMaterial
          );

        roof.scale.set(
          width,
          1,
          depth
        );

        roof.position.set(
          22,
          height + 0.1,
          z
        );

        scene.add(roof);

        const window1 =
          new THREE.Mesh(
            windowGeometry,
            windowMaterial
          );

        window1.position.set(
          15.95,
          height * 0.58,
          z - 3
        );

        scene.add(window1);

        const window2 =
          new THREE.Mesh(
            windowGeometry,
            windowMaterial
          );

        window2.position.set(
          15.95,
          height * 0.58,
          z + 3
        );

        scene.add(window2);

        buildingColliders.push({
          minX: 22 - width / 2,
          maxX: 22 + width / 2,
          minZ: z - depth / 2,
          maxZ: z + depth / 2,
        });
      }
    }

    /*
     * =========================================================
     * STREET LIGHTS
     * =========================================================
     */

    const poleGeometry =
      new THREE.CylinderGeometry(
        0.06,
        0.08,
        3.8,
        6
      );

    const lampGeometry =
      new THREE.SphereGeometry(
        0.16,
        6,
        6
      );

    /*
     * Only every 18 meters.
     */

    for (
      let z = -90;
      z <= 90;
      z += 18
    ) {
      [-8, 8].forEach(
        (x) => {
          const pole =
            new THREE.Mesh(
              poleGeometry,
              streetLightMaterial
            );

          pole.position.set(
            x,
            1.9,
            z
          );

          scene.add(pole);

          const lamp =
            new THREE.Mesh(
              lampGeometry,
              lampMaterial
            );

          lamp.position.set(
            x,
            3.8,
            z
          );

          scene.add(lamp);
        }
      );
    }

    /*
     * =========================================================
     * SMALL ENVIRONMENT PROPS
     * =========================================================
     */

    const propGeometry =
      new THREE.BoxGeometry(
        1.5,
        1,
        1.5
      );

    for (
      let i = 0;
      i < 14;
      i++
    ) {
      const prop =
        new THREE.Mesh(
          propGeometry,
          debrisMaterial
        );

      prop.scale.set(
        0.7 + Math.random(),
        0.5 + Math.random(),
        0.7 + Math.random()
      );

      prop.position.set(
        -7 +
          Math.random() * 14,
        0.5,
        -8 -
          Math.random() * 85
      );

      prop.rotation.y =
        Math.random() *
        Math.PI;

      scene.add(prop);
    }

    /*
     * =========================================================
     * EVACUATION CENTER
     *
     * Target deliberately placed
     * down the main road.
     * =========================================================
     */

    const target = {
      x: 0,
      z: -80,
    };

    /*
     * Objective building
     */

    const centerBuilding =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          10,
          5,
          7
        ),
        new THREE.MeshLambertMaterial({
          color: 0x30372f,
        })
      );

    centerBuilding.position.set(
      target.x,
      2.5,
      target.z
    );

    scene.add(centerBuilding);

    /*
     * Roof
     */

    const centerRoof =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          10.5,
          0.5,
          7.5
        ),
        roofMaterial
      );

    centerRoof.position.set(
      target.x,
      5.25,
      target.z
    );

    scene.add(centerRoof);

    /*
     * Door
     */

    const door =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.8,
          3,
          0.12
        ),
        new THREE.MeshBasicMaterial({
          color: 0x111512,
        })
      );

    door.position.set(
      0,
      1.5,
      target.z + 3.55
    );

    scene.add(door);

    /*
     * =========================================================
     * OBJECTIVE MARKER
     * =========================================================
     */

    const objective =
      new THREE.Mesh(
        new THREE.OctahedronGeometry(
          1.1,
          0
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffc43d,
        })
      );

    objective.position.set(
      target.x,
      4,
      target.z + 3
    );

    scene.add(objective);

    /*
     * Vertical objective beam
     */

    const beam =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.04,
          0.04,
          5,
          6
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffc43d,
          transparent: true,
          opacity: 0.55,
        })
      );

    beam.position.set(
      target.x,
      2.5,
      target.z + 3
    );

    scene.add(beam);

    /*
     * =========================================================
     * COLLISION
     * =========================================================
     */

    function blocked(
      nextX,
      nextZ
    ) {
      /*
       * Keep player on road/sidewalk.
       */

      if (
        nextX < -9 ||
        nextX > 9 ||
        nextZ > 12 ||
        nextZ < -108
      ) {
        return true;
      }

      /*
       * Building collision.
       */

      const radius = 0.55;

      for (
        const box of buildingColliders
      ) {
        if (
          nextX + radius >
            box.minX &&
          nextX - radius <
            box.maxX &&
          nextZ + radius >
            box.minZ &&
          nextZ - radius <
            box.maxZ
        ) {
          return true;
        }
      }

      return false;
    }

    /*
     * =========================================================
     * KEYBOARD
     * =========================================================
     */

    const handleKeyDown = (
      event
    ) => {
      keysRef.current[
        event.key.toLowerCase()
      ] = true;

      if (
        event.key === "Shift"
      ) {
        sprintRef.current = true;
        setSprinting(true);
      }

      if (
        event.key.toLowerCase() ===
        "e"
      ) {
        /*
         * Interaction is handled
         * outside the render loop.
         */

        const p =
          playerRef.current;

        const dx =
          target.x - p.x;

        const dz =
          target.z +
          3 -
          p.z;

        const d =
          Math.sqrt(
            dx * dx +
              dz * dz
          );

        if (d <= 3.5) {
          setShowDialogue(true);
        }
      }
    };

    const handleKeyUp = (
      event
    ) => {
      keysRef.current[
        event.key.toLowerCase()
      ] = false;

      if (
        event.key === "Shift"
      ) {
        sprintRef.current = false;
        setSprinting(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    /*
     * =========================================================
     * DESKTOP MOUSE LOOK
     * =========================================================
     */

    let mouseDown = false;

    const mouseStart = (
      event
    ) => {
      if (
        event.target.closest(
          ".game-ui"
        )
      ) {
        return;
      }

      mouseDown = true;

      lookRef.current.x =
        event.clientX;

      lookRef.current.y =
        event.clientY;
    };

    const mouseMove = (
      event
    ) => {
      if (!mouseDown) return;

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

      player.yaw -=
        dx * 0.004;

      player.pitch -=
        dy * 0.0025;

      player.pitch =
        THREE.MathUtils.clamp(
          player.pitch,
          -1.15,
          1.15
        );
    };

    const mouseEnd = () => {
      mouseDown = false;
    };

    renderer.domElement.addEventListener(
      "mousedown",
      mouseStart
    );

    window.addEventListener(
      "mousemove",
      mouseMove
    );

    window.addEventListener(
      "mouseup",
      mouseEnd
    );

    /*
     * =========================================================
     * ANIMATION LOOP
     * =========================================================
     */

    let frameId = 0;

    let lastTime =
      performance.now();

    let hudTimer = 0;

    const animate = (
      now
    ) => {
      frameId =
        requestAnimationFrame(
          animate
        );

      /*
       * Cap physics delta.
       */

      const delta =
        Math.min(
          (now -
            lastTime) /
            1000,
          0.04
        );

      lastTime = now;

      const p =
        playerRef.current;

      /*
       * =======================================================
       * MOVEMENT INPUT
       * =======================================================
       */

      let forward = 0;
      let strafe = 0;

      const keys =
        keysRef.current;

      if (
        keys.w ||
        keys.arrowup
      ) {
        forward += 1;
      }

      if (
        keys.s ||
        keys.arrowdown
      ) {
        forward -= 1;
      }

      if (
        keys.a ||
        keys.arrowleft
      ) {
        strafe -= 1;
      }

      if (
        keys.d ||
        keys.arrowright
      ) {
        strafe += 1;
      }

      /*
       * Mobile joystick.
       */

      forward +=
        -joystickRef.current.y;

      strafe +=
        joystickRef.current.x;

      /*
       * Normalize diagonal movement.
       */

      const length =
        Math.sqrt(
          forward * forward +
            strafe * strafe
        );

      if (length > 1) {
        forward /= length;
        strafe /= length;
      }

      /*
       * =======================================================
       * SPEED
       * =======================================================
       */

      const speed =
        sprintRef.current
          ? 8.5
          : 4.8;

      if (
        Math.abs(forward) >
          0.01 ||
        Math.abs(strafe) >
          0.01
      ) {
        const movement =
          speed * delta;

        const sin =
          Math.sin(p.yaw);

        const cos =
          Math.cos(p.yaw);

        const nextX =
          p.x +
          sin *
            forward *
            movement +
          cos *
            strafe *
            movement;

        const nextZ =
          p.z +
          cos *
            forward *
            movement -
          sin *
            strafe *
            movement;

        /*
         * Collision separately on
         * each axis for smoother movement.
         */

        if (
          !blocked(
            nextX,
            p.z
          )
        ) {
          p.x = nextX;
        }

        if (
          !blocked(
            p.x,
            nextZ
          )
        ) {
          p.z = nextZ;
        }
      }

      /*
       * =======================================================
       * CAMERA
       * =======================================================
       */

      camera.position.set(
        p.x,
        p.y,
        p.z
      );

      const lookDistance = 10;

      const lookX =
        p.x +
        Math.sin(
          p.yaw
        ) *
          lookDistance;

      const lookY =
        p.y +
        Math.sin(
          p.pitch
        ) *
          lookDistance;

      const lookZ =
        p.z +
        Math.cos(
          p.yaw
        ) *
          lookDistance;

      camera.lookAt(
        lookX,
        lookY,
        lookZ
      );

      /*
       * =======================================================
       * OBJECTIVE DISTANCE
       * =======================================================
       */

      hudTimer += delta;

      /*
       * Update React state only
       * about 8 times per second.
       */

      if (
        hudTimer >= 0.12
      ) {
        hudTimer = 0;

        const dx =
          target.x - p.x;

        const dz =
          target.z +
          3 -
          p.z;

        const currentDistance =
          Math.sqrt(
            dx * dx +
              dz * dz
          );

        const rounded =
          Math.max(
            0,
            Math.round(
              currentDistance
            )
          );

        const near =
          currentDistance <=
          3.5;

        setDistance(
          rounded
        );

        setNearObjective(
          near
        );
      }

      /*
       * =======================================================
       * OBJECTIVE ANIMATION
       * =======================================================
       */

      objective.rotation.y +=
        delta * 1.4;

      objective.position.y =
        4 +
        Math.sin(
          now * 0.003
        ) *
          0.25;

      beam.scale.y =
        0.9 +
        Math.sin(
          now * 0.002
        ) *
          0.1;

      /*
       * =======================================================
       * RENDER
       * =======================================================
       */

      renderer.render(
        scene,
        camera
      );
    };

    frameId =
      requestAnimationFrame(
        animate
      );

    /*
     * =========================================================
     * RESIZE
     * =========================================================
     */

    const resize = () => {
      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height,
        false
      );

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio ||
            1,
          1.25
        )
      );
    };

    window.addEventListener(
      "resize",
      resize
    );

    /*
     * =========================================================
     * CLEANUP
     * =========================================================
     */

    return () => {
      cancelAnimationFrame(
        frameId
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );

      renderer.domElement.removeEventListener(
        "mousedown",
        mouseStart
      );

      window.removeEventListener(
        "mousemove",
        mouseMove
      );

      window.removeEventListener(
        "mouseup",
        mouseEnd
      );

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }

      renderer.dispose();

      /*
       * Dispose geometries/materials.
       */

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
  }, []);

  /*
   * ===========================================================
   * MOBILE JOYSTICK
   * ===========================================================
   */

  const joystickStart = (
    event
  ) => {
    event.preventDefault();

    joystickRef.current.active =
      true;

    updateJoystick(event);
  };

  const updateJoystick = (
    event
  ) => {
    if (
      !joystickRef.current.active
    ) {
      return;
    }

    const touch =
      event.touches?.[0];

    if (!touch) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height / 2;

    let x =
      (touch.clientX -
        centerX) /
      (rect.width / 2);

    let y =
      (touch.clientY -
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

    joystickRef.current.x =
      x;

    joystickRef.current.y =
      y;
  };

  const joystickEnd = (
    event
  ) => {
    event.preventDefault();

    joystickRef.current.active =
      false;

    joystickRef.current.x = 0;
    joystickRef.current.y = 0;
  };

  /*
   * ===========================================================
   * MOBILE CAMERA LOOK
   * ===========================================================
   */

  const touchLookStart = (
    event
  ) => {
    if (
      event.target.closest(
        ".movement-joystick"
      ) ||
      event.target.closest(
        ".right-controls"
      ) ||
      event.target.closest(
        ".game-ui"
      )
    ) {
      return;
    }

    const touch =
      event.touches?.[0];

    if (!touch) return;

    event.preventDefault();

    lookRef.current.active =
      true;

    lookRef.current.x =
      touch.clientX;

    lookRef.current.y =
      touch.clientY;
  };

  const touchLookMove = (
    event
  ) => {
    if (
      !lookRef.current.active
    ) {
      return;
    }

    const touch =
      event.touches?.[0];

    if (!touch) return;

    event.preventDefault();

    const dx =
      touch.clientX -
      lookRef.current.x;

    const dy =
      touch.clientY -
      lookRef.current.y;

    lookRef.current.x =
      touch.clientX;

    lookRef.current.y =
      touch.clientY;

    playerRef.current.yaw -=
      dx * 0.004;

    playerRef.current.pitch -=
      dy * 0.0025;

    playerRef.current.pitch =
      THREE.MathUtils.clamp(
        playerRef.current.pitch,
        -1.15,
        1.15
      );
  };

  const touchLookEnd = () => {
    lookRef.current.active =
      false;
  };

  /*
   * ===========================================================
   * SPRINT
   * ===========================================================
   */

  const sprintStart = (
    event
  ) => {
    event.preventDefault();

    sprintRef.current = true;
    setSprinting(true);
  };

  const sprintEnd = (
    event
  ) => {
    event.preventDefault();

    sprintRef.current = false;
    setSprinting(false);
  };

  /*
   * ===========================================================
   * INTERACT
   * ===========================================================
   */

  const interact = () => {
    if (
      !nearObjective
    ) {
      return;
    }

    if (
      completedRef.current
    ) {
      return;
    }

    setShowDialogue(true);
  };

  /*
   * ===========================================================
   * CHOICE
   * ===========================================================
   */

  const makeChoice = (
    choice
  ) => {
    setChoiceMade(true);

    completedRef.current = true;

    /*
     * Give App.jsx a chance to
     * update its mission state.
     */

    if (onComplete) {
      onComplete({
        choice,
        mission:
          mission?.id ||
          missionNumber,
      });
    }
  };

  /*
   * ===========================================================
   * MUSIC
   * ===========================================================
   */

  const toggleMusic =
    async () => {
      if (
        !audioRef.current
      ) {
        return;
      }

      const audio =
        audioRef.current;

      try {
        if (
          audio.paused
        ) {
          audio.volume = 0.35;
          audio.loop = true;

          await audio.play();

          setMusicOn(true);
        } else {
          audio.pause();

          setMusicOn(false);
        }
      } catch (
        error
      ) {
        console.warn(
          "TATSULOK audio:",
          error
        );

        setMusicOn(false);
      }
    };

  /*
   * ===========================================================
   * RENDER
   * ===========================================================
   */

  return (
    <div
      className="district-game"
      onTouchStart={
        touchLookStart
      }
      onTouchMove={
        touchLookMove
      }
      onTouchEnd={
        touchLookEnd
      }
      onTouchCancel={
        touchLookEnd
      }
    >
      {/* =====================================================
          AUDIO
          ===================================================== */}

      <audio
        ref={audioRef}
        src="/assets/baha-music.mp4"
        preload="auto"
        loop
      />

      {/* =====================================================
          THREE.JS
          ===================================================== */}

      <div
        ref={mountRef}
        className="district-canvas"
      />

      {/* =====================================================
          GAME UI
          ===================================================== */}

      <div className="game-ui">

        {/* TOP */}

        <div className="game-top">

          <button
            className="game-back"
            onClick={onExit}
          >
            ← BACK
          </button>

          <div className="mission-title">

            <div>
              MISSION{" "}
              {missionNumber}
            </div>

            <strong>
              {missionTitle}
            </strong>

            <span>
              DISTRICT 7
            </span>

          </div>

          <div className="objective-distance">

            <span>
              OBJECTIVE
            </span>

            <strong>
              {distance}m
            </strong>

          </div>

          <button
            className="music-button"
            onClick={
              toggleMusic
            }
          >
            {musicOn
              ? "🔊"
              : "🔇"}
          </button>

        </div>

        {/* CROSSHAIR */}

        <div className="crosshair">
          <span />
          <span />
        </div>

        {/* OBJECTIVE */}

        <div className="objective-label">

          <div className="objective-diamond">
            ◆
          </div>

          <div>
            EVACUATION CENTER
          </div>

          <strong>
            {distance}m
          </strong>

        </div>

        {/* BOTTOM OBJECTIVE INFO */}

        <div className="mission-objective-box">

          <small>
            MISSION OBJECTIVE
          </small>

          <h2>
            EVACUATION CENTER
          </h2>

          <p>
            {mission?.description ||
              "May emergency sa distrito. Hanapin ang evacuation center at alamin kung ano ang tunay na nangyayari."}
          </p>

        </div>

        {/* MOBILE JOYSTICK */}

        <div
          className="movement-joystick"
          onTouchStart={
            joystickStart
          }
          onTouchMove={
            updateJoystick
          }
          onTouchEnd={
            joystickEnd
          }
          onTouchCancel={
            joystickEnd
          }
        >
          <div className="joystick-arrows">

            <span className="up">
              ▲
            </span>

            <span className="left">
              ◀
            </span>

            <span className="right">
              ▶
            </span>

            <span className="down">
              ▼
            </span>

          </div>

          <div className="joystick-knob" />
        </div>

        {/* RIGHT CONTROLS */}

        <div className="right-controls">

          <button
            className={
              "control-button interact " +
              (nearObjective
                ? "available"
                : "")
            }
            onClick={
              interact
            }
            disabled={
              !nearObjective
            }
          >
            ✋
          </button>

          <button
            className={
              "control-button " +
              (sprinting
                ? "pressed"
                : "")
            }
            onTouchStart={
              sprintStart
            }
            onTouchEnd={
              sprintEnd
            }
            onTouchCancel={
              sprintEnd
            }
            onMouseDown={() => {
              sprintRef.current =
                true;

              setSprinting(true);
            }}
            onMouseUp={() => {
              sprintRef.current =
                false;

              setSprinting(false);
            }}
          >
            🏃
          </button>

        </div>

        {/* CAMERA HELP */}

        <div className="camera-hint">
          SWIPE TO LOOK
        </div>

        {/* INTERACTION */}

        {nearObjective &&
          !showDialogue && (
            <button
              className="objective-interact"
              onClick={
                interact
              }
            >
              INTERACT —
              EVACUATION CENTER
            </button>
          )}

        {/* ===================================================
            DIALOGUE
            =================================================== */}

        {showDialogue && (
          <div className="dialogue-overlay">

            <div className="dialogue-panel">

              {!choiceMade ? (
                <>
                  <div className="dialogue-eyebrow">
                    EVACUATION CENTER
                  </div>

                  <h2>
                    MAY NAKIKITA KANG
                    MGA TAO SA LOOB.
                  </h2>

                  <p>
                    May mga residenteng
                    naghihintay ng tulong.
                    Mukhang may nangyari
                    bago pa dumating ang
                    baha.
                  </p>

                  <div className="dialogue-question">
                    ANO ANG GAGAWIN MO?
                  </div>

                  <div className="dialogue-actions">

                    <button
                      onClick={() =>
                        makeChoice(
                          "HELP_RESIDENTS"
                        )
                      }
                    >
                      TULUNGAN ANG
                      MGA RESIDENTE
                    </button>

                    <button
                      onClick={() =>
                        makeChoice(
                          "INVESTIGATE"
                        )
                      }
                    >
                      IMBESTIGAHAN
                      ANG PANGYAYARI
                    </button>

                  </div>
                </>
              ) : (
                <>
                  <div className="dialogue-eyebrow">
                    OBJECTIVE COMPLETE
                  </div>

                  <h2>
                    NAKUHA MO ANG
                    UNANG CLUE.
                  </h2>

                  <p>
                    May ebidensyang
                    nagpapakitang hindi
                    simpleng baha lamang
                    ang nangyari sa
                    distrito.
                  </p>

                  <button
                    className="dialogue-continue"
                    onClick={() =>
                      setShowDialogue(
                        false
                      )
                    }
                  >
                    CONTINUE
                  </button>
                </>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
