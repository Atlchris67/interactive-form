//When the page first loads, 
//the first text field should be in focus by default.
$("#name").focus();
$('#other-title').hide();
$('.activities').append('<div id="total"></div>');

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

    colorInput.empty();
    switch (themeSelect) {
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


function setStatus(workshop, stateToSet){
    if (stateToSet =="disabled"){
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
    const $checkedEvent = event.target;
    const eventName = this.name;
    const eventDateTime = $(this).data("day-and-time");
    console.log(eventDateTime);


    // if all checked, disable the rest
    if ((eventName === "all") && $(this).prop('checked')) {
        $events.each(function () {
            if (this.name !== 'all') {
                setStatus($(this), "disabled");                
            };
        });
    };

    //if all unchecked enable all others
    if ((eventName === "all") && !$(this).prop('checked')) {
        $events.each(function () {
            if (this.name !== 'all') {
                setStatus($(this), "enabled");     
            };
        });
    };

    //if something besides all checked, 
    if ((eventName !== "all") && $(this).prop('checked')) {
            $events.each(function () {
            const thisDateTime = $(this).data("day-and-time");
            //disable all, if not disabled already
            if ((this.name === 'all') && ( !$(this).parent().hasClass("disabled"))) {
                setStatus($(this), "disabled");
            };

            //check others with same datetime data attribute and disable if required
            if (this.name !== 'all' && (this.name !== eventName)  && (thisDateTime === eventDateTime) && ( !$(this).parent().hasClass("disabled"))) {
                setStatus($(this), "disabled");;
            };
        });
    };


    //if an item is unchecked, potentially enable new NON conflicts 
    if ((eventName !== "all") && !$(this).prop('checked')) {
        $events.each(function () {
            const thisDateTime = $(this).data("day-and-time");
            if ((this.name !== 'all') && (thisDateTime === eventDateTime)) {
                setStatus($(this), "enabled");
            };
        });
    };

    //if an item is unchecked, potentially enable ALL workshops checkbox
    if ((eventName !== "all") && !$(this).prop('checked')) {

        let allStatus = true;
        let allWorkshops;
        //check all the other items to see if they are checked
        $events.each(function () {
            if ((this.name !== 'all') && ($(this).prop('checked'))) {
                allStatus = false;
            };
            if (this.name === 'all'){
                allWorkshops = this;
            }
        });
        //if all clear, enable all workshop checkbox
        if (allStatus){
            setStatus($(allWorkshops), "enabled");
        }

    };

    //Calculate current cost
    let cost = 0;
    $events.each(function () { 
        if ($(this).prop('checked')){
            cost +=   Number.parseInt(this.getAttribute("data-cost").replace(/\$/g, ''), 10);            
        };       
    });
    
    //Display the total cost for activities
    $("#total").html('<div id="total">Total: $' + cost + '.00</div>');
    
     

      
});
// ”Register for Activities” section
// Some events are at the same day and time as others. If the user selects a workshop, don't allow selection of a workshop at the same day and time -- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
// When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.
// As a user selects activities, a running total should display below the list of checkboxes. For example, if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300.

// "Payment Info" section
// Display payment sections based on the payment option chosen in the select menu.
// The "Credit Card" payment option should be selected by default. Display the #credit-card div, and hide the "PayPal" and "Bitcoin" information. Payment option in the select menu should match the payment option displayed on the page.
// When a user selects the "PayPal" payment option, the PayPal information should display, and the credit card and “Bitcoin” information should be hidden.
// When a user selects the "Bitcoin" payment option, the Bitcoin information should display, and the credit card and “PayPal” information should be hidden.
// The user should not be able to select the "Select Payment Method" option from the payment select menu, because the user should not be able to submit the form without a chosen payment option.

// Form validation
// If any of the following validation errors exist, prevent the user from submitting the form:
// Name field can't be blank.
// Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example.
// User must select at least one checkbox under the "Register for Activities" section of the form.
// If the selected payment option is "Credit Card," make sure the user has supplied a Credit Card number, a Zip Code, and a 3 number CVV value before the form can be submitted.
// Credit Card field should only accept a number between 13 and 16 digits.
// The Zip Code field should accept a 5-digit number.
// The CVV should only accept a number that is exactly 3 digits long.
// NOTE: Don't rely on the built in HTML5 validation by adding the required attribute to your DOM elements. You need to actually create your own custom validation checks and error messages.


// Make sure your validation is only validating Credit Card info if Credit Card is the selected payment method.

// Form validation messages
// Provide some kind of indication when there’s a validation error. The field’s borders could turn red, for example, or even better for the user would be if a red text message appeared near the field.
// The following fields should have some obvious form of an error indication:
// Name field
// Email field
// Register for Activities checkboxes (at least one must be selected)
// Credit Card number (Only if Credit Card payment method is selected)
// Zip Code (Only if Credit Card payment method is selected)
// CVV (Only if Credit Card payment method is selected)
// Error messages or indications should not be visible by default. They should only show upon submission, or after some user interaction.

// Avoid use alerts for your validation messages.

// If a user tries to submit an empty form, there should be an error indication or message displayed for the name field, the email field, the activity section, and the credit card fields if credit card is the selected payment method.