var repairDataJSOn = '../public/Script/JSONData/JSONRepairData.json';

var loadSearchRepair = function () {

  // Added for Search Repair Hide Show  

  clearSearchRepair();
  //Check for tab is there or not  
  if ($('.tab').hasClass('displayBlock')) {
    $('.tab').removeClass('displayBlock');
    $('.tab').addClass('displayNone');
  }

  $(".tab").css("display", "none");

  if ($('.searchRepairScreen').hasClass('hide')) {
    $('.searchRepairScreen').removeClass('hide')
  }
  $('#rdSearch').prop('checked', true);
  $('#rdCreate').prop('checked', false);
  //getRepairPersons();
  if ($('.btnCreateNext').hasClass('displayBlock')) {
    $('.btnCreateNext').removeClass('displayBlock');
    $('.btnCreateNext').addClass('displayNone');
  }
  
  generateStatusData('slctStatus');
  $('.searchTableContent').html('');
  $('.createRepairScreen').addClass('hide');

  hideLoader("loadSearchRepair");

}

var loadRepairfromSearchRepair = function (data) {
  var s = JSON.parse(data);
  var selectedData = s[0];
  loadRepairCodeDetailsbyRepairNumber(selectedData);
}


var loadRepairCommon = function () {
  $('#rdSearch').prop('checked', true);
  $('#rdCreate').prop('checked', false);
  if ($('.repairDiv').hasClass('hide')) {
    $('.repairDiv').removeClass('hide');
    //$('.repairDiv').addClass('show');
  }
  if ($('.minutesSRDiv').hasClass('hide')) {
    $('.minutesSRDiv').removeClass('hide');
    //$('.minutesSRDiv').addClass('show');
  }
  if ($('.skuSRDiv').hasClass('hide')) {
    $('.skuSRDiv').removeClass('hide');
    //$('.skuSRDiv').addClass('show');
  }

  $('.txtSKU').addClass('hide');

  $('.skuCRdiv').addClass('hide');

  //$('.inpSRSKU').addClass('show');
  //$('.imgBarCode').addClass('hide');
  $('#ck-button').addClass('hide');
  $('.txtPCSR').removeAttr('disabled');
  $('.txtPONum').removeAttr('disabled');
  $('.txtSourceLoc').removeAttr('disabled');
  $('.txtSalesNum').removeAttr('disabled');
  $('.txtSuffixO').removeAttr('disabled');

  //$('#repairPersoninpSCR').removeAttr('disabled');
  $('#rPersonPopupInputSR1').removeAttr('disabled');
  $('.btnCreateNext').removeAttr('disabled');
  $('.chkRItem').removeAttr('disabled');
  $('.chkRItemVendor').removeAttr('disabled');
}


var loadRepairCodeDetailsbyRepairNumber = function (selectedData) {
  var returnedStatusCode;
  var data = JSON.stringify({
    repairNum: selectedData.REPAIRNUMBER,
    location: localStorage.getItem('location'),
    locale: localStorage.getItem('locale')
    //ipaddress: localStorage.getItem('IPADDRESS')
  });
  //Loading bar show
  // $(document).find('.circle-loader').removeClass('hide');
  // $('.divoverlay').show();
  // setTimeout(function () {
  //   $(document).find('.circle-loader').addClass('hide');
  //   $('.divoverlay').hide();
  // }, 1000)

  $.ajax({
    type: "POST",
    url: nodeServerURL + '/GetRepairCodeDetailsbyRepairNumber',
    contentType: 'application/json',
    data: data,
    async: false,
    success: function (data) {
      clearCreateRepair();
      if (data.statusCode == 200) {
        var repairData = data.body;
        if (repairData.lockIP == "") {
          //SUCCESS CODE
          existingRepairCodes(repairData.repairs);
          //Added for Create Repair Screen. By Biswa Ranjan. 27 December 2018
          if ($('.createRepairScreen').hasClass('hide')) {
            $('.createRepairScreen').removeClass('hide');
          }
          loadRepairCommon();
         
          $('.txtSKU').val(selectedData.SKU);
          var myDate = selectedData.REPAIRDATE;
          //var myDate = changeDateFormat(selectedData.REPAIRDATE);
          //var myDate = new Date(selectedData.REPAIRDATE);
          localStorage.setItem("repairDate", myDate);
          $('.lblRepairNumber').text(selectedData.REPAIRNUMBER);
          //$('.lblStatus').text(selectedData.REPAIRSTATUSLONGDESCRIPTION.substring(0,18));
          $('.lblStatus').text(selectedData.REPAIRSTATUSLONGDESCRIPTION.substring(selectedData.REPAIRSTATUSLONGDESCRIPTION.indexOf("-") + 1, selectedData.REPAIRSTATUSLONGDESCRIPTION.length));
          $('.lblStatus').attr('code', selectedData.REPAIRSTATUSCODE);
          if (selectedData.SKU == 0) {
            localStorage.setItem("editableSKU", "true");
          } else {
            localStorage.setItem("editableSKU", "false");
          }
          $('.txtPCSR').val(repairData.piece).attr('tempval',repairData.piece);
          if (localStorage.getItem("editableSKU") == "true") {
            //$('.inpSRSKU').val(selectedData.SKU);
            if($('.inpSRSKU').hasClass('hide')){
              $('.inpSRSKU').removeClass('hide')
            }
            $('.inpSRSKU').val('');
            $('.inpSRSKU').removeAttr('readonly');
            $('.lblSRSKUDesc').text('');
            $('.lblSRSKUDesc').addClass('hide');
            if (repairData.piece == 0){
              $('.txtPCSR').val('').attr('tempval','');
            }        
            $('#rPersonPopupInputSR1').text('Select Repair Person').attr('disabled');
            $('#rPersonPopupInputSR1').css('background-color', '#ebebe4');
            $('#rPersonPopupInputSR1').css('pointer-events', 'none');
            
          } else {
            if($('.lblSRSKUDesc').hasClass('hide')){
              $('.lblSRSKUDesc').removeClass('hide');
            }
            $('.inpSRSKU').addClass('hide');
            $('.inpSRSKU').val(selectedData.SKU);
            //$('.lblSRSKUDesc').text(selectedData.SKU + " - " + selectedData.SKUDESCRIPTION);
            $('.lblSRSKUDesc').text(selectedData.SKU);
            $('#rPersonPopupInputSR1').text(repairData.repairPerson);
            getRepairCodes(true,repairData.piece);
            $('#rPersonPopupInputSR1').css('pointer-events', 'fill');
          }

          $('.lblDate').text(myDate);
          getRepairPersons();
          $('.lblMinutes').text(repairData.minutesSpent);
          

          if (repairData.type == 100 || repairData.type == 0) {
            $('input[dname=vendorWrap]').prop('checked', true);
          } else {
            $('input[dname=rewrap]').prop('checked', true);
          }
          if (repairData.purchaseOrder == 0) {
            $('.txtPONum').val();
            $('.txtPONum').attr('valdata', "");
          } else {
            $('.txtPONum').val(repairData.purchaseOrder);
            $('.txtPONum').attr('valdata', repairData.purchaseOrder);
          }

          if (repairData.saleNumber == 0) {
            $('.txtSalesNum').val();
            $('.txtSalesNum').attr('valdata', "");
          } else {
            $('.txtSalesNum').val(repairData.saleNumber);
            $('.txtSalesNum').attr('valdata', repairData.saleNumber);
          }

          if (repairData.suffix == 0) {
            $('.txtSuffixO').val();
            $('.txtSuffixO').attr('valdata', "");
          } else {
            $('.txtSuffixO').val(repairData.suffix);
            $('.txtSuffixO').attr('valdata', repairData.suffix);
          }

          if (repairData.source == 0) {
            $('.txtSourceLoc').val();
            $('.txtSourceLoc').attr('valdata', "");
          } else {
            $('.txtSourceLoc').val(repairData.source);
            $('.txtSourceLoc').attr('valdata', repairData.source);
          }


          $('.lblLocation').text(localStorage.getItem('location'));


          //$('#repairPersoninpSCR').val(repairData.repairPerson);
          if ($('.srRepairRow').hasClass('hide')){
            $('.srRepairRow').removeClass('hide');
          }
          $('.crRepairRow').addClass('hide');
           
          
          
          // added to store repair person value in RD
          localStorage.setItem('repairPersonVal', repairData.repairPerson);
          //$('#repairPersoninpSCR').attr('repairPersonID',repairData.doneByID);
          $('#rPersonPopupInputSR1').attr('repairPersonID', repairData.doneByID);
          $('#rPersonPopupInputSR1').val(repairData.repairPerson);
          
          $('#rPersonPopupInputSR1').attr('valdata', repairData.doneByID);

          
          $('.statu-select-box').css('pointer-events', 'fill');
          $('.selectOption').css('pointer-events', 'fill');

          if ($('.btnBack').hasClass('displayNone')) {
            $('.btnBack').removeClass('displayNone');
            $('.btnBack').addClass('displayBlock');
          }
          $('.btnCreateNext').attr('currentPage', 'CREATE');

          if (localStorage.getItem('EXISTINGREPAIRCODES') == "") {
            existingRepairCodes(repairData.repairs);
          }
          setSelectExistingRepairCodes(JSON.parse(localStorage.getItem('EXISTINGREPAIRCODES')), selectedData.REPAIRSTATUSCODE);
        if (selectedData.REPAIRSTATUSCODE != 900 && selectedData.REPAIRSTATUSCODE != 300) {
           if ($('.btnCancelRepair').hasClass('displayNone')) {
              $('.btnCancelRepair').removeClass('displayNone');
              $('.btnCancelRepair').addClass('displayBlock');
            }
            if ($('.btnCreateNext').hasClass('displayNone')) {
              $('.btnCreateNext').removeClass('displayNone');
              $('.btnCreateNext').addClass('displayBlock');
              if (localStorage.getItem("editableSKU") != "true") {
                $('#rPersonPopupInputSR1').css('background-color', '#ffffff');
              }
              
            }
            if ($('.btnDiscardChanges').hasClass('displayNone')) {
              $('.btnDiscardChanges').removeClass('displayNone');
              $('.btnDiscardChanges').addClass('displayBlock');
            }
          } else {
            $("#rPersonPopupInputSR1,.txtPCSR,.txtPONum,.txtSalesNum,.txtSourceLoc,.txtSuffixO,.chkRItem ,.iconEdit,.chkRepairDesc").attr('disabled', 'disabled').css('pointer-events','none');
            if($('.iconEdit').hasClass('backGroundBlue')){
              $('.iconEdit').removeClass('backGroundBlue');
              $('.iconEdit').addClass('backGroundGrey');
            }
            $('.btnCreateNext').addClass('displayNone');
            if ($('.cust-select-box').css('pointer-events') == 'fill') {
              $('.cust-select-box').css('pointer-events', 'none');
            }
            $('#rPersonPopupInputSR1').css('background-color', '#ebebe4');
          }
          //},
          //   dataType: 'html'
          // });
          GetCancelReasons('slctCancelReasons');
          // Date: 27 Dec 2018. Biswa
          //Hide the Search Repair Screen
          $('.searchRepairScreen').addClass('hide');
          //shows();
          //},3000);
        } else {
          // added to lock screen
          //$('.txtSearchRepairRepairNum ').attr('disabled', true);
          $('#rPersonPopupInputSR').attr('disabled', true);
          //$('#datepicker').attr('disabled', true);
          //$('.slctStatus').attr('disabled', true);
          $('.status-select-box').attr('disabled', 'disabled');
          $('.status-select-box').prop('disabled', true);
          $('#statusSelectLbl').prop('disabled', true);

          $('.tab').attr('disabled', true);
          $('.searchTableContent').attr('disabled', true).css('pointer-events', 'none');
          //ITS LOCKED
          showDialog("Repair # " + selectedData.REPAIRNUMBER + "is locked by IP" + repairData.lockIP + " at " + repairData.lockTimestamp);
        }
      } else {
        showDialog("Repair Code Details by Repair# Web Service Error. Please contact application support team.")
      }
    },
    error: function (xhr, textStatus, error) {},
    complete: function () {
      /*  if(returnedStatusCode == 200)
          setSelectExistingRepairCodes();*/
      //    $(document).find('.searchRowLoadingBar').addClass('hide');
      $('.inpQty').attr('max', $('.txtPCSR').val()).attr('maxlength', $('.txtPCSR').val().length);
      hideLoader('loadRepairCodeDetailsbyRepairNumber');
    }
  });

}

function changeDateFormat(inputDate) { // expects Y-m-d
  var splitDate = inputDate.split('-');
  if (splitDate.count == 0) {
    return null;
  }

  var year = splitDate[0];
  var month = splitDate[1];
  var day = splitDate[2];

  return month + '/' + day + '/' + year;
}

var GetRepairSearchDetails = function () {
  showLoader();
  $('.searchTableContent').html('');
  var sku = $('.txtSearchRepairSKU').val();
  var repairNumber = $('.txtSearchRepairRepairNum').val();

  var repairPerson = $('#rPersonPopupInputSR').attr('repairpersonid');
  var repairDate = 0;
  if ($('#datepicker').val() != "") {
    repairDate = $('#datepicker').val().split('/')[2] + $('#datepicker').val().split('/')[0] + $('#datepicker').val().split('/')[1];
  }

  var repairStatus = $('.status-select-box').attr('valcode');

  var locale = "cb-en-US";
  var checkRepr = false;

  if (sku == "" & repairNumber == "") {
    hideLoader("GetRepairSearchDetails");
    showDialog("Either SKU or Repair# needs to be entered for a Search.");
  } else {
    if (sku.length > 6) {
      hideLoader("GetRepairSearchDetails");
      showDialog("Invalid SKU Length. Must be of length 5 or 6 digits");
    } else if (repairNumber.length < 9 && repairNumber.length > 0) {
      hideLoader("GetRepairSearchDetails");
      showDialog("Invalid Repair # length. Must be of length 9 digits");
    } else {
     locale = localStorage.getItem('locale');
      checkRepr = true;
      var data = JSON.stringify({
        locale: locale,
        location: localStorage.getItem("location"),
        sku: sku,
        status: repairStatus,
        repairDate: repairDate,
        repairNumber: repairNumber,
        repairPerson: repairPerson
      });

      $.ajax({
        type: "POST",
        url: nodeServerURL + '/GetRepairSearchDetails',
        contentType: 'application/json',
        data: data,
        async: true,
        success: function (data) {
          localStorage.setItem('currentSKUDESCRIPTION', '');
          localStorage.setItem('currentCOMPANYCODE', '');
          localStorage.setItem('currentDEPT', '0')
          localStorage.setItem('currentSKUCLASS', '0');
          localStorage.setItem('sku', '');
          localStorage.setItem('importDomestic', '');
          localStorage.setItem('vendor', '');

          if (data.statusCode == 200) {
            createSearchRepairOutput(data.body);
            if (data.body.length != 0) {

              if (sku != "") {
                var s = validateSKUForSearchRepair(sku, checkRepr);
              } else {
                var s = validateSKUForSearchRepair(data.body[0].sku.toString(), checkRepr);
              }

              if (data.body.length == 1) {
                $('.searchRow').trigger('click');
              }
            }
            if (data.crateStatus == "906") {
              //hideLoader();
              var maxRec = localStorage.getItem('MAXRECORDS');
              showDialog("Your search criteria exceeded " + maxRec +" records. Kindly refine your search.")
            }
            // $('.txtSearchRepairSKU').val('');
            // $('.txtSearchRepairRepairNum').val('');
            // $('#datepicker').val('');
            // $('.status-select-box').text('Select');          
          } else {

            hideLoader("GetRepairSearchDetails");

            showDialog("Repair Search Details Web Service Error. Please contact application support team.")
          }


        },
        error: function (xhr, textStatus, error) {}
      });
    }
  }

}

var createSearchRepairOutput = function (data) {
  var divMain = "";
  if (data == "") {
    $('.searchTableContent').html("<div class='col-12 col-m-12 shopRow searchRow'>No Records Found</div>");
    hideLoader("createSearchRepairOutput");

  } else {
    $.each(data, function (k, value) {
      var myDate = value.date;
      //var myDate = new Date(value.date);
      //var divRow = "<div class='col-12 col-m-12 shopRow searchRow emCls' data='" + "'><div class='leftClass col-m-2 col-2'><label class='lbl cursorPointer'>" + value.number + "</label></div><div class='leftClass col-m-3 col-3' data ='" + value.date + "' timeData ='" + value.time + "'>" + myDate + "  " + value.time.replace('.', ':') + "</div><div class='leftClass col-m-5 col-5' skuData='" + value.sku + "' skuDesc='''" + value.skuDesc + "'''><label class='lbl cursorPointer'>" + value.sku + " - " + value.skuDesc + "</label></div><div class=' leftClass col-m-2 col-2'><label class='lbl cursorPointer' statusCode =" + value.status + ">" + value.statusShortDesc + "-" + value.statusLongDesc + "</label></div></div>";
      var divRow = "<div class='col-12 col-m-12 shopRow searchRow emCls' data='" + "'><div class='leftClass col-m-2 col-2'><label class='lbl cursorPointer'>" + value.number + "</label></div><div class='leftClass col-m-3 col-3' data ='" + value.date + "' timeData ='" + value.time + "'>" + myDate + "  " + value.time.replace('.', ':') + "</div><div class='leftClass col-m-5 col-5' skuData='" + value.sku + "' skuDesc='" + value.skuDesc + "'><span class='skuDesc hide'>"+value.skuDesc+  "</span><label class='lbl cursorPointer'>" + value.sku + " - " + value.skuDesc + "</label></div><div class=' leftClass col-m-2 col-2'><label class='lbl cursorPointer' statusCode =" + value.status + ">" + value.statusShortDesc + "-" + value.statusLongDesc + "</label></div></div>";
      if (divRow !== undefined)
        divMain = divMain + divRow;
    });
    $('.searchTableContent').html(divMain);
    hideLoader("createSearchRepairOutput");
  }
}

var existingRepairCodes = function (data) {
  var repairCodes = [];
  $.each(data, function (k, v) {
    var mins ;
    if (v["minutes"] >= 999){
      mins =v["minutes"];
    }else{
      mins = v["minutes"]/v["quantity"];
    }
     
    repairCodes.push({
      "REPAIRCODE": v["code"],
      "CATEGORYCODE": v["reasonCategory"],
      "QTY": v["quantity"],
      "MINUTES": mins,
      //"MINUTES": v["minutes"]/v["quantity"],
      //"MINUTES": v["minutes"],
      "STATUSCODE": v["status"],
      "STATUS": v["statusDesc"],  
      "CHECKED": "true"
    });
  });
  localStorage.setItem("EXISTINGREPAIRCODES", JSON.stringify(repairCodes));
}


var setSelectExistingRepairCodes = function (data, repairCode) {
  var shopRow = $('.shopRow');
  var count = 0;
  for (var i = 0; i < data.length; i++) {
    var shopRow = $(".shopRow[reasonCode='" + data[i].REPAIRCODE + "'][categoryCode='" + data[i].CATEGORYCODE + "']");
    if (repairCode == 900) {
      shopRow.find('.chkRepairDesc').prop('checked', true);
      count = count + 1;
      // if (shopRow.find('.inpQty').val() != "1") {
      //   shopRow.find('.inpQty').val(parseInt(shopRow.find('.inpQty').val()) + data[i].QTY);
      // } else {
      shopRow.find('.inpQty').val(data[i].QTY);
      //}
      // if (shopRow.find('.inpMins').val() != "0") {
      //   shopRow.find('.inpMins').val(parseInt(shopRow.find('.inpMins').val()) + data[i].MINUTES);
      // } else {
      shopRow.find('.inpMins').val(data[i].MINUTES);
      //}
    } else {
      if (data[i].STATUSCODE != 900) {
        shopRow.find('.chkRepairDesc').prop('checked', true);
        count = count + 1;
        //if (shopRow.find('.inpQty').val() != "1") {
        //          shopRow.find('.inpQty').val(parseInt(shopRow.find('.inpQty').val()) + data[i].QTY);
        //} else {
        shopRow.find('.inpQty').val(data[i].QTY);
        //var editBtn = shopRow.find('iconEdit');
        if (shopRow.find('.iconEdit').hasClass('backGroundGrey')){
          shopRow.find('.iconEdit').removeClass('backGroundGrey');
          shopRow.find('.iconEdit').addClass('backGroundBlue');
        }
        //}
        //if (shopRow.find('.inpMins').val() != "0") {
        //shopRow.find('.inpMins').val(parseInt(shopRow.find('.inpMins').val()) + data[i].MINUTES);
        //} else {
        shopRow.find('.inpMins').val(data[i].MINUTES);
        //}
      }
    }
  }

  localStorage.setItem('existingrepairCodesCount', $('input[class="chkRepairDesc"]:checked').length);
}

var setSelectExistingRepairCodesRD = function (data) {
  var shopRow = $('.shopRow');
  var count = 0;
  for (var i = 0; i < data.length; i++) {
    var shopRow = $(".shopRow[reasonCode='" + data[i].REPAIRCODE + "'][categoryCode='" + data[i].CATEGORYCODE + "']");
    if (data[i].STATUSCODE != 900 ) {
      if(data[i].CHECKED == true){      
        shopRow.find('.chkRepairDesc').prop('checked', true);
        if (shopRow.find('.iconEdit').hasClass('backGroundGrey')){
          shopRow.find('.iconEdit').removeClass('backGroundGrey');
          shopRow.find('.iconEdit').addClass('backGroundBlue');
        }
      }
      // var mins;
      // if (data[i].MINUTES * data[i].QTY > 999) {
      //   mins = 999;
      // } else {
      //   mins = data[i].MINUTES * data[i].QTY;
      // }
      // shopRow.find('.inpMins').val(mins);
      shopRow.find('.inpQty').val(data[i].QTY);
     
      shopRow.find('.inpMins').val(data[i].MINUTES);
    }
  }
  
  $('.inpQty').attr('max', $('.txtPCSR').val()).attr('maxlength', $('.txtPCSR').val().length);

  localStorage.setItem('existingrepairCodesCount', $('input[class="chkRepairDesc"]:checked').length);
}

var clearSearchRepair = function (data) {
  $('.txtSearchRepairSKU').val('');
  $('.txtSearchRepairRepairNum').val('');
  $('.status-select-box').text('Select').attr('value', '0').attr('valcode', '0');;
  //$('.status-select-box').text('Select').attr('value', '0');
  $('#datepicker').val('');
  $('#rPersonPopupInputSR').text('Select Repair Person').attr('repairpersonid', '0');
  //$('.searchTableContent').html('');
}