var skuError = false;
var filesData = [];
var fileCounter = 0;


var getCurrentDateTime = function () {
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "_" + (currentdate.getMonth() + 1) + "_" + currentdate.getDate() + "_" + currentdate.getHours() + "_" + currentdate.getMinutes() + "_" + currentdate.getSeconds();
    return datetime;
}

var getCurrentDate = function () {
    var currentdate = new Date();
    var currMon = (currentdate.getMonth() + 1).toString();
    var currDate = currentdate.getDate().toString();

    if (currMon.length < 2)
        currMon = "0" + currMon;
    if (currDate.length < 2)
        currDate = "0" + currDate;

    return currentdate.getFullYear() + "" + currMon + "" + currDate;
}




// Start-- Capture Files after Camera Click
var addFilesToUpload = function () {
    var fileCounter = 0;

    var id = getUniqueIdentifier();
    $(".UploadFileForm").append("<input id='" + id + "' type='file' added='false'  added='false' name='" + id + "' style='display:none;' accept='image/*' multiple/>");

    document.getElementById(id).onchange = function (evt) {

        $('#' + id).attr('added', 'true');
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;
        if (FileReader && files && files.length) {

            $.each(files, function (index, value) {
                var name = value.name.split('.')[0];
                fileCounter = fileCounter + 1;
                var fileNam;
                var fileNaam ;
                if ($('.lblRepairNumRD').text() != '') {
                    fileNam = $('.lblRepairNumRD').text();
                    fileNaam =fileNam + '_' + getCurrentDateTime() + '.' + value.name.split('.')[1];
                } else {
                    fileNam = "Repair#";
                    fileNaam = getCurrentDateTime() + '.' + value.name.split('.')[1];
                }
                var filename = fileNam + '_' + getCurrentDateTime();
                var file = fileNam + '_' + getCurrentDateTime() + '.' + value.name.split('.')[1];
                var hid = getUniqueIdentifier();
                
                $(".UploadFileForm").append("<input type='hidden' class='" + hid + "' name='" + name + "'/>");
                var imageData = "<div class='col-12 col-m-12 brdrBtm " + name + "_" + getCurrentDateTime() + "'><div class='col-9 col-m-9 pad5'><label class='scannedImageLbl' data-name='" + value.name + "'>" + fileNaam + "</label></div><div class='col-3 col-m-3 pad3 txtCnt'><a href='#' value='Remove' class='imgRemoveOption' aria-hidden='true' data-hame=" + name + "_" + getCurrentDateTime() + ">Remove</a></div></div>";
                //var imageData = "<div class='col-12 col-m-12 brdrBtm " + name + "_" + getCurrentDateTime() + "'><div class='col-9 col-m-9 pad5'><label class='scannedImageLbl' data-name='" + value.name + "'>" + fileNaam + "</label></div><div class='col-3 col-m-3 pad3 txtCnt'><i class='fa fa-trash-o fa-2x imgRemoveOption' aria-hidden='true' data-hame=" + name + "_" + getCurrentDateTime() + "></i></div></div>";
                
                
                $('.imgcptbody').append(imageData);
                $('.skuScananchor').removeAttr('href');
                $('.repairScananchor').removeAttr('href');

                value.fileName = file;
                value.name = file;
                filesData.push(value);
            });
            if (filesData.length > 0) {
                $('.btnUpload').attr('disabled', false);
                //  $("." + id).click();
            } else {
                $('.btnUpload').attr('disabled', true);
            }
            localStorage.setItem("filesData", filesData);
            localStorage.setItem('imagesCapturedDiv', $('.imgcptbody').html());
        }
    };
    if (filesData.length > 0)
        $('.btnUpload').attr('disabled', false);
    $("#" + id).click();



}
// End-- Capture Files after Camera Click

var getUniqueIdentifier = function () {
    return "uid_" + String(Math.floor(Math.random() * 1000000000)).replace(".", "");
}



function getParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else {
        return results[0];
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};