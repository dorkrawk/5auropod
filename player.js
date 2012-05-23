var playlist = "playlist.json";

function player(playlist){
	var playlist = playlist;
	var music_folder = "music/";
	var art_folder = "art/";
	var track_index = 0;  // index of currently playing song
	var shuffle = false;
	var tracks = [];
	
	var next_track = function(callback) {
		if(shuffle) {
			track_index = Math.floor(Math.random() * (tracks.length));
		}
		else {
			track_index = (track_index + 1)% tracks.length;
		}
		console.log(track_index);
		track = tracks[track_index];
		load_track(track);
		if (callback && typeof(callback) === "function") {
			callback();
		}
	};
	
	// FIX THIS TO DISPLAY PREVIOUS TRACK EVEN WHEN ON SHUFFLE
	var prev_track = function(callback) {
		track_index = (track_index + tracks.length - 1)% tracks.length;
		track = tracks[track_index];
		load_track(track);
		if (callback && typeof(callback) === "function") {
			callback();
		}
	};
	
	var load_track = function(track) {
		var audio_file = music_folder + track.filename;
		var art_file = art_folder + track.art;
		
		var art = $("img#cover_art");
		var track_info = $("div#track_info");
		var audio_player = $("audio#audio_player");
		
		$(track_info).html("<img src='images/ajax-loader.gif' class='loader' />").css('text-align', 'center');

		$(art).attr('src', art_file);
		
		ID3.loadTags(audio_file, function() {
			var tags = ID3.getAllTags(audio_file);
			$(track_info).html("<div class='track_title'>" + tags.title + "</div> <div class='artist'>" + tags.artist + "</div>").css('text-align', 'left');
			var art = $("<img/>").attr({
				src: art_file,
				title: tags.album,
				class: 'cover_art'
			}).prependTo(track_info);
			
			document.title = tags.title + " - " + tags.artist + " :: &lt5auropod&gt";
		});
		
		$(audio_player).html("<source src='" + audio_file + "' type='audio/mp3' />");
	};  
	
	return {
		start : function() {
			// put up loading animation
			$("div#track_info").html("<img src='images/ajax-loader.gif' class='loader' />").css('text-align', 'center');
			
			// set up actions for the buttons
			$("div#previous_button").click(prev_track);
			$("div#next_button").click(next_track);
			$("div#shuffle_button").click(function(){
				shuffle = !shuffle;
				console.log(shuffle);	
			});
			$("audio#audio_player").bind('ended', function() {
				next_track(function(){
					console.log(this);
					the_player = document.getElementById('audio_player')
					the_player.play();
				});
			});
			
			// load playlist from JSON file
			$.get(playlist, function(data) {
				$.each(data.tracks, function(key,value){
					var track_info = function(info){return info}(value);
					tracks.push(track_info);
				});	
				// load the first track
				var track = tracks[track_index];
				load_track(track);
			});
		}
	};	
};

$(document).ready(function(){
	var the_player = new player(playlist);
	the_player.start();
});