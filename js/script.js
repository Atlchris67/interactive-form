/////////Initial Load tasks///////////
//When the page first loads, 
$("#name").focus();
$('#other-title').hide();
$('.activities').append('<div id="total"></div>');
$("#payment").val("Credit Card");
$("#paypal").hide();
$("#bitcoin").hide();
$("#color").after('<span id="colorMessage" class="error" >Please select a T-shirt theme</span>');
$("#color").hide();
$("select#payment option:first-child" ).attr("disabled","disabled");

//Dry func to build error spans, uniform ID and data attribute used later to managing dynamic messages and form validation
function addErrorSpans(errorID, errorFor, erorMessage) {
    const $errorLocation = $(errorFor);
    const $errorSpan = $('<span id="' + errorID + 'Error" class="error" data-invalid-message="' + erorMessage + '" style="color:red;display:none;">' + erorMessage + '</span>');
    $errorLocation.after($errorSpan);
    $errorSpan.hide();
}

$('#name').on('input',createListener(isValidName));
$('#mail').on('input',createListener(isValidEmail));
$('#cvv').on('input',createListener(isValidCVV));
$('#cc-num').on('input',createListener(isValidCCN));
$('#zip').on('input',createListener(isValidZip));

addErrorSpans('name', "label[for='name']", 'Please enter a valid Name, only enter letters.', );
addErrorSpans('mail', "label[for='mail']", 'Please enter a valid email.');
addErrorSpans('title', "label[for='title']", 'Please select a valid jobe role.');
addErrorSpans('cc-num', "label[for='cc-num']", 'Please enter a number that is between 13 and 16 digits long.');
addErrorSpans('zip', "label[for='zip']", 'Invalid zip.');
addErrorSpans('cvv', "label[for='cvv']", 'Invalid cvv.');
addErrorSpans('register', "legend:contains('Register for Activities')", 'Please select an activity.');


/////////Job Role Section///////////
// On job role change, if other show input feild
$("#title").change(function (event) {
    const titleSelect = this.value;
    const otherInput = $("#other-title");
    (titleSelect === 'other') ? $('#other-title').show(): $('#other-title').hide().val('');
});

/////////T-Shirt Section///////////
$("#design").change(function (event) {
    const themeSelect = this.value;
    const colorInput = $("#color");
    
    //Only shoe color options until design is selected
    $("#colorMessage").hide();
    $("#color").show();

    //Start fresh on color dropdown - easier just reset the manage delta's
    //Else rebuild menu to new selection.
    colorInput.empty();
    switch (themeSelect) {
        //Hide dropdown, if they reselect "Select Theme"
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
    }

});


/////////Workshops Section///////////
// Dry method manage toggling a checkbox job.1
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

//Main on change method for workshop selection 
$("form input:checkbox").change(function (event) {
    const $events = $(":checkbox");
    const $workshops = $(":checkbox:not([name=all])");  
    const eventName = this.name;
    const eventDateTime = $(this).data("day-and-time");
    console.log(eventDateTime);

    //if something besides main checked, disable all other conflicting times. Oddly its name is "all" not "main", 
    if ((eventName !== "all") && $(this).prop('checked')) {
        showOrHideError(!isValidActivities(),'register' );
        $workshops.each(function () {
            const thisDateTime = $(this).data("day-and-time");
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

    //Calculate current cost
    let cost = 0;
    $events.each(function () {
        if ($(this).prop('checked')) {
            cost += Number.parseInt(this.getAttribute("data-cost").replace(/\$/g, ''), 10);
        };
    });

    showOrHideError(!isValidActivities(),'register' );

    //Display the total cost for activities
    $("#total").html('<div id="total"><strong>Total: $' + cost + '.00</strong></div>');

});

/////////Payments Section///////////
//display payment section based on current dropdown selection
function togglePayments($paypal, $bitcoin, $creditCard, $active) {
    $paypal.hide();
    $bitcoin.hide();
    $creditCard.hide();
    $active.show();
};

//You guessed it, clear the credit info, if they change from credit to another payment method
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

//Main onchange event for payment info section.
$("#payment").change(function (event) {
    const paySelect = this.value;
    const $paypal = $("#paypal");
    const $bitcoin = $("#bitcoin");
    const $creditCard = $("#credit-card");

    switch (paySelect) {
        case "Credit Card":
            togglePayments($paypal, $bitcoin, $creditCard, $creditCard);
            //recreating listeners as I count errors to determine if form isValid.
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



/////////Payments Section///////////
//You guessed it a method to edit the error messag based on error type.
function setErrorMessage(length, elementId, elementDisplayName){
    if (length <= 0)
    {
        //standard empty message
        $('#'+ elementId + 'Error').text(elementDisplayName + ' can not be empty.');
    }else{
        //specific regex failure method stored in data attrib
        $('#'+ elementId + 'Error').text($('#'+ elementId + 'Error').data('invalid-message'));
    }
}

// Validation funcs 
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

//count the errors - a c# poormans isValid 
function isValidActivities() {
    return $('input[type="checkbox"]:checked').length > 0;
};

// show error span when show is true, hide when false
function showOrHideError(showError, elementID) {
    
    const $errorSpan = $('#' + elementID + 'Error');
    // (probably could use a toggle, but it broke when i tried and just reverted.
    if (showError) {
        $errorSpan.show();
    } else {
        $errorSpan.hide();
    }
}

//repurposed code from workshop
function createListener(validator) {
    return e => {
        const text = e.target.value;
        const valid = validator(text);
        const showError = !valid;
        showOrHideError(showError, e.target.getAttribute("id"));
    };
}

//main form validation
function validateForm(event) {
    //start fresh
    $('#name').trigger( "input" );
    $('#mail').trigger( "input" );
    if ($("#payment").val() === "Credit Card") {
        $('#cvv').trigger( "input" );
        $('#cc-num').trigger( "input" );
        $('#zip').trigger( "input" );
    }

    //check activities one more time, just in case they never selected anything.
    showOrHideError(!isValidActivities(),'register' );
    
    return ($(".error:visible").length);

};

$('form').submit(function (event) {
    //Hold on wait a minute - make sure it's right.
    const errorCount = validateForm(event);
    if (errorCount){
        event.preventDefault();
    };
});