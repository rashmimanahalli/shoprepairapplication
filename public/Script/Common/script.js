var configData = ''
var getRepairPersons = function () {

  if (localStorage.getItem('repairPersons') == null) {


    var options = "<span data='0'>Select</span>";
    var data = JSON.stringify({
      locale: localStorage.getItem('locale'),
      location: localStorage.getItem("location")
    });
    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetRepairPersons',
      contentType: 'application/json',
      data: data,
      async: true,
      success: function (dataOP) {
        if (dataOP.statusCode == 200) {
          localStorage.setItem('repairPersons', JSON.stringify(dataOP.body));
        } else {
          showDialog("Repair Persons Web Service Error. Please contact application support team.")
        }
      },
      error: function (xhr, textStatus, error) {
        //showDialog("Repair Persons Web Service Error. Please contact application support team.")
      }
    });
  }
}

var getStatusData = function () {
  if (localStorage.getItem('shoprepairStatus') == null) {

    var data = JSON.stringify({
      file: localStorage.getItem("FILE"),
      type: "SHOPREPAIRSTATUS",
      locale: localStorage.getItem("locale")
    });
    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetControlData',
      contentType: 'application/json',
      data: data,
      async: false,
      success: function (configData) {
        if (configData.statusCode == 200) {
          localStorage.setItem('shoprepairStatus', JSON.stringify(configData.body));
          // var statusData = $('.' + selector);
          // $.each(configData.body, function (k, v) {
          //   options += "<div class='statusOptions' value=" + v.value + " statusInfo='" + v.shortDesc + "-" + v.longDesc + "'>" + v.shortDesc + "-" + v.longDesc + "</div>";
          // });
          // statusData.html('');
          // statusData.html(options);
        } else {
          showDialog("Get Control Data Web Service Error. Please contact application support team.")
        }

      },
      error: function (xhr, textStatus, error) {}
    });
  }
}

var generateStatusData = function (selector) {
  var options = "<div class='statusOptions' value='0' statusInfo='Select'>Select</div>";
  var configData = localStorage.getItem("shoprepairStatus");
  var statusData = $('.' + selector);
  $.each(JSON.parse(configData), function (k, v) {
    //console.log(JSON.parse(v));
    console.log(v.value);
    console.log(v);
    options += "<div class='statusOptions' value=" + v.value + " statusInfo='" + v.shortDesc + "-" + v.longDesc + "'>" + v.shortDesc + "-" + v.longDesc + "</div>";
  });
  statusData.html('');
  statusData.html(options);

}



var GetCancelReasons = function (selector) {
  var options = "";
  var data = JSON.stringify({
    file: localStorage.getItem("FILE"),
    type: "SHOPREPAIRCANCELRSN",
    locale: localStorage.getItem("locale")
  });
  $.ajax({
    type: "POST",
    url: nodeServerURL + '/GetControlData',
    contentType: 'application/json',
    data: data,
    async: false,
    success: function (configData) {
      if (configData.statusCode == 200) {
        var statusData = $('.' + selector);
        $.each(configData.body, function (k, v) {
          options += "<option value=" + v.value + ">" + v.shortDesc + "</option>";
        });
        statusData.html(options);
      } else {
        showDialog("Get Cancel Reasons Web Service Error. Please contact application support team.")
      }
    },
    error: function (xhr, textStatus, error) {}
  });
}


var GetRepairRate = function () {
  if (localStorage.getItem('RepairRateData') == null || localStorage.getItem('RepairRateData') == undefined) {


    var options = "<option value= '0'>Select</option>";
    var data = JSON.stringify({
      file: localStorage.getItem("FILE"),
      type: "SHOPREPAIRRATE",
      locale: localStorage.getItem("locale")
    });
    $.ajax({
      type: "POST",
      url: nodeServerURL + '/GetControlData',
      contentType: 'application/json',
      data: data,
      async: true,
      success: function (configData) {
        if (configData.statusCode == 200) {
          localStorage.setItem('RepairRateData', JSON.stringify(configData.body));
        } else {
          showDialog("Get Repair Rate Web Service Error. Please contact application support team.")
        }
      },
      error: function (xhr, testStatus, error) {}
    });
  }
}

var loaderCall = 0;




var getCurrentFormattedDate = function (date, splitChar) {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return (month < 10 ? '0' : '') + month + splitChar +
    (day < 10 ? '0' : '') + day + splitChar +
    date.getFullYear();
}