const data = JSON.parse(document.getElementById('data').innerHTML);

let startpos = data.length - (data.length % 10);
let endpos = data.length;
showData(startpos, endpos);

document.getElementById('btnPrev').addEventListener('click', () => {
    if(startpos > 10) {
        startpos -= 10;
        endpos = (startpos + 10 < data.length) ? startpos + 10 : data.length;
        showData(startpos, endpos);
    }
});
document.getElementById('btnNext').addEventListener('click', () => {
    if(endpos < data.length) {
        startpos += 10;
        endpos = (startpos + 10 < data.length) ? startpos + 10 : data.length;
        showData(startpos, endpos);
    }
});

function showData(start, end) {
    console.log(start + ' ' + end);
    document.getElementById('donationlist').innerHTML = '';
    for(let i=start;i<end;i++) {
        let obj = data[i];
        document.getElementById('donationlist').innerHTML += `${obj.name}님이 ${obj.price}헛코 후원. 내용: ${obj.content} <br />`;
    }
}