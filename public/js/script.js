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

//CONSULTA CEP CORREIOS
const showData = (result)=>{
    for(const campo in result){
        if(document.querySelector("#"+campo)){
            document.querySelector("#"+campo).value = result[campo]
        }
    }
}
cep.addEventListener("blur",(e)=>{
    let search = cep.value.replace("-","")
    const options = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    }

    fetch(`https://viacep.com.br/ws/${search}/json/`, options)
    .then(response =>{ response.json()
        .then( data => showData(data))
    })
    .catch(e => console.log('Deu Erro: '+ e,message))
})


var lat = '';
var lng = '';
var address = document.getElementById("cep").value
geocoder.geocode( { 'address': address}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
     lat = results[0].geometry.location.lat();
     lng = results[0].geometry.location.lng();
  } else {
     alert("Não foi possivel obter localização: " + status);
  }
});
alert('Latitude: ' + lat + ' Logitude: ' + lng);
