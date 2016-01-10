var fs = require('fs');
var http = require('http');
var flow = require('xml-flow');
var unrar = require('node-unrar');

var mongoose = require('mongoose');
var config = require('./config');
var Item = require('./item');
var XML_NAME = 'sprav_org.xml';
var RAR_NAME = 'sprav_org.rar';

function ExtractXML() {
    console.log('Start extracting...');

    // библиотека node-unrar странно работает,
    // если распаковываемый файл существует - не перезаписывает и ошибки никакой не выдает,
    // поэтому удалю старый XML файл перед распаковкой
    try { // не круто использовать try/catch, надо проверять через fs.access, но просто так быстрее
        fs.unlinkSync(XML_NAME);
    } catch (e) {
        // It isn't accessible
    }

    var rar = new unrar(RAR_NAME);
    rar.extract('./', null, function (err) {
        if (err) {
            console.log('XML extracting error: '+err);
        }
        console.log('XML extracting complete!');
        DropItems();
    });
} // ExtractXML()

function DropItems() {
    // перед тем как загружать данные из файла - удалим данные в базе
    // загрузить данные по-новой получается сильно быстрее, чем делать findOneAndUpdate
    Item.remove({}, function(err) {
        if (err) {
            console.log('Error drop Items collection in database: '+err);
        }
        ConvertXML();
    });
}

function ConvertXML() {

    var updateDate = fs.statSync(XML_NAME).mtime;
    var inFile = fs.createReadStream(XML_NAME);

    var xmlStream = flow(inFile);
    var countTotal = 0;
    xmlStream.on('tag:detail', function(item) {
        countTotal = countTotal + 1;
        var new_item = new Item({
            _id: item.owner_id,
            full_name: item.full_name,
            short_name: item.short_name,
            inn: item.inn,
            kpp: item.kpp,
            country_code: item.country_code,
            region_code: item.region_code,
            dejure_address: item.dejure_address,
            fact_address: item.fact_address,
            status: item.id,
            updated_at: updateDate// Date.now()
        });

        new_item.save(function(err) {
            if (err) {
                // 11000 - special code about existing object in MongoDB
                if (err.code == 11000) {
                    // console.log(item.owner_id + ' already exists!');
                } else {
                    // some other erros write to console
                    console.log('Error save Item in database: ' + err);
                }
            }
            else {
                // console.log(item.owner_id + ' added!');
            }
        }); // end save to MongoDB

        // слишком долго, проще убить коллекцию записей и записать по-новой
        // Item.findOneAndUpdate({ ' _id': item.owner_id }, new_item, { upsert: true }, function(err, doc) {
        //     if (err) {
        //         console.log('Error save/update Item in database: ' + err);
        //     }
        //     else {
        //         // console.log(item.owner_id + ' added!');
        //     }
        // });

    });

    xmlStream.on('end', function() {
        console.log('==================================');
        console.log('Обработано всего: ' + countTotal);
        //process.exit(0);
    });
}

// mongoose.connect(config.database, function(err) {
mongoose.connect(config.database, {auth: { authdb: 'admin' }}, function(err) {
    console.log('Connection string: '+config.database); // for debugging only
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to DB!");
        // сначала скачаем свежий файл с egais.ru
        // затем запускаем распаковку и конвертацию
        var tempfile = fs.createWriteStream("sprav_org.rar");
        var request = http.get("http://egais.ru/files/sprav_org.rar ", function(response) {
          response.pipe(tempfile);
          response.on('end', ExtractXML); // когда скачивание завершено - запускаем распаковку
        });

    }
});
