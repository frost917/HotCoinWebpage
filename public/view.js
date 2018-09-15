let now = document.getElementById('counter').innerHTML;
let len;
console.log('됨');

let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
let content = document.getElementById('donationText').innerHTML;
let match = content.toString().split(' ')[0].match(regExp);
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
            func(); 
        }, 2000);         
    }
}*/

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

    fetch('/counter/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count: now })
    })
    .then(res => res.json())
    .then(res => console.log('포스트'));
    /*$.ajax({
        url: '/counter/post',
        async: true,
        type: 'POST',
        data: {
            count: now
        },
        dataType: 'json',
        beforeSend: function(jqXHR) {},
        success: function(jqXHR) { 
            console.log('성공'); 
        },
        error: function(jqXHR) {},
        complete: function(jqXHR) {
            console.log('완료');
        }
    });*/

    //fetch("http://localhost:3000/donations")
    fetch("/donations")
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
                document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';

                let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                let match = content.toString().split(' ')[0].match(regExp);
                console.log(match[2]);
                //player.loadVideoById(match[2]);
                let length = price*1000;
                document.getElementById('videoiframe').src = 'https://www.youtube.com/embed/'+match[2]+'?autoplay=1';

                fetch('https://www.googleapis.com/youtube/v3/videos?id='+match[2]+'&part=contentDetails&id=$vId&key=AIzaSyCO_io6V02e4VtKW7NsexEhVzETLnzwOwE')
                .then((res) => {
                    if(res.ok) {
                        return res.json();
                    }
                })
                .then((data) => {
                    let time = convert_time(data['items'][0]['contentDetails']['duration']);
                    if(price > time) {
                        length = time*1000;
                        console.log(length);
                    }
                    setTimeout(() => {
                        document.getElementById('videoiframe').src = 'about:blank'
                        $("div").fadeOut();
                        now++;
                        setTimeout(() => {
                            func();
                        }, 2000);
                    }, length+1000); 
                });
                /*setTimeout(() => {
                    player.stopVideo();
                    //document.getElementById('videodiv').style.display = 'none';
                    //document.getElementById('videotextdiv').style.display = 'none';
                    $("div").fadeOut();
                    now++;
                    setTimeout(() => {
                        func();
                    }, 2000);
                }, price*1000);
                document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';  */     
            }   

            if(type == 'CLIP') {
                $("div").fadeIn();
                document.getElementById('countdiv').style.display = 'none';
                document.getElementById('textdiv').style.display = 'none'; 
                document.getElementById('videodiv').style.display = 'none';
                document.getElementById('clipdiv').style.display = 'block';
                document.getElementById('videotextdiv').style.display = 'block';
                document.getElementById('videotext').innerHTML = name + '님 ' + price + '헛코 후원 감사합니다.';
                
                let content = document.getElementById('donationText').innerHTML;
                let videoid = content.split('/');
                let length = price*1000;
                if(videoid[2] == 'clips.twitch.tv') videoid = videoid[3];
                else if(videoid[2] == 'www.twitch.tv') videoid = videoid[5];
                console.log(videoid);
                document.getElementById('clipiframe').src = 'https://clips.twitch.tv/embed?clip=' + videoid;

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
            }

            if(type == 'IMAGE' || type == 'AUDIO') {
                now++;
                func();
            }
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