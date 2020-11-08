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

//MODAL
$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    
    recipient.split(".")
    .filter(function(e){ return e }) // remove valores vazios
    .map(function(e){
       modal
       .find(":checkbox[value='"+e+"']")
       .prop("checked", true);
    });
 });