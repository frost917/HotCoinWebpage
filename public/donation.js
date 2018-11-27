$(document).ready(function() {
    document.getElementById('id').value = document.getElementById('userid').innerHTML;
    document.getElementById('coin').value = document.getElementById('usercoin').innerHTML;
    
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
});
