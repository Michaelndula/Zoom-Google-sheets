function test(){
    const request_types = {
     ONLINE: 'online',
     APOLOGY: 'apology',
     PROXY: 'proxy',
     PHYSICALLY: 'physically'
   }
   
   attending_value = "Yes,  I'll will join online";
   var member_attendance = null;
   
   for(var request_type in request_types){
     //Logger.log(request_type);
     var type = request_types[request_type];
     //Logger.log(type);
     if(attending_value.toLowerCase().includes(type)){
       member_attendance = type;
       break;
     }
   }
   
   Logger.log(member_attendance);
 }
 
 function onFormSubmit(e) {
  const request_types = {
    PHYSICALLY: 'physically',
    ONLINE: 'online',
    APOLOGY: 'apology'
  }
  
  var values = e.namedValues;
  Logger.log(values);
  Logger.log(values["How do you plan to participate?"][0]);
        
  var attending_value = values["How do you plan to participate?"][0];
  
  var fullName = values["Full Name"].toString();
  var phoneNumber = values["Cell Phone Number"][0].toString();
  var emailAddress = values["Email Address"].toString().trim();
  emailAddress = emailAddress.toString().replace(",", "");
  
  var member_attendance = null;
  
  for (var request_type in request_types) {
    var type = request_types[request_type];
    if (attending_value.toLowerCase().includes(type)) {
      member_attendance = type;
      break;
    }
  }  
  
  Logger.log(member_attendance);
  
  if (member_attendance != null) {
    switch (member_attendance) {
      case request_types.ONLINE:
        // Register on Zoom
        let lastName = "Member";
        var names = fullName.split(" ");
        if (names.length >= 2) {
          lastName = names[1];
          if (typeof names[2] !== 'undefined') {
            lastName = names[1] + ' ' + names[2];
          }
        }
        
        // Get Zoom link, meeting ID, and passcode
        var { zoomLink, meetingId, passcode } = getZoomDetails();

        // Send email with Zoom details
        sendZoomDetails(emailAddress, zoomLink, meetingId, passcode);

        break;
      case request_types.APOLOGY:
        // Apology
        GmailApp.sendEmail(emailAddress, "Member's Day 2023", "Thank you for your response. Your apology has been duly noted.");
        break;
      case request_types.PROXY:
        // Send proxy data
        sendProxyDetails(fullName, emailAddress, phoneNumber);
        break;
      case request_types.PHYSICALLY:
        // Allocate seat and send email
        // allocateSeat(fullName, emailAddress, values);
        sendConfirmationEmail(fullName, emailAddress);
        break;
      default:
        break;
    }
  }  
}
 
 function sendConfirmationEmail(fullName, emailAddress){    
     var htmlBody = "<h2>Confirmation for attending the Member's Day on Saturday, 25th November 2023</h2>"+
       "<p>Venue: Sarit Center</p>"+
        "<p>Time: 9:00 A.M. - 11:00 A.M</p>"+
        "<p></p>"+
        "<p>Hi "+ fullName +",</p>"+
        "<p>Thank you for registering to physically attend the SGM. You will be allocated a seat on arrival.</p>";
     
     var options = {
       htmlBody: htmlBody
     };
     
     Logger.log(emailAddress);
     if(emailAddress !== undefined){
       GmailApp.sendEmail(emailAddress, "Member's Day", "", options);
     }
     //Admin Email
     //GmailApp.sendEmail("michaelndula@gmail.com", "Michael's App", "", options);
 }
 
 function disableForm(){
   var form = FormApp.openByUrl( SpreadsheetApp.getActiveSpreadsheet().getFormUrl() );
   form.setAcceptingResponses(false);
 }
 
 function sendProxyDetails(fullName, emailAddress, phoneNumber){
     var ss = SpreadsheetApp.getActive();
     var sheet = ss.getSheets()[0];
   
     var nominatedOfficial = "Chairman of the Court";
     var question1 = sheet.getRange("H" + sheet.getLastRow()).getValue();
 
     var htmlBody = `<table border="1" cellpadding="10" cellspacing="0">
         <thead>
             <tr>
                 <th colspan="5">SGM 2022 PROXY FORM</th>
             </tr>
         </thead>
         <tbody>
             <tr>
                 <td colspan="2">Nominated Official</td>
                 <td colspan="3">${nominatedOfficial}</td>
             </tr>
             <tr>
                 <td colspan="5">I nominate the official above to be my proxy. </td>
             </tr>
             <tr>
                 <td colspan="2">Signature</td>
                 <td colspan="3"></td>
             </tr>
             <thead>
                 <tr>
                     <td colspan="2">Question</td>
                     <td ><b>Response</b></td>
                 </tr>
             </thead>
             
             <tr>
                 <td colspan="2">
                     Do you agree with the ratification of the 2019 amended constitution
                 </td>
                 <td>${question1}</td>
             </tr>
         </tbody>
     </table>`;
     
     //Proxy Email
     var options = {
       htmlBody: htmlBody
     }; 
       GmailApp.sendEmail("michaelndula@gmail.com", "SGM 2022 Proxy form", "", options);
     
     var personTable = `
     <table border="1" cellpadding="10" cellspacing="0">
         <thead>
             <tr>
                 <th colspan="5">SGM 2022 PROXY FORM</th>
             </tr>
         </thead>
         
         <tbody>
             <tr>
                 <td colspan="2">Member's Name</td>
                 <td colspan="3">${fullName}</td>
             </tr>
             <tr>
                 <td colspan="2">Member's Email</td>
                 <td colspan="3">${emailAddress}</td>
             </tr>
             <tr>
                 <td colspan="2">Member's Phone Number</td>
                 <td colspan="3">${phoneNumber}</td>
             </tr>
         </tbody>
     </table>`;
     
     //Member confirmation email
     var intro = "<p>Hi "+ fullName +",</p>"+
               "<p>The filled in form below has been forwarded to the admin. Kindly verify the validity and contact the administration in the case of any issues.</p>";
     
     Logger.log(emailAddress);
     if(emailAddress !== undefined){
       var options = {
         htmlBody: personTable + intro + htmlBody
       }; 
       GmailApp.sendEmail(emailAddress, "SGM 2022 Proxy form", "", options);
     }
   
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
 
 
 function countAllocatedSeats() {
   var ss = SpreadsheetApp.getActive();
   var sheet = ss.getSheets()[0];
   var lr = sheet.getLastRow();
   var countTotal = 0;
   var canyouattend = sheet.getRange("E2:E" + lr).getValues();
   
   for (var i=0; i < canyouattend.length; i++) {
     if(canyouattend[i][0].includes("physically")){
         //Logger.log(canyouattend[i][0]);
         countTotal++;
     }
   }
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
 

function getZoomDetails() {
  // Replace these with your actual Zoom details
  var zoomLink = "https://zoom.us/j/your_meeting_id";
  var meetingId = "your_meeting_id";
  var passcode = "your_meeting_passcode";

  return { zoomLink, meetingId, passcode };
}

function sendZoomDetails(emailAddress, zoomLink, meetingId, passcode) {
  var htmlBody = "<h2>Zoom Meeting Details</h2>" +
    "<p>Zoom Link: <a href='" + zoomLink + "'>" + zoomLink + "</a></p>" +
    "<p>Meeting ID: " + meetingId + "</p>" +
    "<p>Passcode: " + passcode + "</p>" +
    "<p>Hi " + fullName + ",</p>" +
    "<p>Thank you for registering to join the event online. Here are your Zoom meeting details:</p>" +
    "<p>Make sure to use the provided meeting ID and passcode to join the meeting.</p>";

  var options = {
    htmlBody: htmlBody
  };

  Logger.log(emailAddress);
  if (emailAddress !== undefined) {
    GmailApp.sendEmail(emailAddress, "Zoom Meeting Details", "", options);
  }
  // Admin Email
  // GmailApp.sendEmail("michaelndula@gmail.com", "Event NAme", "", options);
}
 