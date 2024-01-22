/* *****************************************************************************
 * ナビゲーションメニューの処理に関するファイル
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
 * 初期化
 * ****************************************************************************/
$(initNavMenu)

/* *****************************************************************************
 * ナビゲーションメニューの初期化処理
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function initNavMenu () {
  // スムーススクロール処理
  $('a[href^="#"]' + 'a:not(".carousel-control-prev,.carousel-control-next")').click(function () {
    const speed = 500 // ミリ秒
    const href = $(this).attr('href')
    const target = $(href === '#' || href === '' ? 'html' : href)
    const position = target.offset().top
    $('body,html').animate({ scrollTop: position }, speed, 'swing')
    return false
  })

  // ナビゲーションメニューのブランドをクリックした際にナビゲーションメニューを閉じる
  $('.navbar-brand').on('click', function () {
    // メニューが開いていたら閉じる
    if ($('#navbar-toggler').attr('aria-expanded') === 'true') {
      $('.navbar-collapse').collapse('hide')
    }
  })

  // ナビゲーションメニューのリンクをクリックした際にナビゲーションメニューを閉じる
  $('.navbar-nav li a').on('click', function () {
    // メニューが開いていたら閉じる
    if ($('#navbar-toggler').attr('aria-expanded') === 'true') {
      $('.navbar-collapse').collapse('hide')
    }
  })

  // クリックした際にナビゲーションメニューを閉じる
  $(':not(".navbar-brand,.navbar-nav li a")').on('click', function () {
    // メニューが開いていたら閉じる
    if ($('#navbar-toggler').attr('aria-expanded') === 'true') {
      $('.navbar-collapse').collapse('hide')
    }
  })
}
