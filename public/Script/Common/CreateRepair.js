var jsonArray = [];
var jsonDataArray = [];

function createRepair(currentDate) {

    //Added for Create Repair Screen. By Biswa Ranjan. 27 December 2018
    if ($('.createRepairScreen').hasClass('hide')) {
        $('.createRepairScreen').removeClass('hide');
    }
    clearCreateRepair();
    $('#rdSearch').prop('checked', false);
    $('#rdCreate').prop('checked', true);
    $('.lblDate').text(currentDate);
    //$('.lblDate').text(currentDate.toDateString().substring(4, currentDate.toDateString().length));
    $('.lblLocation').text(localStorage.getItem("location"));

    if (onlyCreate)
        $('.txtSKU').val(localStorage.getItem("CurrentSKU"));
    $('.btnCreateNext').attr('currentPage', 'CREATE');
    localStorage.setItem("repairDate", currentDate);
    $('.lblDate').text(currentDate);
    $('.lblLocation').text(localStorage.getItem("location"));
    hideLoader("createRepair");
    getRepairPersons();

}

function setRepairDetailsSelectedData() {
    var selected = [];
    var selectedArray = {};
    var selectedRepairCodeList = [];
    localStorage.removeItem('repairCodesSelected');
    $('.chkRepairDesc').each(function () {

        var qtyData = $(this).parent().parent().find('.qtyDiv').find('.inpQty').val();
        if (qtyData == "") qtyData = 1;
        var descData = $(this).parent().parent().find('.descDiv').find('.lblRDesc').text();
        var minData = $(this).parent().parent().find('.minsDiv').find('.inpMins').val();
        if (minData == "") minData = 0;
        var headerData = $(this).parent().parent().attr('data');

        var checkdStatus = false;
        if (this.checked == true) {
            checkdStatus = true;
            selected.push({
                "Header": headerData,
                "Desc": descData,
                "qty": qtyData,
                "mins": minData
            });
        }
        selectedRepairCodeList.push({
            "REPAIRCODE": $(this).parent().parent().attr('reasoncode'),
            "CATEGORYCODE": $(this).parent().parent().attr('categorycode'),
            "QTY": qtyData,
            "MINUTES": minData,
            "CHECKED": checkdStatus
        });

    });
    localStorage.setItem('selectedRepairCodes', selected);
    localStorage.setItem('selectedRepairCodesCount', selected.length);

    localStorage.setItem('repairCodesSelected', JSON.stringify(selectedRepairCodeList));
    return selected;
}

function createRepairData(data) {
    var df = [];
    df = data;
    var shopTable = $(".repairDetailsContent");
    var shopData = '';
    if (data == '') {
        shopTable.html('No Records Found/Selected');
    } else {
        var groupedData = (df.reduce(function (result, current) {
            result[current.Header] = result[current.Header] || [];
            result[current.Header].push(current);
            return result;
        }, {}));
        $.each(groupedData, function (k, v) {
            var row = '<div class="subHeader" >' + k + '</div>';
            $.each(v, function (k1, v1) {
                var mins ;
                 if (v1['mins'] * v1['qty'] > 999) {
                    mins = 999;
                } else {
                    mins = v1['mins'] * v1['qty'];
                }
                
                row += '<div class="shopRow" data="' + v1['Header'] + '" >';
                row += '<div class="col-3 col-m-3 qtyDiv leftClass"><label class="pLeft2em">' + v1['qty'] + '</label></div><div class="col-3 col-m-3 minsDiv leftClass"><label class="pLeft2em">' + mins + '</label></div><div class="col-6 col-m-6 descDiv leftClass"><label class="lblRDesc">' + v1['Desc'] + '</label></div></div>';
            })
            shopData = shopData + row;

        })
        shopTable.html('');
        shopTable.html(shopData);
    }

}


function getRepairCodes(PCupdate,PCValue) {
    var data = null;
    data = JSON.stringify({
        locale: localStorage.getItem('locale'),
        dept: localStorage.getItem('currentDEPT'),
        skuclass: localStorage.getItem('currentSKUCLASS')
    });

    $.ajax({
        type: "POST",
        url: nodeServerURL + '/GetRepairCodes',
        contentType: 'application/json',
        data: data,
        async: false,
        success: function (data) {
            if (data.statusCode == 200) {
                localStorage.setItem('repairCodes', data.body);
                createShopRepairCodes(data.body,PCupdate,PCValue);
            } else {
                showDialog("Repair Codes Web Service Error. Please contact application support team.")
            }

        },
        error: function (xhr, textStatus, error) {

        }
    });
}

function createShopRepairCodes(data,PCupdate,PCValue) {
    var shopTable = $(".createRepairTableContent");
    var shopData = '';
    var df = [];
    df = data;
    var groupedData = (df.reduce(function (result, current) {
        result[current.chargebackRsnCategoryDesc] = result[current.chargebackRsnCategoryDesc] || [];
        result[current.chargebackRsnCategoryDesc].push(current);
        return result;
    }, {}));
    shopTable.html('');
    $.each(groupedData, function (k, v) {
        var row = '<div class="subMain" data="' + k + '"><div class="subHeader leftClass" >' + k + '</div>';
        $.each(v, function (k1, v1) {
            row += '<div class="shopRow crRow" data="' + k + '" reasonCode="' + v1['reasonCode'] + '" categoryCode = "' + v1['chargebackRsnCategory'] + '" charge="' + v1['charge'] + '"><div class="col-1 col-m-1"><input type="checkbox" name="rewrap" class="chkRepairDesc" value="" /></div>';
            if (PCupdate== true){
                var PCLength = PCValue.length;
                row += '<div class="col-1 col-m-1 qtyDiv"><input type="number" class="inpQty" value="'+ PCValue+'" tempvalue="'+PCValue +'" name="qty" max="'+ PCValue+'" maxlength= "'+ PCLength +'" readonly/></div><div class="col-2 col-m-2 minsDiv"><input type="number" value="' + v1['presetMinutes'] + '" name="mins" class="inpMins" maxlength= "3" readonly/></div><div class="col-5 col-m-5 leftClass descDiv"><label class="lblRDesc">' + v1['repairDesc'] + '</label></div>';
            }else{
                row += '<div class="col-1 col-m-1 qtyDiv"><input type="number" class="inpQty" value="1" tempvalue="1" name="qty" max="1" maxlength= "5" readonly/></div><div class="col-2 col-m-2 minsDiv"><input type="number" value="' + v1['presetMinutes'] + '" name="mins" class="inpMins" maxlength= "3" readonly/></div><div class="col-5 col-m-5 leftClass descDiv"><label class="lblRDesc">' + v1['repairDesc'] + '</label></div>';
            }
            
            //row += '<div class="col-2 col-m-2"><span class="iconEdit"><i class="fa fa-pencil-square-o fa-2x colorBtn" aria-hidden="true"></i></span></div></div>';
            row += '<div class="col-3 col-m-3"><a href="#" value="Edit" class="iconEdit backGroundGrey">Edit</a></div></div>';
        })
        row = row + '</div>';
        shopData = shopData + row;

    })
    //<button value="Edit" class="iconEdit">Edit <i class="fa fa-pencil-square-o fa-2x colrDat"aria-hidden="true"></i></button>
    shopTable.html(shopData);
}



var disableFields = function () {
    $('.txtPONum').attr('disabled', 'disabled').removeAttr('value');
    $('.txtSourceLoc').attr('disabled', 'disabled').removeAttr('value');
    $('.txtSalesNum').attr('disabled', 'disabled').removeAttr('value');
    $('.txtSuffixO').attr('disabled', 'disabled').val('');
    $('.btnCreateNext').attr('disabled', 'disabled');
    $('.chkRItem').attr('disabled', 'disabled');
    $('.chkRItemVendor').attr('disabled', 'disabled');
    $('.inpRepairPersonCR').attr('disabled', 'disabled');
    $('#rPersonPopupInputCR').attr('disabled', 'disabled').text('Select Repair Person');
    $('#rPersonPopupInputCR').css('background-color', '#ebebe4');
    localStorage.removeItem("repairCodes");
    $('.txtPC').val('1').attr('tempval','1');
    $('.imgDropDown').addClass('hide');
    $('.shopTableContent').html('');
    if ($('.btnCreateNext').hasClass('displayBlock')) {
        $('.btnCreateNext').removeClass('displayBlock');
        $('.btnCreateNext').addClass('displayNone');
    }
    if ($('.btnDiscardChanges').hasClass('displayBlock')) {
        $('.btnDiscardChanges').removeClass('displayBlock');
        $('.btnDiscardChanges').addClass('displayNone');
    }
    localStorage.removeItem("repairCodes");
}


var selectedRepairCodes = function () {
    var repairCodes = [];
    $.each(data, function (k, v) {
        repairCodes.push({
            "REPAIRCODE": v["REPAIRCODE"],
            "CATEGORYCODE": v["REPAIRREASONCATEGORYCODE"]
        });
    });
    localStorage.setItem("EXISTINGREPAIRCODES", JSON.stringify(repairCodes));
}


var setSelectExistingRepairCodesForCreate = function (data) {
    var shopRow = $('.shopRow');
    for (var i = 0; i < data.length; i++) {
        var shopRow = $(".shopRow[reasonCode='" + data[i].REPAIRCODE + "'][categoryCode='" + data[i].CATEGORYCODE + "']");
        shopRow.find('.inpQty').val(data[i].QTY);
        // var mins;
        // if (data[i].MINUTES * data[i].QTY > 999) {
        //     mins = 999;
        // } else {
        //     mins = data[i].MINUTES * data[i].QTY;
        // }
        // shopRow.find('.inpMins').val(mins);
        shopRow.find('.inpMins').val(data[i].MINUTES);
        shopRow.find('.rdStatus').text(data[i].STATUS);
        shopRow.find('.rdStatus').attr('code', data[i].STATUSCODE);
        if (data[i].CHECKED == true) {
            shopRow.find('.chkRepairDesc').prop('checked', true);
            if (shopRow.find('.iconEdit').hasClass('backGroundGrey')) {
                shopRow.find('.iconEdit').removeClass('backGroundGrey');
                shopRow.find('.iconEdit').addClass('backGroundBlue');
            }
        }
    }
    $('.inpQty').attr('max', $('.txtPC').val()).attr('maxlength', $('.txtPC').val().length);

}


var clearCreateRepair = function () {
    $('.txtSKU').val('');
    $('.txtPC').val('1').attr('tempval','1');
    $('.rPersonPopupInputCR').val('');
    $('.txtPONum').val('');
    $('.txtSalesNum').val('');
    $('.txtSourceLoc').val('');
    $('.txtSuffixO').val('');
    $('.createRepairTableContent').html('');
    //$('.cust-select-box').text('Select Repair Person');
    $('#rPersonPopupInputCR').attr('repairpersonid', '').text('Select Repair Person');
    if ($('.btnCreateNext').hasClass('displayBlock')) {
        $('.btnCreateNext').removeClass('displayBlock');
        $('.btnCreateNext').addClass('displayNone');
    }
}