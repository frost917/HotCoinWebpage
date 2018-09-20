document.getElementById('formDonate').addEventListener('submit', function() {
    let usercoin = document.getElementById('usercoin').innerHTML;
    let price = document.getElementById('price').value;
    if(price > usercoin) {
        return;
    }
    fetch('/coins/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: document.getElementById('userid').innerHTML, 
            coin: usercoin - price
        })
    })
    .then(res => res.json())
    .then(res => console.log('코인 써라'));
});
