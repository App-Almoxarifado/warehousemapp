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
    let v1 = document.getElementById('descricao').value
    let desired = v1.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, ''); // Remove hífens extras do final ou do inicio da string
    desired = desired.toLowerCase(); // Transforma Tudo em minúscula
    //RETIRA OS CARACTERES ESPECIAIS PARA GERAR O QR CODE
    document.getElementById("qrcode").value = desired;
    makeCode();
}

//FUNÇÃO PARA AUTOMATIZAR O CÓDIGO QRCODE usuario
function qrcodeFormatUser() {
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
}

//GERA QRCODE
var qrCode;

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
}

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
                document.getElementById('imagem').value = (nameimg)

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

//MOSTRAR E OCULTAR TABELA
function mostrartabela() {
    document.getElementById("table").style.display = 'block';
    document.getElementById("card").style.display = 'none';
}

function mostrarlista() {
    document.getElementById("table").style.display = 'none';
    document.getElementById("card").style.display = 'block';
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}