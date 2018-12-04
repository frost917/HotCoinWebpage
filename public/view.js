const socket = io.connect('https://hotsorry.herokuapp.com');
let myTimeout;
responsiveVoice.setDefaultVoice('Korean Female');
let donationQueue = new Array();

let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
let content = document.getElementById('donationText').innerHTML;
let match = content.toString().split(' ')[0].match(regExp);
let alarm = new Audio('./assets/audio/alarm.mp3');
let signitureList = [
    '(고통)',
    '(닥쳐)',
    '(물론)',
    '(븅신)',
    '(신음)',
    '(아암)',
    '(안돼)',
    '(재성대장)',
    '(좋아)',
    '(포기)',
    '(흉측)',
];

let audios = {
    '(고통)': new Audio(`./assets/audio/(고통).mp3`),
    '(닥쳐)': new Audio(`./assets/audio/(닥쳐).mp3`),
    '(물론)': new Audio(`./assets/audio/(물론).mp3`),
    '(븅신)': new Audio(`./assets/audio/(븅신).mp3`),
    '(신음)': new Audio(`./assets/audio/(신음).mp3`),
    '(아암)': new Audio(`./assets/audio/(아암).mp3`),
    '(안돼)': new Audio(`./assets/audio/(안돼).mp3`),
    '(재성대장)': new Audio(`./assets/audio/(재성대장).mp3`),
    '(좋아)': new Audio(`./assets/audio/(좋아).mp3`),
    '(포기)': new Audio(`./assets/audio/(포기).mp3`),
    '(흉측)': new Audio(`./assets/audio/(흉측).mp3`)
}

let durations = {
    '(고통)': 1000,
    '(닥쳐)': 1000,
    '(물론)': 1000,
    '(븅신)': 1000,
    '(신음)': 2500,
    '(아암)': 1000,
    '(안돼)': 3500,
    '(재성대장)': 1000,
    '(좋아)': 1000,
    '(포기)': 4500,
    '(흉측)': 1000
};

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ytPlayer;
window.onYouTubeIframeAPIReady = function() {
    console.log('유튜브');
    window.ytPlayer = new YT.Player('videoiframe', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) { 

}

function onPlayerStateChange(event) {
    if(event.data == 0) {
        endVideoDonation();      
    }
}

async function endVideoDonation() {
    document.getElementById('videoiframe').src = 'about:blank';
    $("div").fadeOut();
    donationQueue.shift();

    await delay(2000);
    playDonation();
}

async function getVideoLength(id) {
    const fetchVidLen = await fetch('https://www.googleapis.com/youtube/v3/videos?id='+id+'&part=contentDetails&id=$vId&key=AIzaSyCO_io6V02e4VtKW7NsexEhVzETLnzwOwE');
    const vidLenJSON = await fetchVidLen.json();
    console.log(vidLenJSON);
    return convert_time(vidLenJSON['items'][0]['contentDetails']['duration']);
}

socket.on('donated', (data) => {
    console.log('pushed');
    donationQueue.push(data);
    console.log(data);
    console.log(donationQueue);
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
        console.log(data);

        const image = data.image;
        const name = data.name;
        const price = data.price;
        const content = data.paragraph;
        const type = data.types;
        document.getElementById('donationimg').src = './assets/img/' + image;
        document.getElementById('name').innerHTML = name;
        document.getElementById('price').innerHTML = price;
        document.getElementById('donationText').innerHTML = content;

        if(type == 'TEXT') {
            $("div").fadeIn();
            manageDoc(0, 1, 0, 0, 0);

            let strArray = content.split(' ');
            await playTTS(strArray, 0, 0);

            /*responsiveVoice.speak(content, 'Korean Female');
            const delaytime = parseInt(content.length)*1000/4;

            await delay(delaytime+3000);*/
            $("div").fadeOut();
            donationQueue.shift();

            await delay(2000);
            playDonation();
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

                //document.getElementById('videoiframe').src = 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1';
                let time = await getVideoLength(match[2]);
                const starttime = content.toString().split('?t=')[1];
                if(starttime) {
                    ytPlayer.loadVideoById(match[2], parseInt(starttime));
                    //document.getElementById('videoiframe').src += '&start='+starttime;
                    time -= parseInt(starttime);
                }
                else {
                    ytPlayer.loadVideoById(match[2]);
                }

                //ytPlayer.playVideo();
                
                if(length < time) {
                    await delay(length*1000);
                    ytPlayer.stopVideo();
                    await endVideoDonation();
                }
            }
        }  
        
        else if(type == 'CLIP') {
            $("div").fadeIn();
            manageDoc(0, 0, 0, 1, 1);
            document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';
            
            let videoid = content.split('/');
            let length = price*2000;
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
                if(price*2 > data['duration']) {
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
            playDonation();
        }
    }
    else {
        setTimeout(() => {
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
    document.getElementById('videoiframe').width = (c ? 1280 : 0);
    document.getElementById('videoiframe').height = (c ? 720 : 0);
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
    playDonation();
}

async function playTTS(textArr, start, now) {
    if(now >= textArr.length) {
        console.log('now big');
        let str = '';
        for(let i=start;i<now;i++) {
            str += textArr[i] + ' ';
        }
        let len = str.length * 250 + 3000;
        responsiveVoice.speak(str, 'Korean Female');
        await delay(len);
        return;
    }
    console.log(textArr[now]);
    if(signitureList.includes(textArr[now])) {
        console.log('yes');
        console.log(textArr[now]);
        let str = '';
        for(let i=start;i<now;i++) {
            str += textArr[i] + ' ';
        }
        if(str.length > 0) {
            let len = str.length * 250;
            responsiveVoice.speak(str, 'Korean Female');
            await delay(len);
        }

        let sig = audios[textArr[now]];
        sig.play();
        await delay(durations[textArr[now]]+500);
        console.log('ended');
        await playTTS(textArr, now+1, now+1);
    }
    else {
        await playTTS(textArr, start, now+1);
    }
}