/* *****************************************************************************
 * textファイルを読取って指定したIDのタグにセットするfunctionのファイル
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
 * ブラウザオブジェクト
 * ****************************************************************************/
/* global XMLHttpRequest */

/* *****************************************************************************
 * 初期化
 * ****************************************************************************/
// window.addEventListener('DOMContentLoaded', initNoticesText)
// $(window).on('DOMContentLoaded', initNoticesText)
$(initNoticesText)

/**
 * *****************************************************************************
 * textデータを読取りNoticesに表示
 *
 * @return void
 * @author shingo.yoshioka
 * *****************************************************************************
 */
function initNoticesText () {
  const aryNoticesText = [
    {
      txt_path: './txt/jquery-3.4.1.min.js.txt',
      id: 'jquery-3.4.1.min.js.id'
    },
    {
      txt_path: './txt/bootstrap.bundle.min.js.txt',
      id: 'bootstrap.bundle.min.js.id'
    },
    {
      txt_path: './txt/three.min.js.txt',
      id: 'three.min.js.id'
    },
    {
      txt_path: './txt/draco_decoder.js.txt',
      id: 'draco_decoder.js.id'
    }
  ]
  let i

  // テキスト読込と表示
  for (i = 0; i < aryNoticesText.length; i++) {
    setReadText(aryNoticesText[i].txt_path, aryNoticesText[i].id)
  }
}

/**
 * *****************************************************************************
 * textデータを読取りIDのタグへセットする
 *
 * @param string パスを含むtextファイル名
 * @param string セットするタグのID
 * @return void
 * @author shingo.yoshioka
 * *****************************************************************************
 */
function setReadText (readTxtfile, id) {
  const xmlHttp = new XMLHttpRequest()
  xmlHttp.open('GET', readTxtfile, true)
  xmlHttp.send(null)

  xmlHttp.onload = function () {
    const obj = document.getElementById(id)

    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      obj.innerText = xmlHttp.responseText
    } else {
      obj.innerText = xmlHttp.statusText
    }
  }
}
