(function() {
  var app = angular.module('chatbot',[]);
  app.controller('chatbotCtrl',['$scope','$http','$filter', function($scope,$http,$filter) {

  	$scope.init = function(){
  		$scope.chatToggle('close');
  		$scope.userId = guid();
	    $scope.rootUrlBot = 'http://chatbot.kreara.net:8001/RE_bot/Response';
	    $scope.messageList = [];
      $scope.realEstatesDataSeller = {};
      $scope.realEstatesDataBuyer = [];
      $scope.sellerChatActive = false;
	    $scope.resetChatBot();
  	};

    $scope.chatToggle = function(state){
    	if($scope.messageList && $scope.messageList.length>1){
    		$scope.resetChatBot();
    	}
      if(state === 'open'){
        $scope.showChatBot = true;
      }else{
        $scope.showChatBot = false;
      };
    };

  	/* Reset chatBot */
  	$scope.resetChatBot = function(){
  	$scope.userId = guid();
    var data = {
      "messageSource" : "userInitiatedReset",
      "messageText"   : ""
    };
    $scope.messageList = [];
    $scope.realEstatesDataBuyer = [];
    $scope.realEstatesDataSeller = {};
    $scope.sellerChatActive = false;
    $scope.autofill = {};
    $scope.autofillHide = false;

    $http({
      method: 'POST',
      url: $scope.rootUrlBot,
      data : data

    }).then(function successCallback(response) {
      if(response && response.data && response.data.messageText && response.data.messageSource){
        response.data.messageTime = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        $scope.messageList.push(response.data);
        $scope.messageText = null;
      }else{
        $scope.messageList = [];
      }
      
    }, function errorCallback(response) {
      $scope.messageList = [];
    });
  };

    /* create uuid */
		function guid() {
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
		}

		function s4() {
		  return Math.floor((1 + Math.random()) * 0x10000)
		    .toString(16)
		    .substring(1);
		}

    $scope.sendMessage = function(event){
      if(event && event.keyCode === 13){
        event.preventDefault();
        $scope.realEstatesDataBuyer = [];
        $scope.realEstatesDataSeller = {};
        $scope.sendMessageToBot();
      }else if(event && event.keyCode && (event.keyCode === 40 || event.keyCode === 38) && $scope.autofill && $scope.autofill.data && $scope.messageText){
        event.preventDefault();

        var limit = 8;
        var autofillArray = $filter('autofill')($scope.autofill.data,$scope.messageText);

        // limit filter result to limited value
        if(autofillArray && autofillArray.slice(0,limit)){
          autofillArray = autofillArray.slice(0,limit);
        }

        if(event.keyCode === 40 && autofillArray.length > $scope.autofillActive+1){
          $scope.autofillActive++;
        }else if(event.keyCode === 38 && $scope.autofillActive > 0){
          $scope.autofillActive--;
        }



        console.log(autofillArray);
      }
    };

    $scope.sendMessageToBot = function(){

      if($scope.messageText){

        // autofill filter
        if($scope.autofill && $scope.autofill.data){
          var autofillArray = $filter('autofill')($scope.autofill.data,$scope.messageText);
          if(autofillArray && autofillArray[$scope.autofillActive]){
            $scope.messageText = autofillArray[$scope.autofillActive];
          }else{
            $scope.messageFromBot(['Unfortunately, we could not find the '+ $scope.autofill.type +' you are searching for!',' Please try another one.'],null);
            $scope.autofillHide = true;
            return;
          };
        };


        var data = {};

        if($scope.sellerChatActive){
          data = {
            "messageSource" : "sellerFlag",
            "messageText"   : $scope.messageText,
            "user_id"       : $scope.userId
          };
        }else{
          data = {
            "messageSource" : "messageFromUser",
            "messageText"   : $scope.messageText,
            "user_id"       : $scope.userId
          };
        }

        $scope.messageFromUser();

        $http({
          method: 'POST',
          url: $scope.rootUrlBot,
          data : data

        }).then(function successCallback(response) {
          if(response && response.data){

            console.log(response.data);

            // plugin
            if(response.data.plugin){

              // plugin for autofill
              if(response.data.plugin.name && response.data.plugin.name === "autofill"){
                $scope.autofill = response.data.plugin;
              }
            }

            if(response.data.messageText){
              $scope.messageFromBot(response.data.messageText, response.data.link);
            }
            if(response.data.messageSource && response.data.messageSource === 'sellerFlag'){
              $scope.sellerChatActive = true;
            }else{
              $scope.sellerChatActive = false;
            }

            /* result of buyer */
            if(response && response.data && response.data.ResultBuyer){
              $scope.realEstatesDataBuyer = response.data.ResultBuyer;
            }

            /* result of seller */
            if(response && response.data && response.data.ResultSeller){
              $scope.realEstatesDataSeller = response.data.ResultSeller;
            }
            
          }
          
        }, function errorCallback(response) {
          $scope.showMsgLoader = false;
        });
      };
    };

    /*messenger - from user*/
    $scope.messageFromUser = function(){
      $scope.showChatBot = true;
      $scope.messageList.push({
        'messageSource':'messageFromUser',
        'messageText': $scope.messageText,
        'messageTime': new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
      });

      // clear autofill after message is send
      if($scope.autofill){
        $scope.autofill = {};
      }
      
      $scope.messageText = '';
      $scope.showMsgLoader = true;
      $(".chatWrapper").animate({scrollTop: $(".chatScroller").height()}, 500);
    };


    /*messenger - from bot*/
    $scope.messageFromBot = function(message, link){
      $scope.showChatBot = true;
      setTimeout(function() {
        $scope.$apply(function () {
          $scope.showMsgLoader = false;
          message.forEach(function(d){
            $scope.messageList.push({
              'messageSource':'messageFromBot',
              'messageText': d,
              'link': link,
              'messageTime': new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
            });
          });
          
          $(".chatWrapper").animate({scrollTop: $(".chatScroller").height()}, 500);
          document.querySelector('#messageText').focus();
        });
      }, 100);
    };


    // autofill option clicked
    $scope.autofillSelect = function(item){
      $scope.messageText = item;
      $scope.autofillHide = true;
      document.querySelector('#messageText').focus();
    };

    /* Change text in MessageText */
    $scope.changeMessageText = function(){
      $scope.autofillHide = false;

      // reset autofill active
      if($scope.autofill && $scope.autofill.data){
        $scope.autofillActive = 0;
      }
    };

    $scope.startDictation = function() {

      if (window.hasOwnProperty('webkitSpeechRecognition')) {

        var recognition = new webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = function(e) {
          console.log(e.results[0][0].transcript);

        $scope.$apply(function () {
          $scope.messageText = e.results[0][0].transcript;
        });
             
          recognition.stop();
          $scope.startDictation();
          //document.getElementById('labnol').submit();
        };

        recognition.onerror = function(e) {
          recognition.stop();
          $scope.startDictation();
        }

      }
    }


  }]);

  /* Auto fill filter*/
  app.filter('autofill', function() {
    return function( items, input) {
      var filtered = [];
    
      if(input === undefined || input === ''){
         console.log( items);
        return items;
      }
   
      angular.forEach(items, function(item) {
        
        if(item.toLowerCase().indexOf(input.toLowerCase()) === 0){
          filtered.push(item);
        }
      });
      return filtered;
    };
  });



})();