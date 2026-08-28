import {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";

import * as THREE from "three";

import PlayerController from "./PlayerController";
import {
  calculateDistance,
  isNearObjective
} from "./MissionSystem";

export default function District3D({
  mission,
  onExit,
  onComplete
}) {
  const containerRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  const playerRef = useRef({
    x: 0,
    y: 2,
    z: 8,
    yaw: 0
  });

  const [distance, setDistance] = useState(98);
  const [nearObjective, setNearObjective] = useState(false);
  const [dialogue, setDialogue] = useState(false);

  const createBuilding = useCallback(
    (scene, x, z, width, height, depth) => {
      const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
      );

      const material = new THREE.MeshStandardMaterial({
        color: 0x171d1f,
        roughness: 0.9,
        metalness: 0.1
      });

      const building = new THREE.Mesh(
        geometry,
        material
      );

      building.position.set(
        x,
        height / 2,
        z
      );

      scene.add(building);

      const windows = new THREE.MeshBasicMaterial({
        color: 0x31484a
      });

      const rows = Math.max(2, Math.floor(height / 4));
      const cols = Math.max(2, Math.floor(width / 3));

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const windowGeometry =
            new THREE.BoxGeometry(
              0.7,
              0.9,
              0.05
            );

          const windowMesh = new THREE.Mesh(
            windowGeometry,
            windows
          );

          const px =
            x -
            width / 2 +
            1.5 +
            col * 3;

          const py =
            2 +
            row * 3.5;

          windowMesh.position.set(
            px,
            py,
            z - depth / 2 - 0.03
          );

          scene.add(windowMesh);
        }
      }
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(
      0x071114
    );

    scene.fog = new THREE.Fog(
      0x071114,
      35,
      220
    );

    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth /
        container.clientHeight,
      0.1,
      500
    );

    camera.position.set(
      0,
      2,
      8
    );

    cameraRef.current = camera;

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
      });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.shadowMap.enabled = true;

    container.appendChild(
      renderer.domElement
    );

    rendererRef.current = renderer;

    // LIGHTING

    const ambient =
      new THREE.HemisphereLight(
        0x9fb4b5,
        0x020304,
        1.5
      );

    scene.add(ambient);

    const moon =
      new THREE.DirectionalLight(
        0xffd36a,
        2
      );

    moon.position.set(
      30,
      70,
      20
    );

    moon.castShadow = true;

    scene.add(moon);

    // GROUND

    const groundGeometry =
      new THREE.PlaneGeometry(
        300,
        300
      );

    const groundMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x101c1f,
        roughness: 1
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

    // ROAD

    const roadGeometry =
      new THREE.PlaneGeometry(
        22,
        300
      );

    const roadMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x101619,
        roughness: 1
      });

    const road =
      new THREE.Mesh(
        roadGeometry,
        roadMaterial
      );

    road.rotation.x =
      -Math.PI / 2;

    road.position.y =
      0.02;

    scene.add(road);

    // SIDEWALKS

    const sidewalkMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x1d292b
      });

    [-15, 15].forEach((x) => {
      const sidewalk =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            8,
            0.3,
            300
          ),
          sidewalkMaterial
        );

      sidewalk.position.set(
        x,
        0.15,
        0
      );

      scene.add(sidewalk);
    });

    // BUILDINGS

    createBuilding(
      scene,
      -28,
      -30,
      18,
      30,
      35
    );

    createBuilding(
      scene,
      28,
      -45,
      22,
      38,
      42
    );

    createBuilding(
      scene,
      -30,
      35,
      20,
      24,
      30
    );

    createBuilding(
      scene,
      30,
      50,
      24,
      32,
      40
    );

    createBuilding(
      scene,
      -28,
      -105,
      20,
      42,
      38
    );

    createBuilding(
      scene,
      30,
      -115,
      22,
      34,
      40
    );

    // STREET LIGHTS

    for (
      let z = -135;
      z < 130;
      z += 18
    ) {
      [-11, 11].forEach((x) => {
        const pole =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.08,
              0.08,
              5,
              8
            ),
            new THREE.MeshStandardMaterial({
              color: 0x252a2a
            })
          );

        pole.position.set(
          x,
          2.5,
          z
        );

        scene.add(pole);

        const lamp =
          new THREE.PointLight(
            0xffcc55,
            3,
            12
          );

        lamp.position.set(
          x,
          5,
          z
        );

        scene.add(lamp);
      });
    }

    // OBJECTIVE

    const objectiveGroup =
      new THREE.Group();

    const marker =
      new THREE.Mesh(
        new THREE.OctahedronGeometry(
          1.2,
          0
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffc857,
          emissive: 0xffa800,
          emissiveIntensity: 2
        })
      );

    marker.position.y = 5;

    objectiveGroup.add(marker);

    const objectiveBase =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          7,
          0.15,
          2.2
        ),
        new THREE.MeshBasicMaterial({
          color: 0xd6a93a,
          transparent: true,
          opacity: 0.5
        })
      );

    objectiveBase.position.y =
      0.08;

    objectiveGroup.add(
      objectiveBase
    );

    objectiveGroup.position.set(
      mission.objectivePosition.x,
      0,
      mission.objectivePosition.z
    );

    scene.add(objectiveGroup);

    // VEHICLE

    const car =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          3,
          1,
          5
        ),
        new THREE.MeshStandardMaterial({
          color: 0x080b0c
        })
      );

    car.position.set(
      4,
      0.6,
      -45
    );

    scene.add(car);

    // DEBRIS

    for (let i = 0; i < 25; i++) {
      const debris =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            Math.random() * 2 + 0.5,
            Math.random() * 1 + 0.3,
            Math.random() * 2 + 0.5
          ),
          new THREE.MeshStandardMaterial({
            color: 0x30383a
          })
        );

      debris.position.set(
        (Math.random() - 0.5) * 18,
        0.4,
        Math.random() * 180 - 90
      );

      scene.add(debris);
    }

    const clock =
      new THREE.Clock();

    let animationFrame;

    const animate = () => {
      animationFrame =
        requestAnimationFrame(
          animate
        );

      const player =
        playerRef.current;

      camera.position.set(
        player.x,
        player.y,
        player.z
      );

      camera.rotation.order =
        "YXZ";

      camera.rotation.y =
        player.yaw;

      marker.rotation.y +=
        clock.getDelta() * 2;

      const currentDistance =
        calculateDistance(
          player,
          mission.objectivePosition
        );

      setDistance(
        Math.max(
          0,
          Math.round(
            currentDistance
          )
        )
      );

      setNearObjective(
        isNearObjective(
          player,
          mission.objectivePosition,
          5
        )
      );

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    const resize = () => {
      if (!container) return;

      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      renderer.dispose();

      if (
        renderer.domElement.parentNode
      ) {
        renderer.domElement.parentNode.removeChild(
          renderer.domElement
        );
      }
    };
  }, [createBuilding, mission]);

  const handleMove = useCallback(
    ({ x, z }) => {
      const player =
        playerRef.current;

      const speed = 0.14;

      const yaw = player.yaw;

      const forwardX =
        -Math.sin(yaw);

      const forwardZ =
        -Math.cos(yaw);

      const rightX =
        Math.cos(yaw);

      const rightZ =
        -Math.sin(yaw);

      player.x +=
        (forwardX * z +
          rightX * x) *
        speed;

      player.z +=
        (forwardZ * z +
          rightZ * x) *
        speed;

      // WORLD BOUNDS

      player.x =
        Math.max(
          -11,
          Math.min(11, player.x)
        );

      player.z =
        Math.max(
          -145,
          Math.min(130, player.z)
        );
    },
    []
  );

  const handleLook = useCallback(
    ({ x }) => {
      playerRef.current.yaw -=
        x * 0.004;
    },
    []
  );

  const interact = () => {
    if (!nearObjective) return;

    setDialogue(true);
  };

  const completeMission = () => {
    setDialogue(false);
    onComplete?.();
  };

  return (
    <div className="game-screen">
      <div
        ref={containerRef}
        className="three-container"
      />

      <PlayerController
        onMove={handleMove}
        onLook={handleLook}
      />

      {/* TOP BAR */}

      <div className="game-topbar">
        <button
          className="back-button"
          onClick={onExit}
        >
          ← BACK
        </button>

        <div>
          <div className="game-kicker">
            MISSION {mission.number}
          </div>

          <div className="game-title">
            {mission.category}
          </div>

          <div className="game-district">
            {mission.district}
          </div>
        </div>

        <div className="objective-box">
          <span>OBJECTIVE</span>
          <strong>{distance}m</strong>
        </div>
      </div>

      {/* OBJECTIVE HUD */}

      <div className="world-objective">
        <div className="objective-diamond">
          ◆
        </div>

        <div className="objective-label">
          {mission.objective}
        </div>

        <div className="objective-distance">
          {distance}m
        </div>
      </div>

      {/* MISSION PANEL */}

      <div className="mission-panel">
        <div className="mission-panel-label">
          MISSION OBJECTIVE
        </div>

        <h2>
          {mission.objective}
        </h2>

        <p>
          {mission.description}
        </p>
      </div>

      {/* INTERACT */}

      {nearObjective && !dialogue && (
        <button
          className="interact-button"
          onClick={interact}
        >
          INTERACT
        </button>
      )}

      {/* DIALOGUE */}

      {dialogue && (
        <div className="dialogue-overlay">
          <div className="dialogue-card">
            <div className="dialogue-label">
              MISSION EVENT
            </div>

            <h2>
              EVACUATION CENTER
            </h2>

            <p>
              May mga taong nangangailangan
              ng tulong. Ngunit may isang
              bagay na hindi tugma sa
              kuwento ng distrito.
            </p>

            <p className="dialogue-question">
              Ano ang iyong gagawin?
            </p>

            <div className="choice-grid">
              <button
                onClick={completeMission}
              >
                TUMULONG
              </button>

              <button
                onClick={completeMission}
              >
                MAGHANAP NG EBIDENSYA
              </button>

              <button
                onClick={completeMission}
              >
                UMALIS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
