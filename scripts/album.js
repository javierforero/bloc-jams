
var createSongRow = function(songNumber, songName, songLength) {
      
  var template = 
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="'+songNumber+'">'+ songNumber +'</td>'
    + '  <td class="song-item-title">'+ songName +'</td>'
    + '  <td class="song-item-duration">'+ songLength +'</td>'
    + '</tr>'
    ;
  var $row = $(template);
          
  var clickHandler = function() {
   
    var songNumber = parseInt($(this).attr('data-song-number'));
          
    if(currentlyPlayingSongNumber !== null) {
            
      getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);    
    }
          
    if(currentlyPlayingSongNumber == songNumber) {
          
        if(currentSoundFile.isPaused()) {
            
          currentSoundFile.play();
          $(this).html(pauseButtonTemplate);
          updatePlayerBarSong();
  
        } else {
            
          currentSoundFile.pause();
          $(this).html(playButtonTemplate); 
          updatePlayerBarSong();    
        }
           
    } else if(currentlyPlayingSongNumber !== songNumber) {
        
        setSong(songNumber);
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
        updatePlayerBarSong();

    }          
          
  };
      
  var onHover = function(event) {
          
      var numberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(numberCell.attr('data-song-number'));
          
      if(songNumber !== currentlyPlayingSongNumber) {
              
          numberCell.html(playButtonTemplate);
              
      }
  };
      
  var offHover = function(event){
          
      var numberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(numberCell.attr('data-song-number'));
          
      if(songNumber !== currentlyPlayingSongNumber){
              
          numberCell.html(songNumber);      
      }
        
  };
      
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
    
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + '' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for(var i = 0; i < album.songs.length; i++) {
        
        var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;

    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
     
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
       
         var seekBarFillRatio = offsetX / barWidth;
 
    
         updateSeekPercentage($(this), seekBarFillRatio);
     });
 };


var updatePlayerBarSong = function(){
    var $playBarLogic = currentSoundFile.isPaused() ? playerBarPlayButton : playerBarPauseButton;
        
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html($playBarLogic);
};

var trackIndex = function(album, song) {
    
    return album.songs.indexOf(song);
};

var setSong = function(songNumber) {
    
    if(currentSoundFile) {
        
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);
};

var setVolume = function(volume) {
  if(currentSoundFile) {
      currentSoundFile.setVolume(volume);
  }  
};

var getSongNumberCell =  function(number){
    
    return  $('.song-item-number[data-song-number="'+number+'"]');
};

var nextSong = function() {
    
     var newIndex = trackIndex(currentAlbum, currentSongFromAlbum)+1;
     var prevSong = currentSongFromAlbum;
     var prevSongNumber = currentlyPlayingSongNumber;

     if(newIndex < currentAlbum.songs.length) {
         
        setSong(newIndex+1);
        currentSoundFile.play() 
        updatePlayerBarSong();
        getSongNumberCell(prevSongNumber).html(prevSongNumber);
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
         
     } else {
          
         newIndex = 0
         setSong(newIndex+1);
         currentSoundFile.play() 
         updatePlayerBarSong();
         getSongNumberCell(prevSongNumber).html(prevSongNumber);
         getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
     }
};

var previousSong = function() {
    
     var newIndex = trackIndex(currentAlbum, currentSongFromAlbum)-1;
     var nextSong = currentSongFromAlbum;
     var nextSongNumber = currentlyPlayingSongNumber;

     if(newIndex >= 0) {
         
        setSong(newIndex+1);
        currentSoundFile.play(); 
        updatePlayerBarSong();
        getSongNumberCell(nextSongNumber).html(nextSongNumber);
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
         
     } else {
         newIndex = currentAlbum.songs.length-1;
         setSong(newIndex+1);
         currentSoundFile.play();
         updatePlayerBarSong();
         getSongNumberCell(nextSongNumber).html(nextSongNumber);
         getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
     }
};

var togglePlayFromPlayerBar = function() {
    
    if(currentSoundFile == null) {
        setSong(1);
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
        updatePlayerBarSong();
        currentSoundFile.play();
        
    } else if(currentSoundFile.isPaused()) {
        
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate); 
        $barPlayButton.html(playerBarPauseButton);
        currentSoundFile.play();
        
    } else {
        
      getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate); 
      $barPlayButton.html(playerBarPlayButton);   
      currentSoundFile.pause();    
    }
};



var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $barPlayButton = $('.main-controls .play-pause');

$(document).ready(function() {
      
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $barPlayButton.click(togglePlayFromPlayerBar);
  setupSeekBars();
});


