var configFile = '../../public/Config/configuration.json';
var currentDate = new Date();
var onlyCreate = false;
var nodeServerURL = '';
var currentServerURL = '';
var bWarningMessage = false;
var locationTypes = '';
var track = 0;
var location;
var rCodeCheckCount = 0;
var fileMain = '';
var formData = new FormData();
var deviceEventType = '';

$(document).ready(function () {

  var changingHash = false;

  function onbarcode(event) {
    switch (event.type) {
      case "hashchange":
        {
          if (changingHash == true) {
            return;
          }
          var hash = window.location.hash;
          if (hash.substr(0, 3) == "#zx") {
            hash = window.location.hash.substr(3);
            changingHash = true;
            window.location.hash = event.oldURL.split("\#")[1] || ""
            changingHash = false;
            $('.txtSKU').val(hash);
            processBarcode(hash);
          }

          break;
        }
      case "storage":
        {
          window.focus();
          if (event.key == "barcode") {
            window.removeEventListener("storage", onbarcode, false);
            //$('.txtSKU').val(event.newValue);
            processBarcode(event.newValue);
          }
          break;
        }
      default:
        {
          console.log(event)
          break;
        }
    }
  }
  window.addEventListener("hashchange", onbarcode, false);

  function processBarcode(bc) {
    var clTxt = localStorage.getItem('data-from');
    $('.' + clTxt).val(bc);
    if (clTxt == "txtSKU") {
      $('.txtSKU').trigger('keyup');
    }
  }

  function readConfigFile() {
    var jqxhr = $.getJSON(configFile, function () {})
      .done(function (configData) {
       
        currentServerURL = configData.CurrentServerURL;
        if (configData.NodeServicePort  == "0"){
          nodeServerURL = configData.NodeServiceURL;
        }else{
          nodeServerURL = configData.NodeServiceURL + ':' + configData.NodeServicePort;  
        }
        unlockRepairData(localStorage.getItem('REPAIRNUMBERSELECTED'));
        localStorage.clear();
        locationTypes = configData.LocationTypes;
        localStorage.setItem('FILE', configData.FILE);
        localStorage.setItem('MANDETORYIMGCHECK', configData.MANDETORYIMGCHECK);
        localStorage.setItem('MAXRECORDS', configData.MaxRecords)
        //if its a mobile device use 'touchstart'
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          localStorage.setItem('deviceEventType', 'touchstart');
        } else {
          //If its not a mobile device use 'click'
          localStorage.setItem('deviceEventType', 'click');
        }
        // showLoader();
        getDeviceInfo();

      })
  }

  function unlockRepairData(data1) {
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
            async: true,
            success: function (data) {
                if (data.statusCode != 200) {
                    showDialog("Unlock Repair Web Service Error. Please contact application support team.")
                }
            },
            error: function (xhr, textStatus, error) {}
        });
    }
}

  showLoader("docuemnt ready");
  readConfigFile();
  localStorage.setItem("filesData", "");
  localStorage.setItem('imagesCapturedDiv', "");


  var showErrorDialog = function (message) {
    $('#alertModal').css('display', 'block');
    $('.container').css('style', 'background-color: #000; opacity:1; z-index:1000;');
    $('#alertModal').find('.pmodalText').text(message);
    $('.divoverlay').show();
  }


  var getIPAddress = function () {
    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetIPAddress',
      contentType: 'application/json',
      async: true,
      success: function (data) {
        localStorage.setItem('IPADDRESS', data);
      },
      error: function (xhr, textStatus, error) {},
      complete: function (d) {}
    });
  }

  var getDeviceInfo = function () {
    //LoadMainScreen();
    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetLocationInformation',
      contentType: 'application/json',
      success: function (data) {
        if (data.statusCode == 200) {
          if (data.body == "0") {
            if ($('.container').hasClass('hide')) {
              $('.container').removeClass('hide');
            }
            hideLoader("hi");
            $('#tabsContainer').html('');
            showInvalidAppDialog("Application is not configured for your location");
          } else {
            if (data.body.detail != undefined) {

              if (jQuery.inArray(data.body.detail.type, locationTypes) !== -1) {
                localStorage.setItem("location", data.body.location);
                localStorage.setItem("companyCode", data.body.company);
                localStorage.setItem("locale", data.body.locale);
                hideLoader("hi");
                //if(getCookie("forscan") ==  ""){                
                LoadMainScreen();
                // }
                if ($('.container').hasClass('hide')) {
                  $('.container').removeClass('hide');
                }
                if ($('.groupEvents').hasClass('hide')) {
                  $('.groupEvents').removeClass('hide');
                }
                getIPAddress();
                GetRepairRate();
                getStatusData();
                if (localStorage.getItem('REPAIRNUMBERSELECTED') != "" ||
                  localStorage.getItem('REPAIRNUMBERSELECTED') != null) {
                  unlockRepair(localStorage.getItem('REPAIRNUMBERSELECTED'));
                }
              } else {
                hideLoader();
            showInvalidAppDialog("Application is not configured for your location");
              }
            } else {
              hideLoader();
              showInvalidAppLocReloadDialog("Web Service Error ");
            }
          }
        } else {
          hideLoader();
          showInvalidAppLocReloadDialog("Location Information Web Service Error. Please contact application support team.")
        }

      },
      error: function (request, textStatus, error) {
        hideLoader();
        showInvalidAppDialog("Back End server cannot be reached. Please try after some time.")      
      },
      complete: function (d) {
      

      }
    });
  }


  //Code for Getting the SKU number
  // if (window.location.href.indexOf("scan") > -1) {
  //   scannedRepair = getParam('scan');

  //   var sku = scannedRepair.split("-")[0].split("=")[1];
  //   delete_cookie("value");
  //   setCookie("value", sku);

  //   //    window.history.replaceState({}, document.title, window.location.href.split("?")[0]);


  //   //window.history.replaceState({}, document.title, "#");
  //   //window.history.pushState(null, '', "xys");

  //   delete_cookie("CurrentSKU");
  //   setCookie("CurrentSKU", sku);
  //   // alert("ks" + localStorage.getItem('kahan-se'));
  //   //alert("kt" + localStorage.getItem('kaunsa-type'));
  //   showLoader();
  //   //delete_cookie("forscan");
  //   if (getCookie('kahan-se') == "create") {
  //     if (getCookie("CurrentSKU").length == 6) {
  //       $('.txtSKU').val(getCookie("value"));
  //       setTimeout(function () {
  //         $('.txtSKU').val(getCookie("value"));
  //         $(document).find('.txtSKU').focus();
  //         $('.txtSKU').trigger('keyup touchstart');
  //         if (!validateSKU(getCookie("CurrentSKU"))) {
  //           bWarningMessage = true;
  //           $('.shopTableContent').html('');
  //           showDialog("Invalid SKU. Kindly enter a different SKU");
  //         } else {
  //           getRepairCodes();
  //           $('.txtPONum').removeAttr('disabled');
  //           $('.txtSourceLoc').removeAttr('disabled');
  //           $('.txtSalesNum').removeAttr('disabled');
  //           $('.txtSuffixO').removeAttr('disabled');
  //           $('.slctRepPersonCR').removeAttr('disabled');
  //           if ($('.btnCreateNext').hasClass('displayNone')) {
  //             $('.btnCreateNext').removeClass('displayNone');
  //             $('.btnCreateNext').addClass('displayBlock');
  //           }
  //           $('.btnCreateNext').removeAttr('disabled');
  //           $('.chkRItem').removeAttr('disabled');
  //           $('.chkRItemVendor').removeAttr('disabled');
  //           $('#rPersonPopupInputCR').removeAttr('disabled');
  //           $('#rPersonPopupInputCR').removeAttr('disabled');
  //           $('#rPersonPopupInputCR').css('background-color', '#ffffff');
  //           $('.imgDropDown').removeClass('hide');
  //           $('.cust-select-box').css('pointer-events', 'fill');
  //           $('.statu-select-box').css('pointer-events', 'fill');
  //           $('.selectOption').css('pointer-events', 'fill');
  //           $('.btnCreateNext').removeAttr('disabled');
  //         }
  //         //$(document).find('.buttonload').addClass('hide');
  //       }, 2000);

  //     } else {
  //       showInfoDialog("SKU SCANNED is not valid");
  //       setTimeout(function () {
  //         $('.modalWindow').css('display', 'none');
  //         $('.divoverlay').hide();
  //       }, 2000);
  //       getCookie("CurrentSKU", "");
  //       $('.txtSKU').val('');
  //     }
  //   } else {
  //     showLoader();
  //     if (getCookie('kahan-se') == "search") {
  //       var skuData = getCookie("sku");
  //       var repair = getCookie("repair");
  //       var person = getCookie("person");
  //       var rDate = getCookie("rDate");
  //       var status = getCookie("status");

  //       $("#srBC").addClass("current");
  //       $("#crBC").removeClass("current");

  //       //alert(getCookie('kaunsa-type'));
  //       if (getCookie('kaunsa-type') == "sku") {
  //         $('.createRepairScreen').addClass('hide');
  //         setTimeout(function () {
  //           loadScreen("create");
  //           $('.txtSearchRepairSKU').val(getCookie("value"));
  //           $(".txtSearchRepairRepairNum").val(repair);
  //           $("#rPersonPopupInputSR").text(person);
  //           $("#datepicker").val(rDate);
  //           $("#statusSelectLbl").text(status);
  //         }, 3000);
  //       }
  //       if (getCookie('kaunsa-type') == "repair") {
  //         $('.createRepairScreen').addClass('hide');
  //         $("#srBC").addClass("current");
  //         $("#crBC").removeClass("current");
  //         setTimeout(function () {
  //           loadScreen("create");
  //           $('.txtSearchRepairRepairNum').val(getCookie("value"));
  //           $(".txtSearchRepairSKU").val(skuData);
  //           $("#rPersonPopupInputSR").text(person);
  //           $("#datepicker").val(rDate);
  //           $("#statusSelectLbl").text(status);
  //         }, 3000);
  //       }
  //     }
  //   }
  //   onlyCreate = true;
  // }

  var LoadMainScreen = function () {
    if ((currentDate.getMonth() + 1) < 10) {
      mon = "0" + (currentDate.getMonth() + 1);
    } else {
      mon = (currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
      dated = "0" + currentDate.getDate();
    } else {
      dated = currentDate.getDate();
    }
    currentDate = mon + "/" + dated + "/" + currentDate.getFullYear().toString().substring(2, 4);
    createRepair(currentDate);
  }




  $(document).on('click', '.radioGroup', function (event) {
    event.preventDefault();
    var currentTab = "";
    currentTab = $(this).attr('rtyu');
    $(this).parent().addClass("current");
    $(this).parent().siblings().removeClass("current");
    var tab = $(this).parent().attr("href");


    $("#clicktype").attr('clicktype', "radiogroup");
    $(".radioGroup").find("[name=span]").removeAttr("checked");
    bWarningMessage = validatecrsrsr1($("#crsrsr1").attr('current').toLowerCase());
    if (!bWarningMessage) {
      localStorage.removeItem('editableSKU');
      showLoader();
      loadScreen($("#crsrsr1").attr('current').toLowerCase());
      if (localStorage.getItem('REPAIRNUMBERSELECTED') != "" ||
        localStorage.getItem('REPAIRNUMBERSELECTED') != null) {
        unlockRepair(localStorage.getItem('REPAIRNUMBERSELECTED'));
      }
    }
  });

  $('.btnCreateNext').click(function () {
    var currentPage = $(this).attr('currentPage');
    var data = [];
    data = setRepairDetailsSelectedData();
    var repairStatus = $('.lblStatus').attr('code');
    // if (repairStatus == "0") {
    //   repairStatus = "010";
    // }
    bWarningMessage = validateControls($("#crsrsr1").attr('current').toLowerCase());
    if (localStorage.getItem("editableSKU") == "true") {
      if ($('.inpSRSKU').val().length < 5) {
        showDialog("SKU is mandatory.");
      }
      if ($("#crsrsr1").attr('current').toLowerCase() == "create") {
        localStorage.setItem("RepairNumberStatus", "CREATE");
        var pieceCount = $('.txtPC').val();
        repairDetailsJSOn("0", 0, "", $('#rPersonPopupInputCR').attr('repairPersonid'),pieceCount);
        //repairDetailsJSOn("010", 0, "", $('#rPersonPopupInputCR').attr('repairPersonid'));
      } else {
        localStorage.setItem("RepairNumberStatus", "UPDATE");
        var pieceCount = $('.txtPCSR').val();
        repairDetailsJSOn(repairStatus, $('.lblRepairNumber').text(), "", $('#rPersonPopupInputSR1').attr('repairPersonID'),pieceCount);
      }
      if (!bWarningMessage) {
        repairDetailsLoad($("#crsrsr1").attr('current').toLowerCase());
      }

      if ($('.btnBack').attr('disabled') == 'disabled') {
        $('.btnBack').attr('disabled', false);
      }
      createRepairData(data);
      $('#isSR1').attr('stat', false);
    } else {

      if ($("#crsrsr1").attr('current').toLowerCase() == "create") {
        localStorage.setItem("RepairNumberStatus", "CREATE");
        var pieceCount = $('.txtPC').val();
        repairDetailsJSOn("0", 0, "", $('#rPersonPopupInputCR').attr('repairPersonid'),pieceCount);
        //repairDetailsJSOn("010", 0, "", $('#rPersonPopupInputCR').attr('repairPersonid'));
      } else {
        localStorage.setItem("RepairNumberStatus", "UPDATE");
        var pieceCount = $('.txtPCSR').val();
        //repairDetailsJSOn("100",$('.lblRepairNumber').text(),"",$('#repairPersoninpSCR').attr('repairPersonID'));
        repairDetailsJSOn(repairStatus, $('.lblRepairNumber').text(), "", $('#rPersonPopupInputSR1').attr('repairPersonID'),pieceCount);
      }
      if (!bWarningMessage) {
        repairDetailsLoad($("#crsrsr1").attr('current').toLowerCase());
      }

      if ($('.btnBack').attr('disabled') == 'disabled') {
        $('.btnBack').attr('disabled', false);
      }
      createRepairData(data);
      $('#isSR1').attr('stat', false);
    }

  });

  $('.btnDiscardChanges').click(function(){
    showDiscardDialog("Are you sure you want to discard the changes?")
  });
  $('.btnBack').click(function () {
    $("#clicktype").attr('clicktype', "back");
    if ($('#isSR1').attr('stat').toLowerCase() == "true") {
      bWarningMessage = validatecrsrsr1("searchrepair1");
      if (!bWarningMessage) {
        loadSearchRepair();
        $('.btnCreateNext').addClass('displayNone');
        $("#crsrsr1").attr('current', 'search');
        localStorage.removeItem('repairCodesSelected');
        localStorage.removeItem('EXISTINGREPAIRCODES');
        unlockRepair(localStorage.getItem('REPAIRNUMBERSELECTED'));
        if ($('.btnBack').hasClass('displayBlock')) {
          $('.btnBack').removeClass('displayBlock');
          $('.btnBack').addClass('displayNone');
        }
	if ($('.btnDiscardChanges').hasClass('displayBlock')) {
          $('.btnDiscardChanges').removeClass('displayBlock');
          $('.btnDiscardChanges').addClass('displayNone');
        }
        if ($('.btnCancelRepair').hasClass('displayBlock')) {
          $('.btnCancelRepair').removeClass('displayBlock');
          $('.btnCancelRepair').addClass('displayNone');
        }

        $('.btnCreateNext').addClass('displayNone');
        $("#crsrsr1").attr('current', 'search');
      }
    } else {
      repairDetailsBack($("#crsrsr1").attr('current'));
    }
    if ($("#crsrsr1").attr('current') == "searchrepair1")
      $('#isSR1').attr('stat', true);

  });

  $(document).on('click', '.imgBarCode', function () {
    //pushtoJSON();

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // if (/android/i.test(userAgent)) {
    //   setCookie("kahan-se", $(this).attr('kahan-se'));
    //   setCookie("kaunsa-type", $(this).attr('kaunsa-type'));
    //   setCookie("forscan", "scan");
    //   if ($(this).attr('kahan-se') == "search") {
    //     setCookie("sku", $(".txtSearchRepairSKU").val());
    //     setCookie("repair", $(".txtSearchRepairRepairNum").val());
    //     setCookie("person", $("#rPersonPopupInputSR").text());
    //     setCookie("rDate", $("#datepicker").val());
    //     setCookie("status", $("#statusSelectLbl").text());
    //   }
    //   disableFields();
    //   location.href = " xing://scan/?ret=" + currentServerURL + "?scan={CODE}";
    // } else {
    //   showDialog("This feature is not supported in this device.");
    // }
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      var href = window.location.href;
      var ptr = href.lastIndexOf("#");
      if (ptr > 0) {
        href = href.substr(0, ptr);
      }
      window.addEventListener("storage", onbarcode, false);
      setTimeout('window.removeEventListener("storage", onbarcode, false)', 15000);
      localStorage.removeItem("barcode");
      //window.open  (href + "#zx" + new Date().toString());
      // setCookie("kahan-se", $(this).attr('kahan-se'));
      // setCookie("kaunsa-type", $(this).attr('kaunsa-type'));
      // setCookie("forscan", "scan");
      // if ($(this).attr('kahan-se') == "search") {
      //   setCookie("sku", $(".txtSearchRepairSKU").val());
      //   setCookie("repair", $(".txtSearchRepairRepairNum").val());
      //   setCookie("person", $("#rPersonPopupInputSR").text());
      //   setCookie("rDate", $("#datepicker").val());
      //   setCookie("status", $("#statusSelectLbl").text());
      // }
      disableFields();
      localStorage.setItem('data-from', $(this).attr('data-for'));
      if (navigator.userAgent.match(/Firefox/i)) {
        //Used for Firefox. If Chrome uses this, it raises the "hashchanged" event only.
        window.location.href = ("zxing://scan/?ret=" + encodeURIComponent(href + "#zx{CODE}"));
      } else {
        //Used for Chrome. If Firefox uses this, it leaves the scan window open.
        window.open("zxing://scan/?ret=" + encodeURIComponent(href + "#zx{CODE}"));
      }
    } else {
      showDialog("This feature is not supported in this device.");
    }
  });

  // edit option
  $(document).on("click", ".iconEdit", function () {

    var row = $(this).closest(".shopRow");
    var btn = "<a href='#' value='Save' class='iconSave'>Save</a><a value='Cancel' class='iconCancel' href='#'>Cancel</a>";    
    //var btn = "<span class='iconSave'><i class='fa fa-floppy-o fa-2x colorBtn' aria-hidden='true'></i></span><span class='iconCancel'><i class='fa fa-times fa-2x colorBtn' aria-hidden='true'></i></span>";
    

    if (row.find('.chkRepairDesc').prop('checked') == true) {
      var qty = row.find("[name=qty]").val();
      var mins = row.find("[name=mins]").val();
      row.attr("qty", row.find("[name=qty]").val()).attr("mins", row.find("[name=mins]").val());

      if (!row.hasClass("editRow")) {
        row.find("[name=qty]").prop("readonly", false);
        if (row.attr('categorycode') != "10") {
          row.find("[name=mins]").prop("readonly", false);
        }else{
          row.find("[name=mins]").addClass("inpLookLikeLabel");
        }
        row.find("div:last-child").html(btn);
        row.addClass("editRow");
      }
      if (row.find('.rdStatus').attr('code') == 900) {
        if (row.find('input').hasClass('cancelStatusClass'))
          row.find('input').removeClass('cancelStatusClass');
      }
      $('.iconEdit').not($(this)).prop('disabled', true);
      $('.chkRepairDesc').not($(this)).prop('disabled', true);

      $('.btnBack,.btnCancelRepair, .btnCreateNext').attr('disabled', 'disabled');
      $('.btnBack,.btnCancelRepair, .btnCreateNext').css('background-color', 'darkgray');
      row.css('background-color', '#FFE082');
    }

  });

  // save option
  $(document).on("click", ".iconSave", function () {
    var row = $(this).closest(".shopRow");
    //<div class="col-2 col-m-2"><button value="Edit" class="iconEdit">Edit</button></div></div>
    //var ebtn = "<span class='iconEdit'><i class='fa fa-pencil-square-o fa-2x colorBtn' aria-hidden='true'></i></span>";
    var ebtn = "<a href='#' value='Edit' class='iconEdit'>Edit</a>";
    if (row.hasClass("editRow")) {
      row.find("[name=qty]").prop("readonly", true);
      row.find("[name=mins]").prop("readonly", true);
      row.find("div:last-child").html(ebtn);
      row.removeClass("editRow");
    }
    if (row.find("[name=qty]").val() == "") row.find("[name=qty]").val('1');
    if (row.find("[name=mins]").val() == "") row.find("[name=mins]").val('0');
    row.find('.inpQty').attr('tempvalue', row.find('.inpQty').val());
    $(".iconEdit").prop("disabled", false).addClass('backGroundBlue');
    $(".chkRepairDesc").prop("disabled", false);
    $('.btnBack,.btnCancelRepair,.btnCreateNext').removeAttr('disabled');
    $('.btnBack,.btnCancelRepair, .btnCreateNext').css('background-color', '#333');
    row.css('background-color', '#fff');
  })
  // cancel option
  $(document).on("click", ".iconCancel", function () {
    var row = $(this).closest(".shopRow");
    //var ebtn = "<span class='iconEdit'><i class='fa fa-pencil-square-o fa-2x colorBtn' aria-hidden='true'></i></span>";
    var ebtn = "<a href='#' value='Edit' class='iconEdit'>Edit</a>";
    if (row.hasClass("editRow")) {
      row.find("[name=qty]").prop("readonly", true).val(row.attr("qty"));
      row.find("[name=mins]").prop("readonly", true).val(row.attr("mins"));
      row.find("div:last-child").html(ebtn);
      row.removeClass("editRow");
    }
    if (row.find('.rdStatus').attr('code') == 900) {
      row.find('input').addClass('cancelStatusClass');
    }
    $(".iconEdit").prop("disabled", false).addClass('backGroundBlue');
    $(".chkRepairDesc").prop("disabled", false);
    //$('.btnBack,.btnCancelRepair').removeAttr('disabled', 'disabled');
    $('.btnBack,.btnCancelRepair,.btnCreateNext').removeAttr('disabled');
    $('.btnBack,.btnCancelRepair, .btnCreateNext').css('background-color', '#333');
    row.css('background-color', '#fff');
  })



  $(document).click(function (e) {
    if (!$(e.target).is('.imgDropDown,#rPersonPopupInputCR,#rPersonPopupInputSR,#rPersonPopupInputSR1,.repPersonDDCR,.repPersonDD,.repPersonDDSR1,.repairPersoninput,repairPersonsMainDiv,.repairPersonsMainDivSR1,.repairPersonsMainDivSR,.statusMianDiv,.status-select-box')) {
      if (!$('.repairPersonsMainDiv').hasClass('hide')) {
        $('.repairPersonsMainDiv').addClass('hide');
        $('.divoverlay').hide();
      }
      if (!$('.repairPersonsMainDivSR1').hasClass('hide')) {
        $('.repairPersonsMainDivSR1').addClass('hide');
        $('.divoverlay').hide();
      }
      if (!$('.repairPersonsMainDivSR').hasClass('hide')) {
        $('.repairPersonsMainDivSR').addClass('hide');
        $('.divoverlay').hide();
      }
      if (!$('.statusMianDiv').hasClass('hide')) {
        $('.statusMianDiv').addClass('hide');
        $('.divoverlayNew').hide();
      }
      // if ($('#rPersonPopupInputCR').hasClass('bshadowIn')) {
      //   $('#rPersonPopupInputCR').removeClass('bshadowIn');
      //   $('#rPersonPopupInputCR').addClass('bshadowOut');
      // }
      // if ($('#rPersonPopupInputSR').hasClass('bshadowIn')) {
      //   $('#rPersonPopupInputSR').removeClass('bshadowIn');
      //   $('#rPersonPopupInputSR').addClass('bshadowOut');
      // }
      // if ($('#rPersonPopupInputSR1').hasClass('bshadowIn')) {
      //   $('#rPersonPopupInputSR1').removeClass('bshadowIn');
      //   $('#rPersonPopupInputSR1').addClass('bshadowOut');
      // }
      // if ($('.status-select-box').hasClass('bshadowIn')) {
      //   $('.status-select-box').removeClass('bshadowIn');
      //   $('.status-select-box').addClass('bshadowOut');
      // }
    }
    if (localStorage.getItem("ValidrepairPerson") != "true") {
      localStorage.setItem("ValidrepairPerson", " ");
      $("#rPersonPopupInputCR").val('');
      //$("#repairPersoninpSCR").val('');
      $("#rPersonPopupInputSR1").val('');
      $("#rPersonPopupInputSR").val('');
    }
  });
  $(document).on('touchstart ', function (e) {

    if (!$(e.target).is('.imgDropDown,#rPersonPopupInputCR,#rPersonPopupInputSR,#rPersonPopupInputSR1,.repPersonDDCR,.repPersonDD,.repPersonDDSR1,.repairPersoninput,.repairPersonsMainDiv,.repairPersonsMainDivSR1,.repairPersonsMainDivSR,.statusMianDiv,.status-select-box')) {
      if (!$('.repairPersonsMainDiv').hasClass('hide')) {
        $('.repairPersonsMainDiv').addClass('hide');
        $('.divoverlay').hide();
      }
      if (!$('.repairPersonsMainDivSR1').hasClass('hide')) {
        $('.repairPersonsMainDivSR1').addClass('hide');
        $('.divoverlay').hide();
      }
      if (!$('.repairPersonsMainDivSR').hasClass('hide')) {
        $('.repairPersonsMainDivSR').addClass('hide');
        $('.divoverlay').hide();
      }
      if (!$('.statusMianDiv').hasClass('hide')) {
        $('.statusMianDiv').addClass('hide');
        $('.divoverlayNew').hide();
      }
      if ($('#rPersonPopupInputCR').hasClass('bshadowIn')) {
        $('#rPersonPopupInputCR').removeClass('bshadowIn');
        $('#rPersonPopupInputCR').addClass('bshadowOut');
      }
      if ($('#rPersonPopupInputSR').hasClass('bshadowIn')) {
        $('#rPersonPopupInputSR').removeClass('bshadowIn');
        $('#rPersonPopupInputSR').addClass('bshadowOut');
      }
      if ($('#rPersonPopupInputSR1').hasClass('bshadowIn')) {
        $('#rPersonPopupInputSR1').removeClass('bshadowIn');
        $('#rPersonPopupInputSR1').addClass('bshadowOut');
      }
      if ($('.status-select-box').hasClass('bshadowIn')) {
        $('.status-select-box').removeClass('bshadowIn');
        $('.status-select-box').addClass('bshadowOut');
      }
    }
    if (localStorage.getItem("ValidrepairPerson") != "true") {
      localStorage.setItem("ValidrepairPerson", " ");

      $("#rPersonPopupInputCR").val('');
      //$("#repairPersoninpSCR").val('');
      $("#rPersonPopupInputSR1").val('');
      $("#rPersonPopupInputSR").val('');
    }
  });

  /*$(document).on('touch ',function(e){

      if(!$(e.target).is('.imgDropDown,#rPersonPopupInputCR,#rPersonPopupInputSR,#rPersonPopupInputSR1,.repPersonDD,.repairPersoninput,.repairPersonsMainDiv,.repairPersonsMainDivSR1,.repairPersonsMainDivSR,.statusMianDiv,.status-select-box')) {
        if(!$('.repairPersonsMainDiv').hasClass('hide'))
        {
          $('.repairPersonsMainDiv').addClass('hide');
          $('.divoverlay').hide();
        }
        if(!$('.repairPersonsMainDivSR1').hasClass('hide'))
        {
          $('.repairPersonsMainDivSR1').addClass('hide');
          $('.divoverlay').hide();
        }
        if(!$('.repairPersonsMainDivSR').hasClass('hide'))
        {
          $('.repairPersonsMainDivSR').addClass('hide');
          $('.divoverlay').hide();
        }
        if(!$('.statusMianDiv').hasClass('hide'))
        {
          $('.statusMianDiv').addClass('hide');
          $('.divoverlayNew').hide();
        }
        if($('#rPersonPopupInputCR').hasClass('bshadowIn'))
        {
            $('#rPersonPopupInputCR').removeClass('bshadowIn');
            $('#rPersonPopupInputCR').addClass('bshadowOut');
        }
        if($('#rPersonPopupInputSR').hasClass('bshadowIn'))
        {
            $('#rPersonPopupInputSR').removeClass('bshadowIn');
            $('#rPersonPopupInputSR').addClass('bshadowOut');
        }
        if($('#rPersonPopupInputSR1').hasClass('bshadowIn'))
        {
            $('#rPersonPopupInputSR1').removeClass('bshadowIn');
            $('#rPersonPopupInputSR1').addClass('bshadowOut');
        }
      }
      if(localStorage.getItem("ValidrepairPerson") != "true")
      {
        localStorage.setItem("ValidrepairPerson", " ");

        $("#rPersonPopupInputCR").val('');
        //$("#repairPersoninpSCR").val('');
        $("#rPersonPopupInputSR1").val('');
        $("#rPersonPopupInputSR").val('');
      }
    });*/
  /*$(document).on('touch',function(e){
//        if(!$(e.target).is('.repairPersonsMainDivSR')){

          if(!$('.repairPersonsMainDivSR').hasClass('hide'))
          {
            $('.repairPersonsMainDivSR').addClass('hide');
             $('.divoverlay').hide();
          }

      });
});*/
  /*$(document).on('click touchstart',function(e){
        if(!$(e.target).is('input,.radioGroup')){
            $(document).find('.txtSalesNum').trigger('blur');
        }
  });*/
  // $(document).on('click touchstart', function (e) {
  //   if (!$(e.target).is('input, .radioGroup')) {
  //     $(document).find('.focus_cls').trigger('blur');
  //   }
  // });

  function datePicker() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = d.getFullYear() + '/' +
      (month < 10 ? '0' : '') + month + '/' +
      (day < 10 ? '0' : '') + day;

    $('#datepicker').datetimepicker({
      timepicker: false,
      //mask:'9999/19/39',
      mask: '19/39/9999',
      //format:'Y/m/d'  ,
      format: 'm/d/Y',
      maxDate: output
    });
  }
  datePicker();
  $(document).on("focus", "#datepicker", function () {
    datePicker();
  });


});

function hideLoader(mode) {
  console.log("-- Hide loader | " + mode)
  $('.loader').addClass('hide');
}

function showLoader(mode) {
  console.log("-- show loader | " + mode)
  //$(document).find('.circle-loader').removeClass('hide');
  if ($('.loader').hasClass('hide')) {
    $('.loader').removeClass('hide');
    loaderCall++;
  }
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var delete_cookie = function (name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};