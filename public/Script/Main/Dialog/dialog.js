$(document).on("click touch", "#btnokAlert", function () {
    if ($(this).attr('from') == 'backend') {
        location.reload();
    } else {
        if ($("#crsrsr1").attr('current').toLowerCase() == 'search') {
            $('.modalWindow').css('display', 'none');
            $('.divoverlay').hide();
            // $('.txtSearchRepairSKU').val('');
            // $('.txtSearchRepairRepairNum').val('');
            // $('#datepicker').val('');
            // $('.status-select-box').text('Select');
            // $('.txtSearchRepairRepairNum').val('');
            // $('.rPersonPopupInputSR').text('Select Repair Person');
        } else {
            $('.modalWindow').css('display', 'none');
            $('.divoverlay').hide();
            $('.btnCreateNext').attr('currentPage', 'SEARCH');
            //$('.txtSearchRepairRepairNum ').attr('disabled', false);
            $('#rPersonPopupInputSR').attr('disabled', false);
            //$('#datepicker').attr('disabled', false);
            //$('.slctStatus').attr('disabled', false);
            $('.status-select-box').attr('disabled', false);
            $('.status-select-box').prop('disabled', false);
            $('#statusSelectLbl').prop('disabled', false);
            $('.tab').attr('disabled', false);
            $('.searchTableContent').attr('disabled', false).css('pointer-events', '');
            $('.searchRow').attr('disabled', false);
            $('.txtSKU').attr('disabled', false);
        }
    }
});

$(document).on("click touch", "#btnokAlertError", function () {
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
    location.reload();
});

$(document).on("click touch", "#btnokInvalidApp", function () {
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
    //location.reload();
});

$(document).on("click touch", "#btnokInvalidAppLocReload", function () {
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
    location.reload();
});




$(document).on("click touch", ".close", function () {
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
});

$(document).on("click touch", "#btnDiscardOKConfirm", function () {
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
    unlockRepair(localStorage.getItem('REPAIRNUMBERSELECTED'));
    location.reload();

});
$(document).on("click touch", "#btnDiscardCancelConfirm", function () {
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
});

$(document).on("click touch", "#btnokConfirm", function () {
    // Check from where it is coming. radiogroup /next/ back
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
    if ($("#clicktype").attr('clicktype') == "radiogroup") {
        showLoader();
        loadScreen($("#crsrsr1").attr('current').toLowerCase());
        if (localStorage.getItem('REPAIRNUMBERSELECTED') != "" ||
            localStorage.getItem('REPAIRNUMBERSELECTED') != null) {
            unlockRepair(localStorage.getItem('REPAIRNUMBERSELECTED'));
        }
        localStorage.removeItem('REPAIRNUMBERSELECTED');
    }

    if ($("#clicktype").attr('clicktype') == "back") {
        
        unlockRepair(localStorage.getItem('REPAIRNUMBERSELECTED'));
        loadSearchRepair();
        if ($('.btnBack').hasClass('displayBlock')) {
            $('.btnBack').removeClass('displayBlock');
            $('.btnBack').addClass('displayNone');
        }
        if ($('.btnCancelRepair').hasClass('displayBlock')) {
            $('.btnCancelRepair').removeClass('displayBlock');
            $('.btnCancelRepair').addClass('displayNone');
        }

        $('.btnCreateNext').addClass('displayNone');
        $("#crsrsr1").attr('current', 'search');

    }
    localStorage.removeItem('editableSKU');

});
$(document).on("click touch", "#btnCancelConfirm", function () {
    if ($("#crsrsr1").attr('current').toLowerCase() == 'search' || $("#crsrsr1").attr('current').toLowerCase() == 'searchrepair1')
    //if($('.btnCreateNext').attr('currentPage') == 'SEARCH')
    {
        setScreen("SEARCH");
    } else {
        setScreen("CREATE");
    }
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
});
$(document).on("click touch", "#btnCloseConfirm", function () {
    if ($("#crsrsr1").attr('current').toLowerCase() == 'search' || $("#crsrsr1").attr('current').toLowerCase() == 'searchrepair1')
    //if($('.btnCreateNext').attr('currentPage') == 'SEARCH')
    {
        setScreen("SEARCH");
    } else {
        setScreen("CREATE");
    }
    $('.modalWindow').css('display', 'none');
    $('.divoverlay').hide();
});