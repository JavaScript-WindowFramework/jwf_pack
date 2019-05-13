import *  as JWF from 'javascript-window-framework'
//import 'javascript-window-framework/dist-jwf/jwf'
/*
interface Test extends JWF.WINDOW_PARAMS{
}

class CustomWindow extends JWF.Window{
	constructor(p:typeof JWF.WINDOW_PARAMS){
		super(p)
	}
}
*/
async function Sample01() {
	new JWF.Window()
	 const win = new JWF.FrameWindow()	//フレームウインドウの作成
	 win.setTitle('サンプルウインドウ')	//タイトルの設定
	 win.setPos()						//位置を中心に設定


	 await JWF.Sleep(1000)
	win.setTitle('サンプルウインドウ2')
	//const  = {}

}

function Main() {
	Sample01()
}

//ページ読み込み時に実行する処理を設定
addEventListener("DOMContentLoaded", Main)
