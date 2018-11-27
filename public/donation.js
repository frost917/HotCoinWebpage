const socket = io.connect('https://hotsorry.herokuapp.com');
$(document).ready(function() {
    document.getElementById('id').value = document.getElementById('userid').innerHTML;
    document.getElementById('coin').value = document.getElementById('usercoin').innerHTML;

    $('#formDonate').submit(function(event) {
        event.preventDefault();
        
        const formData = {};
        formData['id'] = document.getElementById('id').value;
        formData['coin'] = document.getElementById('coin').value;
        formData['name'] = document.getElementById('name').value;
        formData['price'] = document.getElementById('price').value;
        formData['types'] = document.getElementById('types').value;
        formData['paragraph'] = document.getElementById('paragraph').value;
        socket.emit('donated', formData);
        fetch('/success', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((res) => {
            return res;
        })
        .then((data) => {
            window.location.href = 'https://hotsorry.herokuapp.com/success';
            console.log('yeah');   
        });
    });
});
