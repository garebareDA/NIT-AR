'use strict';
let mesh;
//シーンの作成
const scene = new THREE.Scene();

//レンダラー
let render = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

//レンダラーの設定
render.setClearColor(new THREE.Color('black'), 0);
render.setSize(640, 480);
render.domElement.style.position = 'absolute';
render.domElement.style.top = '0px';
render.domElement.style.left = '0px';
document.body.appendChild(render.domElement);

//カメラの追加
var camera = new THREE.Camera();
scene.add(camera);

//ライトの追加
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 2);
scene.add(light);

const source = new THREEx.ArToolkitSource({
  sourceType: 'webcam'
});

//初期化とリサイズ
source.init(function onReady() {
  onResize();
});

//ARカメラ
const context = new THREEx.ArToolkitContext({

  debug: false,
  cameraParametersUrl: './camera_para.dat',
  detectionMode: 'mono',
  imageSmoothingEnabled: true,
  maxDetectionRate: 60,
  canvasWidth: source.parameters.sourceWidth,
  canvasHeight: source.parameters.sourceHeight

});

context.init(function onCompleted(){
  camera.projectionMatrix.copy(context.getProjectionMatrix());
});


window.addEventListener('resize', function () {
  onResize();
});

//マーカー
const marker1 = new THREE.Group();
const controls = new THREEx.ArMarkerControls(context, marker1, {
  type: 'pattern',
  patternUrl: './NIT.patt'
});

scene.add(marker1);

const loader = new THREE.GLTFLoader();
const model = 'model/itボーン.gltf';

loader.load(model, (data) => {
  const gltf = data;
  const object = gltf.scene;

  marker1.add(object);  
});

renderScene();

function renderScene() {
  requestAnimationFrame(renderScene);
  if(source.ready === false)    { return; }

  context.update(source.domElement);
  render.render(scene, camera);   
}

//リサイズ処理
function onResize(){
  source.onResizeElement(); 
  source.copyElementSizeTo(render.domElement);
  if(context.arController !== null){
    source.copyElementSizeTo(context.arController.canvas);
  }
}
