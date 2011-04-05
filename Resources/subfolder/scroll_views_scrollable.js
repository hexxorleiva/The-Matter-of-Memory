var win = Titanium.UI.currentWindow;
win.backgroundColor = '#000';

var view1 = Ti.UI.createView({
	backgroundColor:'black'
});
var l1 = Ti.UI.createLabel({
	text:'The Matter of Memory',
	color:'#999',
	font:{fontSize:22,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 300,
	height:'auto',
	top:50
});
view1.add(l1);

var sublabel1 = Titanium.UI.createLabel({
	text:'This work has been created to explore the complex relationship between place and memory. The following introduction will help guide you in how to use this app to participate.',
	color:'#999',
	font:{fontSize:14,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 300,
	height:'auto',
	top: 130
});
view1.add(sublabel1);
if (Titanium.Platform.name == 'iPhone OS'){
var fingerSwipe = Titanium.UI.createImageView({
	image:'../images/finger_swipe.png',
	width:180,
	height:56,
	bottom:8,
	opacity:0.2
});
view1.add(fingerSwipe);
}

var sublabel3 = Titanium.UI.createLabel({
	text:'Please swipe from right to left to continue to the next page',
	color:'#999',
	font:{fontSize:12,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 300,
	height:'auto',
	bottom:57
});
view1.add(sublabel3);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var view2 = Ti.UI.createView({
	backgroundColor:'black'
});

var mapexample = Titanium.UI.createImageView({
	image:'../images/mapexample.jpg',
	width:260,
	height:265,
	top:0
});
view2.add(mapexample);

var l2 = Ti.UI.createLabel({
	text:'The map shows your current GPS position and audio locations made by other people.',
	color:'#999',
	font:{fontSize:13,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 300,
	height:'auto',
	top:280
});
view2.add(l2);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var view3 = Ti.UI.createView({
	backgroundColor:'black'
});

var title2 = Titanium.UI.createLabel({
	text:'To Participate',
	color:'#999',
	font:{fontSize:20,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 300,
	height:'auto',
	top:30
});
view3.add(title2);

var l3 = Ti.UI.createLabel({
	text:'When you are within 100 feet of a memory location, you will be able to listen to the memories left by other people.',
	color:'#999',
	font:{fontSize:16,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 300,
	height:'auto',
	top:80
});
view3.add(l3);

var sublabel5 = Titanium.UI.createLabel({
		text:'If there is a place that has importance to you, you also have the opportunity to leave a memory there for others to listen.',
		color:'#999',
		font:{fontSize:16,fontfamily:'Helvetica Neue'},
		textAlign:'center',
		width: 300,
		height:'auto',
		top:200
	});
view3.add(sublabel5);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var view4 = Ti.UI.createView({
	backgroundColor:'black'
});

var l3 = Ti.UI.createLabel({
	text:'The following options can be taken at any time. It is recommended to view the map to know where the memory locations are.',
	color:'#999',
	font:{fontSize:16,fontfamily:'Helvetica Neue'},
	textAlign:'center',
	width: 300,
	height:'auto',
	top:40
});
view4.add(l3);

var tabExample = Titanium.UI.createImageView({
	image:'../images/view4_details.png',
	width:320,
	height:217,
	bottom:0
});
view4.add(tabExample);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var scrollView = Titanium.UI.createScrollableView({
	views:[view1,view2,view3,view4],
	showPagingControl:true,
	pagingControlHeight:30,
	maxZoomScale:2.0,
	currentPage:0
});

win.add(scrollView);

var i=1;
var activeView = view1;

scrollView.addEventListener('scroll', function(e)
{
    activeView = e.view;  // the object handle to the view that is about to become visible
	i = e.currentPage;
	Titanium.API.info("scroll called - current index " + i + ' active view ' + activeView);
});
scrollView.addEventListener('click', function(e)
{
	Ti.API.info('ScrollView received click event, source = ' + e.source);
});
scrollView.addEventListener('touchend', function(e)
{
	Ti.API.info('ScrollView received touchend event, source = ' + e.source);
});