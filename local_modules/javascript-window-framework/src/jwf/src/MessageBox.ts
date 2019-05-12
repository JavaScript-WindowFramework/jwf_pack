import * as Window from "./Window"
import * as Label from "./Label"
import * as Button from "./Button"
export interface MESSAGEBOX_EVENT_ITEM_CLICK {
	value: any
}
export interface MessageBoxEventMap extends Window.WINDOW_EVENT_MAP {
	"buttonClick": MESSAGEBOX_EVENT_ITEM_CLICK
}
export class MessageBox extends Window.FrameWindow{
	label: Label.Label
	constructor(title:string,msg:string,buttons?:{[key:string]:any}){
		super()
		this.setSize(300, 200)
		this.setPos()
		this.setTitle(title)
		this.active()
		this.setPadding(10, 10, 10, 10)

		const label = new Label.Label(msg)
		this.label = label
		this.addChild(label,'top')
		label.setAlign('center')
		label.setMargin(10,10,10,50)
		const that = this
		if (!buttons){
			buttons = {'OK':true}
		}
		for(let name in buttons){
			const b = new Button.Button(name, buttons[name])
			b.setAlign('center')
			this.addChild(b, 'top')
			b.addEventListener('buttonClick',function(){
				that.callEvent('buttonClick',this.getValue())
				that.close()
			}.bind(b))
		}

	}
	addEventListener<K extends keyof MessageBoxEventMap>(type: K, listener: (ev: MessageBoxEventMap[K]) => any): void {
		super.addEventListener(type as any, listener)
	}
	setText(text:string){
		this.label.setText(text)
	}
}
