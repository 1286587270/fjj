
$("#btn").click(function () {
    var files = $('#DCM-01').prop('files');
    var data = new FormData();
    data.append('DCM-01', files[0]);

    $.ajax({
        type: 'POST',
        url: "/upload",
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (ret) {
            console.log(ret)
        },
        error: function (ret) {
            console.log(ret)
        }
    });
});