const { response } = require("express")

$(function(){

})

function showImage(name, type){
    //1 - Limpar a pop up
    //2 - Escrever na pop up
    //3 - Apresentar a pop up

    $('#display').empty()

    if(type == "image/jpeg" || type == "image/png"){
            var ficheiro = $('<img src="/fileStore/' + name + '"width="80%"/>') 
            var download = $('<div><a href="/download/' + name + '">Download</a></div>')
            $('#display').append(ficheiro,download)
            $('#display').modal()
        
    }else if(type == "application/json"){
        $.get('/fileContents/' + name, (response) => {
            var content = JSON.stringify(response)
            var ficheiro = $("<pre>" + content + "</pre>")
            var download = $('<div><a href="/download/' + name + '">Download</a></div>')
            $('#display').append(ficheiro,download)
            $('#display').modal()
        })

    }else if(type == "text/html"){
        $.get('/fileContents/' + name, (response) => {
            var ficheiro = $(response)
            var download = $('<div><a href="/download/' + name + '">Download</a></div>')
            $('#display').append(ficheiro,download)
            $('#display').modal()
        })
        
    }else{
        var ficheiro = $('<p>' + name + '</p>')
        var download = $('<div><a href="/download/' + name + '">Download</a></div>')
        $('#display').append(ficheiro,download)
        $('#display').modal()

    }
}