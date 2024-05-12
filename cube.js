let scene, camera, renderer, sphere;
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("");
  const material = new THREE.MeshStandardMaterial({ map: texture });
  sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  scene.add(sphere);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xffffff, 1);
  document.body.appendChild(renderer.domElement);

  document.addEventListener("touchstart", onTouchStart, false);
  document.addEventListener("touchmove", onTouchMove, false);
  document.addEventListener("touchend", onTouchEnd, false);
  document.addEventListener("mousedown", onMouseDown, false);
  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("mouseup", onMouseUp, false);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onTouchStart(event) {
  isDragging = true;
  previousMousePosition.x = event.touches[0].clientX;
  previousMousePosition.y = event.touches[0].clientY;
}

function onTouchMove(event) {
  if (!isDragging) return;

  const touchEndX = event.touches[0].clientX;
  const deltaX = touchEndX - previousMousePosition.x;
  sphere.rotation.y += deltaX * 0.01;
  previousMousePosition.x = touchEndX;
}

function onTouchEnd() {
  isDragging = false;
}

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition.x = event.clientX;
}

function onMouseMove(event) {
  if (!isDragging) return;

  const mouseX = event.clientX;
  const deltaX = mouseX - previousMousePosition.x;
  sphere.rotation.y += deltaX * 0.01;
  previousMousePosition.x = mouseX;
}

function onMouseUp() {
  isDragging = false;
}

function handleTextureChange(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (!file) {
    alert("No file selected!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const imageUrl = event.target.result;
    changeTexture(imageUrl);
  };
  reader.readAsDataURL(file);
}

function changeTexture(textureUrl) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textureUrl);
  sphere.material.map = texture;
  sphere.material.needsUpdate = true;
}

init();

function showDiv(divId) {
    var div = document.getElementById(divId);
    if (div.style.display === "none") {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
}

