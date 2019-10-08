//When the page first loads, 
//the first text field should be in focus by default.
$("#name").focus();
$('#other-title').hide();
$('.activities').append('<div id="total"></div>');
$("#payment").val("Credit Card");
$("#paypal").hide();
$("#bitcoin").hide();
$("#color").after('<span id="colorMessage">Please select a T-shirt theme</span>');
$("#color").hide();

// ”Job Role” section
// On job role change if other show input feild
$("#title").change(function (event) {
    const titleSelect = this.value;
    const otherInput = $("#other-title");
    (titleSelect === 'other') ? $('#other-title').show(): $('#other-title').hide().val('');
});


// ”T-Shirt Info” section
// Until a theme is selected from the “Design” menu, no color options appear in the “Color” drop down and the “Color” field reads “Please select a T-shirt theme”.
$("#design").change(function (event) {
    const themeSelect = this.value;
    const colorInput = $("#color");
    
    $("#colorMessage").hide();
    $("#color").show();

    colorInput.empty();
    switch (themeSelect) {
        case null:
        case "Select Theme":
            $("#colorMessage").show();
            $("#color").hide();
            $("#colorMessage").css("color","red");
            break;
        case "js puns":
            colorInput.append(`<option value="cornflowerblue">Cornflower Blue (JS Puns shirt only)</option>
                <option value="darkslategrey">Dark Slate Grey (JS Puns shirt only)</option> 
                <option value="gold">Gold (JS Puns shirt only)</option>`);
            break;
        case "heart js":
            colorInput.append(`<option value="tomato">Tomato (I &#9829; JS shirt only)</option>
                <option value="steelblue">Steel Blue (I &#9829; JS shirt only)</option> 
                <option value="dimgrey">Dim Grey (I &#9829; JS shirt only)</option>`);
            break;
        default:
            colorInput.append(`<option value="cornflowerblue">Cornflower Blue (JS Puns shirt only)</option>
                <option value="darkslategrey">Dark Slate Grey (JS Puns shirt only)</option> 
                <option value="gold">Gold (JS Puns shirt only)</option> 
                <option value="tomato">Tomato (I &#9829; JS shirt only)</option>
                <option value="steelblue">Steel Blue (I &#9829; JS shirt only)</option> 
                <option value="dimgrey">Dim Grey (I &#9829; JS shirt only)</option>`);
    }

});


function setStatus(workshop, stateToSet) {
    if (stateToSet == "disabled") {
        workshop.prop("checked", false);
        workshop.prop("disabled", true);
        workshop.parent().addClass("disabled");
        workshop.parent().append('<span class="disabled" style="color:red;">Unavailable</span>');
    } else {
        workshop.prop("disabled", false);
        workshop.parent().removeClass("disabled");
        workshop.parent().children('span').remove();
    }
};

$("form input:checkbox").change(function (event) {
    const $events = $(":checkbox");
    const $workshops = $(":checkbox:not([name=all])");  
    const $checkedEvent = event.target;
    const eventName = this.name;
    const eventDateTime = $(this).data("day-and-time");
    console.log(eventDateTime);



    //if something besides all checked, 
    if ((eventName !== "all") && $(this).prop('checked')) {
        showOrHideError(!isValidActivities(),'register' );
        $workshops.each(function () {
            const thisDateTime = $(this).data("day-and-time");
            //disable all, if not disabled already
            if ((this.name === 'all') && (!$(this).parent().hasClass("disabled"))) {
                setStatus($(this), "disabled");
            };

            //check others with same datetime data attribute and disable if required
            if (this.name !== 'all' && (this.name !== eventName) && (thisDateTime === eventDateTime) && (!$(this).parent().hasClass("disabled"))) {
                setStatus($(this), "disabled");;
            };
        });
    };


    //if an item is unchecked, potentially enable new NON conflicts 
    if ((eventName !== "all") && !$(this).prop('checked')) {
        showOrHideError(!isValidActivities(),'register' );
        $workshops.each(function () {
            const thisDateTime = $(this).data("day-and-time");
            if ((this.name !== 'all') && (thisDateTime === eventDateTime)) {
                setStatus($(this), "enabled");
            };
        });
    };

    //if an item is unchecked, potentially enable ALL workshops checkbox
    /**if ((eventName !== "all") && !$(this).prop('checked')) {
        showOrHideError(!isValidActivities(),'register' );
        let allStatus = true;
        let allWorkshops;
        //check all the other items to see if they are checked
        $workshops.each(function () {
            if ((this.name !== 'all') && ($(this).prop('checked'))) {
                allStatus = false;
            };
            if (this.name === 'all') {
                allWorkshops = true;
            }
        });
        //if all clear, enable all workshop checkbox
        if (allStatus) {
            setStatus($(allWorkshops), "enabled");
        }

    };
*/
    //Calculate current cost
    let cost = 0;
    $events.each(function () {
        if ($(this).prop('checked')) {
            cost += Number.parseInt(this.getAttribute("data-cost").replace(/\$/g, ''), 10);
        };
    });

    //Display the total cost for activities
    $("#total").html('<div id="total">Total: $' + cost + '.00</div>');




});
// ”Register for Activities” section
// Some events are at the same day and time as others. If the user selects a workshop, don't allow selection of a workshop at 
//the same day and time -- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
// When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.
// As a user selects activities, a running total should display below the list of checkboxes. For example, 
//if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300.
function togglePayments($paypal, $bitcoin, $creditCard, $active) {
    $paypal.hide();
    $bitcoin.hide();
    $creditCard.hide();
    $active.show();
};

function clearCreditInfo() {
    $("#cc-num").val("");
    $("#zip").val("");
    $("#cvv").val("");
    $('#cvv').off("change");
    $('#cc-num').off("change");
    $('#zip').off("change");
    $('#zipError').hide();
    $('#cvvError').hide();
    $('#cc-numError').hide();
};

//////// "Payment Info" section///////
$("#payment").change(function (event) {
    const paySelect = this.value;
    const $paypal = $("#paypal");
    const $bitcoin = $("#bitcoin");
    const $creditCard = $("#credit-card");

    switch (paySelect) {
        case "Credit Card":
            togglePayments($paypal, $bitcoin, $creditCard, $creditCard);
            $('#cvv').change(createListener(isValidCVV));
            $('#cc-num').change(createListener(isValidCCN));
            $('#zip').change(createListener(isValidZip));
            break;
        case "PayPal":
            togglePayments($paypal, $bitcoin, $creditCard, $paypal);
            clearCreditInfo();
            break;
        case "Bitcoin":
            togglePayments($paypal, $bitcoin, $creditCard, $bitcoin)
            clearCreditInfo();
            break;
        default:
            $paypal.hide();
            $bitcoin.hide();
            $creditCard.hide();
            clearCreditInfo();;

    };

});



// The user should not be able to select the "Select Payment Method" option from the payment select menu, 
//because the user should not be able to submit the form without a chosen payment option.

// Form validation
function addErrorSpans(errorID, errorFor, erorMessage) {
    const $errorLocation = $(errorFor);
    const $errorSpan = $('<span id="' + errorID + 'Error" class="error" data-invalid-message="' + erorMessage + '" style="color:red;display:none;">' + erorMessage + '</span>');
    $errorLocation.after($errorSpan);
    $errorSpan.hide();
}

addErrorSpans('name', "label[for='name']", 'Please enter a valid Name, only enter letters.', );
addErrorSpans('mail', "label[for='mail']", 'Please enter a valid email.');
addErrorSpans('title', "label[for='title']", 'Please select a valid jobe role.');
addErrorSpans('cc-num', "label[for='cc-num']", 'Please enter a valid credit card number.');
addErrorSpans('zip', "label[for='zip']", 'Invalid zip.');
addErrorSpans('cvv', "label[for='cvv']", 'Invalid cvv.');
addErrorSpans('register', "legend:contains('Register for Activities')", 'Please select an activity.');

function setErrorMessage(length, elementId, elementDisplayName){
    if (length <= 0)
    {
        $('#'+ elementId + 'Error').text(elementDisplayName + ' can not be empty.');
    }else{
        $('#'+ elementId + 'Error').text($('#'+ elementId + 'Error').data('invalid-message'));
    }
}

// Can only contain letters a-z in lowercase
function isValidName(name) {
    setErrorMessage(name.length, 'name', 'Name');
    return /^[A-Za-z]+$/.test(name) && name.length > 0;
};

function isValidCCN(ccn) {
    setErrorMessage(ccn.length, 'cc-num', 'Credit Card Number');
    return /^[0-9]{13,16}$/.test(ccn) && ccn.length > 0;
};

function isValidCVV(cvv) {
    setErrorMessage(cvv.length, 'cvv', 'CVV');
    return /^[0-9]{3}$/.test(cvv) && cvv.length > 0;
};

function isValidZip(zip) {
    setErrorMessage(zip.length, 'zip', 'Zip');
    return /^[0-9]{5}$/.test(zip) && zip.length > 0;;
};
// Must be a valid email address
function isValidEmail(email) {
    setErrorMessage(email.length, 'mail', 'Email');
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) && email.length > 0;
};

function isValidActivities() {

    
    return $('input[type="checkbox"]:checked').length > 0;
};

function showOrHideError(showError, elementID) {
    // show element when show is true, hide when false
    const $errorSpan = $('#' + elementID + 'Error');
    if (showError) {
        $errorSpan.show();
    } else {
        $errorSpan.hide();
    }
}

function createListener(validator) {
    return e => {
        const text = e.target.value;
        const valid = validator(text);
        const showError = !valid;
        showOrHideError(showError, e.target.getAttribute("id"));
    };
}

function validateForm(event) {


    $(".error:visible").hide();
    $('#name').trigger( "input" );
    $('#mail').trigger( "input" );
    if ($("#payment").val() === "Credit Card") {
        $('#cvv').trigger( "input" );
        $('#cc-num').trigger( "input" );
        $('#zip').trigger( "input" );
    }

    showOrHideError(!isValidActivities(),'register' );
    
    console.log($(".error:visible").length);

};

$('#name').on('input',createListener(isValidName));
$('#mail').on('input',createListener(isValidEmail));
$('#cvv').on('input',createListener(isValidCVV));
$('#cc-num').on('input',createListener(isValidCCN));
$('#zip').on('input',createListener(isValidZip));

$('form').submit(function (event) {

    event.preventDefault();
    validateForm(event);
});

// 1) If any of the following validation errors exist, prevent the user from submitting the form:
//    Name field can't be blank.
// 2) Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example.
// 3) User must select at least one checkbox under the "Register for Activities" section of the form.
// 4) If the selected payment option is "Credit Card," 
//    make sure the user has supplied a 
//      a) Credit Card number - a number between 13 and 16 digits.
//      b) a Zip Code - a 5-digit number., 
//      c) 3 number CVV value - a 3 digit number
//before the form can be submitted.
// 5) Make sure your validation is only validating Credit Card info if Credit Card is the selected payment method.

// Form validation messages
// Provide some kind of indication when there’s a validation error. The field’s borders could turn red, for example, 
// or even better for the user would be if a red text message appeared near the field.
// The following fields should have some obvious form of an error indication:
//      1) Name field
//      2) Email field
//      3) Register for Activities checkboxes (at least one must be selected)
//      4) Credit Card number (Only if Credit Card payment method is selected)
//      6) Zip Code (Only if Credit Card payment method is selected)
//      7) CVV (Only if Credit Card payment method is selected)
// Error messages or indications should not be visible by default. They should only show upon submission, or after some user interaction.

// Avoid use alerts for your validation messages.

// If a user tries to submit an empty form, there should be an error indication or message displayed for the name field, 
//the email field, the activity section, and the credit card fields if credit card is the selected payment method.