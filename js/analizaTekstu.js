
var poczatek = 'https://watson-api-explorer.mybluemix.net/natural-language-understanding/api/v1/analyze?version=2017-02-27&text='

var przykladowaTresc = 'A%20blade%20runner%20must%20pursue%20and%20try%20to%20terminate%20four%20replicants%20who%20stole%20a%20ship%20in%20space%20and%20have%20returned%20to%20Earth%20to%20find%20their%20creator.'

var parametry = '&features=concepts%2Centities%2Ckeywords%2Ccategories%2Cemotion%2Csentiment%2Crelations%2Csemantic_roles&return_analyzed_text=true&clean=true&fallback_to_raw=true&concepts.limit=10&emotion.document=true&entities.limit=50&entities.emotion=true&entities.sentiment=true&keywords.limit=50&keywords.emotion=true&keywords.sentiment=true&relations.model=en-us&semantic_roles.limit=50&semantic_roles.entities=true&semantic_roles.keywords=true&sentiment.document=true&limit_text_characters=800'

var zwrotnyJson = null;

var zapytanieHttp = null;

function Ladowanie()
{
	document.getElementById( "guziki" ).innerHTML = '<div class="loader"></div>';
}


function ZapytajWatsona()
{

    // PRZECHWYĆ TEKST:
    var ToCoWpiszeUzytkownik = document.getElementById( "tekstUzytkownika" ).value;
    
	// KONWERTUJ NA LINK:
	var trescUrl = ZamianaNaUrl(ToCoWpiszeUzytkownik);
	
    // ZAMIEŃ GO NA ADRES: var adresUrl = poczatek + ToCoWpiszeUzytkownik + parametry;
    var adresUrl = poczatek + trescUrl + parametry;

    zapytanieHttp = new XMLHttpRequest(); 
    zapytanieHttp.onreadystatechange = CoNaToWatson;
    zapytanieHttp.open( "GET", adresUrl, true );
    zapytanieHttp.send( null );
}

function ZamianaNaUrl(tekstUzytkownika)
{
	var zakazane = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; // pomiedzy /.../ są zakazane regular expresions, a 'i' oznacza case-insensitive, a 'g' - global - czyli wszystkie wystapienia wyłapie
	var bezSpecjalnych = tekstUzytkownika.replace(zakazane, "<a href='$1'>$1</a>");
	var poKonwersji = bezSpecjalnych.replace(/ /ig,"%20");
	return poKonwersji
}

function CoNaToWatson() 
{
    if ( zapytanieHttp.readyState == 4 && zapytanieHttp.status == 200 ) 
    {
        if ( zapytanieHttp.responseText == "Not found" ) 
        {
            console.log('nie znaleziono');
            document.getElementById( "tresci" ).innerHTML = "O nie, jesteśmy zgubieni.";
        }
        else
        {
        	console.log('dostalem zwrot z serwera');
        	var zwrot = zapytanieHttp.responseText;
        	//console.log(zwrot);

			zwrotnyJson = JSON.parse(zapytanieHttp.responseText);
        	
        	var jezyk = zwrotnyJson.language;

        	// ZWRÓĆ GUZIKI
			document.getElementById( "guziki" ).innerHTML = '<button type="button" class="btn btn-primary" onclick="pokazKategorie()" style="margin: 10px 5px 10px 0px">Kategorie</button><button type="button" class="btn btn-primary" onclick="pokazKoncepcje()" style="margin: 10px 5px 10px 0px">Koncepcje</button><button type="button" class="btn btn-primary" onclick="pokazPodmioty()" style="margin: 10px 5px 10px 0px">Podmioty</button><button type="button" class="btn btn-primary" onclick="pokazSlowaKluczowe()" style="margin: 10px 5px 10px 0px">Słowa kluczowe</button><button type="button" class="btn btn-warning" onclick="" style="margin: 10px 5px 10px 0px">Semantyka</button><button type="button" class="btn btn-warning" onclick="" style="margin: 10px 5px 10px 0px">Emocje</button><button type="button" class="btn btn-warning" onclick="" style="margin: 10px 5px 10px 0px">Relacje</button>'

        	document.getElementById( "tresci" ).innerHTML = '<br> Wykryto język: "'+ jezyk +'".';

        	return zwrotnyJson;
        }                    
    }
}

function pokazSlowaKluczowe()
{
	document.getElementById( "tresci" ).innerHTML = "<br><h3>Słowa Kluczowe</h3>";

	if (zwrotnyJson.keywords == undefined) {
		document.getElementById( "tresci" ).innerHTML += 'W tekście brak słów kluczowych.';
	} else {
		for (i in zwrotnyJson.keywords) {
			
			var slowoKlucz = zwrotnyJson.keywords[i].text;	
			var znaczenie = 100*(zwrotnyJson.keywords[i].relevance);

			var smutek = 100*(zwrotnyJson.keywords[i].emotion.sadness);
			var radosc = 100*(zwrotnyJson.keywords[i].emotion.joy);
			var strach = 100*(zwrotnyJson.keywords[i].emotion.fear);
			var wstret = 100*(zwrotnyJson.keywords[i].emotion.disgust);
			var zlosc = 100*(zwrotnyJson.keywords[i].emotion.anger);
			
			document.getElementById( "tresci" ).innerHTML += '<br><h5>'+ slowoKlucz + '</h5><div class="progress" style="margin-top: 5px"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + znaczenie + '" aria-valuemin="0" aria-valuemax="100" style="width:' + znaczenie + '%">' + Math.round(znaczenie*10)/10 + '% znaczenia w zdaniu</div></div>';
			document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + smutek + '" aria-valuemin="0" aria-valuemax="100" style="width:' + smutek + '%"; color: red">' + Math.round(smutek*10)/10 + '% smutku</div></div>';
			document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + radosc + '" aria-valuemin="0" aria-valuemax="100" style="width:' + radosc + '%">' + Math.round(radosc) + '% radości</div></div>';
			document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + strach + '" aria-valuemin="0" aria-valuemax="100" style="width:' + strach + '%">' + Math.round(strach*10)/10 + '% strachu</div></div>';
			document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="' + wstret + '" aria-valuemin="0" aria-valuemax="100" style="width:' + wstret + '%">' + Math.round(wstret*10)/10 + '% wstrętu</div></div>';
			document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="' + zlosc + '" aria-valuemin="0" aria-valuemax="100" style="width:' + zlosc + '%">' + Math.round(zlosc*10)/10 + '% złości</div></div>';
		}
	}
}

function pokazPodmioty() 
{
	document.getElementById( "tresci" ).innerHTML = "<br><h3>Podmioty</h3>";
	
	if (zwrotnyJson.entities == undefined) {
		document.getElementById( "tresci" ).innerHTML += 'W tekście brak jest podmiotów.';
	} else {
		for (i in zwrotnyJson.entities) {
			var slowoKlucz = zwrotnyJson.entities[i].text;
			var typ = zwrotnyJson.entities[i].type;
			var sentyment = zwrotnyJson.entities[i].sentiment.score;	
			var ileRazy = zwrotnyJson.entities[i].count;		
			var istotnosc = 100*(zwrotnyJson.entities[i].relevance);

			document.getElementById( "tresci" ).innerHTML += '<br><h5>'+ slowoKlucz + '</h5> zostaje wymienione w tekście: '+ileRazy+' raz. Należy do kategorii: <b>'+typ+'</b> i może oznaczać: ';
			
			for (x in zwrotnyJson.entities[i].disambiguation.subtype) {
				var znaczenie = zwrotnyJson.entities[i].disambiguation.subtype[x];
				znaczenie = znaczenie.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
				document.getElementById( "tresci" ).innerHTML += '<b>'+znaczenie+ '</b>; ';
			}

			document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 5px"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + istotnosc + '" aria-valuemin="0" aria-valuemax="100" style="width:' + istotnosc + '%">' + Math.round(istotnosc*10)/10 + '% znaczenia w zdaniu</div></div>';
			
			if (zwrotnyJson.entities[i].emotion == undefined) {
					document.getElementById( "tresci" ).innerHTML += 'W tym podmiocie nie udało się wyróżnić żadnych emocji.';
				} else {
					var smutek = 100*(zwrotnyJson.entities[i].emotion.sadness);
					var radosc = 100*(zwrotnyJson.entities[i].emotion.joy);
					var strach = 100*(zwrotnyJson.entities[i].emotion.fear);
					var wstret = 100*(zwrotnyJson.entities[i].emotion.disgust);
					var zlosc = 100*(zwrotnyJson.entities[i].emotion.anger);
					document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + smutek + '" aria-valuemin="0" aria-valuemax="100" style="width:' + smutek + '%"; color: red">' + Math.round(smutek*10)/10 + '% smutku</div></div>';
					document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + radosc + '" aria-valuemin="0" aria-valuemax="100" style="width:' + radosc + '%">' + Math.round(radosc) + '% radości</div></div>';
					document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + strach + '" aria-valuemin="0" aria-valuemax="100" style="width:' + strach + '%">' + Math.round(strach*10)/10 + '% strachu</div></div>';
					document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="' + wstret + '" aria-valuemin="0" aria-valuemax="100" style="width:' + wstret + '%">' + Math.round(wstret*10)/10 + '% wstrętu</div></div>';
					document.getElementById( "tresci" ).innerHTML += '<div class="progress" style="margin-top: 2px"><div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="' + zlosc + '" aria-valuemin="0" aria-valuemax="100" style="width:' + zlosc + '%">' + Math.round(zlosc*10)/10 + '% złości</div></div>';
				}

		}
		
	}
}

function pokazKategorie() 
{
	document.getElementById( "tresci" ).innerHTML = "<br><h3>Kategorie</h3>";
	
	if (zwrotnyJson.categories == undefined) {
		document.getElementById( "tresci" ).innerHTML += 'W tekście nie znaleziono kategorii.';
	} else {

		for (i in zwrotnyJson.categories) {
			var kategoria = zwrotnyJson.categories[i].label;
			kategoria = kategoria.replace( /\//g, ' &rarr; ');
			var trafnosc = 100*(zwrotnyJson.categories[i].score);
			
			document.getElementById( "tresci" ).innerHTML += '<br><h5>'+ kategoria + '</h5><div class="progress" style="margin-top: 5px"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + trafnosc + '" aria-valuemin="0" aria-valuemax="100" style="width:' + trafnosc + '%">' + Math.round(trafnosc*10)/10 + '% znaczenia w zdaniu</div></div>';
		}
	}
}

function pokazKoncepcje() 
{
	document.getElementById( "tresci" ).innerHTML = "<br><h3>Koncepcje</h3>";
	
	if (zwrotnyJson.concepts == undefined) {
		document.getElementById( "tresci" ).innerHTML += 'W tekście nie udało się wyróżnić koncepcji.';
	} else {

		for (i in zwrotnyJson.concepts) {
			var koncepcja = zwrotnyJson.concepts[i].text;
			var trafnosc = 100*(zwrotnyJson.concepts[i].relevance);
			var zrodlo = zwrotnyJson.concepts[i].dbpedia_resource;

			document.getElementById( "tresci" ).innerHTML += '<b>'+ koncepcja + '</b> (<a href="'+zrodlo+'">LINK: <i>'+koncepcja+'</i></a>) <div class="progress" style="margin-top: 5px"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + trafnosc + '" aria-valuemin="0" aria-valuemax="100" style="width:' + trafnosc + '%">' + Math.round(trafnosc*10)/10 + '% trafność w zdaniu</div></div>';
		}
	}
}