function myFunction() {
  
}
function onFormSubmit(e) {
  //var values = e.source;
  
  var lastSeat = 100;
  var attendanceLimit = 42;
  var seatsFrom = 16;
  var responseCount = countResponses();
  var nextSeat = seatsFrom + responseCount - 1;
  
  var values = e.namedValues;
  
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheets()[0];
  var lr = sheet.getLastRow();
  sheet.getRange("M" + sheet.getLastRow()).setValue(nextSeat);
  //sheet.getRange(sheet.getLastRow(), values.length).setValue(nextSeat);
  
  var emailAddress = values["Email Address"];
  emailAddress = emailAddress.toString().replace(",", "");
  
  //if(responseCount <= attendanceLimit){
  if(nextSeat <= lastSeat){
    //There is space
    
    values = reverseObject(values);
    //Logger.log(values);
    
    
    var fullName = values["Full Name"];
    var htmlBody = "<h2>Confirmation for attending the Event Title on date  "+ getNextDate().toLocaleDateString("en-GB") +"</h2>"+
      "<p>Hi "+ fullName +",</p>"+
        "<p>Here are the details you filled in. Kindly take note of your seat number.</p>";
    htmlBody += '<ul>';
    for (Key in values) {
      var label = Key;
      var data = values[Key];
      htmlBody += '<li>' + label + ": " + data + '</li>';
    };
    htmlBody += '<li><h2>' + 'Seat Number' + ": " + nextSeat + '</h2></li>';
    htmlBody += '</ul>';
    
    var options = {
      htmlBody: htmlBody
    };
    
    Logger.log(emailAddress);
    if(emailAddress !== undefined){
      GmailApp.sendEmail(emailAddress, "Event Title", "", options);
    }
    //Admin Email
    //GmailApp.sendEmail("michaelndula@gmail.com", "Event Title", "", options);
    
    //if(responseCount == attendanceLimit){
    if(nextSeat == lastSeat){
      //Last Seat
      disableForm();     
    }
  }else{
    //No space
    disableForm();
    //TODO: Send decline email
    GmailApp.sendEmail(emailAddress, "Event Title", "Hello, we have reached the maximum number of people for this Event. Kindly plan to view the event live on Youtube. ");
  }
}

function disableForm(){
  var form = FormApp.openByUrl( SpreadsheetApp.getActiveSpreadsheet().getFormUrl() );
  form.setAcceptingResponses(false);
}

function getNextDate(){
  var x = 7;
  var now = new Date();    
  now.setDate(now.getDate() + (x+(7-now.getDay())) % 7);
  return now;
}


function countResponses() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheets()[0];
  var lr = sheet.getLastRow();
  var timestamps = sheet.getRange("A2:A" + lr).getValues();
  var countTotal = timestamps.length;
  Logger.log(countTotal);
  return countTotal;
}

function reverseObject(object) {
  var newObject = {};
  var keys = [];
  
  for (var key in object) {
    keys.push(key);
  }
  
  for (var i = keys.length - 1; i >= 0; i--) {
    var value = object[keys[i]];
    newObject[keys[i]]= value;
  }       
  
  return newObject;
}


function countResponsesWeek() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheets()[0];
  var lr = sheet.getLastRow();
  var timestamps = sheet.getRange("A2:A" + lr).getValues();
  var countTotal = timestamps.length;
  var thisweek = 0;
  var weekAgo = new Date() - (7 * 24 * 60 * 60 * 1000);
  for (var i=0; i < countTotal; i++) {
    if (timestamps[i][0].getTime() > weekAgo) {
      thisweek++;
    }
  }
//  GmailApp.sendEmail("michaelndula@gmail.com", "Response Update", "You have " + countTotal + " total responses and " + thisweek + " new responses this week.");
}
