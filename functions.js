function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

$(window).resize(function(){
    drawChart();
});

function updateCountries(){
    countries = $('#listCountries').val();
    drawChart();
}

function populateData(){

}


//list of countries interested
var countries = ['USA', 'UK', 'Sweden', 'Italy', 'South Korea', 'South Africa'];

//Create 2D array, first layer: countries, second: deaths for each countries per day
var allDeaths = new Array(countries.length);
for(var i =0; i < allDeaths.length; i++){
    allDeaths[i] = [];
}

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};
var baseUrl = 'https://api.covid19api.com';
var dateStart = '2020-03-01';
var dateEnd = '2020-07-18';

//indicator to populate date array, only once (first iteration), set true after so subsequent population will ignore date.
var isDateParsed = false;

var dateArr = [];

for(var a = 0; a < allDeaths.length; a++){
    var country = countries[a];
    var url = baseUrl + "/total/country/" + country + "?from=" + dateStart + "&to=" + dateEnd;

    //Get the json object based on parameters defined above
    var jsonObj = JSON.parse(Get(url));

    var deathArr = new Array();
    for(var i = 0; i < jsonObj.length; i++){
        var obj = jsonObj[i];
        allDeaths[a].push(obj.Deaths);

        if(!isDateParsed){
            var date1 = obj.Date;
            // date1 = date1.substring(0,10);
            dateArr.push(date1);
        }
    }
    isDateParsed = true;
}

google.charts.load('current', {packages: ['corechart', 'line', 'table']});
google.charts.setOnLoadCallback(function() {
    drawChart()
});
//google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var arr = countries.slice();
    arr.unshift('Day'); //add day to array, so country name matches exactly what was on the request

    var data = new google.visualization.DataTable();
    data.addColumn('date', arr[0]);
    for(var b = 1; b < arr.length; b++){
        data.addColumn('number', arr[b]);
    }

    for(var i = 0; i < allDeaths[0].length; i++){
        var row = new Array();
        row.push(new Date(dateArr[i]));
        for(var c = 0; c < allDeaths.length; c++){
            row.push(allDeaths[c][i]);
        }
        data.addRows(new Array(row));
    }


    var options = {
        legend: {position: 'bottom'},
        title: 'Total deaths since ' + dateStart,
        height: 600


    };
    var chart = new google.visualization.LineChart(document.getElementById('linechart_material'));
    chart.draw(data, options);

    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
}
