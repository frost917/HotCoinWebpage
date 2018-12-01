async function f() {
    const id = document.getElementById('id').value;
    const fetchCoin = await fetch('https://api.twitch.tv/kraken/users?login=' + id, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'rzqazfzpfb7iqxk546uvrwej12f9le'
        }
    });
    const coinJSON = await fetchCoin.json();
    const name = coinJSON['users'][0]['display_name'];
    document.getElementById('name').value = name;
    document.getElementById('price').value = 10;
}

$(document).ready(f());

const imageArr = ['img1.png', 'img2.jpg', 'img3.png', 'img4.gif', 'img5.gif', 'img6.gif', 'img7.gif'];

$('#image_select').change(function() {
    document.getElementById('image_selected').src = './assets/img/' + imageArr[this.selectedIndex];
});
