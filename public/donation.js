$(document).ready(function() {
    document.getElementById('id').value = document.getElementById('userid').innerHTML;
    document.getElementById('coin').value = document.getElementById('usercoin').innerHTML;

    $('#formDonate').submit(function(event) {
        console.log('버튼눌름');
        event.preventDefault();
        
        const formData = {};
        formData['id'] = $('#id').value;
        formData['coin'] = $('#coin').value;
        formData['name'] = $('#name').value;
        formData['price'] = $('#price').value;
        formData['types'] = $('#types').value;
        formData['paragrapth'] = $('#paragraph').value;

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
