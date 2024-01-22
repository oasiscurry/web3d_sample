/* *****************************************************************************
 * Three.jsを利用して3Dの歯車を表示するfunctionのファイル
 *
 * @author    shingo.yoshioka
 * @copyright 2020 shingo.yoshioka
 * @license   http://opensource.org/licenses/mit-license.php MIT License
 * ****************************************************************************/
'use strict'

/* *****************************************************************************
 * 別ファイルの定義
 * ****************************************************************************/
/* global $ */
/* global THREE */

/* *****************************************************************************
 * 定数定義
 * ****************************************************************************/
const ADJUST_WIDTH = 6 // レンダリングサイズの横幅調整
const ADJUST_HEIGHT = 6 // レンダリングサイズの縦幅調整
const CANVAS_ID = '#background' // 描画先CANVASのID
const BACK_COLOR = 0xf3f3f3 // 背景色
const BACK_ALPHA = 1.0 // 背景色のアルファ値
const CAMERA_X = 0 // カメラ初期位置のX座標
const CAMERA_Y = 1 // カメラ初期位置のY座標
const CAMERA_Z = 10 // カメラ初期位置のZ座標
const CAMERA_ANGLE = 45 // カメラの視野角
const CAMERA_ASPECT = window.innerWidth / window.innerHeight // 画面のアスペクト比
const CAMERA_NEAR = 1 // カメラに映る最短距離
const CAMERA_FAR = 2000 // カメラに映る最遠距離
const AMB_COLOR = 0xffffff // 環境光の色
const AMB_PW = 1 // 環境光の強さ
const GRID_SIZE = 10 // グリッドのサイズ
const GRID_DIVISIONS = 5 // グリッドの分割数
const MODEL_DATA_PATH = 'models/gear3d.glb' // モデルデータのパス
const DRACO_DECODER_PATH = 'js/lib/' // Dracoデコーダのパス
const DEBUG_MODE = false // デバッグのオン(true)オフ(false)
const ENV_MAP = [
  // 環境マップ用テクスチャのパス
  'textures/envmap/posx.jpg',
  'textures/envmap/negx.jpg',
  'textures/envmap/posy.jpg',
  'textures/envmap/negy.jpg',
  'textures/envmap/posz.jpg',
  'textures/envmap/negz.jpg'
]
const MODEL_DATA = [
  // モデルデータのパラメータ
  // オブジェクト名、回転ベクトルx、回転ベクトルy、回転ベクトルz
  { name: 'gear01', v_rot_x: 0, v_rot_y: 0.01, v_rot_z: 0 },
  { name: 'gear02', v_rot_x: 0, v_rot_y: 0.01, v_rot_z: 0 },
  { name: 'gear03', v_rot_x: 0, v_rot_y: 0.01, v_rot_z: 0 },
  { name: 'gear04', v_rot_x: 0, v_rot_y: 0.01, v_rot_z: 0 }
]
const DIRECTION_LIGHT = [
  // 平行光源のパラメータ
  // 光の色、光の強さ、光源x、光源y、光源z
  { color: 0xffffff, pw: 3, pos_x: 0, pos_y: 1, pos_z: 40 }, // 正面
  { color: 0xffffff, pw: 3, pos_x: 40, pos_y: 1, pos_z: 0 }, // 右
  { color: 0xffffff, pw: 3, pos_x: -40, pos_y: 1, pos_z: 0 }, // 左
  { color: 0xffffff, pw: 3, pos_x: 0, pos_y: 40, pos_z: 0 } // 上
]

/* *****************************************************************************
 * グローバル変数定義
 * ****************************************************************************/
let gCamera
let gRenderer

/* *****************************************************************************
 * 初期化
 * ****************************************************************************/
$(init3DGear)

/* *****************************************************************************
 * 歯車の表示初期化処理
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function init3DGear () {
  let i
  let loadingManager
  let light
  let lightHelper
  let grid

  // シーンの作成
  const scene = new THREE.Scene()

  // カメラの作成(視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
  gCamera = new THREE.PerspectiveCamera(
    CAMERA_ANGLE,
    CAMERA_ASPECT,
    CAMERA_NEAR,
    CAMERA_FAR
  )
  gCamera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z)

  // カメラのコントロール
  const controls = new THREE.OrbitControls(gCamera)
  controls.enabled = DEBUG_MODE

  // 環境マップ用テクスチャの読込
  const texCube = new THREE.CubeTextureLoader().load(ENV_MAP)
  texCube.format = THREE.RGBFormat
  texCube.mapping = THREE.CubeReflectionMapping
  texCube.encoding = THREE.sRGBEncoding

  // Dracoローダー作成
  const dracoLoader = new THREE.DRACOLoader()
  dracoLoader.setDecoderPath(DRACO_DECODER_PATH)
  dracoLoader.setDecoderConfig({ type: 'js' })

  // glTFローダー作成
  const gltfLoader = new THREE.GLTFLoader(loadingManager)
  gltfLoader.setDRACOLoader(dracoLoader)

  // レンダラーの作成
  gRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: document.querySelector(CANVAS_ID)
  })

  // デバイスの解像度をセット
  gRenderer.setPixelRatio(window.devicePixelRatio)

  // レンダリングサイズをブラウザのサイズにセット
  gRenderer.setSize(
    window.innerWidth - ADJUST_WIDTH,
    window.innerHeight - ADJUST_HEIGHT
  )

  // 背景色と背景色のアルファ値をセット
  gRenderer.setClearColor(BACK_COLOR, BACK_ALPHA)
  gRenderer.gammaInput = true // 自動で色空間を調整
  gRenderer.gammaOutput = true // 自動で色空間を調整

  // 環境光の作成と追加
  light = new THREE.AmbientLight(AMB_COLOR, AMB_PW)
  scene.add(light)

  // 平行光源の作成と追加
  for (i = 0; i < DIRECTION_LIGHT.length; i++) {
    // 平行光源(色、光の強さ)
    light = new THREE.DirectionalLight(
      DIRECTION_LIGHT[i].color,
      DIRECTION_LIGHT[i].pw
    )
    light.position.set(
      DIRECTION_LIGHT[i].pos_x,
      DIRECTION_LIGHT[i].pos_y,
      DIRECTION_LIGHT[i].pos_z
    )
    scene.add(light)

    if (DEBUG_MODE) {
      // ライトの確認
      lightHelper = new THREE.DirectionalLightHelper(light)
      scene.add(lightHelper)
    }
  }

  if (DEBUG_MODE) {
    // グリッドの作成と追加
    grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS)
    scene.add(grid)
  }

  // glTFの読取
  gltfLoader.load(
    MODEL_DATA_PATH,
    function (gltf) {
      // 環境マップを適用
      gltf.scene.traverse(function (obj) {
        if (obj.material) {
          // color:アルベドとして利用される色
          // map:アルベドとして利用されるディフューズテクスチャー
          // roughness:表面の粗さ。ざらざらしていれば1に近づく
          // metalness: 金属（伝導体）／非金属（非伝導体）
          // envMap: 環境マップ
          obj.material.envMap = texCube
        }
      })
      scene.add(gltf.scene)
      // THREE.DRACOLoader.releaseDecoderModule();
    },
    function () {
      console.log('loading')
    },
    function (error) {
      console.error(error)
    }
  )

  // レンダリング
  start3dGearAnimation()
  function start3dGearAnimation () {
    scene.traverse(function (obj) {
      for (i = 0; i < MODEL_DATA.length; i++) {
        if (obj.name === MODEL_DATA[i].name) {
          obj.rotation.x = obj.rotation.x + MODEL_DATA[i].v_rot_x
          obj.rotation.y = obj.rotation.y + MODEL_DATA[i].v_rot_y
          obj.rotation.z = obj.rotation.z + MODEL_DATA[i].v_rot_z
        }
      }
    })

    gRenderer.render(scene, gCamera)
    window.requestAnimationFrame(start3dGearAnimation)
  }

  // リサイズイベント時にonWindowResizeを実行
  $(window).resize(onWindowResize)
}

/* *****************************************************************************
 * ブラウザのサイズに合わせる
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function onWindowResize () {
  gRenderer.setPixelRatio(window.devicePixelRatio)
  gRenderer.setSize(
    window.innerWidth - ADJUST_WIDTH,
    window.innerHeight - ADJUST_HEIGHT
  )
  gCamera.aspect = window.innerWidth / window.innerHeight
  gCamera.updateProjectionMatrix()
}
