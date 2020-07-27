

    //CONFIRMAÇÃO AO DELETAR 
    $(document).ready(function(){
        $(".deletar").click( function(event) {
           var apagar = confirm('Deseja realmente excluir este registro?');
           if (apagar){
         // aqui vai a instrução para apagar registro			
           }else{
              event.preventDefault();
           }	
        })
     })

//FUNÇÃO PARA AUTOMATIZAR O CÓDIGO QRCODE
function qrcodeFormat() {
    let v1 = document.getElementById('subgroup').value
    let desired = v1.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, ''); // Remove hífens extras do final ou do inicio da string
    desired = desired.toLowerCase(); // Transforma Tudo em minúscula
    //RETIRA OS CARACTERES ESPECIAIS PARA GERAR O QR CODE
    document.getElementById("copy").value = desired;
    makeCode();
}

//FUNÇÃO PARA AUTOMATIZAR O CÓDIGO QRCODE usuario
/*function qrcodeFormatUser() {
    var v1 = document.getElementById('nome').value
    var desired = v1.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, ''); // Remove hífens extras do final ou do inicio da string
    desired = desired.toLowerCase(); // Transforma Tudo em minúscula
    //RETIRA OS CARACTERES ESPECIAIS PARA GERAR O QR CODE
    document.getElementById("qrcode").value = desired;
    console.log("aqui")
    makeCode();
}/*

//GERA QRCODE
/*var qrCode;

if(document.getElementById("qrcode")){
    qrCode = new QRCode(document.getElementById("qrcode2"), {
            text: "0",
            width: 150,
            height: 150,
            colorDark: "black",
            colorLight: "white",
            correctLevel: QRCode.CorrectLevel.L
    });
}

function makeCode() {
    var elText = document.getElementById("qrcode");

    if(qrCode && elText) qrCode.makeCode(elText.value);
}*/

//CARREGANDO IMAGEM
$(document).ready(function () {

    var readUrl = function (input) {

        if (input.files && input.files[0]) {

            var reader = new FileReader();

            reader.readAsDataURL(input.files[0]);

            reader.onload = function (e) {
                $(".avatar").attr('src', e.target.result);

                var url = (e.target.result);
                console.log(url);
                var nameimg = document.getElementById("file").files[0].name
                document.getElementById('image').value = (nameimg)

            }

        }
    }

    $(".file-upload").on('change', function () {
        readUrl(this);
    });

    $(".avatar").click(function () {
        var btn = $(".file-upload");
        btn.trigger('click');
    });
})


//CPF CNPJ
/*$("#cpfcnpj").keydown(function(){
    try {
        $("#cpfcnpj").unmask();
    } catch (e) {}

    var tamanho = $("#cpfcnpj").val().length;

    if(tamanho < 11){
        $("#cpfcnpj").mask("999.999.999-99");
    } else {
        $("#cpfcnpj").mask("99.999.999/9999-99");
    }

    // ajustando foco
    var elem = this;
    setTimeout(function(){
        // mudo a posição do seletor
        elem.selectionStart = elem.selectionEnd = 10000;
    }, 0);
    // reaplico o valor para mudar o foco
    var currentValue = $(this).val();
    $(this).val('');
    $(this).val(currentValue);
});

$('#cep').mask('00000-000');

$('#fone').mask('(00) 0000-00009');
$('#fone').blur(function(event) {
   if($(this).val().length == 15){ // Celular com 9 dígitos + 2 dígitos DDD e 4 da máscara
      $('#fone').mask('(00) 00000-0009');
   } else {
      $('#fone').mask('(00) 0000-00009');
   }
});*/

//MOEDA
/*function formatarMoeda() {
    var elemento = document.getElementById('faceValue');
    var valor = elemento.value;

    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    elemento.value = valor;
}*/

//ARREDONDA SEMPRE DUAS CASAS DECIMAIS INPUT NUMBER
$(".number").on("change", function () {
    $(this).val(parseFloat($(this).val()).toFixed(2));
});
//MOSTAR SEMPRE DUAS CASAS DECIMAIS AO MOSTRAR TELA
$(".number").each(function () {
    var help = $(this).val().split(".");
    if (help.length == 1) {
        $(this).val($(this).val() + ".00");
    } else if (help[1].length == 1) {
        $(this).val($(this).val() + "0");
    }
});



//MUDAR BACKGROUND
function muda() {
    classe = document.getElementById('bg').className;
    if (classe == 'bgLight') {
        document.getElementById('bg').className = 'bgDark';
    } else {
        document.getElementById('bg').className = 'bgLight';
    }
}


//SIDEBAR   
$(document).ready(function () {
    $('[data-toggle="offcanvas"], #navToggle').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    })
});

//MASCARAS
function mascara(i, t) {

    var v = i.value;

    if (isNaN(v[v.length - 1])) {
        i.value = v.substring(0, v.length - 1);
        return;
    }

    if (t == "data") {
        i.setAttribute("maxlength", "10");
        if (v.length == 2 || v.length == 5) i.value += "/";
    }

    if (t == "cep") {
        i.setAttribute("maxlength", "9");
        if (v.length == 5) i.value += "-";
    }

    if (t == "tel") {
        if (v[0] == 9) {
            i.setAttribute("maxlength", "10");
            if (v.length == 5) i.value += "-";
        } else {
            i.setAttribute("maxlength", "9");
            if (v.length == 4) i.value += "-";
        }
    }
}

//OCULTAR DIV
function viewFile() {
    let files = document.getElementsByClassName('upload');
    let information = document.getElementById('subgroup').value
    if (information != "Selecione...") {
        files[0].style.display = 'block';
    } else {
        files[0].style.display = 'none';
    }
}

//OCULTAR DIV
function viewCertificate() {
    let files = document.getElementsByClassName('certificate');
    let information = document.getElementById('requiresCertificationCalibration').value
    if (information != "Sim") {
        files[0].style.display = 'none';
    } else {
        files[0].style.display = 'block';
    }
}

//CALCULAR DATA DE VENCIMENTO
function calculater() {
    var inicial = document.getElementById("calibrationDate").value;
    //var daysToExpire = parseInt(document.getElementById("daysToExpire").value);
    var monthsDue = document.getElementById("frequency").value;
    
    var partes = inicial.split("-");
    var ano = partes[0];
    var mes = partes[1] - 1;
    var dia = partes[2];
  
    inicial = new Date(ano, mes, dia);
    final = new Date(inicial);
    if (monthsDue == "5f011814038643547805dbe1") {
        daysToExpire = 365;
    }
    if (monthsDue == "5f011814038643547805dbe2") {
        daysToExpire = 365*2;
    }
    if (monthsDue == "5f011814038643547805dbe3") {
        daysToExpire = 365*3;
    }
    if (monthsDue == "5f011814038643547805dbe4") {
        daysToExpire = 365*4;
    }
    if (monthsDue == "5f011814038643547805dbe5") {
        daysToExpire = 365*5;
    }
    final.setDate(final.getDate() + daysToExpire);
    //final.setDate(final.getDate() - 14); // menos 14 dias do resultado
    
    var dd = ("0" + final.getDate()).slice(-2);
    var mm = ("0" + (final.getMonth() + 1)).slice(-2);
    var y = final.getFullYear();
  
    var dataformatada = y + '-' + mm + '-' + dd;
    document.getElementById('calibrationValidity').value = dataformatada;
    var calibrationValidity =  document.getElementById('calibrationValidity').valueAsDate
    //var today = document.getElementById('today').valueAsDate = new Date();
    var today  = new Date();
    if (calibrationValidity > today){
        calibrationStatus = "Ok"   
    }
    if (calibrationValidity < today){
        calibrationStatus = "Vencido"   
    }  
    document.getElementById('calibrationStatus').value = calibrationStatus;
  }

 function statusCalibration (){
    var calibrationValidity =  document.getElementById('calibrationValidity').valueAsDate
    //var today = document.getElementById('today').valueAsDate = new Date();
    var today = new Date();
  
    if (calibrationValidity > today){
        calibrationStatus = "Ok"   
    }
    if (calibrationValidity < today){
        calibrationStatus = "Vencido"   
    }  
    document.getElementById('calibrationStatus').value = calibrationStatus;
 }

  