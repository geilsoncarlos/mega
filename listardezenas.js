function mostrarSorteio() {
    pConcurso = $('#numeroConcurso').val()
    //console.log(pConcurso)
    $.getJSON("megasena.json", function (data) {
        $.each(data, function (key, val) {

            for (var index in val) {
                sorteio = val[index]
                concurso = sorteio.concurso
                if (concurso === pConcurso) {

                    resAux = sorteio.resultadoOrdenado.replace(/-/g, " ")
                    resultado = sorteio.resultadoOrdenado

                    dezenas = resultado.split("-")

                    //console.log(pConcurso, concurso, resultado, dezenas);
                    //console.log("TESTE", resultado, dezenas)
                    marcarDezenas(dezenas)
                    $('#palpite').val(resAux) // Colocar o resulta no campo de palpites                    
                }

            }
        })
    })
}



function criaCartao2() {


    var cartao = document.getElementById('cartao');
    for (i = 1; i <= 60; i++) {
        name = ("0" + i).substr(-2, 2)
        var li = document.createElement('li');
        li.id = name
        li.innerHTML = name;
        cartao.appendChild(li);
    }

}

function marcarDezenas(pDezenas) {
    aux = $('#palpite').val()
    //console.log("AYX...:",aux)
    limparCartao();
    $('#palpite').val(aux)

    for (i = 0; i < pDezenas.length; i++) {
        dezena = pDezenas[i];
        //console.log(dezena[i]);
        document.getElementById(dezena).style.backgroundColor = "red"; document.getElementById(dezena).style.color = "white";
    }
}

function limparCartao() {
    for (i = 1; i <= 60; i++) {
        dezena = ("0" + i).substr(-2, 2);
        //console.log(dezena);
        document.getElementById(dezena).style.backgroundColor = "white"; document.getElementById(dezena).style.color = "black";
        $('#palpite').val("")
    }
}

function verificarPalpite() {

    pPalpite = $('#palpite').val()
    pPalpite = pPalpite.split(" ")
    //console.log(pPalpite)
    // 01 02 03 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20

    $('#qtdeQuadras').val("0")
    $('#qtdeQuinas').val("0")
    $('#qtdeSenas').val("0")

    $.getJSON("megasena.json", function (data) {
        //                    console.log(data.data[0])                    
        $.each(data, function (key, val) {


            ///////////////////////////////////////
            quantQuadras = 0
            quantQuinas = 0
            quantSenas = 0

            for (var index in val) {
                sorteio = val[index]
                concurso = sorteio.concurso

                resultado = sorteio.resultadoOrdenado
                resultado = resultado.split("-")
                intersec = pPalpite.filter(value => -1 !== resultado.indexOf(value))

                if (intersec.length > 3) {
                    switch (intersec.length) {
                        case 4: quantQuadras++
                            $('#qtdeQuadras').val(`${quantQuadras}`)
                            break;
                        case 5: quantQuinas++
                            $('#qtdeQuinas').val(`${quantQuinas}`)
                            break;
                        case 6: quantSenas++
                            $('#qtdeSenas').val(`${quantSenas}`)
                            break;

                    }
                    /*
                                        console.log('Concurso..:' + concurso)
                                        console.log('pPalpite..:' + pPalpite)
                                        console.log('Resultado..:' + resultado, intersec)
                                        console.log('Intersec..:' + intersec)
                                        console.log('Tamanho..:' + intersec.length)
                    */

                }
            }
            // console.log(`Quadras..: ${quantQuadras}  Quinas..: ${quantQuinas} Senas..: ${quantSenas}`)
            return

        })
    })

}

function marcarPalpites() {
    pPalpite = ($('#palpite').val()).trim()
    pPalpite = pPalpite.split(" ")
    //console.log(pPalpite)
    marcarDezenas(pPalpite)
}

function selecionaDezena(pDezenaSelecionada) {
    p = pDezenaSelecionada
    document.getElementById(p).style.backgroundColor = "red"; document.getElementById(p).style.color = "white";
}

function teste(pEvento) {

    tmp = pEvento
    tmp.preventDefault();
    //console.log(tmp, tmp.type, tmp.buttons)

    if (tmp.type === "mouseover" && tmp.buttons === 0) return

    corElemento = tmp.srcElement.style.backgroundColor
    if (corElemento === "red") {
        tmp.srcElement.style.backgroundColor = "white"
        tmp.srcElement.style.color = "black"
        aux = $('#palpite').val()
        aux = aux.replace(`${tmp.srcElement.id} `, "")
        $('#palpite').val(aux)

    } else {
        tmp.srcElement.style.backgroundColor = "red"
        tmp.srcElement.style.color = "white"
        aux = $('#palpite').val() + `${tmp.srcElement.id} `
        $('#palpite').val(aux)

    }
    //document.getElementById(p).style.backgroundColor = "red"; document.getElementById(p).style.color = "white";
}

function moverPalpite(pOperacao) {
    aux = $('#palpite').val()
    aux = aux.trim()
    vetor = aux.split(" ")
    //console.log(vetor)
    novoPalpite = ""
    for (i = 0; i < vetor.length; i++) {
        aux2 = parseInt(vetor[i]) + pOperacao
        if (aux2 === 61 && pOperacao === +1) { aux2 = 1 } // Para a direita
        if (aux2 === 0 && pOperacao === -1) { aux2 = 60 } // Para a esquerda
        if (aux2 <= 0 && pOperacao === -10) { aux2 += 60 } // Para cima
        if (aux2 > 60 && pOperacao === +10) { aux2 -= 60 } // Para baixo
        novoPalpite += ("0" + aux2).substr(-2, 2) + " ";
    }
    $('#palpite').val(novoPalpite)
    marcarPalpites()
    //console.log(novoPalpite.trim())
    verificarPalpite()

}



