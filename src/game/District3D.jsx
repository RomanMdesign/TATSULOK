import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function District3D({ playerPos, targetPos, isInterior }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    // Pagbabago ng kulay ng paligid depende kung nasa LOOB (Interior) o LABAS (Outdoor)
    if (isInterior) {
      scene.background = new THREE.Color(0x1a1510); // Warm dark interior
      scene.fog = new THREE.FogExp2(0x1a1510, 0.05);
    } else {
      scene.background = new THREE.Color(0x0a0a0c); // Dark city night
      scene.fog = new THREE.FogExp2(0x0a0a0c, 0.025);
    }

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isInterior ? 0.4 : 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(isInterior ? 0xffaa44 : 0xff4500, 0.8);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    if (isInterior) {
      // --- INTERIOR ROOM ENVIRONMENT ---
      // Floor
      const roomFloorGeo = new THREE.PlaneGeometry(30, 30);
      const roomFloorMat = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.4 });
      const roomFloor = new THREE.Mesh(roomFloorGeo, roomFloorMat);
      roomFloor.rotation.x = -Math.PI / 2;
      scene.add(roomFloor);

      // Walls
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x221a15 });
      const wall1 = new THREE.Mesh(new THREE.BoxGeometry(30, 8, 1), wallMat);
      wall1.position.set(0, 4, -15);
      scene.add(wall1);

      const wall2 = new THREE.Mesh(new THREE.BoxGeometry(30, 8, 1), wallMat);
      wall2.position.set(0, 4, 15);
      scene.add(wall2);

      const wall3 = new THREE.Mesh(new THREE.BoxGeometry(1, 8, 30), wallMat);
      wall3.position.set(-15, 4, 0);
      scene.add(wall3);

      const wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 8, 30), wallMat);
      wall4.position.set(15, 4, 0);
      scene.add(wall4);

      // Interior Props (Desks, Chairs)
      const deskGeo = new THREE.BoxGeometry(4, 1.5, 2);
      const deskMat = new THREE.MeshStandardMaterial({ color: 0x553311 });
      const desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.set(0, 0.75, -5);
      scene.add(desk);

    } else {
      // --- OUTSIDE CITY ENVIRONMENT ---
      const groundGeo = new THREE.PlaneGeometry(300, 300);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x111115 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // City Buildings
      const buildingMat = new THREE.MeshStandardMaterial({ color: 0x1f1f28, roughness: 0.7 });
      for (let x = -80; x <= 80; x += 25) {
        for (let z = -80; z <= 80; z += 25) {
          if (Math.abs(x) < 12 && Math.abs(z) < 12) continue; // Keep center clear
          const h = Math.random() * 20 + 10;
          const geo = new THREE.BoxGeometry(15, h, 15);
          const b = new THREE.Mesh(geo, buildingMat);
          b.position.set(x, h / 2, z);
          b.castShadow = true;
          scene.add(b);
        }
      }
    }

    // Objective Marker (Floating Golden Octahedron)
    const objGeo = new THREE.OctahedronGeometry(1.2);
    const objMat = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true });
    const objMesh = new THREE.Mesh(objGeo, objMat);
    objMesh.position.set(targetPos.x, 1.8, targetPos.z);
    scene.add(objMesh);

    // Camera setup
    camera.position.set(playerPos.x, 1.7, playerPos.z);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      objMesh.rotation.y += 0.03;
      camera.position.set(playerPos.x, 1.7, playerPos.z);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [playerPos, targetPos, isInterior]);

  return <div ref={mountRef} className="w-full h-full absolute inset-0 z-0" />;
}
