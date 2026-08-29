import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function District3D({
  mission,
  onExit,
  onComplete,
}) {
  const mountRef = useRef(null);
  const audioRef = useRef(null);

  const keys = useRef({});

  const joystick = useRef({
    active: false,
    x: 0,
    y: 0,
  });

  const look = useRef({
    active: false,
    x: 0,
    y: 0,
  });

  const player = useRef({
    x: 0,
    y: 1.6,
    z: 8,
    yaw: 0,
    pitch: 0,
  });

  const target = useRef({
    x: 0,
    z: -80,
  });

  const [musicOn, setMusicOn] = useState(false);
  const [sprinting, setSprinting] = useState(false);
  const [distance, setDistance] = useState(88);
  const [nearObjective, setNearObjective] =
    useState(false);

  const missionTitle =
    mission?.title || "BAHA";

  const missionNumber =
    mission?.number || "01";

  /*
   * =========================================================
   * THREE.JS DISTRICT
   * =========================================================
   */

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(
      0x050807
    );

    scene.fog = new THREE.Fog(
      0x050807,
      15,
      150
    );

    const camera =
      new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
          window.innerHeight,
        0.1,
        300
      );

    camera.position.set(
      player.current.x,
      player.current.y,
      player.current.z
    );

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(
      renderer.domElement
    );

    /*
     * =======================================================
     * LIGHTING
     * =======================================================
     */

    const ambient =
      new THREE.AmbientLight(
        0xffffff,
        0.35
      );

    scene.add(ambient);

    const moon =
      new THREE.DirectionalLight(
        0xffffff,
        0.7
      );

    moon.position.set(
      30,
      50,
      20
    );

    moon.castShadow = true;

    scene.add(moon);

    /*
     * =======================================================
     * GROUND
     * =======================================================
     */

    const groundGeometry =
      new THREE.PlaneGeometry(
        220,
        220
      );

    const groundMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x19170d,
        roughness: 1,
      });

    const ground =
      new THREE.Mesh(
        groundGeometry,
        groundMaterial
      );

    ground.rotation.x =
      -Math.PI / 2;

    ground.receiveShadow = true;

    scene.add(ground);

    /*
     * =======================================================
     * ROAD
     * =======================================================
     */

    const roadGeometry =
      new THREE.PlaneGeometry(
        18,
        220
      );

    const roadMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x222016,
        roughness: 0.9,
      });

    const road =
      new THREE.Mesh(
        roadGeometry,
        roadMaterial
      );

    road.rotation.x =
      -Math.PI / 2;

    road.position.y = 0.01;

    scene.add(road);

    /*
     * =======================================================
     * SIDEWALKS
     * =======================================================
     */

    [-12, 12].forEach((x) => {
      const sidewalk =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            5,
            0.25,
            220
          ),
          new THREE.MeshStandardMaterial({
            color: 0x303020,
            roughness: 1,
          })
        );

      sidewalk.position.set(
        x,
        0.12,
        0
      );

      sidewalk.receiveShadow = true;

      scene.add(sidewalk);
    });

    /*
     * =======================================================
     * BUILDINGS
     * =======================================================
     */

    const buildingMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x0c0e0c,
        roughness: 1,
      });

    for (
      let z = -100;
      z <= 100;
      z += 16
    ) {
      [-22, 22].forEach((x) => {
        const width =
          12 +
          Math.random() * 5;

        const height =
          8 +
          Math.random() * 18;

        const depth =
          11 +
          Math.random() * 7;

        const building =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              width,
              height,
              depth
            ),
            buildingMaterial
          );

        building.position.set(
          x,
          height / 2,
          z
        );

        building.castShadow = true;
        building.receiveShadow = true;

        scene.add(building);
      });
    }

    /*
     * =======================================================
     * STREET LIGHTS
     * =======================================================
     */

    for (
      let z = -100;
      z <= 100;
      z += 12
    ) {
      [-8, 8].forEach((x) => {
        const pole =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.06,
              0.06,
              4,
              8
            ),
            new THREE.MeshStandardMaterial({
              color: 0x33332b,
            })
          );

        pole.position.set(
          x,
          2,
          z
        );

        pole.castShadow = true;

        scene.add(pole);

        const light =
          new THREE.PointLight(
            0xffc94a,
            0.7,
            9
          );

        light.position.set(
          x,
          4.2,
          z
        );

        scene.add(light);
      });
    }

    /*
     * =======================================================
     * ENVIRONMENT / DEBRIS
     * =======================================================
     */

    for (
      let i = 0;
      i < 18;
      i++
    ) {
      const obstacle =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            1.5 +
              Math.random() * 2,
            0.8 +
              Math.random() * 1.2,
            1.5 +
              Math.random() * 2
          ),
          new THREE.MeshStandardMaterial({
            color: 0x28281d,
            roughness: 1,
          })
        );

      obstacle.position.set(
        -6 +
          Math.random() * 12,
        0.6,
        -10 -
          Math.random() * 100
      );

      obstacle.rotation.y =
        Math.random() * Math.PI;

      obstacle.castShadow = true;

      scene.add(obstacle);
    }

    /*
     * =======================================================
     * OBJECTIVE
     * =======================================================
     */

    const objective =
      new THREE.Mesh(
        new THREE.OctahedronGeometry(
          1.1
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffc642,
        })
      );

    objective.position.set(
      target.current.x,
      3,
      target.current.z
    );

    scene.add(objective);

    const objectiveLight =
      new THREE.PointLight(
        0xffc642,
        3,
        15
      );

    objectiveLight.position.set(
      target.current.x,
      3,
      target.current.z
    );

    scene.add(objectiveLight);

    /*
     * =======================================================
     * RESIZE
     * =======================================================
     */

    const handleResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    /*
     * =======================================================
     * KEYBOARD
     * =======================================================
     */

    const down = (event) => {
      keys.current[
        event.key.toLowerCase()
      ] = true;
    };

    const up = (event) => {
      keys.current[
        event.key.toLowerCase()
      ] = false;
    };

    window.addEventListener(
      "keydown",
      down
    );

    window.addEventListener(
      "keyup",
      up
    );

    /*
     * =======================================================
     * GAME LOOP
     * =======================================================
     */

    let animationFrame;

    let lastTime =
      performance.now();

    const animate = (
      currentTime
    ) => {
      const delta =
        Math.min(
          (currentTime -
            lastTime) /
            1000,
          0.05
        );

      lastTime =
        currentTime;

      const p =
        player.current;

      let forward = 0;
      let strafe = 0;

      /*
       * KEYBOARD MOVEMENT
       */

      if (
        keys.current.w ||
        keys.current.arrowup
      ) {
        forward += 1;
      }

      if (
        keys.current.s ||
        keys.current.arrowdown
      ) {
        forward -= 1;
      }

      if (
        keys.current.a ||
        keys.current.arrowleft
      ) {
        strafe -= 1;
      }

      if (
        keys.current.d ||
        keys.current.arrowright
      ) {
        strafe += 1;
      }

      /*
       * MOBILE JOYSTICK
       */

      forward +=
        -joystick.current.y;

      strafe +=
        joystick.current.x;

      const rawMagnitude =
        Math.sqrt(
          forward * forward +
            strafe * strafe
        );

      const magnitude =
        Math.min(
          1,
          rawMagnitude
        );

      if (
        magnitude > 0.05
      ) {
        const speed =
          sprinting
            ? 9
            : 5;

        const move =
          speed *
          delta *
          magnitude;

        const yaw =
          p.yaw;

        p.x +=
          Math.sin(yaw) *
            forward *
            move +
          Math.cos(yaw) *
            strafe *
            move;

        p.z +=
          Math.cos(yaw) *
            forward *
            move -
          Math.sin(yaw) *
            strafe *
            move;
      }

      /*
       * KEEP PLAYER INSIDE DISTRICT
       */

      p.x = THREE.MathUtils.clamp(
        p.x,
        -9,
        9
      );

      p.z = THREE.MathUtils.clamp(
        p.z,
        -108,
        12
      );

      /*
       * CAMERA
       */

      camera.position.set(
        p.x,
        p.y,
        p.z
      );

      const direction =
        new THREE.Vector3(
          Math.sin(p.yaw),
          Math.sin(p.pitch),
          Math.cos(p.yaw)
        );

      camera.lookAt(
        p.x + direction.x,
        p.y + direction.y,
        p.z + direction.z
      );

      /*
       * OBJECTIVE DISTANCE
       */

      const dx =
        target.current.x -
        p.x;

      const dz =
        target.current.z -
        p.z;

      const currentDistance =
        Math.sqrt(
          dx * dx +
            dz * dz
        );

      const roundedDistance =
        Math.max(
          0,
          Math.round(
            currentDistance
          )
        );

      setDistance(
        roundedDistance
      );

      const isNear =
        currentDistance < 4;

      setNearObjective(
        isNear
      );

      /*
       * DO NOT AUTO-COMPLETE
       *
       * The player must press
       * INTERACT.
       */

      /*
       * OBJECTIVE ANIMATION
       */

      objective.rotation.y +=
        delta * 1.5;

      objective.position.y =
        3 +
        Math.sin(
          currentTime * 0.003
        ) *
          0.25;

      /*
       * RENDER
       */

      renderer.render(
        scene,
        camera
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    animationFrame =
      requestAnimationFrame(
        animate
      );

    /*
     * =======================================================
     * CLEANUP
     * =======================================================
     */

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      window.removeEventListener(
        "keydown",
        down
      );

      window.removeEventListener(
        "keyup",
        up
      );

      if (
        mountRef.current &&
        renderer.domElement &&
        mountRef.current.contains(
          renderer.domElement
        )
      ) {
        mountRef.current.removeChild(
          renderer.domElement
        );
      }

      renderer.dispose();
    };
  }, [sprinting]);

  /*
   * =========================================================
   * MUSIC SYSTEM
   * =========================================================
   *
   * IMPORTANT:
   * The file must exist at:
   *
   * public/assets/baha-music.mp4
   *
   * The browser URL is:
   *
   * /assets/baha-music.mp4
   *
   * =========================================================
   */

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.45;

    /*
     * Do NOT automatically call play()
     * here.
     *
     * Mobile browsers can block autoplay.
     */

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  /*
   * =========================================================
   * MUSIC TOGGLE
   * =========================================================
   */

  const toggleMusic = async () => {
    const audio =
      audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        audio.loop = true;
        audio.volume = 0.45;

        await audio.play();

        setMusicOn(true);
      } else {
        audio.pause();

        setMusicOn(false);
      }
    } catch (error) {
      console.error(
        "TATSULOK MUSIC ERROR:",
        error
      );

      setMusicOn(false);
    }
  };

  /*
   * =========================================================
   * JOYSTICK
   * =========================================================
   */

  const handleJoystickStart = (
    e
  ) => {
    e.preventDefault();

    joystick.current.active =
      true;

    updateJoystick(e);
  };

  const updateJoystick = (
    e
  ) => {
    if (
      !joystick.current.active
    ) {
      return;
    }

    const touch =
      e.touches?.[0] || e;

    if (!touch) return;

    const rect =
      e.currentTarget.getBoundingClientRect();

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

    joystick.current.x =
      x;

    joystick.current.y =
      y;
  };

  const stopJoystick = (
    e
  ) => {
    e.preventDefault();

    joystick.current.active =
      false;

    joystick.current.x = 0;
    joystick.current.y = 0;
  };

  /*
   * =========================================================
   * CAMERA LOOK
   * =========================================================
   */

  const startLook = (
    e
  ) => {
    /*
     * Don't steal the touch
     * when touching the joystick
     * or buttons.
     */

    if (
      e.target.closest(
        ".movement-joystick"
      ) ||
      e.target.closest(
        ".right-controls"
      ) ||
      e.target.closest(
        ".game-top"
      ) ||
      e.target.closest(
        ".objective-interact"
      )
    ) {
      return;
    }

    e.preventDefault();

    look.current.active =
      true;

    const touch =
      e.touches?.[0];

    if (!touch) return;

    look.current.x =
      touch.clientX;

    look.current.y =
      touch.clientY;
  };

  const moveLook = (
    e
  ) => {
    if (
      !look.current.active
    ) {
      return;
    }

    const touch =
      e.touches?.[0];

    if (!touch) return;

    e.preventDefault();

    const dx =
      touch.clientX -
      look.current.x;

    const dy =
      touch.clientY -
      look.current.y;

    look.current.x =
      touch.clientX;

    look.current.y =
      touch.clientY;

    player.current.yaw -=
      dx * 0.004;

    player.current.pitch -=
      dy * 0.0025;

    player.current.pitch =
      Math.max(
        -1.1,
        Math.min(
          1.1,
          player.current.pitch
        )
      );
  };

  const stopLook = () => {
    look.current.active =
      false;
  };

  /*
   * =========================================================
   * INTERACT
   * =========================================================
   */

  const interact = () => {
    if (!nearObjective) {
      return;
    }

    onComplete?.();
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="district-game">

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
          THREE.JS CANVAS
          ===================================================== */}

      <div
        ref={mountRef}
        className="district-canvas"
        onTouchStart={
          startLook
        }
        onTouchMove={
          moveLook
        }
        onTouchEnd={
          stopLook
        }
        onTouchCancel={
          stopLook
        }
      />

      {/* =====================================================
          TOP HUD
          ===================================================== */}

      <div className="game-top">

        <button
          className="game-back"
          onClick={onExit}
        >
          ← BACK
        </button>

        <div className="game-title">

          <small>
            MISSION{" "}
            {missionNumber}
          </small>

          <strong>
            {missionTitle}
          </strong>

          <span>
            DISTRICT 7
          </span>

        </div>

        <div className="objective-distance">

          <small>
            OBJECTIVE
          </small>

          <strong>
            {distance}m
          </strong>

        </div>

        {/* MUSIC BUTTON */}

        <button
          className={
            "music-button " +
            (musicOn
              ? "music-active"
              : "")
          }
          onClick={
            toggleMusic
          }
          aria-label={
            musicOn
              ? "Turn music off"
              : "Turn music on"
          }
        >
          {musicOn
            ? "🔊"
            : "🔇"}
        </button>

      </div>

      {/* =====================================================
          CENTER OBJECTIVE
          ===================================================== */}

      <div className="objective-marker">

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

      {/* =====================================================
          MISSION INFO
          ===================================================== */}

      <div className="mission-objective-box">

        <small>
          MISSION OBJECTIVE
        </small>

        <h2>
          EVACUATION CENTER
        </h2>

        <p>
          {mission?.description ||
            "May emergency sa distrito. Tuklasin ang evacuation center at alamin kung ano ang tunay na nangyayari."}
        </p>

      </div>

      {/* =====================================================
          MOBILE MOVEMENT JOYSTICK
          ===================================================== */}

      <div
        className="movement-joystick"
        onTouchStart={
          handleJoystickStart
        }
        onTouchMove={
          updateJoystick
        }
        onTouchEnd={
          stopJoystick
        }
        onTouchCancel={
          stopJoystick
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

      {/* =====================================================
          RIGHT-SIDE CONTROLS
          ===================================================== */}

      <div className="right-controls">

        {/* INTERACT */}

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

        {/* SPRINT */}

        <button
          className={
            "control-button " +
            (sprinting
              ? "pressed"
              : "")
          }
          onTouchStart={() =>
            setSprinting(true)
          }
          onTouchEnd={() =>
            setSprinting(false)
          }
          onTouchCancel={() =>
            setSprinting(false)
          }
          onMouseDown={() =>
            setSprinting(true)
          }
          onMouseUp={() =>
            setSprinting(false)
          }
          onMouseLeave={() =>
            setSprinting(false)
          }
        >
          🏃
        </button>

        {/* INVENTORY */}

        <button
          className="control-button"
          onClick={() =>
            alert(
              "Inventory — coming soon"
            )
          }
        >
          🎒
        </button>

      </div>

      {/* =====================================================
          CAMERA GUIDE
          ===================================================== */}

      <div className="camera-hint">
        SWIPE TO LOOK
      </div>

      {/* =====================================================
          OBJECTIVE INTERACTION
          ===================================================== */}

      {nearObjective && (
        <button
          className="objective-interact"
          onClick={
            interact
          }
        >
          INTERACT — EVACUATION CENTER
        </button>
      )}

    </div>
  );
}
