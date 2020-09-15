let fullTotalTime, selectedSlotStartTime, selectedSlotEndTime, selectedSlot, slotTotalTime,
containerSlotTimeStart, containerSlotTimeEnd, containerSlotTimeSub;
let slotsContainerSelector = $('.slots-container');
let reservationModal = $('#timeReservation');
let deleteModal = $('#cancelIndividualReservation');
let cancelReserve = $('.cancel-btn');
let reserveBtn = $('.reserve-btn');

function timeSubtraction(start, end){

    s = start.split(':');
    e = end.split(':');
    
    min = e[1]-s[1];
    hour_carry = 0;
    if(min < 0){
        min += 60;
        hour_carry += 1;
    }
    hour = e[0]-s[0]-hour_carry;

    tHours = hour*60;
    tDiff = tHours+min; 

    return tDiff;
}
function timeFormHanling(startTime, endTime){
    // Subtract 5 Mins From End Time For Max Value
    var formFromMax = moment.utc(endTime,'HH:mm').subtract(5,'minutes').format('HH:mm');
    // Add 5 Mins From Start Time For Min Value
    var formtoMin = moment.utc(startTime,'HH:mm').add(5,'minutes').format('HH:mm');
    
    // Set Max and Min Values in Time Form
    $('.control-time-from').attr('min', startTime);
    $('.control-time-from').attr('max', formFromMax);
    $('.control-time-to').attr('min', formtoMin);
    $('.control-time-to').attr('max', endTime);

    // Default values for Time Form
    $('.control-time-from').val(startTime);
    $('.control-time-to').val(endTime);
}
function timeFormValidation(){
    let alertMsg;
    let fromControlVal = $('.control-time-from').val();
    let fromControlMaxVal = $('.control-time-from').attr('max');
    let fromControlMinVal = $('.control-time-from').attr('min');

    let toControlVal = $('.control-time-to').val();
    let toControlMaxVal = $('.control-time-to').attr('max');
    let toControlMinVal = $('.control-time-to').attr('min');

    if(fromControlVal < fromControlMinVal || fromControlVal > fromControlMaxVal){
        alertMsg = 'Start Time Should Be Between '+fromControlMinVal+' and '+fromControlMaxVal;
        $('#time-form').find('.invalid-feedback').append('<div>'+alertMsg+'</div>');
        if(toControlVal < toControlMinVal || toControlVal > toControlMaxVal){
            alertMsg = 'End Time Should Be Between '+toControlMinVal+' and '+toControlMaxVal;
            $('#time-form').find('.invalid-feedback').append('<div>'+alertMsg+'</div>');
        }
        return false;
    }else if(toControlVal < toControlMinVal || toControlVal > toControlMaxVal){
        if(fromControlVal < fromControlMinVal || fromControlVal > fromControlMaxVal){
            alertMsg = 'Start Time Should Be Between '+fromControlMinVal+' and '+fromControlMaxVal;
            $('#time-form').find('.invalid-feedback').append('<div>'+alertMsg+'</div>');
        }    
        alertMsg = 'End Time Should Be Between '+toControlMinVal+' and '+toControlMaxVal;
        $('#time-form').find('.invalid-feedback').append('<div>'+alertMsg+'</div>');
        return false;
    }else if(fromControlVal > toControlVal || fromControlVal == toControlVal){
        alertMsg = 'Wrong Data From Date Should be Earlier than to date'+fromControlVal+' > '+toControlVal;
        $('#time-form').find('.invalid-feedback').append('<div>'+alertMsg+'</div>');
        return false;
    }else{
        return true;
    }
}

function selectSlot($thisSlot){
   
       // Remove Selected Class From all Slots Except This
       $('.slot').not($thisSlot).removeClass('slot-selected');
    let $selectedSlotBefore = $thisSlot.parents(".slots-container").find('.slot.active-slot');
    if($selectedSlotBefore.length == 0){
        $(reservationModal).modal('show'); 
    
        $thisSlot.addClass('slot-selected');
        selectedSlot  = $('.slot-selected');
        
        // Selected Slot Start and End Time
        selectedSlotStartTime = $thisSlot.find('.slot-start-time').text();
        selectedSlotEndTime = $thisSlot.find('.slot-end-time').text();
    
        // Time Form Handling
        timeFormHanling(selectedSlotStartTime, selectedSlotEndTime);
    
        // Container Slot Start and End Time
        containerSlotTimeStart = selectedSlot.closest(slotsContainerSelector).attr('slot-start');
        containerSlotTimeEnd = selectedSlot.closest(slotsContainerSelector).attr('slot-end');
        
        // Calculate Container Slot Time in Minutes using Time Sub Fn()
        containerSlotTimeSub = timeSubtraction(containerSlotTimeStart, containerSlotTimeEnd);
    }else{
        selectSlotForDelete($selectedSlotBefore);  
        $(reserveBtn).hide();
        $(cancelReserve).show();
    }
   
}
function createSlots(timeFrom, timeTo){
    // New Slot Total Time by Time Sub Fn()
    let newSlotTotalTime = timeSubtraction(timeFrom, timeTo);

    // Calculate New Slot Width in percentage of Full Container Slotes Total Time in Minutes
    let newSlotWidth = (newSlotTotalTime * 100) / containerSlotTimeSub;

    // Get Selected Slot Width to Calculate New Width
    let selectedSlotWidth = selectedSlot.attr('slot-width');
    let selectedSotNewWidth = selectedSlotWidth - newSlotWidth;

    // Subtract Selected Slot Start Time From New Slot start Time 
    // Subtract Selected Slot End Time From New Slot End Time 
    let timeStartSub = timeSubtraction(selectedSlotStartTime, timeFrom);
    let timeEndSub = timeSubtraction(selectedSlotEndTime, timeTo);
    let slotsHTML;

    // Else Check if Selected Slot Start Time == Start Time && Selected Slot End Time == End Time  
    // Then Full Slot will be reserved
    if(selectedSlotStartTime == timeFrom && selectedSlotEndTime == timeTo){
        slotsHTML = `
            <div class="slot active-slot" onclick="selectSlotForDelete($(this))" slot-width="`+selectedSlotWidth+`" style="width:`+selectedSlotWidth+`%">
                <span class="slot-start-time">`+selectedSlotStartTime+`</span>
                <span class="slot-end-time">`+selectedSlotEndTime+`</span>
            </div>
        `;
    }
    // Check if Previous Sub of Start Time == 0
    // Then Slot is Added Before Selected Slot
    else if(timeStartSub == 0){
        slotsHTML = `
            <div class="slot active-slot" onclick="selectSlotForDelete($(this))" slot-width="`+newSlotWidth+`" style="width:`+newSlotWidth+`%">
                <span class="slot-start-time">`+timeFrom+`</span>
                <span class="slot-end-time">`+timeTo+`</span>
            </div>
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+selectedSotNewWidth+`" style="width:`+selectedSotNewWidth+`%">
                <span class="slot-start-time">`+timeTo+`</span>
                <span class="slot-end-time">`+selectedSlotEndTime+`</span>
            </div>
        `;
    }
    // Else Check if Previous Sub of End Time == 0
    // Then Slot is Added After Selected Slot
    else if(timeEndSub == 0){
        slotsHTML = `
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+selectedSotNewWidth+`" style="width:`+selectedSotNewWidth+`%">
                <span class="slot-start-time">`+selectedSlotStartTime+`</span>
                <span class="slot-end-time">`+timeFrom+`</span>
            </div>
            <div class="slot active-slot" onclick="selectSlotForDelete($(this))" slot-width="`+newSlotWidth+`" style="width:`+newSlotWidth+`%">
                <span class="slot-start-time">`+timeFrom+`</span>
                <span class="slot-end-time">`+selectedSlotEndTime+`</span>
            </div>
        `;
    }
    // Else
    // Then Slot is Added in The Middle Of Selected Slot
    // I will Have 3 Slots To be Replaced With Selected Slot 
    else{
        // 3 Slots Start and End Date
        let slot1_Start = selectedSlotStartTime;
        let slot2_Start = timeFrom;
        let slot3_Start = timeTo;

        let slot1_End = timeFrom;
        let slot2_End = timeTo;
        let slot3_End = selectedSlotEndTime;

        // 3 Slots Time in Minutes By Time Sub Fn()
        let slot1TotalTime = timeSubtraction(slot1_Start, slot1_End);
        let slot2TotalTime = timeSubtraction(slot2_Start, slot2_End);
        let slot3TotalTime = timeSubtraction(slot3_Start, slot3_End);

        // 3 Slots Width Calculations
        let slot1Width = (slot1TotalTime * 100) / containerSlotTimeSub;
        let slot2Width = (slot2TotalTime * 100) / containerSlotTimeSub;
        let slot3Width = (slot3TotalTime * 100) / containerSlotTimeSub;

        slotsHTML = `
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+slot1Width+`" style="width:`+slot1Width+`%">
                <span class="slot-start-time">`+slot1_Start+`</span>
                <span class="slot-end-time">`+slot1_End+`</span>
            </div>
            <div class="slot active-slot" onclick="selectSlotForDelete($(this))" slot-width="`+slot2Width+`" style="width:`+slot2Width+`%">
                <span class="slot-start-time">`+slot2_Start+`</span>
                <span class="slot-end-time">`+slot2_End+`</span>
            </div>
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+slot3Width+`" style="width:`+slot3Width+`%">
                <span class="slot-start-time">`+slot3_Start+`</span>
                <span class="slot-end-time">`+slot3_End+`</span>
            </div>
        `;

    }

    // Replace Selected Slot With New Slots
    selectedSlot.replaceWith(slotsHTML);
}
function selectSlotForDelete($selectedSlotForDelete){
    $selectedSlotForDelete.addClass('selected-active-slot');
    $(deleteModal).modal('show');

}

$(cancelReserve).click(function(){
    $(this).parents(".meeting-card").find(".active-slot").addClass('selected-active-slot');
    $(deleteModal).modal('show');
});
function deleteSlot(){

    $activeSlot = $('.selected-active-slot');
    $(cancelReserve).hide();
    $(reserveBtn).show();
    // Get Previous Slot and Next Slot
    let $prevSlot = $activeSlot.prev();
    let $nextSlot = $activeSlot.next();

    // console.log();

    // Get Previous Slot and Next Slot and Active Slots Required Times
    let prevSlotStart = $prevSlot.find('.slot-start-time').text();
    let nextSlotEnd = $nextSlot.find('.slot-end-time').text();
    let activSlotStart = $activeSlot.find('.slot-start-time').text();
    let activSlotEnd = $activeSlot.find('.slot-end-time').text();

    // New Slot Width To be changed Based on if statement
    let newSlotWidth = $activeSlot.attr('slot-width');
    let newSlotHTML;

    // If Active Slot Has Prev and Next Slots to be added to Active Slot
    if($prevSlot.html() != undefined && $nextSlot.html() != undefined  && !($prevSlot.hasClass('taken')) && !($prevSlot.hasClass('active-slot')) && !($nextSlot.hasClass('taken')) && !($nextSlot.hasClass('active-slot'))){
        let prevSlotWidth = $prevSlot.attr("slot-width");
        let nextSlotWidth = $nextSlot.attr("slot-width");
        newSlotWidth = parseFloat(newSlotWidth) + parseFloat(prevSlotWidth) + parseFloat(nextSlotWidth);        
        
        newSlotHTML = `
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+newSlotWidth+`" style="width:`+newSlotWidth+`%">
                <span class="slot-start-time">`+prevSlotStart+`</span>
                <span class="slot-end-time">`+nextSlotEnd+`</span>
            </div>
        `;
        
        $prevSlot.remove();
        $nextSlot.remove();
    }
    // Else If Active Slot Has Only Prev Slot to be added to Active Slot
    else if($prevSlot.html() != undefined && !($prevSlot.hasClass('taken')) && !($prevSlot.hasClass('active-slot'))){
        let prevSlotWidth = $prevSlot.attr("slot-width");
        newSlotWidth = parseFloat(newSlotWidth) + parseFloat(prevSlotWidth);   
        
        newSlotHTML = `
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+newSlotWidth+`" style="width:`+newSlotWidth+`%">
                <span class="slot-start-time">`+prevSlotStart+`</span>
                <span class="slot-end-time">`+activSlotEnd+`</span>
            </div>
        `;
        
        $prevSlot.remove();
    }
    // Else If Active Slot Has Only Next Slot to be added to Active Slot
    else if($nextSlot.html() != undefined  && !($nextSlot.hasClass('taken')) && !($nextSlot.hasClass('active-slot'))){
        let nextSlotWidth = $nextSlot.attr("slot-width");
        newSlotWidth = parseFloat(newSlotWidth) + parseFloat(nextSlotWidth);   
        
        newSlotHTML = `
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+newSlotWidth+`" style="width:`+newSlotWidth+`%">
                <span class="slot-start-time">`+activSlotStart+`</span>
                <span class="slot-end-time">`+nextSlotEnd+`</span>
            </div>
        `;
        
        $nextSlot.remove();
    }
    // Else Active Slot Has no Prev nor Next Slot
    else{
        newSlotWidth = parseFloat(newSlotWidth);

        newSlotHTML = `
            <div class="slot" onclick="selectSlot($(this))" slot-width="`+newSlotWidth+`" style="width:`+newSlotWidth+`%">
                <span class="slot-start-time">`+activSlotStart+`</span>
                <span class="slot-end-time">`+activSlotEnd+`</span>
            </div>
        `;
    }

    $activeSlot.replaceWith(newSlotHTML);

     
    $(deleteModal).modal('hide');
   
}
$(document).ready(function(){
    $(cancelReserve).hide();
    $(reserveBtn).show();
    $('#form-time-submit').click(function(){
        $('.invalid-feedback').html('');
        // Time Form Start and End Time
        let usrTimeFrom = $('.control-time-from').val();
        let usrTimeTo = $('.control-time-to').val();

        // Time Form Validation
        timeFormValidation();

        // Draw Slots
        if(timeFormValidation() == true){
            createSlots(usrTimeFrom, usrTimeTo); 
            $(reservationModal).modal('hide');
        }

        // show cancel modal
        $(reserveBtn).hide();
        $(cancelReserve).show();

    });
    
});