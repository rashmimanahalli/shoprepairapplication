  $(document).on('click touchstart', '.btnImageCapture', function () {
      addFilesToUpload();
  });

  //START--Image remove option
  $(document).on('click touch', '.imgRemoveOption', function (event) {
    
      var rowObject = $(this).parent().parent();
      var imgFileName = $(rowObject).find('.pad5').find('label').attr('data-name');
      filesData = filesData.filter(function( obj ) {
        return obj.name !== imgFileName;
      });
      localStorage.removeItem("filesData");
      localStorage.setItem("filesData", filesData);
     
      var sRow = $(this).attr('data-hame');
      //$(rowObject).remove();
     
      $('.imgcptbody').find('.' + sRow).remove();
      localStorage.removeItem('imagesCapturedDiv');
      localStorage.setItem('imagesCapturedDiv', $('.imgcptbody').html());
      showInfoDialog("Image is successfully Removed");
      setTimeout(function () {
          $('.modalWindow').css('display', 'none');
          $('.divoverlay').hide();
      }, 2000)
    //   filesData = $.grep(filesData, function (e) {
    //       return e.fileName != imgFileName;
    //   });
     
    //   if (filesData.length == 0) {
    //       $('.btnUpload').attr('disabled', 'disabled');
    //   }
  });
  //END-Image remove option




  $(document).on('click', '.btnUpload', function () {
      
     $('.btnBack').attr('disabled', true);
	 $('.btnUpload').attr('disabled', true);
     updateRepairData($("#crsrsr1").attr('current').toLowerCase());
  });