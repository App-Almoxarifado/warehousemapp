(function(_win, doc) {

    //CONFIRMAÇÃO AO DELETAR 
    if (doc.querySelector('.deletar')) {
        let deleters = doc.querySelectorAll('.deletar');
        for (let i = 0; i < deleters.length; i++) {
            deleters[i].addEventListener('click', function(event) {
                let id = deleters[i].dataset.id;
                if (confirm("Deseja mesmo apagar este dado?")) {
                    return true;
                } else {
                    event.preventDefault();
                }
            });
        }
    }
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
$(document).ready(function() {

    var readUrl = function(input) {

        if (input.files && input.files[0]) {

            var reader = new FileReader();

            reader.readAsDataURL(input.files[0]);

            reader.onload = function(e) {
                $(".avatar").attr('src', e.target.result);

                var url = (e.target.result);
                console.log(url);
                var nameimg = document.getElementById("file").files[0].name
                document.getElementById('image').value = (nameimg)

            }

        }
    }

    $(".file-upload").on('change', function() {
        readUrl(this);
    });

    $(".avatar").click(function() {
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
});

function formatarMoeda() {
    var elemento = document.getElementById('valor');
    var valor = elemento.value;
    
    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g,''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");
  
    if (valor.length > 6) {
      valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
  
    elemento.value = valor;
  }*/
 

//MUDAR BACKGROUND
function muda(){
    classe = document.getElementById('bg').className; 
    if(classe == 'bgLight'){
       document.getElementById('bg').className = 'bgDark';
   }else{
       document.getElementById('bg').className = 'bgLight';
   }
}


//SIDEBAR   
$(document).ready(function () {
    console.log("document is ready");
    $('[data-toggle="offcanvas"], #navToggle').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    })
});
window.onload = function () {
   
};