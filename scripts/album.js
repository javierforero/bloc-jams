
var createSongRow = function(songNumber, songName, songLength) {
      
      var template = 
          '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="'+songNumber+'">'+ songNumber +'</td>'
        + '  <td class="song-item-title">'+ songName +'</td>'
        + '  <td class="song-item-duration">'+ songLength +'</td>'
        + '</tr>'
        ;
      var $row = $(template);
      
      var clickHandler = function(){
          
        var songNumber = $(this).attr('data-song-number');
          
        if(currentlyPlayingSongNumber !== null) {
            
          $('.song-item-number[data-song-number="'+currentlyPlayingSongNumber+'"]').html(currentlyPlayingSongNumber);    
            
        }
          
        if(currentlyPlayingSongNumber == songNumber) {
            
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            
        } else if(currentlyPlayingSongNumber !== songNumber) {
            
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

        }          
          
      };
      
      var onHover = function(event) {
          
          var numberCell = $(this).find('.song-item-number');
          var songNumber = numberCell.attr('data-song-number');
          
          if(songNumber !== currentlyPlayingSongNumber) {
              numberCell.html(playButtonTemplate);
          }
      };
      
      var offHover = function(event){
          
          var numberCell = $(this).find('.song-item-number');
          var songNumber = numberCell.attr('data-song-number');
          
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


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;

$(document).ready(function() {
    
  setCurrentAlbum(albumPicasso);
  
});


