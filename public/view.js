const socket = io.connect('https://hotsorry.herokuapp.com');
let myTimeout;
responsiveVoice.setDefaultVoice('Korean Female');
let donationQueue = new Array();

let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
let content = document.getElementById('donationText').innerHTML;
let match = content.toString().split(' ')[0].match(regExp);
let alarm = new Audio('./assets/audio/alarm.mp3');
/*
let player;
window.onYouTubeIframeAPIReady = function() {
    console.log('유튜브');
    player = new YT.Player('videodiv', {
        height: 720,
        width: 1280,
        videoId: 'Erbmd5EWPRw',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) { 
    event.target.loadVideoById(match[2]); 
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if(event.data == 0) {
        $('div').fadeOut();
        now++;
        setTimeout(() => {
            playDonation(); 
        }, 2000);         
    }
}*/

async function getVideoLength(id) {
    const fetchVidLen = await fetch('https://www.googleapis.com/youtube/v3/videos?id='+id+'&part=contentDetails&id=$vId&key=AIzaSyCO_io6V02e4VtKW7NsexEhVzETLnzwOwE');
    const vidLenJSON = await fetchVidLen.json();
    console.log(vidLenJSON);
    return convert_time(vidLenJSON['items'][0]['contentDetails']['duration']);
}

socket.on('donated', (data) => {
    donationQueue.push(data);
});

pause();
playDonation();

socket.on('skip', () => {
    skip();
});

socket.on('pause', () => {
    pause();
});

socket.on('resume', () => {
    resume();
});

socket.on('replay', (num) => {
    replay(num);
});

async function playDonation() {
    if(donationQueue.length > 0) {
        alarm.play();
        const data = donationQueue[0];

        const name = data.name;
        const price = dtat.price;
        const content = data.content;
        const type = data.type;
        document.getElementById('name').innerHTML = name;
        document.getElementById('price').innerHTML = price;
        document.getElementById('donationText').innerHTML = content;

        if(type == 'TEXT') {
            $("div").fadeIn();
            manageDoc(0, 1, 0, 0, 0);

            responsiveVoice.speak(content, 'Korean Female', { onend: function() {
                myTimeout = setTimeout(() => {
                    $("div").fadeOut();                                     
                    donationQueue.shift();
                    setTimeout(() => {
                        playDonation(); 
                    }, 2000);
                }, 4000);
            }});
        }

        else if(type == 'VIDEO') {
            $("div").fadeIn();
            manageDoc(0, 0, 1, 0, 1);
            document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';

            let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            let match = content.toString().split(' ')[0].match(regExp);
            if(!match[2]) {
                skip();
            }
            else {
                console.log(match[2]);
                let length = price*2;
                document.getElementById('videoiframe').src = 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1';

                const time = await getVideoLength(match[2]);
                if(length > time) {
                    length = time;
                    console.log(length);
                }
                    
                await delay(length*1000);
                document.getElementById('videoiframe').src = 'about:blank';
                $("div").fadeOut();
                donationQueue.shift();

                await delay(2000);
                playDonation();
            }
        }  
        
        else if(type == 'CLIP') {
            $("div").fadeIn();
            manageDoc(0, 0, 0, 1, 1);
            document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';
            
            const videoid = content.split('/');
            const length = price*2000;
            if(videoid[2] == 'clips.twitch.tv') videoid = videoid[3];
            else if(videoid[2] == 'www.twitch.tv') videoid = videoid[5];
            console.log(videoid);
            document.getElementById('clipiframe').src = 'https://clips.twitch.tv/embed?clip=' + videoid;

            fetch('https://api.twitch.tv/kraken/clips/'+videoid , {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': 'aqb3jyyi5f9kooibp1if0clz2gqwrt'
                }
            })
            .then((res) => {
                if(res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                if(price > data['duration']) {
                    length = data['duration']*1000;
                }
                setTimeout(() => {
                    document.getElementById('clipiframe').src = 'about:blank'
                    $("div").fadeOut();
                    donationQueue.shift();
                    setTimeout(() => {
                        playDonation();
                    }, 2000);
                }, length+1000);     
            });
        }

        else if(type == 'IMAGE' || type == 'AUDIO') {
            now++;
            playDonation();
        }
    }
    else {
        setTimeout(() => {
            console.log(now);
            playDonation();
        }, 1000);
    }
}

function convert_time(duration) {
    var total = 0;
    var hours = duration.match(/(\d+)H/);
    var minutes = duration.match(/(\d+)M/);
    var seconds = duration.match(/(\d+)S/);
    if (hours) total += parseInt(hours[1]) * 3600;
    if (minutes) total += parseInt(minutes[1]) * 60;
    if (seconds) total += parseInt(seconds[1]);
    return total;
}

function manageDoc(a, b, c, d, e) {
    document.getElementById('countdiv').style.display = (a ? 'block' : 'none');
    document.getElementById('textdiv').style.display = (b ? 'block' : 'none'); 
    document.getElementById('videodiv').style.display = (c ? 'block' : 'none');
    document.getElementById('clipdiv').style.display = (d ? 'block' : 'none');
    document.getElementById('videotextdiv').style.display = (e ? 'block' : 'none');
}

function delay(ms) {
    return new Promise(resolve => myTimeout = setTimeout(resolve, ms));
}

function pause() {
    manageDoc(0, 0, 0, 0, 0);
    document.getElementById('videoiframe').src = 'about:blank';
    document.getElementById('clipiframe').src = 'about:blank';
    responsiveVoice.cancel();
    window.speechSynthesis.cancel();
    if(myTimeout) clearTimeout(myTimeout);
}

function resume() {
    playDonation();
}

function skip() {
    pause();
    if(donationQueue.length > 0) {
        donationQueue.shift();
    }
    playDonation();
}

function replay(num) {
    pause();
    if(num <= now) {
        now = num;
    }
    playDonation();
}

/*function playTTS(text) {
    let regex = /([^따]*)(.*)/;
    let match = text.match(regex);
    console.log(match[0]);
    console.log(match[1]);
    console.log(match[2]);
    responsiveVoice.speak(match[0], 'Korean Female', { onend: function() {   
        setTimeout(() => {
            //document.getElementById('textdiv').style.display = 'none';   
            $("div").fadeOut();                                     
            now++;
            setTimeout(() => {
                playDonation(); 
            }, 2000);
        }, 1000);
    } });
}*/