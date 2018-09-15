let now = document.getElementById('counter').innerHTML;
let len;
console.log('됨');

let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
let content = document.getElementById('donationText').innerHTML;
let match = content.toString().split(' ')[0].match(regExp);

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
            func(); 
        }, 2000);         
    }
}

function func() {
    
    document.getElementById('counter').innerHTML = now;
    /*fetch("http://localhost:3000/counter")
    .then((res) => {
        if(res.ok) {
            return res.json();
        }
    })
    .then((data) => {
        now = data.count;
    });*/

    //fetch("http://localhost:3000/donations")
    fetch("https://hotsorry.herokuapp.com/donations")
    .then((res) => {
        if(res.ok) {
            return res.json();
        }
    })
    .then((data) => {
        let obj = data;
        let len = obj.length;      
        if(now < len) {
            let name = obj[now].name;
            let price = obj[now].price;
            let content = obj[now].content;
            let type = obj[now].type;
            document.getElementById('name').innerHTML = name;
            document.getElementById('price').innerHTML = price;
            document.getElementById('donationText').innerHTML = content;
            if(type == 'TEXT') {
                $("div").fadeIn();
                document.getElementById('countdiv').style.display = 'none';
                document.getElementById('textdiv').style.display = 'block'; 
                document.getElementById('videodiv').style.display = 'none';
                document.getElementById('clipdiv').style.display = 'none';
                document.getElementById('videotextdiv').style.display = 'none';

                let str = document.getElementById('donationText').innerHTML;
                let len = str.length;

                let regex = /([^따]*)(.*)/;
                let match = str.match(regex);
                console.log(match[0]);
                console.log(match[1]);
                console.log(match[2]);
                responsiveVoice.speak(str, 'Korean Female', { onend: function() {   
                    setTimeout(() => {
                        //document.getElementById('textdiv').style.display = 'none';   
                        $("div").fadeOut();                                     
                        now++;
                        setTimeout(() => {
                            func(); 
                        }, 2000);
                    }, 4000);
                } });
                /*playTTS(str, len, 0, function() {
                    setTimeout(() => {
                        document.getElementById('textdiv').style.display = 'none';                                         
                        now++;
                        setTimeout(() => {
                            func(); 
                        }, 2000);
                    }, 1000);
                });*/
                //playTTS(document.getElementById('donationText').innerHTML);
            }

            if(type == 'VIDEO') {
                $("div").fadeIn();
                document.getElementById('countdiv').style.display = 'none';
                document.getElementById('textdiv').style.display = 'none'; 
                document.getElementById('videodiv').style.display = 'block';
                document.getElementById('clipdiv').style.display = 'none';
                document.getElementById('videotextdiv').style.display = 'block';

                let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                let match = content.toString().split(' ')[0].match(regExp);
                console.log(match[2]);
                player.loadVideoById(match[2]);
                
                setTimeout(() => {
                    player.stopVideo();
                    //document.getElementById('videodiv').style.display = 'none';
                    //document.getElementById('videotextdiv').style.display = 'none';
                    $("div").fadeOut();
                    now++;
                    setTimeout(() => {
                        func();
                    }, 2000);
                }, price*1000);
                document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';       
            }   

            if(type == 'CLIP') {
                $("div").fadeIn();
                document.getElementById('countdiv').style.display = 'none';
                document.getElementById('textdiv').style.display = 'none'; 
                document.getElementById('videodiv').style.display = 'none';
                document.getElementById('clipdiv').style.display = 'block';
                document.getElementById('videotextdiv').style.display = 'block';
                
                let content = document.getElementById('donationText').innerHTML;
                let videoid = content.split('/');
                let length = price*1000;
                if(videoid[2] == 'clips.twitch.tv') videoid = videoid[3];
                else if(videoid[2] == 'www.twitch.tv') videoid = videoid[5];
                console.log(videoid);
                document.getElementById('clipiframe').src = 'https://clips.twitch.tv/embed?clip=' + videoid;
                document.getElementById('clipdiv').style.display = 'block';

                fetch('https://api.twitch.tv/kraken/clips/'+videoid , {
                    method: 'GET',
                    //mode: 'no-cors',
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
                    //let clipdata = JSON.parse(data);
                    console.log(price);
                    if(price > data['duration']) {
                        length = data['duration']*1000;
                        console.log(length);
                    }
                    setTimeout(() => {
                        document.getElementById('clipiframe').src = 'about:blank'
                        //document.getElementById('clipdiv').style.display = 'none';
                        //document.getElementById('videotextdiv').style.display = 'none';
                        $("div").fadeOut();
                        now++;
                        setTimeout(() => {
                            func();
                        }, 2000);
                    }, length+1000);     
                });

                

                document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';
            }

            if(type == 'IMAGE' || type == 'AUDIO') {
                now++;
                func();
            }

            /*if(type == 'IMAGE') {
                let content = document.getElementById('donationText').innerHTML;
                document.getElementById('image').src = content;
                setTimeout(() => {
                    now++;
                    setTimeout(() => {
                        func();
                    }, 2000);
                }, 2000);
            }

            if(type == 'AUDIO') {
            }*/
        }
        else {
            setTimeout(() => {
                console.log(now);
                func();
            }, 1000);
        }
    });

    /*let counter = {
        count: 0
    };
    counter['count'] = now;
    fetch("http://localhost:3000/counter", {
        method: 'post',
        body: JSON.stringify(counter)
    })
    .then((res) => {
        if(res.status === 200 || res.status === 201) {
            //res.json().then(json => console.log(json));
        }
        else {
            console.err(res.statusText);
        }
    })
    .catch(err => console.error(err));*/
}

func(); 

function fadeOut() {
    let divs = document.getElementsByTagName('div');
    /*for(let i in divs) {
        //i.style.animation = 'fadeout 500ms';
        let fadeout = setInterval(() => {
            if(i.style.opacity > 0) {
                i.style.opacity -= 0.1;
            }
            else {
                clearInterval(fadeout);
            }
        }, 10);
    }*/
    $("div").fadeOut();
}

/*function playTTS(text, len, index, f) {
    responsiveVoice.speak(text[index], 'Korean Female', { onend: function() {  
        console.log(index + ' ' + len);
        if(index < len-1) {
            if(text[index+1] == '따') {
                let audio = new Audio('따.mp3');
                //let audio = document.getElementById('audio');
                audio.play();
                audio.onended = function() {
                    console.log('퉤');
                    if(index+1 < len-1) {
                        playTTS(text, len, index+1, f);
                    }
                    else {
                        f();
                    }
                }
            }
            else {
                playTTS(text, len, index+1, f);
            }
        }
        else {
            f();
        }
    } });
}*/

function playTTS(text) {
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
                func(); 
            }, 2000);
        }, 1000);
    } });
}