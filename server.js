//Installato e richiesto il modulo di mongodb
let mongo = require("mongodb");
//Prelevo la parte del modulo per la gestione del client mongo
let mongoClient = mongo.MongoClient;
let  urlServerMongoDb = "mongodb://127.0.0.1:27017/";


let http = require("http");
let url = require("url");

let database = "DB_Hotel";
let op;

//DEFINISCO IL SERVER
let json;
let server = http.createServer(function(req, res){
    //Avverto il browser che ritorno un oggetto JSON
    res.setHeader('Content-Type', 'application/json');

    //Decodifico la richiesta ed eseguo la query interessata
    let scelta = (url.parse(req.url)).pathname;
    switch(scelta){
        case "/i1":
            insertMany(res, "ospiti",
                [
                    {_id:1, nome:"Carlo", cognome:"Ferrero", residenza:"Fossano", anni:54},
                    {_id:2, nome:"Leopoldo", cognome:"Marengo", residenza:"Cuneo", anni:65},
                    {_id:3, nome:"Mattia", cognome:"Manzo", residenza:"Bra", anni:22},
                    {_id:4, nome:"Rosanna", cognome:"Gelso", residenza:"Savigliano", anni:35},
                    {_id:5, nome:"Margherita", cognome:"Pea", residenza:"Cuneo", anni:18},
                    {_id:6, nome:"Leone", cognome:"Manzo", residenza:"Fossano", anni:43},
                    {_id:7, nome:"Albana", cognome:"Renzi", residenza:"Bra", anni:48},
                    {_id:8, nome:"Elisa", cognome:"Basso", residenza:"Savigliano", anni:31}
                ]);
            break;

        case "/i2":
            insertMany(res, "soggiorni",
                [
                    {cliente:4, anticipo:25, data:new Date("2020-08-16"), costoBase:150, extra:[{desc:"spumante", spesa:33},{desc:"cena", spesa:45}]},
                    {cliente:3, anticipo:15, data:new Date("2020-09-18"), costoBase:100, extra:[{desc:"bibita", spesa:4.5},{desc:"panini", spesa:15}]},
                    {cliente:4, anticipo:10, data:new Date("2020-10-23"), costoBase:50, extra:[{desc:"aperitivo", spesa:16},{desc:"cocktail", spesa:10}]},
                    {cliente:6, anticipo:150, data:new Date("2020-11-27"), costoBase:50},
                    {cliente:5, anticipo:500, data:new Date("2020-12-03"), costoBase:300, extra:[{desc:"auto", spesa:400},{desc:"spiaggia", spesa:100}]},
                    {cliente:2, anticipo:100.0, data:new Date("2021-01-14"), costoBase:250, extra:[{desc:"massaggio", spesa:100},{desc:"spiaggia", spesa:50}]},
                    {cliente:8, anticipo:70, data:new Date("2021-01-20"), costoBase:100, extra:[{desc:"pranzo", spesa:60},{desc:"panini", spesa:15}]},
                    {cliente:1, anticipo:25, data:new Date("2021-01-22"), costoBase:150, extra:[{desc:"safari", spesa:200},{desc:"cena", spesa:45}]},
                    {cliente:8, anticipo:20, data:new Date("2021-01-22"), costoBase:100, extra:[{desc:"piscina", spesa:20},{desc:"palestra", spesa:15}]},
                    {cliente:3, anticipo:150, data:new Date("2021-01-27"), costoBase:50, extra:[{desc:"bibita", spesa:6},{desc:"cena", spesa:60}]}
                ]);
            break;

        case "/q1":
            
            break;

        default:
            json = {cod:-1, desc:"Nessuna query trovata con quel nome"};
            res.end(JSON.stringify(json));
    }
});

server.listen(8888, "127.0.0.1");
console.log("Il server è in ascolto sulla porta 8888");

function creaConnessione(nomeDb, response, callback){
    console.log(mongoClient);
    let promise = mongoClient.connect(urlServerMongoDb);
    promise.then(function(connessione){
        callback(connessione, connessione.db(nomeDb))
    });
    promise.catch(function(err){
        json = {cod:-1, desc:"Errore nella connessione"};
        response.end(JSON.stringify(json));
    });
}

function find(res, col, obj, select){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).find(obj).project(select).toArray();
        promise.then(function(ris){
            //console.log(ris);
            obj = { cod:0, desc:"Dati trovati con successo", ris};
            res.end(JSON.stringify(obj));
            conn.close();
        });
        promise.catch(function(error){
            obj = { cod:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

function find2(res, col, obj, select, callback){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).find(obj).project(select).toArray();
        promise.then(function(ris){
            conn.close();
            callback(ris);
        });
        promise.catch(function(error){
            obj = { cod:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

function limit(res, col, obj, select, n){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).find(obj).project(select).limit(n).toArray();
        promise.then(function(ris){
            //console.log(ris);
            obj = { cod:0, desc:"Dati trovati con successo", ris};
            res.end(JSON.stringify(obj));
            conn.close();
        });
        promise.catch(function(error){
            obj = { cod:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

function sort(res, col, obj, select, orderby){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).find(obj).project(select).sort(orderby).toArray();
        promise.then(function(ris){
            //console.log(ris);
            obj = { cod:0, desc:"Dati trovati con successo", ris};
            res.end(JSON.stringify(obj));
            conn.close();
        });
        promise.catch(function(error){
            obj = { cod:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

function cont(res, col, query){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).countDocuments(query);
        promise.then(function(ris){
            //console.log(ris);
            json = { cod:0, desc:"Dati trovati con successo", ris};
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function(error){
            json = { cod:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(json));
            conn.close();
        });
    });
}

function cont2(res, col, query){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).count(query);
        promise.then(function(ris){
            //console.log(ris);
            json = { cod:0, desc:"Dati trovati con successo", ris};
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function(error){
            json = { cod:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(json));
            conn.close();
        });
    });
}

function insertOne(res, col, obj){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).insertOne(obj);
        promise.then(function(ris){
            json = { cod:1, desc:"Insert in esecuzione", ris };
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function(err){
            obj = { cod:-2, desc:"Errore nell'inserimento"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

function insertMany(res, col, array){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).insertMany(array);
        promise.then(function(ris){
            json = { cod:1, desc:"Insert in esecuzione", ris };
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function(err){
            json = { cod:-2, desc:"Errore nell'inserimento"}
            res.end(JSON.stringify(json));
            conn.close();
        });
    });
}

function update(res, col, array, modifica) {
    creaConnessione(database, res, function (conn, db) {
        let promise = db.collection(col).updateMany(array, modifica);
        promise.then(function (ris) {
            json = {cod: 1, desc: "Update in esecuzione", ris};
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function (err) {
            json = {cod: -2, desc: "Errore nella modifica"}
            res.end(JSON.stringify(json));
            conn.close();
        });
    });
}

function remove(res, col, where) {
    creaConnessione(database, res, function (conn, db) {
        let promise = db.collection(col).deleteMany(where);
        promise.then(function (ris) {
            json = {cod: 1, desc: "Insert in esecuzione", ris};
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function (err) {
            json = {cod: -2, desc: "Errore nella cancellazione"}
            res.end(JSON.stringify(json));
            conn.close();
        });
    });
}

// Aggregate --> aggregazione di funzioni di ricerca
// Opzioni --> array di oggetti dove ogni oggetto è un filtro che vogliamo applicare alla collezione
function aggregate (res, col, opzioni){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).aggregate(opzioni).toArray();
        promise.then(function(ris){
            json = { cod:0, desc:"Dati trovati con successo", ris};
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function(error){
            json = { cod:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(json));
            conn.close();
        });
    });
}

function updateOne(res, col, where, modifica){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).updateOne(where, modifica);
        promise.then(function(ris){
            json = { cod:1, desc:"Update effettuata", ris };
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function(err){
            obj = { cod:-2, desc:"Errore nell'update"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

function replaceOne(res, col, where, modifica){
    creaConnessione(database, res, function(conn, db){
        let promise = db.collection(col).replaceOne(where, modifica);
        promise.then(function(ris){
            json = { cod:1, desc:"Update effettuata", ris };
            res.end(JSON.stringify(json));
            conn.close();
        });
        promise.catch(function(err){
            obj = { cod:-2, desc:"Errore nell'update"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}