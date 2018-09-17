fetch('/coins/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify( { id: document.getElementById('userid').innerHTML, coin: document.getElementById('usercoin').innerHTML })
})
.then(res => res.json())
.then(res => console.log('코인 써라'));