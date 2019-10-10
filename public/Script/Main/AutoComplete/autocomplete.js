// CLICK of Repair Person label.in CR SCREEN
$(document).on('click', '#rPersonPopupInputCR', function (e) {
  
  $('.divoverlay').show();
  $('.repairPersonsMainDiv').removeClass('hide');
  filterRepairPersonData("", 'repairPersonsDivCR', false, false,"CR");
 
});


$(document).on('click', '#rPersonPopupInputSR', function (e) {
  
  $('.divoverlay').show();
  $('.repairPersonsMainDivSR').removeClass('hide');
  filterRepairPersonData("", 'repairPersonsDivSR', false, true,"SR");
  
});

$(document).on('click', '#rPersonPopupInputSR1', function (e) {
 
  $('.divoverlay').show();
  $('.repairPersonsMainDivSR1').removeClass('hide');
  filterRepairPersonData("", 'repairPersonsDivSR1', false, false,"SR1");
  $('#repairPersoninputSR1').val($(this).text());

});



$(document).on('click', '.repPersonDDCR', function (e) {
  $(this).parent().parent().parent().find('label[valcode=""]').text($(this).attr('personName')).attr('repairPersonID', $(this).attr('data'));
  $('.divoverlay').hide();
  $(this).parent().parent().find('.repairPersoninput').val($(this).attr('personName')).attr('repairPersonID', $(this).attr('data'));
  $('.repairPersonsMainDiv').addClass('hide');
  // $('.repairPersonsMainDivSR1').addClass('hide');
  // $('.repairPersonsMainDivSR').addClass('hide');
  if(localStorage.getItem('repairCodes') == null){
    getRepairCodes();
    //$('.txtPC').trigger('blur');
    $('.inpQty').val($('.txtPC').val());
    $('.inpQty').attr('max', $('.txtPC').val()).attr('maxlength', $('.txtPC').val().length);
    $('.txtPC').attr('tempval', $('.txtPC').val());
  }
  
});

$(document).on('click', '.repPersonDDSR1', function (e) {
  $(this).parent().parent().parent().find('label[valcode=""]').text($(this).attr('personName')).attr('repairPersonID', $(this).attr('data'));
  $('.divoverlay').hide();
  $(this).parent().parent().find('.repairPersoninput').val($(this).attr('personName')).attr('repairPersonID', $(this).attr('data'));
  // $('.repairPersonsMainDiv').addClass('hide');
  $('.repairPersonsMainDivSR1').addClass('hide');
  // $('.repairPersonsMainDivSR').addClass('hide');
  //getRepairCodes();
  //$('.txtPC').trigger('blur');
  if (localStorage.getItem("editableSKU") == "true"){
    if(localStorage.getItem('repairCodes') == null){
      getRepairCodes();
        $('.txtPCSR').trigger('blur');
        $('.inpQty').val($('.txtPCSR').val());
        $('.inpQty').attr('max', $('.txtPCSR').val()).attr('maxlength', $('.txtPCSR').val().length);
        $('.txtPCSR').attr('tempval', $('.txtPCSR').val());
    }
  }

});

$(document).on('click', '.repPersonDD', function (e) {
  $(this).parent().parent().parent().find('label[valcode=""]').text($(this).attr('personName')).attr('repairPersonID', $(this).attr('data'));
  $('.divoverlay').hide();
  $(this).parent().parent().find('.repairPersoninput').val($(this).attr('personName')).attr('repairPersonID', $(this).attr('data'));
  // $('.repairPersonsMainDiv').addClass('hide');
  // $('.repairPersonsMainDivSR1').addClass('hide');
  $('.repairPersonsMainDivSR').addClass('hide');
  //getRepairCodes();
  //$('.txtPC').trigger('blur');
});


//CR
$(document).on('keyup', '#repairPersoninput', function () {
  filterRepairPersonData($(this).val(), 'repairPersonsDivCR', true, false,"CR");
});
//sR
$(document).on('keyup', '#repairPersoninputSR', function () {
  filterRepairPersonData($(this).val(), 'repairPersonsDivSR', true, false,"SR");
});
//SR1
$(document).on('keyup', '#repairPersoninputSR1', function () {
  filterRepairPersonData($(this).val(), 'repairPersonsDivSR1', true, false,"SR1");
});

$(document).not("#repairPersoninp").click(function () {
  var elem = $(this).parent().find('div').attr('id');
  $('#' + elem).hide();
});


function openRepairPersons() {

}

function filterRepairPersonData(param, selector, isFilter, selectOption,from) {
  
  var repairPerso = $('#' + selector);
  //.find('#repairPersonsDiv');
  // $('#repairPersonsDiv');
  repairPerso.html('');
  if (localStorage.getItem('repairPersons') == "") {
    getRepairPersons();
  }
  var repairPersons = JSON.parse(localStorage.getItem('repairPersons'));
  var options = "";
  var forScree= "";
  if (from.toLowerCase() == "cr"){
    if (selectOption) {
      options = "<div data='0' class='col-12 col-m-12 repPersonDDCR' personName='Select Repair Person'>Select Repair Person</div>";
    }
  
    //var optionsinp ="";
    var divCount = 0;
    if (isFilter) {
      var results = repairPersons.filter(function (element) {
        return element.name.toLowerCase().indexOf(param.toLowerCase()) !== -1;
      });
  
      if (results.length == 0) {
        options = "<div data='007700' class='col-12 col-m-12'>No matches..</div>";
      } else {
        $.each(results, function (k, v) {
          options += "<div data=" + v.id + " class='col-12 col-m-12 repPersonDDCR' personName='" + v.name + "'>" + v.name + "</div>";
          divCount += 1;
        });
      }
    } else {
  
      $.each(repairPersons, function (k, v) {
        options += "<div data=" + v.id + " class='col-12 col-m-12 repPersonDDCR' personName='" + v.name + "'>" + v.name + "</div>";
      });
    }
  }else if (from.toLowerCase() == "sr1"){
    if (selectOption) {
      options = "<div data='0' class='col-12 col-m-12 repPersonDDSR1' personName='Select Repair Person'>Select Repair Person</div>";
    }
  
    //var optionsinp ="";
    var divCount = 0;
    if (isFilter) {
      var results = repairPersons.filter(function (element) {
        return element.name.toLowerCase().indexOf(param.toLowerCase()) !== -1;
      });
  
      if (results.length == 0) {
        options = "<div data='007700' class='col-12 col-m-12'>No matches..</div>";
      } else {
        $.each(results, function (k, v) {
          options += "<div data=" + v.id + " class='col-12 col-m-12 repPersonDDSR1' personName='" + v.name + "'>" + v.name + "</div>";
          divCount += 1;
        });
      }
    } else {
  
      $.each(repairPersons, function (k, v) {
        options += "<div data=" + v.id + " class='col-12 col-m-12 repPersonDDSR1' personName='" + v.name + "'>" + v.name + "</div>";
      });
    }
  }else{
    if (selectOption) {
      options = "<div data='0' class='col-12 col-m-12 repPersonDD' personName='Select Repair Person'>Select Repair Person</div>";
    }
  
    //var optionsinp ="";
    var divCount = 0;
    if (isFilter) {
      var results = repairPersons.filter(function (element) {
        return element.name.toLowerCase().indexOf(param.toLowerCase()) !== -1;
      });
  
      if (results.length == 0) {
        options = "<div data='007700' class='col-12 col-m-12'>No matches..</div>";
      } else {
        $.each(results, function (k, v) {
          options += "<div data=" + v.id + " class='col-12 col-m-12 repPersonDD ' personName='" + v.name + "'>" + v.name + "</div>";
          divCount += 1;
        });
      }
    } else {
  
      $.each(repairPersons, function (k, v) {
        options += "<div data=" + v.id + " class='col-12 col-m-12 repPersonDD ' personName='" + v.name + "'>" + v.name + "</div>";
      });
    }
  }
 
  repairPerso.append(options);
}


// Added for status dropdown option:START
$(document).on('click', '.status-select-box', function (e) {
  // if ($('.status-select-box').hasClass('bshadowOut')) {
  //   $('.status-select-box').removeClass('bshadowOut');
  //   $('.status-select-box').addClass('bshadowIn');
  // }
  if ($('.statusMianDiv').hasClass('hide')) {
    $('.statusMianDiv').removeClass('hide');
  }
  $('.divoverlayNew').show();
});

$(document).on('click touchstart', '.statusOptions', function (e) {
  //
  // $("header").append(e.type)
  // console.log($(this)[0]);
  //  if($('.status-select-box').hasClass('bshadowIn'))
  //   {
  //     $('.status-select-box').removeClass('bshadowIn');
  //     $('.status-select-box').addClass('bshadowOut');
  //   }
  $(this).parent().parent().parent().find('.status-select-box').text($(this).attr('statusInfo'));
  $(this).parent().parent().parent().find('.status-select-box').attr('valcode', $(this).attr('value'));
  setTimeout(() => {
    $('.divoverlayNew').hide();
    $('.statusMianDiv').addClass('hide');
  }, 600);
  e.stopPropagation();

});

// Added for status dropdown option:END