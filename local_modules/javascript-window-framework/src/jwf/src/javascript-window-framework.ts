import "../scss/jwf.scss"
export * from './Button'
export * from './CalendarView'
export * from './Label'
export * from './Libs'
export * from './ListView'
export * from './MessageBox'
export * from './Panel'
export * from './SelectBox'
export * from './TableFormView'
export * from './TextBox'
export * from './TreeView'
export * from './Window'


import * as Button from './Button'
import * as CalendarView from './CalendarView'
import * as Label from './Label'
import * as Libs from './Libs'
import * as ListView from './ListView'
import * as MessageBox from './MessageBox'
import * as Panel from './Panel'
import * as SelectBox from './SelectBox'
import * as TableFormView from './TableFormView'
import * as TextBox from './TextBox'
import * as TreeView from './TreeView'
import * as Window from './Window'

global['JWF'] = Object.assign(
	Button,
	CalendarView,
	Label,
	Libs,
	ListView,
	MessageBox,
	Panel,
	SelectBox,
	TableFormView,
	TextBox,
	TreeView,
	Window
)


console.log('JWF')
