$(document).ready(function () {
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
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

//MOSTAR OCULTAR DIV
function showHide(el) {
  var display = document.getElementById(el).style.display;
  if (display == "none") document.getElementById(el).style.display = "block";
  else document.getElementById(el).style.display = "none";
}

$("#form").submit(function () {
  if ($("#image").val() == null || $("#image").val() == "") {
    alert("campo vazio");
    return false;
  }
});

//EXPORTAR TABELA EXCEL
$(document).ready(function () {
  $("#btnExport").click(function (e) {
    e.preventDefault();
    var table_div = document.getElementById("tblExport");
    // esse "\ufeff" é importante para manter os acentos
    var blobData = new Blob(["\ufeff" + table_div.outerHTML], {
      type: "application/vnd.ms-excel",
    });
    var url = window.URL.createObjectURL(blobData);
    var a = document.createElement("a");
    a.href = url;
    a.download =
      "WarehouseApp" +
      " " +
      new Date().toLocaleString().replace(/[\-\:\.]/g, "");
    a.click();
  });
});




