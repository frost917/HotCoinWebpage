const socket = io();
$(document).ready(function() {
    document.getElementById('id').value = document.getElementById('userid').innerHTML;
    document.getElementById('coin').value = document.getElementById('usercoin').innerHTML;

    $('#formDonate').submit(function(event) {
        console.log('버튼눌름');
        event.preventDefault();
        
        const formData = {};
        formData['id'] = document.getElementById('id').value;
        formData['coin'] = document.getElementById('coin').value;
        formData['name'] = document.getElementById('name').value;
        formData['price'] = document.getElementById('price').value;
        formData['types'] = document.getElementById('types').value;
        formData['paragraph'] = document.getElementById('paragraph').value;

        console.log(formData);

        $.ajax({
            url: '/success',
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(data) {
                socket.emit('donated', data);
            }
        });
    });
});
