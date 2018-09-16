const remote = require('electron').remote;
const fs = require('fs');
const path = require('path');

let nowData = remote.getGlobal('queue').head;
let dataFile = path.join(__dirname, 'donation-data.json');
let fileObj = null;
let jsonObj = null;

fs.readFile(dataFile, 'utf-8', (err, data) => {
    fileObj = JSON.parse(data);
    //if(nowData >= fileObj.length) remote.getGlobal('shared').clicks--;
    jsonObj = fileObj[nowData];
    console.log(nowData);
    console.log(jsonObj);

    document.getElementById('name').innerHTML = jsonObj.name;
    document.getElementById('price').innerHTML = jsonObj.price;
    document.getElementById('donationText').innerHTML = jsonObj.content;
    if(jsonObj.type === 'TEXT') {
        let videodiv = document.getElementById('videodiv');
        videodiv.parentNode.removeChild(videodiv);
        responsiveVoice.speak(document.getElementById('donationText').innerHTML, 'Korean Female', { onend: function() {
            remote.getGlobal('queue').canClose = true;
            console.log('왜');
        }});
    }  
    else if(jsonObj.type === 'VIDEO') {
        let textdiv = document.getElementById('textdiv');
        textdiv.parentNode.removeChild(textdiv);

        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player-api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        let videoid = '';
        let regExp = /^.*(youtu\.be\/|clips\.twitch\.tv\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = jsonObj.content.split(' ')[0].match(regExp);
        if (match) {
            videoid = match[2];
            if(match[1] === 'clips.twitch.tv/') {
                document.getElementById('videoiframe').src = 'https://clips.twitch.tv/embed?clip=' + videoid;
            }
            else {
                document.getElementById('videoiframe').src = 'https://www.youtube.com/embed/' + videoid + '?autoplay=1';
            }
        } else {
            //error
        }

        
        

        setTimeout(() => {
            remote.getGlobal('queue').canClose = true;
        }, jsonObj.price * 1000);

        /*let player;
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('videodiv', {
                height: '360',
                width: '640',
                videoId: videoid,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            console.log('Player Load');
        } 

        function onPlayerReady(event) {
            event.target.playVideo();
        }*/

        let 
    }

    fs.writeFile(path.join(__dirname, 'counter.txt'), nowData, 'utf-8', (err) => {
        if(err) throw err;
    });
});