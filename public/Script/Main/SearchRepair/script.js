var jsonRepairData = "../public/Script/JSONData/JSONRepairData.json"
var touchmoved;

$(document).on("keyup", ".txtSearchRepairRepairNum", function (e) {
  maxLengthCheck($(this)[0]);
  limitNumbers($(this)[0]);
  if ($(this).val().length != 9) {
    //$('.btnSearch,#rPersonPopupInputSR').attr('disabled', 'disabled');
  } else {
    $('.btnSearch,#rPersonPopupInputSR').removeAttr('disabled');
    $('#rPersonPopupInputSR').css('background-color', '#ffffff');
    $('.status-select-box').css('background-color', '#ffffff');
  }
});

$(document).on("click", ".btnSearch", function (e) {

  e.stopPropagation();

  e.preventDefault(); //prevent default behavior

  
  GetRepairSearchDetails();


});

$(document).on("click", ".btnClearAll", function (e) {
  clearSearchRepair();
  $('.searchTableContent').html('');
});

// $(document).on("touchstart", ".btnSearch", function(e){
//   e.stopPropagation();
//     e.preventDefault(); //prevent default behavior
//     $('.btnSearch').off('click');
//     GetRepairSearchDetails();
//     console.log("TouchStarrt");
// });

$(document).on("change", ".chkRD", function () {
  var $this = $(this);
  if ($this.is(".chkRD")) {
    if ($this.is(":checked")) {
      $(".chkRD").not($this).prop({
        disabled: true,
        checked: false
      });


      if (localStorage.getItem('selectedrow') !== undefined) {
        localStorage.removeItem('selectedrow');
      }
      var selected = [];
      var repairNumber = $(this).parent().parent().children(':nth-child(1)').find('.lbl').text();
      var dateData = $(this).parent().parent().children(':nth-child(2)').attr('data');
      var timeData = $(this).parent().parent().children(':nth-child(3)').attr('data');
      var sku = $(this).parent().parent().children(':nth-child(4)').find('.lbl').text();
      var skuDescription = $(this).parent().parent().children(':nth-child(5)').find('.lbl').text();
      var skuStatus = $(this).parent().parent().children(':nth-child(6)').find('.lbl').text();
      selected.push({
        "REPAIRNUMBER": repairNumber,
        "REPAIRDATE": dateData,
        "REPAIRTIME": timeData,
        "SKU": sku,
        "SKUDESCRIPTION": skuDescription,
        "REPAIRSTATUSLONGDESCRIPTION": skuStatus
      });
      localStorage.setItem('selectedrow', JSON.stringify(selected));
      $('.btnCreateNext').removeAttr('disabled');
    } else {
      $(".chkRD").prop("disabled", false);
      $('.btnCreateNext').attr('disabled', 'disabled');

    }
  } else {
    $(".chkRD").prop("disabled", false);
  }
});


$(document).on("keyup", ".txtSearchRepairSKU", function () {
  maxLengthCheck($(this)[0]);
  limitNumbers($(this)[0]);
  //   if ($(this).val().length >= 5 && $(this).val().length <= 6) {
  //     //$(document).find('.hdnCalss').focus();
  //     //$(this).next().focus();
  //     if ($(this).val().length == 5) {
  //       setTimeout(function () {
  //         if (('' + $('.txtSearchRepairSKU').val())[0] == 0) {
  //           $(this).attr('disabled', true);
  //           bWarningMessage = true;
  //           showDialog("Invalid SKU. Kindly enter a different SKU");
  //           document.activeElement.blur();
  //         //  $('.btnSearch,#rPersonPopupInputSR').attr('disabled', 'disabled');
  //           // $('#datepicker,#rPersonPopupInputSR').val('');
  //           //$('.status-select-box').prop('disabled', true);
  //           //$('#rPersonPopupInputSR').css('background-color', '#ebebe4');
  //           $('.status-select-box').css('background-color', '#ebebe4');       
  //           $('.imgDropDown').addClass('hide');
  //           // $('.searchTableContent').html('');
  //         } else {
  //           if (!validateSKUForSearchRepair($('.txtSearchRepairSKU').val()), false) {
  //             //              $(this).attr('disabled',true);
  //             bWarningMessage = true;
  //             showDialog("Invalid SKU. Kindly enter a different SKU");
  //             document.activeElement.blur();
  //         ///    $('.btnSearch,#rPersonPopupInputSR').attr('disabled', 'disabled');
  //             // $('#datepicker,#rPersonPopupInputSR').val('');
  //             //$('.status-select-box').prop('disabled', true);
  //             // $('#rPersonPopupInputSR').css('background-color', '#ebebe4');
  //             //$('.status-select-box').css('background-color', '#ebebe4');       
  //             $('.imgDropDown').addClass('hide');
  //             //$('.searchTableContent').html('');
  //           } else {
  //             $('.btnSearch,#rPersonPopupInputSR').removeAttr('disabled');
  //           //  $('.status-select-box').prop('disabled', false);
  // //$('.status-select-box').css('pointer-events','fill');
  //             $('.imgDropDown').removeClass('hide');
  //             //$('.cust-select-box').css('pointer-events','fill');
  //             //$('.selectOption').css('pointer-events','fill');
  //             //$('.statu-select-box').css('pointer-events','fill');
  //             //document.activeElement.blur();
  //             // $('#rPersonPopupInputSR').css('background-color', '#ffffff');
  //             //$('.status-select-box').css('background-color', '#ffffff');
  //           }

  //         }
  //       }, 3000);
  //     } else {
  //       if (!validateSKUForSearchRepair($(this).val()), false) {
  //         //$(this).attr('disabled',true);
  //         bWarningMessage = true;
  //         showDialog("Invalid SKU. Kindly enter a different SKU");
  //         document.activeElement.blur();
  //        // $('.btnSearch,#rPersonPopupInputSR').attr('disabled', 'disabled');
  //         $('#rPersonPopupInputSR').val('');
  //         //$('.status-select-box').prop('disabled', true);
  //         $('#rPersonPopupInputSR').css('background-color', '#ebebe4');
  //         // $('.status-select-box').css('background-color', '#ebebe4');       
  //         $('.imgDropDown').addClass('hide');
  //         // $('.searchTableContent').html('');
  //       } else {
  //         $('.btnSearch,#rPersonPopupInputSR').removeAttr('disabled');
  //         //$('.status-select-box').prop('disabled', false);
  //        // $('.status-select-box').css('pointer-events', 'fill');
  //         $('.imgDropDown').removeClass('hide');
  //         // $('.cust-select-box').css('pointer-events','fill');
  //         // $('.selectOption').css('pointer-events','fill');
  //         //$('.statu-select-box').css('pointer-events','fill');
  //         document.activeElement.blur();
  //         // $('#rPersonPopupInputSR').css('background-color', '#ffffff');
  //         //$('.status-select-box').css('background-color', '#ffffff');
  //       }

  //     }
  //   } else {
  //   //  $('.btnSearch,#rPersonPopupInputSR').attr('disabled', 'disabled');
  //     $('#rPersonPopupInputSR').val('');
  //    // $('.status-select-box').prop('disabled', true);
  //     $('#rPersonPopupInputSR').css('background-color', '#ebebe4');
  //    // $('.status-select-box').css('background-color', '#ebebe4');
  //     $('.imgDropDown').addClass('hide');
  //     //$('.searchTableContent').html('');
  //   }
});

$(document).on("keyup touch", ".inpSRSKU ", function () {
  maxLengthCheck($(this)[0]);
  limitNumbers($(this)[0]);
  var sku = $('.inpSRSKU').val();
  if ($('.inpSRSKU').val().length >= 5 && $('.inpSRSKU').val().length <= 6) {

    if ($('.inpSRSKU').val().length == 5) {
      setTimeout(function () {
        if ($('.inpSRSKU').val().length == 5) {
          if (!validateSKUForSR1(sku)) {
            showDialog("Invalid SKU. Kindly enter a different SKU.");
            //$('.lonChkBox').attr('disabled',true);
            $('#rPersonPopupInputSR1').css('pointer-events', 'none');
            document.activeElement.blur();
          } else {
            $('#rPersonPopupInputSR1').removeAttr('disabled');
            $('#rPersonPopupInputSR1').css('background-color', '#ffffff');
            $('#rPersonPopupInputSR1').css('pointer-events', 'fill');
            document.activeElement.blur();
            $('.shopTableContent').html('');
            //getRepairCodes();
          }
        }
      }, 3000);
    } else {
      $(document).find('.hdnCalss').focus();
      $(this).next().focus();
      if (!validateSKUForSR1($('.inpSRSKU').val())) {
        showDialog("Invalid SKU. Kindly enter a different SKU.");
        //$('.lonChkBox').attr('disabled',true);
        document.activeElement.blur();
        $('#rPersonPopupInputSR1').css('pointer-events', 'none');
      } else {
        $('#rPersonPopupInputSR1').css('pointer-events', 'fill');
        $('#rPersonPopupInputSR1').removeAttr('disabled');
        $('#rPersonPopupInputSR1').css('background-color', '#ffffff');
        document.activeElement.blur();
        $('.shopTableContent').html('');
        //getRepairCodes();
      }
    }
  }else{
    $('.txtPCSR').val('1');
    $('#rPersonPopupInputSR1').attr('disabled', 'disabled').text('Select Repair Person');
    $('#rPersonPopupInputSR1').css('background-color', '#ebebe4');
    $('#rPersonPopupInputSR1').css('pointer-events', 'none');
    localStorage.removeItem("repairCodes");
    $('.shopTableContent').html('');
  }

});
// Start input sku validations
$(document).on('change', '.lonChkBoxSR', function () {
  if ($('.txtSearchRepairSKU').val().length >= 5 && $('.txtSearchRepairSKU').val().length <= 6) {
    $(document).find('.hdnCalss').focus();
    if (!validateSKUForSearchRepair($('.txtSearchRepairSKU').val()), false) {
      bWarningMessage = true;
      $('.shopTableContent').html('');
      showDialog("Invalid SKU. Kindly enter a different SKU.");
    } else {
      // $('.btnSearch,#datepicker,#rPersonPopupInputSR,.status-select-box').attr('disabled', 'disabled');
      // $('#datepicker,#rPersonPopupInputSR').val('');
      // $('.status-select-box').prop('disabled', true);
      //$('#rPersonPopupInputSR').css('background-color', '#ebebe4');
      //$('.status-select-box').css('background-color', '#ebebe4');       
      $('.imgDropDown').addClass('hide');
      //$('.searchTableContent').html('');
    }
  } else {
    //$('.btnSearch,#datepicker,#rPersonPopupInputSR,.status-select-box').attr('disabled', 'disabled');
    // $('#datepicker,#rPersonPopupInputSR').val('');
    // $('.status-select-box').prop('disabled', true);
    // $('#rPersonPopupInputSR').css('background-color', '#ebebe4');
    //$('.status-select-box').css('background-color', '#ebebe4');       
    $('.imgDropDown').addClass('hide');
    // $('.searchTableContent').html('');
  }

});
$('.searchTableContent').on('click', '.searchRow', function (e) {
  showLoader();
  e.stopPropagation();
  e.preventDefault();
  $('.searchRow').not(this).removeClass('clicked');

  $(this).toggleClass('clicked');
  var selected = [];
  var repairNumber = $(this).children(':nth-child(1)').find('.lbl').text();
  localStorage.setItem("REPAIRNUMBERSELECTED", repairNumber);
  var dateData = $(this).children(':nth-child(2)').attr('data');
  var timeData = $(this).children(':nth-child(2)').attr('timeData');
  var sku = $(this).children(':nth-child(3)').attr('skuData');
//  var skuDescription = $(this).children(':nth-child(3)').attr('skuDesc');
  var skuDescription = $(this).children(':nth-child(3)').find('.skuDesc').text()

  var skuStatus = $(this).children(':nth-child(4)').find('.lbl').text();
  var skuStatusCode = $(this).children(':nth-child(4)').find('.lbl').attr('statuscode');

  selected.push({
    "REPAIRNUMBER": repairNumber,
    "REPAIRDATE": dateData,
    "REPAIRTIME": timeData,
    "SKU": sku,
    "SKUDESCRIPTION": skuDescription,
    "REPAIRSTATUSLONGDESCRIPTION": skuStatus,
    "REPAIRSTATUSCODE": skuStatusCode
  });
  localStorage.setItem('selectedrow', '');
  localStorage.setItem('selectedrow', JSON.stringify(selected));

  if (localStorage.getItem('selectedrow') !== undefined) {
    localStorage.removeItem('selectedrow');
  }
  localStorage.removeItem("filesData");
  loadRepairfromSearchRepair(JSON.stringify(selected));

  $("#crsrsr1").attr('current', 'searchrepair1');
  //$("#isSR1").attr('stat','true');
  $('#isSR1').attr('stat', "true")
  $('.searchRow').attr('disabled', true);
  localStorage.setItem("ValidrepairPerson", true);


});



function shows() {
  $('.buttonload').css('display', 'none');
  $('.divoverlay').hide();
}

$(document).on('click', '.btnCancelRepair', function () {
  showCancelConfirmDialog("Are you sure you want to cancel Repair # " + $('.lblRepairNumber').text() + "?");
});

$(document).on('click', '#btnyesRepairConfirm', function () {
  $('.cancelText').addClass('hide');
  if ($('.cancelReasonsdiv').hasClass('hide')) {
    $('.cancelReasonsdiv').removeClass('hide');
  }
  $(this).addClass('hide');
  $('#btnConfirmCancelRepairConfirm').removeClass('hide');
  localStorage.setItem('CancelRepair', 'YES');
});
$(document).on('click', '#btnConfirmCancelRepairConfirm', function () {
  localStorage.setItem('CancelRepairReason', $('.slctCancelReasons').val());
  $('.modalWindow').css('display', 'none');
  $('.divoverlay').hide();
  localStorage.removeItem('repairCodesSelected');
  $('.cancelReasonsdiv').addClass('hide');
  var pieceCount = $('.txtPCSR').val();
  if (pieceCount ==""){
    pieceCount =0;

  }
  if ($('.cancelText').hasClass('hide')) {
    $('.cancelText').removeClass('hide');
  }
  $('#btnConfirmCancelRepairConfirm').addClass('hide');
  if ($('#btnyesRepairConfirm').hasClass('hide')) {
    $('#btnyesRepairConfirm').removeClass('hide');
  }


  if (!validateForCancel()){
      //repairDetailsJSOn("900",$('.lblRepairNumber').text(),$('.slctCancelReasons').val(),$('#repairPersoninpSCR').attr('repairPersonID'));
      repairDetailsJSOn("900", $('.lblRepairNumber').text(), $('.slctCancelReasons').val(), $('#rPersonPopupInputSR1').attr('repairPersonID'),pieceCount);
      showLoader();
      searchFiles();
     
      //loadSearchRepair();
      $('.btnCreateNext').attr('currentPage', 'SEARCH');
      if ($('.btnBack').hasClass('displayBlock')) {
        $('.btnBack').removeClass('displayBlock');
        $('.btnBack').addClass('displayNone');
      }
      if ($('.btnCancelRepair').hasClass('displayBlock')) {
        $('.btnCancelRepair').removeClass('displayBlock');
        $('.btnCancelRepair').addClass('displayNone');
      }
      hideLoader("confirm click");
  }
  
});

$(document).on('click', '#btnnoCancelRepairConfirm', function () {
  $('.modalWindow').css('display', 'none');
  $('.divoverlay').hide();
  $('.cancelReasonsdiv').addClass('hide');
  if ($('.cancelText').hasClass('hide')) {
    $('.cancelText').removeClass('hide');
  }
  $('#btnConfirmCancelRepairConfirm').addClass('hide');
  if ($('#btnyesRepairConfirm').hasClass('hide')) {
    $('#btnyesRepairConfirm').removeClass('hide');
  }
});