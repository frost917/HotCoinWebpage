$(document).ready(function() {
    document.getElementById('id').value = document.getElementById('userid').innerHTML;
    document.getElementById('coin').value = document.getElementById('usercoin').innerHTML;

    $('#formDonate').submit(function(event) {
        event.preventDefault();
        
        const formData = {};
        formData['id'] = $('#id').val();
        formData['coin'] = $('#coin').val();
        formData['name'] = $('#name').val();
        formData['price'] = $('#price').val();
        formData['types'] = $('#types').val();
        formData['paragrapth'] = $('#paragraph').val();

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
