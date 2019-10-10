var easyimg = require('easyimage');
easyimg.rescrop({
     src:'..\\TempImages\\Resized\\e0ca7c8a-afb7-4974-8241-54ddf757a29e\\Repair#_2017_6_22_11_31_3.jpg', dst:'..\\TempImages\\Resized\\e0ca7c8a-afb7-4974-8241-54ddf757a29e\\Repair#_2017_6_22_11_31_3.jpg',
     width:500, height:500,
     x:0, y:0
  }).then(
  function(image) {
     
  },
  function (err) {
    console.log(err);
  }
);
