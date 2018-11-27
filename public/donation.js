$('#formDonate').submit(function(event) {
    event.preventDefault();
    const data = $('#formDonate').serializeArray();

    $.ajax({
        url: '/success',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(getFormData(data)),
        success: function(data){
            socket.emit('donated', data);
        }
    });
});