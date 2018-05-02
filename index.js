const fs = require('fs');
const request = require('request');

var items = {
    title: {
        inicio: '<h3>',
        final: '</h3>'
    },
    desc: {
        inicio: '<p class="desc">',
        final: '</p>'
    }
}

var temporadas = 29;
var temporada = 1;

var doc = 'LISTADO DE LOS CAPÍTULOS DE LOS SIMPSONS \n\n';

for(var i = 1; i <= temporadas; i++){
    request('https://www.simpsonizados.org/simpsons-temporada-' + i + '.html',
        (error,res,body)=>{
            if(error) return console.log(error);
            formato(body);
            if(temporada == temporadas + 1) return saveFile();
        });
}

    /* Este es un ejemplo de String */

function formato(body){
    let contador = 1;

    let seccionCapitulos = body.substring(
        body.indexOf('<div class="capitulo">'),
        body.indexOf('<div class="side">')
    );

    let capitulos = seccionCapitulos.split('<div class="capitulo">');
    capitulos.shift();

    doc += '-----------------------Temporada ' + temporada + '-----------------------\n';

    capitulos.forEach(capitulo => {

        titulo = capitulo.substring(
            capitulo.indexOf(items.title.inicio) + items.title.inicio.length,
            capitulo.indexOf(items.title.final),
        );
        titulo = titulo.split(' ');
        titulo.shift();

        descripcion = capitulo.substring(
            capitulo.indexOf(items.desc.inicio) + items.desc.inicio.length,
            capitulo.indexOf(items.desc.final),
        );
        if(descripcion.substr(-1,2) == '\n'){
            descripcion = descripcion.replace('\n','');
        }

        doc += 'Capítulo ' + contador + ': ' + titulo + '\n';
        doc += descripcion + '\n\n';

        contador ++;

    });

    temporada++;

}

function saveFile(){
    fs.writeFile(__dirname + '/listado_capitulos.txt',doc,(err)=>{
        if(err) console.log(err);
    });
}