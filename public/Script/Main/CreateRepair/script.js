var jsonDataConfigFile = '../Script/JSONData/JSONObject.json';
var moveTouch;

//START--Input Validations
/*$(document).on("input",".txtPC" ,function(e) {
        limitNumbers($(this)[0]);
        maxLengthCheck($(this)[0]);
        if($(this).val() < 1)
        {
          // $(this).val(1);
        }
        $('.inpQty').attr('max', $(this).val()).attr('maxlength', $(this).val().length);
});
*/

$(document).on("keyup input", ".txtPC", function (e) {
    console.log(e.type + "0");
    limitNumbers($(this)[0]);
    maxLengthCheck($(this)[0]);
    sliceData($(this)[0]);
    if ($('.txtPC').attr('tempval') != $('.txtPC').val()) {
        $('.inpQty').val($('.txtPC').val());
        $('.inpQty').attr('max', $(this).val()).attr('maxlength', $(this).val().length);
        $('.txtPC').attr('tempval', $('.txtPC').val());
    }

});
$('.txtPC').on('focus', function (e) {
    console.log(e.type + "1");    
    if ($('.txtPC').attr('tempval') != $('.txtPC').val()) {
        $('.inpQty').val($('.txtPC').val());
        $('.inpQty').attr('max', $(this).val()).attr('maxlength', $(this).val().length);
        $('.txtPC').attr('tempval', $('.txtPC').val());
    }
})
$('.txtPC').on('blur', function (e) {
    console.log(e.type + "2");
    var $this = $(this);
    if ($this.val() == '') {
        $this.val(1);
    }
    if ($('.txtPC').attr('tempval') != $('.txtPC').val()) {
        $('.inpQty').val($('.txtPC').val());
        $('.inpQty').attr('max', $(this).val()).attr('maxlength', $(this).val().length);
        $('.txtPC').attr('tempval', $('.txtPC').val());
    }
});

$(document).on("keyup input", ".txtPCSR", function (e) {
    console.log(e.type + "0");
    limitNumbers($(this)[0]);
    maxLengthCheck($(this)[0]);
    sliceData($(this)[0]);
    if ($('.txtPCSR').attr('tempval') != $('.txtPCSR').val()) {
        $('.inpQty').val($('.txtPCSR').val());
        $('.inpQty').attr('max', $(this).val()).attr('maxlength', $(this).val().length);
        $('.txtPCSR').attr('tempval', $('.txtPCSR').val());
    }
});
$('.txtPCSR').on('focus', function (e) {
    console.log(e.type + "1");
    var $this = $(this);
    // if ($this.val() == 1) {
    //     $this.val('');
    // }
    if ($('.txtPCSR').attr('tempval') != $('.txtPCSR').val()) {
        $('.inpQty').val($('.txtPCSR').val());
        $('.inpQty').attr('max', $(this).val()).attr('maxlength', $(this).val().length);
        $('.txtPCSR').attr('tempval', $('.txtPCSR').val());
    }
})
$('.txtPCSR').on('blur', function (e) {
    console.log(e.type + "2");
    var $this = $(this);
    if ($this.val() == '') {
        $this.val(1);
    }
    if ($('.txtPCSR').attr('tempval') != $('.txtPCSR').val()) {
        $('.inpQty').val($('.txtPCSR').val());
        $('.inpQty').attr('max', $(this).val()).attr('maxlength', $(this).val().length);
        $('.txtPCSR').attr('tempval', $('.txtPCSR').val());
    }
});


$(document).on("keyup", ".txtPONum", function (e) {
    limitNumbers($(this)[0]);
    sliceData($(this)[0]);
    maxLengthCheck($(this)[0]);
});

$(document).on("keyup", ".txtSourceLoc", function (e) {
    limitNumbers($(this)[0]);
    sliceData($(this)[0]);
    maxLengthCheck($(this)[0]);
});

$(document).on("keyup", ".txtSalesNum", function (e) {
    sliceData($(this)[0]);
    maxLengthCheck($(this)[0]);
    limitNumbers($(this)[0]);
});

$(document).on("keyup", ".txtSuffixO", function (e) {
    sliceData($(this)[0]);
    maxLengthCheck($(this)[0]);
    limitNumbers($(this)[0]);
});

$(document).on("keyup", ".inpQty", function (e) {
    sliceData($(this)[0]);
    limitNumbers($(this)[0]);
    maxValueCheck($(this)[0]);
    maxLengthCheck($(this)[0]);


});
$(document).on("focus", ".inpQty", function (e) {
    $(this)[0].scrollIntoView(true);
});

$(document).on("focus", ".inpMins", function (e) {
    $(this)[0].scrollIntoView(true);
});
$(document).on("keyup", ".inpMins", function (e) {
    maxLengthCheck($(this)[0]);
    limitNumbers($(this)[0]);
    sliceData($(this)[0]);
});



$(document).on('keyup', '.txtSKU', function (event) {

    maxLengthCheck($(this)[0]);
    limitNumbers($(this)[0]);
    localStorage.setItem("filesData", "");

    //if($(this).val().length == $(this).attr('maxlength'))
    if ($('.txtSKU').val().length >= 5 && $('.txtSKU').val().length <= 6) {

        if ($('.txtSKU').val().length == 5) {
            setTimeout(function () {
                if ($('.txtSKU').val().length == 5) {
                    if (!validateSKU($('.txtSKU').val())) {

                        $('.txtSKU').attr('disabled', true);
                        bWarningMessage = true;
                        $('.shopTableContent').html('');
                        showDialog("Invalid SKU. Kindly enter a different SKU.");

                        //document.activeElement.blur();
                        $('#rPersonPopupInputCR').css('background-color', '#ebebe4').text('Repair Person').attr('disabled', 'disabled');
                        $('.cust-select-box').css('pointer-events', 'none');
                        $('.statu-select-box').css('pointer-events', 'none');
                        $('.selectOption').css('pointer-events', 'none');
                        $('.txtPONum').attr('disabled', 'disabled');
                        $('.txtSourceLoc').attr('disabled', 'disabled');
                        $('.txtSalesNum').attr('disabled', 'disabled');
                        $('.txtSuffixO').attr('disabled', 'disabled');
                        $('.txtSKU').trigger('focusout');
                    } else {
                        // getRepairCodes();
                        $('.txtPONum').removeAttr('disabled');
                        $('.txtSourceLoc').removeAttr('disabled');
                        $('.txtSalesNum').removeAttr('disabled');
                        $('.txtSuffixO').removeAttr('disabled');
                        $('.slctRepPersonCR').removeAttr('disabled');
                        if ($('.btnCreateNext').hasClass('displayNone')) {
                            $('.btnCreateNext').removeClass('displayNone');
                            $('.btnCreateNext').addClass('displayBlock');
                        }
                        if ($('.btnDiscardChanges').hasClass('displayNone')) {
                            $('.btnDiscardChanges').removeClass('displayNone');
                            $('.btnDiscardChanges').addClass('displayBlock');
                        }
                        if ($('.btnDiscardChanges').hasClass('fRight')) {
                            $('.btnDiscardChanges').removeClass('fRight');
                            $('.btnDiscardChanges').addClass('fLeft');
                        }
                        $('.btnCreateNext').removeAttr('disabled');
                        $('.chkRItem').removeAttr('disabled');
                        $('.chkRItemVendor').removeAttr('disabled');
                        $('#rPersonPopupInputCR').removeAttr('disabled');
                        $('#rPersonPopupInputCR').css('background-color', '#ffffff');
                        $('.imgDropDown').removeClass('hide');
                        $('.cust-select-box').css('pointer-events', 'fill');
                        $('.statu-select-box').css('pointer-events', 'fill');
                        $('.selectOption').css('pointer-events', 'fill');
                        //document.activeElement.blur();
                        $('.txtSKU').trigger('focusout');
                    }
                }
            }, 3000);

        } else {
            $(document).find('.hdnCalss').focus();
            $(this).next().focus();
            if (!validateSKU($('.txtSKU').val())) {

                //alert(event.type);
                $('.txtSKU').attr('disabled', true);
                bWarningMessage = true;
                $('.shopTableContent').html('');
                showDialog("Invalid SKU. Kindly enter a different SKU.");
                //$('.lonChkBox').attr('disabled',true);
                //document.activeElement.blur();
                $('.txtSKU').trigger('focusout');
                $('#rPersonPopupInputCR').css('background-color', '#ebebe4').text('Repair Person').attr('disabled', 'disabled');
                $('.cust-select-box').css('pointer-events', 'none');
                $('.statu-select-box').css('pointer-events', 'none');
                $('.selectOption').css('pointer-events', 'none');
                $('.txtPONum').attr('disabled', 'disabled');
                $('.txtSourceLoc').attr('disabled', 'disabled');
                $('.txtSalesNum').attr('disabled', 'disabled');
                $('.txtSuffixO').attr('disabled', 'disabled');
            } else {
                //$('.lonChkBox').attr('disabled',true);
                $('.txtSKU').trigger('focusout');
                //getRepairCodes();
                $('.txtPONum').removeAttr('disabled');
                $('.txtSourceLoc').removeAttr('disabled');
                $('.txtSalesNum').removeAttr('disabled');
                $('.txtSuffixO').removeAttr('disabled');
                $('.slctRepPersonCR').removeAttr('disabled');
                if ($('.btnCreateNext').hasClass('displayNone')) {
                    $('.btnCreateNext').removeClass('displayNone');
                    $('.btnCreateNext').addClass('displayBlock');
                }
                if ($('.btnDiscardChanges').hasClass('displayNone')) {
                    $('.btnDiscardChanges').removeClass('displayNone');
                    $('.btnDiscardChanges').addClass('displayBlock');
                }
                if ($('.btnDiscardChanges').hasClass('fRight')) {
                    $('.btnDiscardChanges').removeClass('fRight');
                    $('.btnDiscardChanges').addClass('fLeft');
                }
                $('.btnCreateNext').removeAttr('disabled');
                $('.chkRItem').removeAttr('disabled');
                $('.chkRItemVendor').removeAttr('disabled');
                $('#rPersonPopupInputCR').removeAttr('disabled');
                $('#rPersonPopupInputCR').css('background-color', '#ffffff');
                $('.imgDropDown').removeClass('hide');
                $('.cust-select-box').css('pointer-events', 'fill');
                $('.statu-select-box').css('pointer-events', 'fill');
                $('.selectOption').css('pointer-events', 'fill');
                document.activeElement.blur();
            }
        }

    } else {
        //$('.lonChkBox').removeAttr('disabled');

        disableFields();
    }

});


$(document).on("click", ".chkRepairDesc", function () {

    if ($(this)[0].checked) {
        if ($("#crsrsr1").attr('current').toLowerCase() == "create") {
            $(this).parent().parent().find('.inpQty').val($('.txtPC').val());
        } else {
            $(this).parent().parent().find('.inpQty').val($('.txtPCSR').val());
        }

        if ($(this).parent().parent().find('.iconEdit').hasClass('backGroundGrey')) {
            $(this).parent().parent().find('.iconEdit').removeClass('backGroundGrey');
            $(this).parent().parent().find('.iconEdit').addClass('backGroundBlue');
        }
    } else {
        if ($(this).parent().parent().find('.iconEdit').hasClass('backGroundBlue')) {
            $(this).parent().parent().find('.iconEdit').removeClass('backGroundBlue');
            $(this).parent().parent().find('.iconEdit').addClass('backGroundGrey');
        }
    }

    //$('#repairPersoninpSCR').val(localStorage.getItem('repairPersonVal'));
    //$('.txtPC').prop('disabled', $('.chkRepairDesc').filter(':checked').length < 1);
    // $('.txtSKU').prop('disabled', $('.chkRepairDesc').filter(':checked').length < 1);
    //$('.txtSKU').attr('disabled','disabled');
    // ENABLE /DISABLE Edit icons
    //if (this.checked) {
    // if($(this)[0].checked){
    //     // if ($(this).parent().parent().find('.iconEdit').hasClass('disableSpan')) {
    //     //     $(this).parent().parent().find('.iconEdit').removeClass('disableSpan');

    //     // }
    //     $(this).parent().parent().find('.inpQty').val($('.txtPC').val());
    //     //  $('#repairPersoninpSCR').val(localStorage.getItem('repairPersonVal'));
    // } else {
    //     //$(this).parent().parent().find('.iconEdit').addClass('disableSpan');
    //     $(this).parent().parent().find('.inpQty').val($(this).parent().parent().find('.inpQty').attr('tempvalue'));
    //     //  $('.repairPersoninpSCR').val(localStorage.getItem('repairPersonVal'));
    // }

    // if ($('.chkRepairDesc').is(":checked")) {
    //     //$('.txtPC').removeAttr('disabled');
    //     //$('.txtSKU').attr('disabled','disabled');

    // } else {
    //     //$('.txtSKU').removeAttr('disabled');
    //    // $('.txtPC').attr('disabled', 'disabled');
    // }
});


$(document).on("change", ".shopRowslctStatus", function () {
    $(this).parent().find('.rdStatus').text('');
    $(this).parent().find('.rdStatus').text($(this).find('option:selected').text());
    $(this).parent().find('.rdStatus').attr('statusname', '');
    $(this).parent().find('.rdStatus').attr('statusname', $(this).find('option:selected').attr('dat'));
});