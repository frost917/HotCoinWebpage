let now = 57;
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
        //event.target.playVideo();
        event.target.loadVideoById(match[2]); 
    }

    function onPlayerStateChange(event) {
        if(event.data == 0) {
            //setTimeout(() => {
                document.getElementById('videodiv').style.display = 'none';
                setTimeout(() => {
                    func(); 
                }, 2000);
            //}, 1000);
            
        }
    }


function func() {                  
    fetch("http://localhost:3000/donations")
    //fetch("http://hotsorry.herokuapp.com/donations")
    .then((res) => {
        if(res.ok) {
            return res.json();
        }
    })
    .then((data) => {
        let obj = data;
        let len = obj.length;
        if(now < len) {
            let type = obj[now].type;
            document.getElementById('name').innerHTML = obj[now].name;
            document.getElementById('price').innerHTML = obj[now].price;
            document.getElementById('donationText').innerHTML = obj[now].content;
            if(type == 'TEXT') {
                let str = document.getElementById('donationText').innerHTML.split(' ');
                let len = str.length;
                responsiveVoice.speak(document.getElementById('donationText').innerHTML, 'Korean Female', { onend: function() {   
                    setTimeout(() => {
                        document.getElementById('textdiv').style.display = 'none';                                         
                        now++;
                        setTimeout(() => {
                            func(); 
                        }, 2000);
                    }, 1000);
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
                document.getElementById('textdiv').style.display = 'block'; 
                document.getElementById('videodiv').style.display = 'none';
            }

            if(type == 'VIDEO') {
                let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                let content = document.getElementById('donationText').innerHTML;
                let match = content.toString().split(' ')[0].match(regExp);
                console.log(match[2]);
                player.loadVideoById(match[2]);
                document.getElementById('videodiv').style.display = 'block';
                now++;
            }   

            if(type == 'CLIP') {
                let content = document.getElementById('donationText').innerHTML;
                let videoid = content.split('/')[3].split('?')[0];
                console.log(videoid);
                document.getElementById('clipiframe').src = 'https://clips.twitch.tv/embed?clip=' + videoid;
                setTimeout(() => {
                    document.getElementById('clipdiv').style.display = 'none';
                    now++;
                    setTimeout(() => {
                        func();
                    }, 2000);
                }, 10000);
            }

            if(type == 'IMAGE') {
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
            }
        }
        else {
            setTimeout(() => {
                func();
            }, 1000);
        }
    });
}

func(); 


function playTTS(text, len, index, f) {
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
}