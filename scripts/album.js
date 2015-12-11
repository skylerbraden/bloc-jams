// Example Album
var albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { name: 'Blue', length: '4:26' },
        { name: 'Green', length: '3:14' },
        { name: 'Red', length: '5:01' },
        { name: 'Pink', length: '3:21'},
        { name: 'Magenta', length: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
    name: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { name: 'Hello, Operator?', length: '1:01' },
        { name: 'Ring, ring, ring', length: '5:01' },
        { name: 'Fits in your pocket', length: '3:21'},
        { name: 'Can you hear me now?', length: '3:14' },
        { name: 'Wrong phone number', length: '2:15'}
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;

    return template;
};

var setCurrentAlbum = function(album) {
    // #1
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

    // #2
    albumTitle.firstChild.nodeValue = album.name;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    // #3
    albumSongList.innerHTML = '';

    // #4
    for (i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    }
};

// Change the Song Number to the Pause Button

var child = document.getElementsByClassName('album-view-title')[0];
var noParent = document.querySelector('html');

var findParentByClassName = function(element, targetClass) {
    var currentParent = element.parentElement;
        
    if (currentParent) {
        // The while loop is saying, if cP.className exists AND cP.className is not the targetClass, then execute code. This is done so that the loop doesn't reach the last parent of the document and throw an error.
        while(currentParent.className && currentParent.className != targetClass) {
            currentParent = currentParent.parentElement;
        }
        
        if (currentParent.className == targetClass) {
            return currentParent;
        } else {
            alert("No parent with that class name found.");
        }
    } else {
        alert("No parent found.");
    }
};
// Works with 'album' but not 'album-view'.
findParentByClassName(child, 'album-view');

var getSongItem = function(element) {
    switch(element.className) {
        // 1
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        // 2
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        // 3
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        // 4
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

var clickHandler = function(targetElement) {
    
    var songItem = getSongItem(targetElement);
//    console.log(targetElement);
//    console.log(songItem);
    // I.e., when you CLICK on a song and nothing is currently playing,
    // change the song you click on to the pause button. The key point I was missing is:
    // "if when you click it's like this (what's inside the conditional), then do { ... }".
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
        // if when you click a song that's already playing (i.e., the data-song-number
        // of the currently playing song matches that of the clicked song, then change to
        // the play button and set the cPS to null.)
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        // set cPSE to the element that has the data-song-number of the cPS.
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        // changes the innerHTML from the pause button back to the song number.
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }

};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function() {

    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener('mouseover', function(event) {
        if (event.target.parentElement.className === 'album-view-song-item') {
                var songItem = getSongItem(event.target.parentElement);
            
                if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                    songItem.innerHTML = playButtonTemplate;
                }
         }
    });
    
    for (i = 0; i < songRows.length; i++) {
        
        songRows[i].addEventListener('mouseleave', function(event) {
//            this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
            // #1

            
            var targetElement = event.target.firstElementChild;
            
            var songItem = getSongItem(targetElement);
            var songItemNumber = targetElement.getAttribute('data-song-number');
            
            // #2
            // when your mouse leaves a song that is not currently,
            // change it back from the play button to it's number.
            // Need to ask Michael about this. mouseleave is not working - buttons don't turn back to numbers when leaving.
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
        
        // adds this event listener to all song rows.
        songRows[i].addEventListener('click', function(event) {
            // Event handler call
            clickHandler(event.target);
        });
    }
};











