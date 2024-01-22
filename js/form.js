/* *****************************************************************************
 * reCAPCHAを利用してフォーム入力チェックを行うfunctionのファイル
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
/* global grecaptcha */

/* *****************************************************************************
 * 初期化
 * ****************************************************************************/
$(checkForm)

/* *****************************************************************************
 * reCAPCHAを利用してフォーム入力をチェック
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function checkForm () {
  $('#contact_form').submit(function (e) {
    // 送信停止
    e.preventDefault()

    grecaptcha.ready(function () {
      grecaptcha.execute('サイトキー', { action: 'send_form' }).then(function (token) {
        $('#contact_form').prepend('<input type="hidden" name="g-recaptcha-response" value="' + token + '">')
        $('#contact_form').prepend('<input type="hidden" name="action" value="send_form">')
        $('#contact_form').unbind('submit').submit()
      })
    })
  })
}
