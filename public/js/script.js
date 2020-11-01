$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

$(".NumberDec").each(format_2_dec);
function format_2_dec() {
    var curr_val = parseFloat($(this).val());
    $(this).val(curr_val.toFixed(2));
}

$(".NumberInt").each(format_0_dec);
function format_0_dec() {
    var curr_val = parseFloat($(this).val());
    $(this).val(curr_val.toFixed(0));
}
