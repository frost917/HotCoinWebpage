/*const getCoinfromUser = async(user) => {
    const fetchCoin = await fetch('https://api.twitch.tv/kraken/users?login=' + user.id, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'rzqazfzpfb7iqxk546uvrwej12f9le'
        }
    });
    const coinJSON = await fetchCoin.json();
    document.getElementById('coinlist').innerHTML += coinJSON['users'][0]['display_name'] + '(' + user.id +')' + ': ' + user.coin + '코인' + '<br />';
};

function f(users, k, n) {
    if(k >= n) return;
    getCoinfromUser(users[k]);
    setTimeout(() => { f(users, k+1, n) }, 0);
}

fetch('/coins/get')
.then((res) => {
    if(res.ok) {
        return res.json();
    }
})
.then((data) => {
    let users = data;
    f(users, 0, users.length);
});*/