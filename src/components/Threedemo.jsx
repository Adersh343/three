// src/components/ThreeDModel.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDModel = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set up the loader to load the GLTF model
    const loader = new GLTFLoader();
    loader.load('../models/adamHead.gltf', (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      model.scale.set(1, 1, 1); // Adjust the scale of the model

      // Position the camera
      camera.position.z = 5;

      // Set up the animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate the model for a simple animation
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
    });

    // Handle resizing
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ThreeDModel;
