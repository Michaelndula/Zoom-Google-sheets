# Zoom-Google-sheets

Automate tasks in Google Workspace (formerly G Suite) applications like Google Sheets, Google Forms, and Gmail. 

Let's break down the main functions in this script:


1. **`test()` function:**
   * Defines an object `request_types` with different request types.
   * Sets a variable `attending_value` to a specific string.
   * Loops through `request_types` and checks if the `attending_value` contains any of the request types in a case-insensitive manner.
   * Logs the matching request type.
2. **`onFormSubmit(e)` function:**
   * Triggered when a Google Form linked to a Google Sheet is submitted.
   * Retrieves form responses from the `e` event object.
   * Processes the responses, extracts information like full name, phone number, email address, and the selected method of attendance.
   * Determines the type of attendance based on the selected option (online, apology, proxy, physically).
   * Performs different actions based on the type of attendance, such as sending confirmation emails, registering for Zoom, handling apologies, and managing proxy details.
3. **`sendConfirmationEmail(fullName, emailAddress)` function:**
   * Sends a confirmation email for physical attendance, providing details about the event.
4. **`sendProxyDetails(fullName, emailAddress, phoneNumber)` function:**
   * Sends emails related to proxy attendance, both to the admin and the member submitting the proxy.
5. **`disableForm()` function:**
   * Disables the Google Form from accepting more responses.
6. **`zoomRegistration(firstName, lastName, email, phoneNumber)` function:**
   * Registers a Zoom participant for a specific meeting using the Zoom API.
7. **Various utility functions (`getNextDate()`, `countResponses()`, `countAllocatedSeats()`, `reverseObject()`, `countResponsesWeek()`)**
   * These functions serves various purposes, such as getting the next date, counting responses, counting allocated seats, reversing an object, and checking responses within a week.

This script helps to manage a registration system for an event, handling different modes of attendance, sending confirmation emails, managing proxy details, and integrating with Zoom for online participation.
