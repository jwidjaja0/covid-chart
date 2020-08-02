//TODO:Think about caching

$(window).resize(function(){
    setChart(stat);
});

function updateCountries(){
    //get selected countries
    defCountries = $('#list-countries').val(); //get selected countries
    rawData = new RawData(defCountries, dateStart, "");

    //TODO: need to be able to change to other stats;
    setChart("Deaths");
}

function updateStats(){
    stat = $('#stats').val();
    setChart(stat);
}



//list of countries interested
// var countries = ['USA', 'UK', 'Sweden', 'Spain',
//     'Italy', 'China', 'Brazil', 'India', 'Russia', 'Pakistan', 'Indonesia'];

// var defCountries = countries.slice(0,5);

var dateStart = '2020-03-15';
var rawData = new RawData(defCountries, dateStart, "");
// var stat = "Deaths"; //initial stat

google.charts.load('current', {packages: ['corechart', 'line', 'table', 'controls']});
google.charts.setOnLoadCallback(function() {
    setChart(stat)
});


function populateTable(stat){
    var header = rawData.listCountries.slice();
    header.unshift('date'); //add day to array, so country name matches exactly what was on the request array

    var data = new google.visualization.DataTable();
    data.addColumn('date', header[0]);
    //add each country to data header
    for(var b = 1; b < header.length; b++){
        data.addColumn('number', header[b]);
    }

    var all = rawData[stat];

    //Populate data
    for(var i = 0; i < rawData.numberPoints; i++){
        var row = [];
        // row.push(new Date(rawData.dateArr[i]));
        row.push(rawData.dateArr[i]);

        //for each country
        for(var c = 0; c < all.length; c++){
            row.push(all[c][i]);
        }
        data.addRows(new Array(row));
    }

    return data;
}

function setChart(stat) {
    var width = $(window).width();

    var legPos = 'right';
    if(width < 900){
        legPos = 'bottom';
    }

    var data = populateTable(stat);

    var word = "Total";

    var options = {
        legend: {position: legPos},
        title: word + ' ' + stat.toLowerCase() + ' since ' + dateStart,
        height: 600,
        vAxis: {
            title: 'Total ' + stat,
        },

        hAxis: {
            title: 'Date'
        }
    };

    drawChart(data,options);
    //drawTable(data);
}

function drawChart(data, options){
    var chart = new google.visualization.LineChart(document.getElementById('linechart'));
    chart.draw(data, options);
}

function drawTable(data){
    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data, {
        showRowNumber: false,
        width: '100%',
        height: '100%',
        });
}


