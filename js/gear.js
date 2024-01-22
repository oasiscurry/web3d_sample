/* *****************************************************************************
 * スクロール時、歯車を回転させるアニメーションfunctionのファイル
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

/* *****************************************************************************
 * 定数定義
 * ****************************************************************************/
const VECTOR_NAV_GEAR01 = 3 // ナビゲーションメニューの歯車1の回転角度(度)凸18度
const VECTOR_NAV_GEAR02 = -4 // ナビゲーションメニューの歯車2の回転角度(度)凸24度
const VECTOR_NAV_GEAR03 = 6 // ナビゲーションメニューの歯車3の回転角度(度)凸36度
const ID_NAV_GEAR01 = 'nav-gear01' // ナビゲーションメニューの歯車1のID
const ID_NAV_GEAR02 = 'nav-gear02' // ナビゲーションメニューの歯車2のID
const ID_NAV_GEAR03 = 'nav-gear03' // ナビゲーションメニューの歯車3のID
// const GEAR_ANIM_TIME = 2000 // 歯車を回転させる時間(ミリ秒)

/* *****************************************************************************
 * グローバル変数定義
 * ****************************************************************************/
let gScalarNavGear01 = 0 // ナビゲーションメニューの歯車1の回転量(度)
let gScalarNavGear02 = 0 // ナビゲーションメニューの歯車2の回転量(度)
let gScalarNavGear03 = 0 // ナビゲーションメニューの歯車3の回転量(度)
let gPrevScrollPosition = 0 // 前のスクロールの位置
// let gStartTime // 歯車の回転開始時間
// let gGearAnimFlg = false // 歯車の回転状態(true:回転中 false:停止中)
let gNavGearRotationFlg = true // ナビゲーションメニューの歯車の回転方向(true:定数定義した回転方向 false:逆回転)

/* *****************************************************************************
 * 初期化
 * ****************************************************************************/
// window.addEventListener('DOMContentLoaded', InitGear)
// $(window).on('DOMContentLoaded', initGear)
$(initGear)

/* *****************************************************************************
 * ナビゲーションメニューの歯車を回転させる
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function initGear () {
  // スクロールイベント時の処理
  $(window).scroll(function () {
    if ($(window).scrollTop() - gPrevScrollPosition < 0) {
      // 上方向のスクロール
      // 歯車を逆回転させる
      gNavGearRotationFlg = false
      NavGearRotation()
    } else {
      // 下方向のスクロール
      // 歯車を回転させる
      gNavGearRotationFlg = true
      NavGearRotation()
    }
    gPrevScrollPosition = $(window).scrollTop()
  })
}

/* *****************************************************************************
 * 歯車を特定の時間回転させる
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function GearAnimation () {
  let current_time = new Date().getTime()
  let end_time = current_time - gStartTime

  NavGearRotation()
  let request_id = window.requestAnimationFrame(GearAnimation)

  if (end_time > GEAR_ANIM_TIME) {
    window.cancelAnimationFrame(request_id)
    gGearAnimFlg = false
  }
}

/* *****************************************************************************
 * ナビゲーションメニューの歯車を回転させる
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function NavGearRotation () {
  let rot

  const gear01 = document.getElementById(ID_NAV_GEAR01)
  const gear02 = document.getElementById(ID_NAV_GEAR02)
  const gear03 = document.getElementById(ID_NAV_GEAR03)

  if (gNavGearRotationFlg === true) {
    rot = 1
  } else {
    rot = -1
  }
  gScalarNavGear01 = gScalarNavGear01 + VECTOR_NAV_GEAR01 * rot
  gScalarNavGear02 = gScalarNavGear02 + VECTOR_NAV_GEAR02 * rot
  gScalarNavGear03 = gScalarNavGear03 + VECTOR_NAV_GEAR03 * rot

  gear01.style.transform = 'rotate(' + gScalarNavGear01 + 'deg)'
  gear02.style.transform = 'rotate(' + gScalarNavGear02 + 'deg)'
  gear03.style.transform = 'rotate(' + gScalarNavGear03 + 'deg)'
}
