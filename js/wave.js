/* *****************************************************************************
 * 波動方程式を利用したウェーブを表示する
 *
 * @author    shingo.yoshioka
 * @copyright 2019 shingo.yoshioka
 * @license   http://opensource.org/licenses/mit-license.php MIT License
 * ****************************************************************************/
"use strict";

/* *****************************************************************************
 * 定数定義
 * ****************************************************************************/
const V_TIME = 0.01;							// アニメーションのベクトル
const SCREEN_WIDTH = 800;						// スクリーン　幅
const SCREEN_HEIGHT = 600;						// スクリーン　高さ
const AXIS_X_OFFSET = SCREEN_WIDTH/2+10;		// X座標オフセット
const AXIS_Y_OFFSET = SCREEN_HEIGHT/2-10;		// Y座標オフセット
const WAVE_PITCH = 10;							// ウェーブポイントの間隔
const WAVE_QTY = (40+1);						// ウェーブポイントの総数
const WAVE_AMPLITUDE = 50.0;					// ウェーブポイントの振幅
const WAVE_LENGTH = 20.0;						// ウェーブポイントの波長
const WAVE_CYCLE = 1.0;							// ウェーブポイントの周期
const WAVE_ID = "wave_sample";						// ウェーブ表示のID

/* *****************************************************************************
 * クラス定義
 * ****************************************************************************/
// ウェーブポイント用
class WAVE {
	constructor(x,z) {
		this.x = ((x - WAVE_QTY/2) * WAVE_PITCH);		// 位置座標
		this.y = 0.0;									// 位置座標
		this.z = ((z - WAVE_QTY/2) * WAVE_PITCH);		// 位置座標
		this.amplitude = WAVE_AMPLITUDE;				// 振幅(Amplitude)
		this.time = 0.0;								// 時間
		this.status = 0;								// ステータス
	}
}

/* *****************************************************************************
 * グローバル変数定義
 * ****************************************************************************/
// ウェーブ用
let gX;
let gZ;
let gWave = new Array(WAVE_QTY);
for(gZ = 0; gZ < WAVE_QTY; gZ++) {
	gWave[gZ] = new Array(WAVE_QTY);
	for(gX = 0; gX < WAVE_QTY; gX++) {
		gWave[gZ][gX] = new WAVE(gX,gZ);
	}
}

/* *****************************************************************************
 * 初期化
 * ****************************************************************************/
$(function(){
  DrawWaveAnimation()
  $('#wave_modal').on('shown.bs.modal', function () {
    // 開く
  })
  $('#wave_modal').on('hidden.bs.modal', function () {
    // 閉じる
  })
})

/* *****************************************************************************
 * ウェーブポイントの座標計算
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function ExecWavePoint() {
	let x;
	let z;

	for(z = 0; z < WAVE_QTY; z++) {
		for(x = 0; x < WAVE_QTY; x++) {
			switch(gWave[z][x].status) {
				case 0:
					// 初期の状態
					gWave[z][x].status = 1;
					break;
				case 1:
					// 波の計算
					gWave[z][x].y = WAVE_AMPLITUDE * Math.sin(2 * Math.PI * (Math.sqrt((x - (WAVE_QTY / 2)) * (x - (WAVE_QTY / 2)) + (z - (WAVE_QTY / 2)) * (z - (WAVE_QTY / 2))) / WAVE_LENGTH - gWave[z][x].time / WAVE_CYCLE));
					gWave[z][x].time = gWave[z][x].time + V_TIME;
					break;
			}
		}
	}
}

/* *****************************************************************************
 * ウェーブを描画
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function DrawWaveLine() {
	let x;
	let z;
	let px;
	let py;
	let px2;
	let py2;
	let canvas;
	let context;

	// 表示先を取得
	canvas = document.getElementById(WAVE_ID);
	context = canvas.getContext("2d");

	// 次のアニメーションを表示する前に以前のアニメーションをクリア
	context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	//新しいパスを開始する
	context.beginPath();

	// ウェーブポイントを元に線を描画する座標の計算と線の描画
	for(z = 0; z < WAVE_QTY; z++) {
		for(x = 0; x < WAVE_QTY; x++) {
			if(x < WAVE_QTY - 1) {
				px  = AXIS_X_OFFSET + gWave[z][x].x + gWave[z][x].z;
				py  = AXIS_Y_OFFSET - gWave[z][x].y - gWave[z][x].z;
				px2 = AXIS_X_OFFSET + gWave[z][x + 1].x + gWave[z][x + 1].z;
				py2 = AXIS_Y_OFFSET - gWave[z][x + 1].y - gWave[z][x + 1].z;

				// 線の色
				context.strokeStyle = "rgb(0, 104, 255)";

				// パスの開始座標を指定
				context.moveTo(parseInt(px),parseInt(py));

				// 座標を指定してラインを描画
				context.lineTo(parseInt(px2),parseInt(py2));
			}
			if(z < WAVE_QTY - 1) {
				px  = AXIS_X_OFFSET + gWave[z][x].x + gWave[z][x].z;
				py  = AXIS_Y_OFFSET - gWave[z][x].y - gWave[z][x].z;
				px2 = AXIS_X_OFFSET + gWave[z + 1][x].x + gWave[z + 1][x].z;
				py2 = AXIS_Y_OFFSET - gWave[z + 1][x].y - gWave[z + 1][x].z;

				// 線の色
				context.strokeStyle = "rgb(0, 104, 255)";

				// パスの開始座標を指定
				context.moveTo(parseInt(px), parseInt(py));

				// 座標を指定してラインを描画
				context.lineTo(parseInt(px2), parseInt(py2));
			}
		}
	}
	context.stroke();
}

/* *****************************************************************************
 * ウェーブのアニメーションを描画
 *
 * @return void
 * @author shingo.yoshioka
 * ****************************************************************************/
function DrawWaveAnimation() {
	ExecWavePoint();
	DrawWaveLine();
	window.requestAnimationFrame(DrawWaveAnimation);
}
