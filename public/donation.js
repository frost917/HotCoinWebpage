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
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        fetch('/donate', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': token
            },
            body: JSON.stringify(formData)
        })
        .then((res) => {
            if(res.ok) {
                return res;
            }
            alert('csrf');
        })
        .then((data) => {
            if(parseInt(document.getElementById('price').value) > parseInt(document.getElementById('coin').value)) {
                window.location.href = 'https://hotsorry.herokuapp.com/fail';
            }
            else {
                socket.emit('donated', formData);
                window.location.href = 'https://hotsorry.herokuapp.com/success';
            }
            console.log('yeah');   
        });
    });
});
