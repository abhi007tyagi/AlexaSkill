var APP_ID = 'amzn1.ask.skill.2ccb6d3f-2423-4444-8e4e-73b1aed32584';
var http = require('http');
/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * URL prefix to download history content from Wikipedia
 */
 //http://d597aed7.ngrok.io/query
var url = '0a08edcb.ngrok.io';

var cardTitle = 'MyRpiSkill';

var MyRpiSkill = function () {
    AlexaSkill.call(this, APP_ID);
};


// Extend AlexaSkill
MyRpiSkill.prototype = Object.create(AlexaSkill.prototype);
MyRpiSkill.prototype.constructor = MyRpiSkill;

MyRpiSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("MyRpiSkill onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

MyRpiSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MyRpiSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Abhinav's Raspberry Pi Skills. How may I help you?";
    var repromptText = "Please let me know, how may I help you?";
    response.ask(speechOutput, repromptText);    
};

MyRpiSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MyRpiSkill onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};


MyRpiSkill.prototype.intentHandlers = {
    "AskQuestionIntent": function (intent, session, response) {

      	var questionSlot = intent.slots.question;
      	var query = questionSlot.value;
      	var reply = '';
      	if (questionSlot && query) {

      		doGetRequest(encodeURI("http://"+url+"/?query="+query), function(resp){
              reply = resp.replace(/<(?:.|\n)*?>/gm, '');
            // console.log("POST DATA-->"+postData);
              var repromptText = "Please let me know, how may I help you?";
              response.askWithCard(reply, repromptText, cardTitle, reply);
            });
      // 		var dataQuery = '{"query":"'+query+'"}';
	    	// doPostRequest(url,"/query", dataQuery, function(resp){
      //         reply = resp.replace(/<(?:.|\n)*?>/gm, '');
      //       // console.log("POST DATA-->"+postData);
      //         var repromptText = "Please let me know, how may I help you?";
      //         response.askWithCard(reply, repromptText, cardTitle, reply);
      //       });
  		} else {
  			var speechText = "There was some error! Captured query is "+query;
  			var repromptText = speechText;
  			response.askWithCard(repromptText, repromptText, cardTitle, repromptText);
  		}
    },
    "ContinueIntent": function(intent, session, response) {
    	var choiceSlot = intent.slots.choice;
      	var speechOutput = "How may I help you?";
	  	var repromptText = "Please let me know, how may I help you?";
	  	if (choiceSlot && (choiceSlot.value == 'yes' || choiceSlot.value == 'yeah' || choiceSlot.value == 'ha' || choiceSlot.value == 'ok' || choiceSlot.value == 'yup')) {
	    	response.askWithCard(speechOutput, repromptText, cardTitle, speechOutput);
      	}else if (choiceSlot && (choiceSlot.value == 'no' || choiceSlot.value == 'na' || choiceSlot.value == 'naah' || choiceSlot.value == 'nahi')) {
          	response.tellWithCard("Thanks you! have a nice day.", cardTitle, "Thanks you! have a nice day.");
      	} else {
          	response.askWithCard("Please select a correct option. Say yes or no!!","Please select a correct option. Say yes or no!!",cardTitle, "Please select a correct option. Say yes or no!!");
      	}
    },
    "AMAZON.StopIntent": function (intent, session, response) {
      	var speechOutput = "Do you want to continue with Abhinav's Raspberry Pi Skills? Say yes or no!";
      	var repromptText = "Please let me know, do you want to continue with Abhinav's Raspberry Pi Skills? Say yes or no!";
      	response.askWithCard(speechOutput, repromptText,cardTitle , speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
      	var speechOutput = "Do you want to continue with Abhinav's Raspberry Pi Skills? Say yes or no!";
      	var repromptText = "Please let me know, do you want to continue with Abhinav's Raspberry Pi Skills? Say yes or no!";
      	response.askWithCard(speechOutput, repromptText,cardTitle , speechOutput);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MyRpiSkill skill.
    var myRpiSkill = new MyRpiSkill();
    myRpiSkill.execute(event, context);
};

function doGetRequest(url, eventCallback){

    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            eventCallback(body);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        eventCallback(" Facing issue communicating with server! "+e);
    });

}

function doPostRequest(url, urlPath, payload, eventCallback) {

    var options = {
      host : url,
      port : 80,
      path : urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      }
   };

   callback = function(response) {

      var str = '';

      response.on('data', function (chunk) {
         str += chunk;
      });

      response.on('end', function () {
        console.log(str);
        eventCallback(str);
      });
   };

    var req = http.request(options, callback).on('error', function (e) {
        console.log("Got error: ", e);
        eventCallback(" Facing issue communicating with server! "+e);
    });
    req.write(payload);
    req.end();
}


