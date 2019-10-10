var repairDetailsLoad = function (name) {

    var skuDescription = localStorage.getItem('currentSKUDESCRIPTION');
    var companyCode = localStorage.getItem('currentCOMPANYCODE');
    var repairDate = $('.lblDate').text();
    var location = $('.lblLocation').text();
    var repairPersonSR = $('#rPersonPopupInputSR1').text();
    var repairPersonCR = $('#rPersonPopupInputCR').text();
    var repairPersonSRID = $('#rPersonPopupInputSR1').attr('repairPersonID');
    var repairPersonCRID = $('#rPersonPopupInputCR').attr('repairPersonID');

    var rewrapItem = $('input[name=rewrap]:checked').attr('dname');
    var purchaseOrderNum = ($('.txtPONum').val() == "") ? "0" : $('.txtPONum').val();
    var salesNum = ($('.txtSalesNum').val() == "") ? "0" : $('.txtSalesNum').val();
    var suffixNum = ($('.txtSuffixO').val() == "") ? "0" : $('.txtSuffixO').val();
    var sourceLoc = ($('.txtSourceLoc').val() == "") ? "0" : $('.txtSourceLoc').val();
    var repairNum = $('.lblRepairNumber').text();
    var status = $('.lblStatus').text();
    var minutesSpent = calculateMinuteSpent();


    $('.createRepairScreen').addClass('hide');

    var repairStatusCode = $('.lblStatus').attr('code');
    $('.tab').html('');
    clearRepairDetailsData();
    if ($('.repairDetailScreen').hasClass('hide')) {
        $('.repairDetailScreen').removeClass('hide');
    }

    if ($('.btnUpload').hasClass('displayNone')) {
        $('.btnUpload').removeClass('displayNone');
        $('.btnUpload').addClass('displayBlock');
    }

    if ($('.btnDiscardChanges').hasClass('displayNone')) {
        $('.btnDiscardChanges').removeClass('displayNone');
        $('.btnDiscardChanges').addClass('displayBlock');
    }

    if ($('.btnDiscardChanges').hasClass('fLeft')) {
        $('.btnDiscardChanges').removeClass('fLeft');
        $('.btnDiscardChanges').addClass('fRight');
    }
    if ($('.btnBack').hasClass('displayNone')) {
        $('.btnBack').removeClass('displayNone');
        $('.btnBack').addClass('displayBlock');
    }
    if ($('.btnCreateNext').hasClass('displayBlock')) {
        $('.btnCreateNext').removeClass('displayBlock');
        $('.btnCreateNext').addClass('displayNone');
    } else {
        $('.btnCreateNext').addClass('displayNone');
    }

    if ($('.btnCancelRepair').hasClass('displayBlock')) {
        $('.btnCancelRepair').removeClass('displayBlock');
        $('.btnCancelRepair').addClass('displayNone');
    }

    // $.ajax({
    //     url: "../public/Layouts/RepairDetails.html",
    //     success: function (data) {
    //         $('.tab').html(data);
    //         if ($('.btnUpload').hasClass('displayNone')) {
    //             $('.btnUpload').removeClass('displayNone');
    //             $('.btnUpload').addClass('displayBlock');
    //         }
    //         if ($('.btnBack').hasClass('displayNone')) {
    //             $('.btnBack').removeClass('displayNone');
    //             $('.btnBack').addClass('displayBlock');
    //         }
    //         if ($('.btnCreateNext').hasClass('displayBlock')) {
    //             $('.btnCreateNext').removeClass('displayBlock');
    //             $('.btnCreateNext').addClass('displayNone');
    //         } else {
    //             $('.btnCreateNext').addClass('displayNone');
    //         }

    //         if ($('.btnCancelRepair').hasClass('displayBlock')) {
    //             $('.btnCancelRepair').removeClass('displayBlock');
    //             $('.btnCancelRepair').addClass('displayNone');
    //         }
    //     },
    //     dataType: 'html'
    // });
    if (name.toLowerCase() == "searchrepair1") {
        var pieceCount = $('.txtPCSR').val();
        var sku = $('.inpSRSKU').val();
        $('.cRScreenOnly').addClass('hide');

        if ($('.sRScreenOnly').hasClass('hide')) {
            $('.sRScreenOnly').removeClass('hide');
            //$('.sRScreenOnly').addClass('show');
        }
        $('.cRScreenOnly').addClass('hide');

        $('.lblSkuNumRD').text(sku + ' ' + skuDescription);
        $('.lblSkuNumRD').attr('sku', sku);
        $('.lblSkuNumRD').attr('skuDescription', skuDescription);
        if (companyCode == "300") {
            $('.lblSkuNumRD').text(sku + ' ' + skuDescription + ' LON ');
        } else {
            $('.lblSkuNumRD').text(sku + ' ' + skuDescription);
        }
        $('.lblMinutesRD').text(minutesSpent);
        $('.lblRepairPersonSD').text(repairPersonSR).attr('rpID', repairPersonSRID);
        $('.lblRepairNumRD').text(repairNum);
        $('.lblStatusRD').text(status).attr('code', repairStatusCode);
        $('.lblRepairNumRD').text(repairNum);
        $('.lblSKU').attr('sku', sku);
        if (pieceCount == 0) pieceCount = 1;
        $('.lblPieceCount').text(pieceCount);

    } else {
        var pieceCount = $('.txtPC').val();
        var sku = $('.txtSKU').val();
        $('.sRScreenOnly').addClass('hide');
        //$('.cRScreenOnly').removeClass('hide');
        if ($('.cRScreenOnly').hasClass('hide')) {
            $('.cRScreenOnly').removeClass('hide');
        }
        $('.lblSKU').text(sku + ' ' + skuDescription);
        $('.lblSKU').attr('sku', sku);
        $('.lblMinutes').text(minutesSpent);
        $('.lblRepairPersonCD').text(repairPersonCR).attr('rpID', repairPersonSRID);
        if (companyCode == "300") {
            $('.lblSKU').text(sku + ' ' + skuDescription + ' LON ');
        } else {
            $('.lblSKU').text(sku + ' ' + skuDescription);
        }
        $('.lblRepairPersonCD').text(repairPersonCR).attr('rpID', repairPersonCRID);
        $('.lblSKU').attr('sku', sku);
        if (pieceCount == 0) pieceCount = 1;
        $('.lblPieceCount').text(pieceCount);
    }

    $('.lblRepairDate').text(repairDate);
    $('.lblLocationData').text(localStorage.getItem("location"));

    $('.lblPurchaseOrders').text(purchaseOrderNum);
    $('.lblSales').text(salesNum);
    $('.lblSuffix').text(suffixNum);
    $('.lblSourceLoc').text(sourceLoc);
    $('.tabContent').addClass('repairDetailsSelected');
    $('.tabsMenu').addClass('displayNone');
    if (rewrapItem == "rewrap") {
        $('.lblRewrapItem').text('POST DELIVERY');
    } else {
        $('.lblRewrapItem').text('PRE DELIVERY');
    }

    if (localStorage.getItem('filesData') != null) {
        if (localStorage.getItem('filesData').length > 0)
            $('.imgcptbody').html(localStorage.getItem("imagesCapturedDiv"));
    }
    if (localStorage.getItem('MANDETORYIMGCHECK') == 'true') {
        $('.btnUpload').attr('disabled', true);
    } else {
        $('.btnUpload').attr('disabled', false);
    }


}


var repairDetailsBack = function (name) {
    var skuCR = $('.lblSKU').attr('sku');
    var radioCR = $('.lblRewrapItem').text(); // added to save radio button values.
    var skuSR = $('.lblSkuNumRD').attr('sku');
    var skuSRDescription = $('.lblSkuNumRD').attr('skuDescription');

    var repairDate = $('.lblRepairDate').text();
    var location = $('.lblLocationData').text();
    var repairPersonSD = $('.lblRepairPersonSD').text();
    var repairPersonCD = $('.lblRepairPersonCD').text();
    var repairPersonSDID = $('.lblRepairPersonSD').attr('rpID');
    var repairPersonCDID = $('.lblRepairPersonCD').attr('rpID');
    var pieceCount = $('.lblPieceCount').text();
    var rewrapItem = $('.lblRewrapItem').text();
    var purchaseOrderNum = ($('.lblPurchaseOrders').text() == "0") ? "" : $('.lblPurchaseOrders').text();
    var salesNum = ($('.lblSales').text() == "0") ? "" : $('.lblSales').text();
    var suffixNum = ($('.lblSuffix').text() == "0") ? "" : $('.lblSuffix').text();
    var sourceLoc = ($('.lblSourceLoc').text() == "0") ? "" : $('.lblSourceLoc').text();
    var status = $('.lblStatusRD').text();
    var repairNum = $('.lblRepairNumRD').text();
    var minutesSpent = $('.lblMinutesRD').text();
    var statusCodeRep = $('.lblStatusRD').attr('code');

    // Added for Repair Details hide
    ($('.repairDetailScreen').addClass('hide'));
    clearCreateRepair();
    $('.createRepairTableContent').html('');
    if ($('.createRepairScreen').hasClass('hide')) {
        $('.createRepairScreen').removeClass('hide');
    }
    localStorage.setItem("repairDetailsJSONData", '');
    localStorage.setItem("repairDetailsNum", '');
    // $('.tab').html('');
    // $.ajax({
    //     url: "../public/Layouts/CreateRepair.html",
    //     success: function (data) {
    //         $('.tab').html(data);
    //     },
    //     dataType: 'html'
    // });

    if ($('.tabContent').hasClass('repairDetailsSelected')) {
        $('.tabContent').removeClass('repairDetailsSelected')
    }
    if ($('.tabsMenu').hasClass('displayNone')) {
        $('.tabsMenu').removeClass('displayNone');
    }

    if ($('.btnUpload').hasClass('displayBlock')) {
        $('.btnUpload').removeClass('displayBlock');
        $('.btnUpload').addClass('displayNone');
    }
    if ($('.btnDiscardChanges').hasClass('displayNone')) {
        $('.btnDiscardChanges').removeClass('displayNone');
        $('.btnDiscardChanges').addClass('displayBlock');
    }

    if ($('.btnBack').hasClass('displayBlock')) {
        $('.btnBack').removeClass('displayBlock');
        $('.btnBack').addClass('displayNone');
    }
    if ($('.btnCreateNext').hasClass('displayNone')) {
        $('.btnCreateNext').removeClass('displayNone');
        $('.btnCreateNext').addClass('displayBlock');
    }


    $('.lblDate').text(repairDate);
    $('.lblLocation').val(location);

    $('.txtPONum').val(purchaseOrderNum);
    $('.txtSalesNum').val(salesNum);
    $('.txtSuffixO').val(suffixNum);
    $('.txtSourceLoc').val(sourceLoc);
    $('.txtSKU').val(skuCR);
    $('.rewrapLbl').prop('checked', false);
    if (radioCR == 'REWRAP') {
        $('input[dname=rewrap]').prop('checked', true);

    } else {
        $('input[dname=vendorWrap]').prop('checked', true);
    }
    $('.lblLocation').text(localStorage.getItem("location"));
    //  $('.rPersonPopupInputCR').text(repairPersonCR);
    getRepairCodes();
    getRepairPersons();
    if (name.toLowerCase() == 'searchrepair1') {
        loadRepairCommon();
        $('.txtPCSR').val(pieceCount).attr('tempval',pieceCount);
        $('#rPersonPopupInputSR1').val(repairPersonSD);
        $('#rPersonPopupInputSR1').attr('repairPersonID', repairPersonSDID);
        $('#rPersonPopupInputSR1').text(repairPersonSD);
        $('.cust-select-box').css('pointer-events', 'fill');
        $('.statu-select-box').css('pointer-events', 'fill');
        $('.selectOption').css('pointer-events', 'fill');
        if (localStorage.getItem("editableSKU") == "true") {
            $('.inpSRSKU').removeAttr('readonly');
            $('.lblSRSKUDesc').addClass('hide');
        } else {
            //$('.inpSRSKU').attr('disabled','disabled');
            $('.inpSRSKU').addClass('hide');
            if ($('.lblSRSKUDesc').hasClass('hide')) {
                $('.lblSRSKUDesc').removeClass('hide')
            }
        }

        $('.inpSRSKU').val(skuSR);
        $('.lblSRSKUDesc').text(skuSR);
        //$('.lblSRSKUDesc').text(skuSR + "" + skuSRDescription);
        $('.lblRepairNumber').text(repairNum);
        $('.lblStatus').text(status);
        $('.lblMinutes').text(minutesSpent);
        $('.btnCreateNext').attr('currentPage', 'CREATE');
        $('.txtSKU').val(skuCR);
        setSelectExistingRepairCodesRD(JSON.parse(localStorage.getItem('repairCodesSelected')));
        if (statusCodeRep != "900") {
            if ($('.btnCancelRepair').hasClass('displayNone')) {
                $('.btnCancelRepair').removeClass('displayNone');
                $('.btnCancelRepair').addClass('displayBlock');
            }
        }
        if ($('.btnBack').hasClass('displayNone')) {
            $('.btnBack').removeClass('displayNone');
            $('.btnBack').addClass('displayBlock');
        }
    } else {
        $('.txtPC').val(pieceCount).attr('tempval',pieceCount);
        // $('.txtPC').removeAttr('disabled');
        $('.txtPONum').removeAttr('disabled');
        $('.txtSourceLoc').removeAttr('disabled');
        $('.txtSalesNum').removeAttr('disabled');
        $('.txtSuffixO').removeAttr('disabled');
        $('#rPersonPopupInputCR').removeAttr('disabled');
        $('.btnCreateNext').removeAttr('disabled');
        // if ($('.btnCreateNext').hasClass('displayBlock')) {
        //     $('.btnCreateNext').removeClass('displayBlock');
        //     $('.btnCreateNext').addClass('displayNone');
        //   }
        if ($('.btnDiscardChanges').hasClass('fRight')) {
            $('.btnDiscardChanges').removeClass('fRight');
            $('.btnDiscardChanges').addClass('fLeft');
        }
        $('.chkRItem').removeAttr('disabled');
        $('.chkRItemVendor').removeAttr('disabled');
        $('.imgDropDown').removeAttr('disabled');
        if ($('.imgDropDown').hasClass('hide'))
            $('.imgDropDown').removeClass('hide');
        $('#rPersonPopupInputCR').val(repairPersonCD);
        $('#rPersonPopupInputCR').text(repairPersonCD);
        $('.cust-select-box').css('pointer-events', 'fill');
        $('#rPersonPopupInputCR').attr('repairPersonID', repairPersonCDID);
        $('.statu-select-box').css('pointer-events', 'fill');
        $('.selectOption').css('pointer-events', 'fill');
        if (localStorage.getItem('currentCOMPANYCODE') == "300") {
            $('.lonChkBox').attr('disabled', false).attr('checked', 'checked');
        } else {
            $('.lonChkBox').attr('disabled', true);
        }
        setSelectExistingRepairCodesForCreate(JSON.parse(localStorage.getItem('repairCodesSelected')));
    }

}



var calculateMinuteSpent = function () {
    var minutesSpent = 0;
    $('.chkRepairDesc').each(function () {
        if (this.checked == true && $(this).parent().parent().attr('charge') == "true") {
            var qty = $(this).parent().parent().find('.inpQty').val();
            var mins = $(this).parent().parent().find('.inpMins').val();
            if (qty == 0) qty = 1;
            minutesSpent += (qty * mins);
        }
    });
    if (minutesSpent > 99999) {
        minutesSpent = 99999;
    }
    return minutesSpent;
}


var updateRepairData = function (type) {
    var val = "";
    if (type == "searchrepair1") val = "S";
    else {
        val = "C";
    }
    var repairPersonD = $('.lblRepairPersonCD').text() + "_" + $('.lblRepairPersonCD').attr('rpid');
    //$('.divoverlay').show();
    showLoader();
    //setTimeout(function () {
    $('#btnokAlert').attr('from', 'backend');
    formFiles();
    $.ajax({
        type: "POST",
        url: nodeServerURL + '/updateRepairData/' + parseInt(localStorage.getItem("repairDetailsNum")) + '/type/' + val + '/locale/' + localStorage.getItem('locale'),
        data: {
            repairDetailsJSON: localStorage.getItem("repairDetailsJSONData"),
        },
        async: true,
        success: function (data) {
            hideLoader("updateRepairData");

            if (data == 0) {
                copyErroredFiles(localStorage.getItem('location'), repairPersonD);
                showDialogError("Update Repair failed. Kindly try after some time.");
            } else {
                unlockRepair(data);
                if (filesData.length > 0) {
                    updateUploadrdgDrive(data);
                }
                var rNoStatus = localStorage.getItem("RepairNumberStatus");
                if (filesData.length > 0) {
                    if (rNoStatus == "CREATE") {
                        showDialog("Repair # " + data + " is created and Images are submitted for Upload");
                    } else {
                        showDialog("Repair # " + parseInt(localStorage.getItem("repairDetailsNum")) + " is updated and Images are submitted for Upload");
                    }

                } else {
                    if (rNoStatus == "CREATE") {
                        showDialog("Repair # " + data + " is created");
                    } else {
                        showDialog("Repair # " + parseInt(localStorage.getItem("repairDetailsNum")) + " is updated");
                    }
                }

            }

        },
        error: function (xhr, textStatus, error) {

        },
        complete: function () {

        }
    });
    //}, 4000);
}

var updateUploadrdgDrive = function (repairNumber) {
    // formFiles();
    $.ajax({
        type: "POST",
	url: nodeServerURL + '/uploadGoogleDrive/' + repairNumber + '/sku/' + encodeURIComponent(localStorage.getItem('sku')) + '/vendorID/' + encodeURIComponent(localStorage.getItem('vendor')) + '/name/' + encodeURIComponent(localStorage.getItem('vendorName')),
        data: formData,
        async: false,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function () {},
        success: function (data) {
            if (data == "OK") {
                showInfoDialog("SUCCESS !! Repair Data updated & Images are uploaded.");
                setTimeout(function () {
                    $('.modalWindow').css('display', 'none');
                    $('.divoverlay').hide();
                    $('#progress').hide();
                    $('.btnUpload').prop('disabled', true);
                    base64Image = null;
                    file = null;
                    base64Image = null;
                    contentType = null;
                    metadata = null;
                    multipartRequestBody = null;
                    bUploaded = true;
                    filesData = [];
                    formData = new FormData();
                    if ($('.btnBack').hasClass('displayBlock')) {
                        $('.btnBack').removeClass('displayBlock');
                        $('.btnBack').addClass('displayNone');
                    }
                    if ($('.btnUpload').hasClass('displayBlock')) {
                        $('.btnUpload').removeClass('displayBlock');
                        $('.btnUpload').addClass('displayNone');
                    }
                    localStorage.setItem('filesData', '');
                }, 2000);
            }
        },
        error: function (xhr, textStatus, error) {

        },
        complete: function () {

        }
    });

}


function formFiles() {
    $.each(filesData, function (index, value) {
        filesData[index].name = filesData[index].fileName;
        formData.append('filesList[]', filesData[index], filesData[index].fileName);
        formData.append('repairDetailsJSON', localStorage.getItem("repairDetailsJSONData"));
    });
    return formData;
}

var searchFiles = function () {
    var repairNumber = $('.lblRepairNumber').text();
    var dataS = null;
    dataS = JSON.stringify({
        vendor: localStorage.getItem('vendor'),
        sku: localStorage.getItem('sku'),
        locale: localStorage.getItem('locale'),
        repair: $('.lblRepairNumber').text()
    });
    $('#btnokAlert').attr('from', 'backend');
    $.ajax({
        type: "POST",
        url: nodeServerURL + '/searchFile',
        data: {
            searchData: dataS,
            repairData: localStorage.getItem("repairDetailsJSONData")
        },
        async: false,
        success: function (data) {
            showDialog("Repair # " + repairNumber + " is cancelled and Images are submitted for deletion");
            unlockRepair($('.lblRepairNumber').text());
        },
        error: function (xhr, textStatus, error) {

        },
        complete: function () {
            // location.reload();
        }
    });
}


var repairDetailsJSOn = function (repairStatus, repairNumber, cancelReason, repairDoneBy, pieceCount) {
    var repairDetailsjson = [];
    var repairDetailsArray = {};
    /*For RepairCode*/
    var repairData = JSON.parse(localStorage.getItem('repairCodesSelected'));
    /*END- For Repair Code*/

    var currentdate = localStorage.getItem("repairDate");

    repairDetailsArray.repairDoneDate = currentdate;

    if ($('input[name=rewrap]:checked').attr('dname').toLowerCase() == "rewrap") {
        repairDetailsArray.type = 200;
    } else {
        repairDetailsArray.type = 100;
    }
    if (localStorage.getItem('sku') == ""){
        repairDetailsArray.sku = 0;
    }else{
        repairDetailsArray.sku = parseInt(localStorage.getItem('sku'));
    }
    //repairDetailsArray.sku = parseInt(localStorage.getItem('sku'));
    if (localStorage.getItem("currentCOMPANYCODE") == 300) {
        repairDetailsArray.lonSku = "Y";
    } else {
        repairDetailsArray.lonSku = "N";
    }
    repairDetailsArray.importDomestic = localStorage.getItem('importDomestic');
    //repairDetailsArray.vendorID = localStorage.getItem('vendor');
    if (localStorage.getItem('vendor') == ""){
        repairDetailsArray.vendorID = 0;
    }else{
        repairDetailsArray.vendorID = parseInt(localStorage.getItem('vendor'));
    }
    repairDetailsArray.department = localStorage.getItem('currentDEPT');
    repairDetailsArray.class = localStorage.getItem('currentSKUCLASS');
    var pc = pieceCount;
    if (pc == "0") pc = "1";
    repairDetailsArray.numberOfPieces = parseInt(pc);
    repairDetailsArray.minutesSpent = calculateMinuteSpent();
    repairDetailsArray.doneByID = parseInt(repairDoneBy);
    repairDetailsArray.location = parseInt(localStorage.getItem('location'));
    if (localStorage.getItem('RepairRateData') != "") {
        repairDetailsArray.repairAmount = JSON.parse(localStorage.getItem('RepairRateData'))[0].shortDesc / 100 * repairDetailsArray.minutesSpent;
    }
    repairDetailsArray.cancelReason = cancelReason;
    repairDetailsArray.loggedInUser = "WHSSHPRPR";
    repairDetailsArray.applicationID = "WHSSHPRPR";
    repairDetailsArray.ipAddress = localStorage.getItem('IPADDRESS');
    repairDetailsArray.purchaseOrder = ($('.txtPONum').val() == "") ? 0 : parseInt($('.txtPONum').val());
    repairDetailsArray.source = ($('.txtSourceLoc').val() == "") ? 0 : parseInt($('.txtSourceLoc').val());
    repairDetailsArray.saleNumber = ($('.txtSalesNum').val() == "") ? 0 : parseInt($('.txtSalesNum').val());
    //repairDetailsArray.Suffix = parseInt(($('.txtSuffixO').val() == "") ? "0" : $('.txtSuffixO').val());
    repairDetailsArray.Suffix = ($('.txtSuffixO').val() == "") ? 0 : parseInt($('.txtSuffixO').val());

    repairDetailsArray.repairs = [];
    var nocStatus = false;
    var nonNocstatus = false;
    var incCount =0 ;
    if (repairData == null) {
        //var rdArray ={};
        //repairDetailsArray.repairs.push(rdArray)  ;
    } else {
        
        for (var i = 0; i < repairData.length; i++) {
            if (repairData[i].CHECKED == true) {
                var mins = 0;
                if (parseInt(repairData[i].MINUTES) * parseInt(repairData[i].QTY) > 999) {
                    mins = 999;
                } else {
                    mins = parseInt(repairData[i].MINUTES) * parseInt(repairData[i].QTY);
                }
                var rdArray = {};
                rdArray.status = 100;
                rdArray.reasonCategory = parseInt(repairData[i].CATEGORYCODE);
                rdArray.code = parseInt(repairData[i].REPAIRCODE);
                rdArray.cancelReason = "";
                rdArray.minutes = mins,
                    //rdArray.minutes = parseInt(repairData[i].MINUTES) * parseInt(repairData[i].QTY);
                    //rdArray.minutes = parseInt(repairData[i].MINUTES);
                rdArray.quantity = parseInt(repairData[i].QTY);
                repairDetailsArray.repairs.push(rdArray);
                if (repairData[i].CATEGORYCODE != "10") {
                    nonNocstatus = true;
                }
            }else{
                incCount++;
            }
        }
    }
    if (repairStatus != "900") {
        if (repairData.length == incCount) {
            repairDetailsArray.status = "010";
        } else if (nonNocstatus == true) {
            repairDetailsArray.status = "100";
        } else {
            repairDetailsArray.status = "050";
        }
    } else {
        repairDetailsArray.status = repairStatus;
    }

    repairDetailsjson.push(repairDetailsArray);

    localStorage.setItem("repairDetailsJSONData", JSON.stringify(repairDetailsArray));
    localStorage.setItem("repairDetailsNum", repairNumber);
}


var unlockRepair = function (data1) {
    var data = null;
    if (data1 != null) {


        data = JSON.stringify({
            locale: localStorage.getItem('locale'),
            repairNumber: data1
            // ipAddress: localStorage.getItem('IPADDRESS')
        });
        $.ajax({
            async: false,
            url: nodeServerURL + '/unlockRepair',
            type: 'POST',
            contentType: 'application/json',
            data: data,
            async: false,
            success: function (data) {
                if (data.statusCode != 200) {
                    showDialog("Unlock Repair Web Service Error. Please contact application support team.")
                }
            },
            error: function (xhr, textStatus, error) {}
        });
    }
}

var clearRepairDetailsData = function () {

    $('.lblSkuNumRD').text('');
    $('.lblSkuNumRD').attr('sku', '');
    $('.lblSkuNumRD').text('');

    $('.lblMinutesRD').text('');
    $('.lblRepairPersonSD').text('').attr('rpID', '');
    $('.lblRepairNumRD').text('');
    $('.lblStatusRD').text('').attr('code', '');
    $('.lblRepairNumRD').text('');

    $('.repairDetailsContent').html('');
    $('.lblSKU').text('');
    $('.lblSKU').attr('sku', '');
    $('.lblMinutes').text('');
    $('.lblRepairPersonCD').text('').attr('rpID', '');

    $('.lblSKU').text('');

    $('.lblRepairPersonCD').text('').attr('rpID', '');

    $('.lblSKU').attr('sku', '');
    $('.lblRepairDate').text('');
    $('.lblLocationData').text('');
    $('.lblPieceCount').text('');
    $('.lblPurchaseOrders').text('');
    $('.lblSales').text('');
    $('.lblSuffix').text('');
    $('.lblSourceLoc').text('');
    $('.lblRewrapItem').text('');
    $('.imgcptbody').html('');
}

var copyErroredFiles = function (location, repairPerson) {
    formFiles();
    $.ajax({
        type: "POST",
        url: nodeServerURL + '/copyFiles/' + location + '/repair_person/' + repairPerson,
        data: formData,
        async: false,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function () {},
        success: function (data) {},
        error: function (xhr, textStatus, error) {},
        complete: function () {}
    });
}