"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const BUILDING_LAYOUT = [
  { id: 1, name: "Auth Tower", x: -16, z: -12, w: 5, h: 9, d: 5, color: 0x3b82f6 },
  { id: 2, name: "SQL Vault", x: -5, z: -12, w: 6, h: 7, d: 5, color: 0x06b6d4 },
  { id: 3, name: "API Gateway", x: 7, z: -12, w: 5, h: 8, d: 5, color: 0x6366f1 },
  { id: 4, name: "Crypto Bank", x: 17, z: -12, w: 5, h: 10, d: 5, color: 0x8b5cf6 },
  { id: 5, name: "Session Hub", x: -16, z: 0, w: 5, h: 6, d: 5, color: 0x10b981 },
  { id: 6, name: "Cloud Core", x: 17, z: 0, w: 5, h: 9, d: 5, color: 0x0ea5e9 },
  { id: 7, name: "XSS Studio", x: -16, z: 12, w: 5, h: 7, d: 5, color: 0xf59e0b },
  { id: 8, name: "IDS Radar", x: -5, z: 12, w: 6, h: 8, d: 5, color: 0x14b8a6 },
  { id: 9, name: "DevSecOps Lab", x: 7, z: 12, w: 5, h: 7, d: 5, color: 0xec4899 },
  { id: 10, name: "SOC Citadel", x: 17, z: 12, w: 6, h: 11, d: 5, color: 0xef4444 },
];

export default function RobloxCityMap({
  buildings = [],
  selectedBuildingId,
  onSelectBuilding,
}) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onSelectBuilding);
  onSelectRef.current = onSelectBuilding;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.014);

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 160);
    camera.position.set(0, 26, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(18, 32, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Lantai kota blocky
    const groundGeo = new THREE.BoxGeometry(52, 1, 40);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Jalan grid
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const roadH = new THREE.Mesh(new THREE.BoxGeometry(48, 0.12, 3.2), roadMat);
    roadH.position.set(0, 0.05, 6);
    scene.add(roadH);

    const roadV = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 36), roadMat);
    roadV.position.set(1, 0.05, 0);
    scene.add(roadV);

    const meshes = [];
    const statusMap = new Map(
      buildings.map((b) => [Number(b.buildingId ?? b.id), b])
    );

    BUILDING_LAYOUT.forEach((item) => {
      const info = statusMap.get(item.id) || {};
      const status = info.status || "available";
      const isSelected = Number(selectedBuildingId) === item.id;

      let color = item.color;
      if (status === "completed") color = 0x22c55e;
      else if (status === "locked" || status === "ejected") color = 0x475569;

      const geo = new THREE.BoxGeometry(item.w, item.h, item.d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: isSelected ? 0x1d4ed8 : 0x000000,
        emissiveIntensity: isSelected ? 0.5 : 0,
        roughness: 0.45,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(item.x, item.h / 2, item.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { buildingId: item.id, baseY: item.h / 2 };

      // Atap blocky khas gaya Roblox
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(item.w + 0.4, 0.6, item.d + 0.4),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      roof.position.y = item.h / 2 + 0.3;
      mesh.add(roof);

      scene.add(mesh);
      meshes.push(mesh);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0 && typeof onSelectRef.current === "function") {
        onSelectRef.current(hits[0].object.userData.buildingId);
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      meshes.forEach((m) => {
        if (Number(selectedBuildingId) === m.userData.buildingId) {
          m.position.y = m.userData.baseY + Math.sin(elapsed * 4) * 0.35;
        } else {
          m.position.y = m.userData.baseY;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [buildings, selectedBuildingId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer select-none"
    />
  );
}
