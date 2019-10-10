var warningMessage = '../public/Script/JSONData/WarningMessages.json';
//START--Common
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

// validate sku Start
var validateSKU = function (skuID) {
  var skuValid = false;

  if (skuID.length > 4 && skuID.length <= 6) {
    var data = null;
    if ($('.lonChkBox').prop('checked') == true) {
      data = JSON.stringify({
        sku: skuID,
        locale: "nd-en-US",
        effectivedate: getCurrentDate()
      });
    } else {
      data = JSON.stringify({
        sku: skuID,
        locale: localStorage.getItem('locale'),
        effectivedate: getCurrentDate()
      });
    }
    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetSKUDetails',
      contentType: 'application/json',
      data: data,
      async: false,
      success: function (data) {
        if (data.statusCode == 200) {
          if (data.body == "") {
            skuValid = false;
          } else {
            localStorage.setItem('currentSKUDESCRIPTION', data.body.itemDetail.description);
            localStorage.setItem('currentCOMPANYCODE', data.body.itemDetail.company);
            localStorage.setItem('currentDEPT', data.body.itemDetail.department)
            localStorage.setItem('currentSKUCLASS', data.body.itemDetail.class);
            localStorage.setItem('sku', skuID);

            localStorage.setItem('importDomestic', data.body.itemDetail.importDomestic);
            vendorID = data.body.itemDetail.vendorID;
            localStorage.setItem('vendor', vendorID);
	    localStorage.setItem('vendorName', data.body.itemDetail.vendorName);
            if (vendorID != 0) {
              skuValid = true;
              validSKUID = skuID;
            } else {
              skuValid = false;
            }
          }
        } else {
          showDialog("SKU Details Web Service Error. Please contact application support team.")
        }
      },
      error: function (xhr, textStatus, error) {
        skuValid = false;
      }
    });

    return skuValid;
  } else {
    skuValid = false;
    return skuValid;
  }
  return skuValid;
}
// validate sku End

//START--For search repair screen
var validateSKUForSearchRepair = function (skuID, checkRepair) {
  var skuValid = false;

  if (skuID.length > 4 && skuID.length <= 6) {
    var data = null;
    if (checkRepair == true) {
      data = JSON.stringify({
        sku: skuID,
        locale: localStorage.getItem('locale'),
        effectivedate: getCurrentDate()
      });
    } else {
      if ($('.lonChkBoxSR').prop('checked') == true) {
        data = JSON.stringify({
          sku: skuID,
          locale: "nd-en-US",
          effectivedate: getCurrentDate()
        });
      } else {
        data = JSON.stringify({
          sku: skuID,
	  locale: localStorage.getItem('locale'),
          effectivedate: getCurrentDate()
        });
      }
    }
    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetSKUDetails',
      contentType: 'application/json',
      data: data,
      async: false,
      success: function (data) {
        if (data.statusCode == 200) {
          if (data.body == "") {
            skuValid = false;
          } else {
            localStorage.setItem('currentSKUDESCRIPTION', data.body.itemDetail.description);
            localStorage.setItem('currentCOMPANYCODE', data.body.itemDetail.company);
            localStorage.setItem('currentDEPT', data.body.itemDetail.department)
            localStorage.setItem('currentSKUCLASS', data.body.itemDetail.class);
            localStorage.setItem('sku', skuID);

            localStorage.setItem('importDomestic', data.body.itemDetail.importDomestic);
            vendorID = data.body.itemDetail.vendorID;
            localStorage.setItem('vendor', vendorID);
	    localStorage.setItem('vendorName', data.body.itemDetail.vendorName);
            if (vendorID != 0) {
              skuValid = true;
              validSKUID = skuID;
            } else {
              skuValid = false;
            }
          }
        } else {
          showDialog("SKU Details Web Service Error. Please contact application support team.")
        }
      },
      error: function (xhr, textStatus, error) {
        skuValid = false;
      }
    });
    return skuValid;
  } else {
    skuValid = false;
    return skuValid;
  }
  return skuValid;
}
//END--For search repair screen

var validateSKUForSR1 = function (sku) {
  var skuValid = false;
  var data = JSON.stringify({
    sku: sku,
    locale: localStorage.getItem('locale'),
    effectivedate: getCurrentDate()
  });
  if (sku.length >= 5 && sku.length <= 6) {


    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetSKUDetails',
      contentType: 'application/json',
      data: data,
      async: false,
      success: function (data) {
        if (data.statusCode == 200) {
          if (data.body == "") {
            skuValid = false;
          } else {
            localStorage.setItem('currentSKUDESCRIPTION', data.body.itemDetail.description);
            localStorage.setItem('currentCOMPANYCODE', data.body.itemDetail.company);
            localStorage.setItem('currentDEPT', data.body.itemDetail.department)
            localStorage.setItem('currentSKUCLASS', data.body.itemDetail.class);
            localStorage.setItem('sku', sku);

            localStorage.setItem('importDomestic', data.body.itemDetail.importDomestic);
            vendorID = data.body.itemDetail.vendorID;
            localStorage.setItem('vendor', vendorID);
		localStorage.setItem('vendorName', data.body.itemDetail.vendorName);
            if (vendorID != 0) {
              skuValid = true;
              validSKUID = sku;
            } else {
              skuValid = false;
            }
          }
        } else {
          showDialog("SKU Details Web Service Error. Please contact application support team.")
        }
      },
      error: function (xhr, textStatus, error) {
        skuValid = false;
      }
    });
  }
  return skuValid;
}

var validateControls = function (name) {

  var maxQty = getMaxQty();
  $.ajaxSetup({
    async: false
  });

  $.ajax({
    type: "GET",
    url: warningMessage,
    async: false,
    success: function (configData) {

      if (name.toLowerCase() == "searchrepair1") {

        //if($('#repairPersoninpSCR').val() == 0 )
        if ($('#rPersonPopupInputSR1').attr('repairpersonid') == 0) {
          bWarningMessage = true;
          configData = configData.WarningMessages.filter(function (a) {
            return a.Title == "RepairPerson";
          });
          showDialog(configData[0].Message);
        } else if ($('.txtPCSR').val().length == 0) {
          bWarningMessage = true;
          configData = configData.WarningMessages.filter(function (a) {
            return a.Title == "PieceCount";
          });
          showDialog(configData[0].Message);

        } else if ($('.txtPONum').val() != 0 || $('.txtSalesNum').val() != 0 || $('.txtSourceLoc').val() != 0 || $('.txtSuffixO').val() != 0) {

          if ($('.txtSalesNum').val() != 0 && $('.txtSourceLoc').val() == 0) {
            bWarningMessage = true;
            showDialog("Source Location must be provided if Sales Number is entered");
          } else if ($('.txtSuffixO').val() != 0 && $('.txtSalesNum').val() == 0) {
            bWarningMessage = true;
            showDialog("Sales Number must be provided is Suffix is entered");
          } else {
            var data = null;
            var data = JSON.stringify({
              PurchaseOrder: $('.txtPONum').val(),
              Sales: $('.txtSalesNum').val(),
              SourceLocation: $('.txtSourceLoc').val(),
              Suffix: $('.txtSuffixO').val(),
              locale: localStorage.getItem('locale'),
              location: localStorage.getItem('location'),
              sku: localStorage.getItem('sku')

            });
            $.ajax({
              type: "POST",
              url: nodeServerURL + '/ValidateData',
              contentType: 'application/json',
              data: data,
              async: false,
              success: function (data) {
                if (data.statusCode == 200) {
                  if (data.body.errorCode != 0) {
                    bWarningMessage = true;
                    configData = configData.WarningMessages.filter(function (a) {
                      return a.Code == data.body.errorCode;
                    });

                    showDialog(configData[0].Message);
                  } else {
                    bWarningMessage = false;
                  }
                } else {
                  showDialog("Validate Data Web Service Error. Please contact application support team.")
                }
              },
              error: function (xhr, textStatus, error) {}
            });
          }

        } else if ($('.txtPCSR').val() < maxQty && maxQty != 0) {
          bWarningMessage = true;
          showDialog("Piece Count entered is lesser than the Quantity selected.");
        } else if (localStorage.getItem('selectedRepairCodesCount') == 0 && ($('.lblStatus').attr('code') != "010" && $('.lblStatus').attr('code') != "0" )){
          bWarningMessage = true;
          showDialog("Repair codes needs to be selected.");
        } else {
          bWarningMessage = false;
        }
      } else {
        if ($('#rPersonPopupInputCR').attr('repairpersonid') == 0) {
          bWarningMessage = true;
          configData = configData.WarningMessages.filter(function (a) {
            return a.Title == "RepairPerson";
          });
          showDialog(configData[0].Message);
        } else if ($('.txtPC').val().length == 0) {
          bWarningMessage = true;
          configData = configData.WarningMessages.filter(function (a) {
            return a.Title == "PieceCount";
          });
          showDialog(configData[0].Message);

        } else if ($('.txtPONum').val() != 0 || $('.txtSalesNum').val() != 0 || $('.txtSourceLoc').val() != 0 || $('.txtSuffixO').val() != 0) {
          if ($('.txtSalesNum').val() != 0 && $('.txtSourceLoc').val() == 0) {
            bWarningMessage = true;
            showDialog("Source Location must be provided if Sales Number is entered");
          } else if ($('.txtSuffixO').val() != 0 && $('.txtSalesNum').val() == 0) {
            bWarningMessage = true;
            showDialog("Sales Number must be provided is Suffix is entered");
          } else {

            var data = null;
            var data = JSON.stringify({
              PurchaseOrder: $('.txtPONum').val(),
              Sales: $('.txtSalesNum').val(),
              SourceLocation: $('.txtSourceLoc').val(),
              Suffix: $('.txtSuffixO').val(),
              locale: localStorage.getItem('locale'),
              location: localStorage.getItem('location'),
              sku: localStorage.getItem('sku')

            });

            $.ajax({
              type: "POST",
              url: nodeServerURL + '/ValidateData',
              contentType: 'application/json',
              data: data,
              async: false,
              success: function (data) {
                if (data.statusCode == 200) {
                  if (data.body.errorCode != 0) {
                    bWarningMessage = true;
                    configData = configData.WarningMessages.filter(function (a) {
                      return a.Code == data.body.errorCode;
                    });
                    showDialog(configData[0].Message);
                  } else {
                    bWarningMessage = false;
                  }
                } else {
                  showDialog("Validate Data Web Service Error. Please contact application support team.")
                }
              },
              error: function (xhr, textStatus, error) {}
            });
          }


        } else if ($('.txtPC').val() < maxQty && maxQty != 0) {
          bWarningMessage = true;
          showDialog("Piece Count entered is lesser than the quantity selected.");
        } else {
          bWarningMessage = false;
        }
        return bWarningMessage;
      }

    }
  });

  return bWarningMessage;
}

var validateForCancel = function(name){
  bWarningMessage= false;
  if ($('.inpSRSKU').val().length ==0){
    bWarningMessage = true;   
    showDialog("SKU needs to be entered.");
  }else if ($('.txtPCSR').val().length == 0) {
    bWarningMessage = true;   
    showDialog("Piece Count needs to be entered.");
  }else if ($('#rPersonPopupInputSR1').attr('repairpersonid') == 0) {
    bWarningMessage = true;   
    showDialog("Repair Person needs to be selected.");
  } 
  return bWarningMessage;
}

var getMaxQty = function () {
  var list = [];
  $('.chkRepairDesc').each(function () {
    if (this.checked == true) {
      var qtyData = $(this).parent().parent().find('.qtyDiv').find('.inpQty').val();
      list.push(qtyData);
    }
  });
  var maxQty;
  if (list.length == 0) {
    maxQty = 0;
  } else {
    maxQty = Math.max.apply(null, list);
  }
  return maxQty;
}
var showDialog = function (message) {

  $('#alertModal').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#alertModal').find('.pmodalText').text(message);
  $('.divoverlay').show();
  //  $('.txtSKU').css('style','pointer-events: none;'); // added to remove cursor from txtSKU.
}


var showDialogError = function (message) {

  $('#alertModalError').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#alertModalError').find('.pmodalText').text(message);
  $('.divoverlay').show();
  //  $('.txtSKU').css('style','pointer-events: none;'); // added to remove cursor from txtSKU.
}

var showConfirmDialog = function (message) {
  $('#confirmModal').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#confirmModal').find('.pmodalText').text(message);
  $('.divoverlay').show();
}

var showDiscardDialog = function(message){
  $('#discardConfirmModal').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#discardConfirmModal').find('.pmodalText').text(message);
  $('.divoverlay').show();
}

var showInfoDialog = function (message) {
  $('#informationModal').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#informationModal').find('.pmodalText').text(message);
  $('.divoverlay').show();
}

var showCancelConfirmDialog = function (message) {
  $('#cancelconfirmModal').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#cancelconfirmModal').find('.pmodalText').text(message);
  $('.divoverlay').show();
}

var showInvalidAppDialog = function (message) {
  $('#invalidAppLoader').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#invalidAppLoader').find('.pmodalText').text(message);
  $('.divoverlay').show();
}

var showInvalidAppLocReloadDialog = function (message) {
  $('#invalidAppLoaderLocReload').css('display', 'block');
  $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
  $('#invalidAppLoaderLocReload').find('.pmodalText').text(message);
  $('.divoverlay').show();
}

var setScreen = function (name) {
  if (name == "SEARCH") {
    if ($('#lblCSP').parent().hasClass('current'))
      $('#lblCSP').parent().removeClass("current");
    $("#lblSSP").parent().addClass("current");

  } else {
    if ($('#lblSSP').parent().hasClass('current'))
      $('#lblSSP').parent().removeClass("current");
    $("#lblCSP").parent().addClass("current");

  }
}

var limitAlphabets = function (object) {
  object.value = object.value.replace(/[^a-zA-Z]/g, '');
  return object.value;
}


var limitNumbers = function (object) {
  object.value = object.value.replace(/[^0-9]/g, '');
  return object;
}


var maxLengthCheck = function (object) {
  if (object.value.length > object.maxLength) {
    object.value = object.value.substring(0, object.maxLength)
  } else if (object.value === "" || object.value < 0) {
    object.value = object.value.slice(0, object.value.length - 1);
  }
}



/*var maxValueCheck = function(object)
{
    if(object.value > object.max)
      {
          object.value = object.max;
      }
    else {
        object.value = object.value;
      }
}*/

var maxValueCheck = function (object) {
  if (object.value == "") {
    object.value = "";
    //object.value = Math.min(object.value, object.max);
  } else {
    object.value = Math.min(object.value, object.max);
  }


}

var sliceData = function (object) {
    if (object.value.slice(0, 1) == "0" || object.value.slice(0, 1) == "") {
      object.value = object.value.slice(1, object.value.length);
    } else {
      object.value = object.value;
    }
  }


  ||
  $('#rPersonPopupInputCR').val().length > 1

var validatecrsrsr1 = function (from) {
  if (from.toLowerCase() == "create") {
    // from create.. load search repair
    if ($('.txtSKU').val().length >= 1 ||
      $('.txtPC').val().length > 1 ||
      $('.txtPONum').val().length ||
      $('.txtSourceLoc').val().length ||
      $('.txtSalesNum').val().length ||
      $('.txtSuffixO').val().length) {
      showConfirmDialog("You have modified fields. Changes will be lost . Are you sure to continue ?");
      bWarningMessage = true;
    } else {
      bWarningMessage = false;
    }
    return bWarningMessage;
  } else if (from.toLowerCase() == "searchrepair1") {
    // from search.. load Search repair
    data = setRepairDetailsSelectedData();
    var newCodes = JSON.parse(localStorage.getItem('selectedRepairCodesCount'));
    var oldCodes = JSON.parse(localStorage.getItem('existingrepairCodesCount'));

    if ($('.txtPONum').attr('valdata') != $('.txtPONum').val() ||
      $('.txtSalesNum').attr('valdata') != $('.txtSalesNum').val() ||
      $('.txtSuffixO').attr('valdata') != $('.txtSuffixO').val() ||
      $('.txtSourceLoc').attr('valdata') != $('.txtSourceLoc').val() ||
      $('#rPersonPopupInputSR1').attr('valdata') != $('#rPersonPopupInputSR1').attr('repairpersonid') ||
      newCodes != oldCodes
    ) {
      showConfirmDialog("You have modified fields. Changes will be lost . Are you sure to continue ?");
      bWarningMessage = true;
    } else {
      bWarningMessage = false;
    }
    return bWarningMessage;
  } else {
    // from search.. load Search repair
    bWarningMessage = false;
  }
  return bWarningMessage;
}


var loadScreen = function (from) {
  if (!$('.createRepairScreen').hasClass('hide')) {
    $('.createRepairScreen').addClass('hide');
  }
  if (!$('.searchRepairScreen').hasClass('hide')) {
    $('.searchRepairScreen').addClass('hide');
  }
  //$('.searchRepairScreen').addClass('hide');
  if (from.toLowerCase() == "create") {
    // from create.. load search repair
    loadSearchRepair();
    $('.btnCreateNext').addClass('displayNone');
    if ($('.btnDiscardChanges').hasClass('fLeft')) {
      $('.btnDiscardChanges').removeClass('fLeft');
      $('.btnDiscardChanges').addClass('fRight');
  }
    $("#crsrsr1").attr('current', 'search');
  } else if (from.toLowerCase() == "searchrepair1") {
    // from search1.. load Create repair
    loadCRfromSR1();
    createRepair(currentDate);
    $("#crsrsr1").attr('current', 'create');
    if ($('.btnBack').hasClass('displayBlock')) {
      $('.btnBack').removeClass('displayBlock');
      $('.btnBack').addClass('displayNone');
    }
    if ($('.btnCancelRepair').hasClass('displayBlock')) {
      $('.btnCancelRepair').removeClass('displayBlock');
      $('.btnCancelRepair').addClass('displayNone');
    }

  } else {
    // from search.. load Create repair
    loadCRfromSR1();
    createRepair(currentDate);
    $("#crsrsr1").attr('current', 'create');
  }
  // setTimeout(function () {
  //   hideLoader();
  // }, 2000);
}

var loadCRfromSR1 = function () {
  //For Repair Div
  $('.repairDiv').addClass('hide');
  // if ($('.repairDiv').hasClass('show')) {
  //   $('.repairDiv').removeClass('show');
  //   $('.repairDiv').addClass('hide');
  // }
  $('.lblRepairNumber').text('');
  $('.lblStatus').text('');
  $('.skuSRDiv').addClass('hide');
  // if ($('.skuSRDiv').hasClass('show')) {
  //   $('.skuSRDiv').removeClass('show');
  //   $('.skuSRDiv').addClass('hide');
  // }
  $('.inpSRSKU').val('');
  $('.lblSRSKUDesc').text('');

  $('.minutesSRDiv').addClass('hide');
  // if ($('.minutesSRDiv').hasClass('show')) {
  //   $('.minutesSRDiv').removeClass('show');
  //   $('.minutesSRDiv').addClass('hide');
  // }
  $('.lblMinutes').text('');
  $('#rPersonPopupInputSR1').attr('repairpersonid', '').text('');

  if ($('.skuCRdiv').hasClass('hide')) {
    $('.skuCRdiv').removeClass('hide');
  }

  if ($('.imgBarCode').hasClass('hide')) {
    $('.imgBarCode').removeClass('hide');
  }

  if ($('.txtSKU').hasClass('hide')) {
    $('.txtSKU').removeClass('hide');
  }
  if ($('.crRepairRow').hasClass('hide')){
    $('.crRepairRow').removeClass('hide');
  }
  $('.srRepairRow').addClass('hide');
  disableFields();

  if ($('.btnDiscardChanges').hasClass('fRight')) {
    $('.btnDiscardChanges').removeClass('fRight');
    $('.btnDiscardChanges').addClass('fLeft');
}
  // hideLoader();

}