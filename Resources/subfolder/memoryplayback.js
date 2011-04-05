/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																																		   //
//	This javascript file will list any returned coordinates that are within range of the user's Latitude and Longitude. The tabelview	   //
//	will be established and the data will be added as long as the user is within the threshold distance of another 'memory'. Afterwards    //
//	it will display the following information on each row.																				   //
//	**Memory																															   //
//	**Timestamp it was added (returns Datetime from MySQL)																				   //
//	Once it returns these values it will become a button that will start the audioplayer and play the returned audio url associated 	   //
//	with those coordinates as a streaming element. It it important to note that it will not download it, because I want to avoid the 	   //
//	user having the ability to listen to the audio whenever they wish.																	   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//	Decalres the scope of the window to be drawn within the selected tab that redirected here.
var win = Titanium.UI.currentWindow;
var tabGroup = win.tabGroup;

//	To prevent automatic lock
Titanium.App.idleTimerDisabled = true;
//	To allow playback during lock

Titanium.Geolocation.purpose = "Recieve User Location";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
//	Set Distance filter. This dictates how often an event fires based on the distance the device moves. This value is in meters. 10 meters = 33 feet.
Titanium.Geolocation.distanceFilter = 10;

//	Establishes the Table
var tableData = [];
var CustomData = [];
var tableView = Titanium.UI.createTableView({minRowHeight:60});
win.add(tableView);

//	Establishes the audio components
var stream_url = [];
var audiourls = [];
var streamPlayer = Ti.Media.createAudioPlayer();

//	Buttons
var reloadButton;
var stop;

//	Global Variables
var incomingData;
var longitude;
var latitude;
var streamPlayerurl = 'http://hectorleiva.com/scripts/';

//	Activity Indicator
var actInd = Titanium.UI.createActivityIndicator({ 
	height:50,
	width:10,
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
});

var labelBuffering = Titanium.UI.createLabel({
	text: 'Depending on your connection status, some audio files might take longer to load than others.',
	height:'auto',
	width:'auto',
	textAlign:'center',
	color:'#fff',
	font:{fontSize:12,fontFamily:"Helvetica Neue"},
	bottom:60
});

var PlaystatusLabel = Titanium.UI.createLabel({
	text: '',
	height:'auto',
	width:'auto',
	textAlign:'center',
	color:'#fff',
	font:{fontSize:16,fontFamily:"Helvetica Neue"},
	bottom:160
});

var ProgressLabel = Titanium.UI.createLabel({
	text: '',
	height:'auto',
	width:'auto',
	textAlign:'center',
	color:'#fff',
	font:{fontSize:16,fontFamily:"Helvetica Neue"},
	bottom:120
});

var StatusLabel = Titanium.UI.createLabel({
	text: '',
	height:'auto',
	width:'auto',
	textAlign:'center',
	color:'#fff',
	font:{fontSize:16,fontFamily:"Helvetica Neue"},
	bottom:170
});

var headphones = Titanium.UI.createImageView({
	image:'../images/headphones.png',
	width:250,
	height:250,
	top:20,
	opacity:0.7
});


//	Alerts
var lostSignal = Ti.UI.createAlertDialog({
		title:'Connection Lost',
		message:'Check to see that you have a phone signal or Wi-Fi connection.'
		});

var lostServer = Ti.UI.createAlertDialog({
		title:'Connection Lost',
		message:'There was an issue connecting to the server, please wait and try again.'
		});

//	Off the top we need to create a connection to the server to make sure if there is any data to be created in the rows. So once the
//	"getCurrentPosition()" fires, it will send a call to the server to get any coordinates that match and if they do, to return the audio
//	url those coordinates are in line with.

/////////////////////////////////////////////////////////////////////////////////////////
//																				  	  //
//	The Following Section are for the Buttons to do one of the following: Reload	  //
//																				      //
////////////////////////////////////////////////////////////////////////////////////////

//
//	Reload Button
//
if (Titanium.Platform.name == 'iPhone OS'){
reloadButton = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.REFRESH,
	right:50
	});
win.setRightNavButton(reloadButton);
}


//
//	Create Table
//

function displayItems() {
	//	Clear the entire tableView
	tableView.setData([]);
	try {
		for (var i = 0; i < incomingData.length; i++){
			CustomData = incomingData[i];
			Titanium.API.info(CustomData.easytime);
	
	// Create a vertical layout view to hold all the info
		var row = Titanium.UI.createTableViewRow({
			hasChild:true,
			backgroundColor:'#999'
		});
	// Takes easytime data from mySQL database and populates it as a label
		var easyTime = Titanium.UI.createLabel({
			text: CustomData.easytime,
			font: {fontSize:16,fontWeight:'bold'},
			width: 'auto',
			textAlign:'left',
			bottom: 25,
			left:10,
			color:'#fff'
			});
		
		var easyClock = Titanium.UI.createLabel({
			text: CustomData.easyclock,
			font: {fontSize:14,fontWeight:'bold'},
			width: 'auto',
			textAlign:'left',
			top:15,
			left:10,
			color:'#fff'
			});

	//	Declare variable "stream_URL" as an array that when "while loop" continues to fill array with audio URL location
		var stream_url = CustomData.AudioURL;
		var dataTimestamp = CustomData.Timestamp;
		var dataClock = CustomData.easyclock;
		row.add(easyTime);
		row.add(easyClock);
		row.className = 'audiourl';
		row.thisStream = stream_url;
		row.dataTimestamp = dataTimestamp;
		row.dataeasyclock = dataClock;
		//audiourls = CustomData.AudioURL;			
		tableView.appendRow(row,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
		//tableData.push(row);
	}; //end of For loop
	
	} catch(err) {
			setTimeout(function(){
				lostServer.show();
			},1000);
			
			setTimeout(function(){
				lostServer.hide();
			},3000);
			Titanium.API.info(err.error);
		}
		//tableView.setData(tableData);
}; //end of function Display Items

//
//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
//
if (Titanium.Geolocation.locationServicesEnabled==false)
{
	Titanium.UI.createAlertDialog({title:'Geolocation Off', message:'Your device has location services turned off - please turn it on.'}).show();
	} else {
	if (Titanium.Platform.name != 'android') {
		var authorization = Titanium.Geolocation.locationServicesAuthorization;
		Ti.API.log('Authorization: '+authorization);
		if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
			Ti.UI.createAlertDialog({
				title:'Geolocation Off',
				message:'You have disallowed this app from running geolocation services.'
			}).show();
		}
		else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
			Ti.UI.createAlertDialog({
				title:'Geolocation Off',
				message:'Your system has disallowed this app from running geolocation services. Please allow to use app.'
			}).show();
		}
	}
}; //end of Alert to see if you have geolocation turned on.

function reloadSend(){
	try{
		reloadButton.hide();
		win.rightNavButton = null;
	
		//	Activity Indicator
		win.add(actInd);
		actInd.show();
	
		//	Create a view that will block out all opitions while it loads

		var view = Titanium.UI.createView({
			backgroundColor:'black',
			width: 320,
			height: 460,
			opacity: 0.9
			});
		win.add(view);
	
		// Begin the "Get data" request
		setTimeout(function(){
			var xhr = Titanium.Network.createHTTPClient();
			xhr.setTimeout(20000);
			var geturl="http://hectorleiva.com/scripts/memorycoordinates.php?latitude=" + latitude + "&longitude=" + longitude;
			xhr.open('GET', geturl, false);
			xhr.onerror = function(e){
		//	When there is an error, remove all links to the server to prevent from crashing
			tableView.setData([]);
		//	Display Error Alert
			Titanium.UI.createAlertDialog({title:'Connection Lost!', message:'Check to see that you have a phone signal or wireless connection.'}).show();
			Titanium.API.info('IN ERROR' + e.error);
		//	Remove all reloading indicators
			actInd.message = null;
			actInd.hide();
			win.remove(view);
			win.setRightNavButton(reloadButton);
			};
///////////////////////////////////////////////////////////////////
			xhr.onload = function(){
				actInd.message = null;
				actInd.hide();
				win.remove(view);
				Titanium.API.info(this.responseText);
				incomingData = JSON.parse(this.responseText);
				displayItems(incomingData);
				}; //end of onload
			xhr.send();
			Titanium.API.info('Reload Button has been pressed!');
			win.setRightNavButton(reloadButton);
		}, 1500); //Time out function will wait 1.5 seconds before executing a request to the server.
	} catch(e) {
			setTimeout(function(){
				lostServer.show();
			},1000);
			
			setTimeout(function(){
				lostServer.hide();
			},3000);
			Titanium.API.info(e.error);
	}
} //	end of reloadSend

//
//	Get Moving Location - This fires within every 30 meters
//
	Ti.App.addEventListener('setLocationEvent', function(event){
	latitude = event.latitude;
	longitude = event.longitude;
	Ti.API.info('Latitude from MemoryPlayback : ' + latitude);
	Ti.API.info('Longitude from MemoryPlayback : ' + longitude);
	//	Clear the entire table view
	var timeout = 0;
	
	tableView.setData([]);
	var geturl="http://hectorleiva.com/scripts/memorycoordinates.php?latitude=" + latitude + "&longitude=" + longitude;
	// Begin the "Get data" request
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onerror = function(){
			if(timeout%2){
				Titanium.UI.createAlertDialog({title:'Connection Lost', message:'Check to see that you have a phone signal or wireless connection.'}).show();
				return;
			}
			timeout++;
		}; //end of onerror
		xhr.setTimeout(20000);
		xhr.onload = function(){
		Titanium.API.info(this.responseText);
		incomingData = JSON.parse(this.responseText);
		displayItems(incomingData);
		}; //end of onload
		xhr.open('GET', geturl, false);
		xhr.send();
});
if (Titanium.Platform.name == 'iPhone OS'){	
reloadButton.addEventListener('click', reloadSend);
}
//
//	TableView Event Listener
//

tableView.addEventListener('click', function(e){

	Titanium.API.info('item index clicked :'+e.index);
	Ti.API.info("Row object  = "+e.row);
	Ti.API.info('http://hectorleiva.com/scripts/'+e.rowData.thisStream);
	
	//	When table view is hit, create a view that renders the rest of the options visible, but to focus on the buttons bar at the bottom.
	
	//
	//	Done System Button
	//
	var buttonDone = Titanium.UI.createButton({
	    systemButton:Titanium.UI.iPhone.SystemButton.DONE,
		right:50,
		enable: true
		});
	win.setRightNavButton(buttonDone);
	
	//	Hides the toolbar to prevent people from switching to other tabs to record while playing
	tabGroup.animate({bottom:-50, duration:200});
	
	//	Create view that will block out the other Table options
	var view = Titanium.UI.createView({
		backgroundColor:'black',
		width: 320,
		height: 460,
		opacity: 0.9
		});
	win.add(view);
	
	//	Activity Indicator
	win.add(actInd);
	actInd.show();

	win.add(labelBuffering);
	win.add(PlaystatusLabel);
	win.add(ProgressLabel);

	//	Create Stream Player
	try {
	streamPlayer.url = streamPlayerurl + e.rowData.thisStream;
	streamPlayer.start();
	win.add(headphones);

	} catch (err) {
		setTimeout(function(){
		lostServer.show();
		},1000);
		setTimeout(function(){
		lostServer.hide();
		},3000);
		Titanium.API.info(err.error);
		Ti.API.info('error ' + err);
		win.remove(labelBuffering);
		win.remove(PlaystatusLabel);
		win.remove(ProgressLabel);
		win.remove(view);
		win.setToolbar(null, {animated:true});
		buttonDone.hide();
		win.rightNavButton = null;
		win.remove(headphones);
		win.setRightNavButton(reloadButton);
	}
	
	//	Used to keep the buttons spaced apart equally
	var flexSpace = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																													  	  //
//	The Following Section are for the Buttons to do one of the following: Pause, Play, Rewind, Done						  //
//																													      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//
	//	Add Pause Button
	//
	var pauseButton = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.PAUSE,
		enabled:true
	});
	
	pauseButton.addEventListener('click', function() {
		Titanium.API.info('Clicked Pause Button!');
		streamPlayer.pause();
	});
	
	//
	//	Add Play button
	//
	var playButton = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.PLAY,
		left:30,
		enabled:true
	});
		
	//	
	//	Add Rewind button
	//
	var rewindButton = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.REWIND,
		left:50,
		enabled:true
	});
	
	/////////////////////////////////////////////////////////
	//													  //
	//	The Following Section are for the Button Events	  //
	//												      //
	////////////////////////////////////////////////////////
	
	//	
	//	Play EventListener
	//
	playButton.addEventListener('click', function() {
		Ti.API.info('Clicked Play Button!');
		streamPlayer.start();
		//soundPlayer.play();
		//progressBar.max = soundPlayer.duration;
	});
	
	rewindButton.addEventListener('click', function() {
		Titanium.API.info('Clicked Rewind Button!');
		streamPlayer.stop();
		streamPlayer.start();

	});
	
	//
	//	WHEN 'DONE' BUTTON IS PRESSED
	//
	buttonDone.addEventListener('click', function(){
		setTimeout(function(){
		Titanium.API.info('Pressed Done Button!');
		win.remove(labelBuffering);
		win.remove(PlaystatusLabel);
		win.remove(ProgressLabel);
		win.remove(view);
		win.setToolbar(null, {animated:true});
		buttonDone.hide();
		win.rightNavButton = null;
		win.remove(headphones);
		win.setRightNavButton(reloadButton);
		streamPlayer.stop();
		
		tabGroup.animate({bottom:0,duration:500});
		},200);
	});
	
		
	//	This sets the toolbar at the button and locations of where the buttons are
	win.setToolbar([playButton,flexSpace,pauseButton,flexSpace,rewindButton], {translucent:true});
	
	//	This is all that is needed to show an activity indicator when loading an audio file.
	if(win.setToolbar){
		win.remove(actInd);
		actInd.hide();
	}

	
});