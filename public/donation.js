$(document).ready(function() {
    document.getElementById('id').value = document.getElementById('userid').innerHTML;
    document.getElementById('coin').value = document.getElementById('usercoin').innerHTML;

    $('#formDonate').submit(function(event) {
        event.preventDefault();
        const formData = {};
        $('#formDonate').serializeArray().forEach((element) => {
            formData[element.name] = element.value;
        });

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
