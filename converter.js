var fs = require('fs');
var flow = require('xml-flow');

var mongoose = require('mongoose');
var config = require('./config');
var Item = require('./item');

function ConvertXML() {
    //var inFile = fs.createReadStream('./egais_test.xml');
    var inFile = fs.createReadStream('./xmls/sprav_org.xml');
    var xmlStream = flow(inFile);
    var count = 0;

    xmlStream.on('tag:detail', function(item) {
        count = count + 1;
        //console.log(item);
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
            updated_at : Date.now()
        });

        new_item.save(function(err) {
            if (err) {
                // 11000 - special code about existing object in MongoDB
                if (err.code == 11000) {
                    console.log(item.owner_id + ' already exists!');
                } else {
                    // some other erros write to console
                    console.log('Error save Item in database: ' + err);
                }
            }
            else {
                // console.log(item.owner_id + ' added!');
            }
        }); // end save to MongoDB

    });

    xmlStream.on('end', function() {
        console.log('DONE! (' + count + ' items)');
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
        ConvertXML();
    }
});
