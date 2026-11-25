"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RobloxCityMap({
  buildings,
  completedQuestions,
  visitedBuildings = [],
  lockedBuildings = [],
  activeBuildingId,
  onSelectBuilding,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#bae6fd");
    scene.fog = new THREE.Fog("#bae6fd", 28, 65);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, 26);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    // Baseplate Hijau Roblox
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(38, 1, 30),
      new THREE.MeshLambertMaterial({ color: "#4ade80" })
    );
    ground.position.y = -0.5;
    scene.add(ground);

    // Jalan Kota
    const mainRoad = new THREE.Mesh(
      new THREE.BoxGeometry(34, 0.1, 4.5),
      new THREE.MeshLambertMaterial({ color: "#334155" })
    );
    mainRoad.position.set(0, 0.05, -1);
    scene.add(mainRoad);

    const buildingMeshes = [];

    buildings.forEach((b) => {
      const group = new THREE.Group();
      const [bx, , bz] = b.position;
      group.position.set(bx, 0, bz);

      const allQs = [...b.levels.pemula, ...b.levels.menengah, ...b.levels.mahir];
      const solvedCount = allQs.filter((q) => completedQuestions[q.id]?.correct).length;
      const isLocked = lockedBuildings.includes(b.id) || (visitedBuildings.includes(b.id) && activeBuildingId !== b.id);
      const isActive = activeBuildingId === b.id;

      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.3, 4.2),
        new THREE.MeshLambertMaterial({ color: isActive ? "#facc15" : "#cbd5e1" })
      );
      baseMesh.position.y = 0.15;
      group.add(baseMesh);

      let bodyColor = b.color;
      if (isLocked && solvedCount === 6) bodyColor = "#22c55e";
      else if (isLocked) bodyColor = "#64748b";

      const bodyMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, b.height, 3.4),
        new THREE.MeshLambertMaterial({ color: bodyColor })
      );
      bodyMesh.position.y = b.height / 2 + 0.3;
      bodyMesh.userData = { buildingId: b.id };
      group.add(bodyMesh);
      buildingMeshes.push(bodyMesh);

      const roofMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.7, 0.4, 3.7),
        new THREE.MeshLambertMaterial({ color: "#1e293b" })
      );
      roofMesh.position.y = b.height + 0.5;
      group.add(roofMesh);

      const beaconColor = isActive
        ? "#38bdf8"
        : isLocked
        ? solvedCount === 6
          ? "#22c55e"
          : "#ef4444"
        : "#facc15";

      const beacon = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.1, 1.1),
        new THREE.MeshBasicMaterial({ color: beaconColor })
      );
      beacon.position.y = b.height + 1.5;
      beacon.userData = { isBeacon: true, buildingId: b.id };
      group.add(beacon);

      scene.add(group);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let prevX = 0;
    let cameraAngle = 0;

    const getX = (e) => (e.touches?.[0]?.clientX ?? e.clientX);

    const handleDown = (e) => {
      isDragging = false;
      prevX = getX(e);
    };

    const handleMove = (e) => {
      const x = getX(e);
      if (Math.abs(x - prevX) > 6) {
        isDragging = true;
        cameraAngle -= (x - prevX) * 0.008;
        camera.position.x = Math.sin(cameraAngle) * 26;
        camera.position.z = Math.cos(cameraAngle) * 26;
        camera.lookAt(0, 1, 0);
        prevX = x;
      }
    };

    const handleUp = (e) => {
      if (isDragging) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = e.changedTouches?.[0]?.clientX ?? e.clientX;
      const clientY = e.changedTouches?.[0]?.clientY ?? e.clientY;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);
      if (intersects.length > 0) {
        onSelectBuilding(intersects[0].object.userData.buildingId);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handleDown);
    dom.addEventListener("mousemove", handleMove);
    dom.addEventListener("mouseup", handleUp);
    dom.addEventListener("touchstart", handleDown, { passive: true });
    dom.addEventListener("touchmove", handleMove, { passive: true });
    dom.addEventListener("touchend", handleUp);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      scene.traverse((obj) => {
        if (obj.userData?.isBeacon) obj.rotation.y += 0.03;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", handleDown);
      dom.removeEventListener("mousemove", handleMove);
      dom.removeEventListener("mouseup", handleUp);
      dom.removeEventListener("touchstart", handleDown);
      dom.removeEventListener("touchmove", handleMove);
      dom.removeEventListener("touchend", handleUp);
      container.removeChild(dom);
      renderer.dispose();
    };
  }, [buildings, completedQuestions, visitedBuildings, lockedBuildings, activeBuildingId, onSelectBuilding]);

  return (
    <div className="relative w-full h-[46vh] min-h-[300px] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 bg-slate-900/85 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur">
        Geser putar kota • Kuning: Tersedia (1x masuk) • Abu/Merah: Terkunci/Selesai
      </div>
    </div>
  );
}
