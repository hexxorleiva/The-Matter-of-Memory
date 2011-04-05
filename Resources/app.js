// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup({id:'tabGroup1'});


var newDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'mydir');
if (newDir.exists('mydir')){
Titanium.API.info('Directory already exists');
} else {
newDir.createDirectory();
Titanium.API.info('Path to newdir: ' + newDir.nativePath);
};

//
// create controls tab and root window
//

//	create the label - Introduction
var titleLabelIntro = Titanium.UI.createLabel({
    color:'#333333',
    height:18,
    width:210,
    top:10,
    text:'Introduction',
    textAlign:'center',
    font:{fontFamily:'Arial',fontSize:20,fontWeight:'bold'},
    shadowColor:'#eee',shadowOffset:{x:0,y:1}
});

var win1 = Titanium.UI.createWindow({
	id:'win1',
	url:'subfolder/scroll_views_scrollable.js',
    title:'Introduction',
	barColor: '#999999'
});

var tab1 = Titanium.UI.createTab({
	id:'tab1',  
    icon:'KS_nav_ui.png',
    title:'Introduction',
    window:win1
});

//
//

//	create the label - Map
var titleLabelMap = Titanium.UI.createLabel({
    color:'#333333',
    height:18,
    width:210,
    top:10,
    text:'Map',
    textAlign:'center',
    font:{fontFamily:'Arial',fontSize:20,fontWeight:'bold'},
    shadowColor:'#eee',shadowOffset:{x:0,y:1}
});

var win2 = Titanium.UI.createWindow({
	id:'win2',
	url:'maps/map_view.js',
	title:'Map',
	barColor: '#999999'
	});
//This action causes the map to open on top of win1 in the Android Phone
if (Titanium.Platform.name == 'iPhone OS'){
win2.open();
}

var tab2 = Titanium.UI.createTab({
	id:'tab2',
	icon:'KS_map.png',
	title:'Map',
	window:win2
});

var label2 = Titanium.UI.createLabel({
	id:'label2',
	color:'#999',
	font:{fontSize:16,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 'auto'
});
win2.add(label2);


//
//

//	create the label - Record Memory
var titleLabelRecord = Titanium.UI.createLabel({
    color:'#333333',
    height:18,
    width:210,
    top:10,
    text:'Record Memory',
    textAlign:'center',
    font:{fontFamily:'Arial',fontSize:20,fontWeight:'bold'},
    shadowColor:'#eee',shadowOffset:{x:0,y:1}
});

var win3 = Titanium.UI.createWindow({
	id:'win3',
	url:'subfolder/gps_soundrecordupload.js',
	title:'Record Memory',
	backgroundColor: '#666',
	barColor: '#999999'
});

var tab3 = Titanium.UI.createTab({
	id:'tab3',
	icon:'KS_record.png',
	title:'Record',
	window:win3
});

var label3 = Titanium.UI.createLabel({
	id:'label3',
	color:'#999',
	text:'',
	font:{fontSize:15,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 'auto'	
});

win3.add(label3);

//
//

//	create the label - Memory Playback
var titleLabelPlayback = Titanium.UI.createLabel({
    color:'#333333',
    height:18,
    width:210,
    top:10,
    text:'Playback Memory',
    textAlign:'center',
    font:{fontFamily:'Arial',fontSize:20,fontWeight:'bold'},
    shadowColor:'#eee',shadowOffset:{x:0,y:1}
});

var win4 = Titanium.UI.createWindow({
	id:'win4',
	url:'subfolder/memoryplayback.js',
	title:'Playback Memory',
	barColor: '#999999'
});

var tab4 = Titanium.UI.createTab({
	id:'tab4',
	icon:'KS_sound.png',
	title:'Listen',
	window:win4
});

var label4 = Titanium.UI.createLabel({
	id:'label4',
	color:'#999',
	text:'Listen',
	font:{fontSize:15,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});
win4.add(label4);

if (Titanium.Platform.name == 'iPhone OS'){
win1.setTitleControl(titleLabelIntro);
win2.setTitleControl(titleLabelMap);
win3.setTitleControl(titleLabelRecord);
win4.setTitleControl(titleLabelPlayback);
}



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.addTab(tab4);

// open tab group
tabGroup.open();
