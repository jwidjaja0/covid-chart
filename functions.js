//TODO:Think about caching

//TEST CLASS
class RawData {
    constructor(listCountries, startDate, endDate) {
        this.listCountries = listCountries; //arrays
        this.startDate = startDate; //string
        this.endDate = endDate;

        if(endDate == ""){
            var today = new Date();
            var month = 1+today.getMonth();
            if(month < 10){
                month = '0' + month;
            }
            var day = today.getDate();
            if(day < 10){
                day = '0' + day;
            }
            this.endDate = today.getFullYear() + "-" + month + "-" + day;
        }
        this.dateArr = new Array();

        this.Deaths = new Array(listCountries.length);
        this.Confirmed = new Array(listCountries.length);
        this.Recovered = new Array(listCountries.length);
        this.Active = new Array(listCountries.length);

        //Create 2d array
        for(var i = 0; i < this.Deaths.length; i++){
            this.Deaths[i] = [];
            this.Confirmed[i] = [];
            this.Recovered[i] = [];
            this.Active[i] = [];
        }

        this.getData();
    } //constructor

    getData(){
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        var baseUrl = 'https://api.covid19api.com';

        //indicator to populate date array, only once (first iteration), set true after so subsequent population will ignore date.
        var isDateParsed = false;
        for(var a = 0; a < this.Deaths.length; a++){
            var country = this.listCountries[a];
            var url = baseUrl + "/total/country/" + country + "?from=" + this.startDate + "&to=" + this.endDate;
            console.log(url);

            //Get the json object based on parameters defined above
            var jsonObj = JSON.parse(this.get(url));

            for(var i = 0; i < jsonObj.length; i++){
                var obj = jsonObj[i];
                this.Deaths[a].push(obj.Deaths);
                this.Confirmed[a].push(obj.Confirmed);
                this.Active[a].push(obj.Active);
                this.Recovered[a].push(obj.Recovered);

                if(!isDateParsed){
                    var date1 = obj.Date;
                    // date1 = date1.substring(0,10);
                    this.dateArr.push(date1);
                }
            }
            isDateParsed = true;
        }
    }

    get(url){
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.open("GET",url,false);
        Httpreq.send(null);
        return Httpreq.responseText;
    }


}
$(window).resize(function(){
    setChart();
});

function updateCountries(){
    countries = $('#list-countries').val(); //get selected countries
    allDeaths = new Array(countries.length); //update array
    //TODO: update length of allDeaths equivalent in class
    setChart();
}

function updateStats(){
    var stats = $('#stats').val();
    console.log(stats);
}

//list of countries interested
var countries = ['USA', 'UK', 'Sweden', 'Italy', 'South Korea', 'South Africa'];

var dateStart = '2020-03-15';
//app will get data up to today's date

var stats = "Death";

google.charts.load('current', {packages: ['corechart', 'line', 'table']});
var rawData = new RawData(countries, dateStart, "");

//console.log(rawData.totalDeaths)



google.charts.load('current', {packages: ['corechart', 'line', 'table']});
google.charts.setOnLoadCallback(function() {
    // setChart()
    populateTable(stat);
});

$( document ).ready(function() {
    // console.log('ready to draw');
    // google.charts.setOnLoadCallback(function() {
    //     setChart()
    // });
});

populateTable("Deaths");

function populateTable(stat){
    var header = rawData.listCountries.slice();
    header.unshift('Day'); //add day to array, so country name matches exactly what was on the request

    var data = new google.visualization.DataTable();
    data.addColumn('date', header[0]);
    //add each country to data header
    for(var b = 1; b < header.length; b++){
        data.addColumn('number', header[b]);
    }

    // console.log(stat);

    var all = rawData[stat];

    // //for Test
    // console.log(all);
    // for(var i = 0; i < all[0].length; i++){
    //     console.log(i);
    // }

    //populate data
    // for(var i = 0; i < all[0].length; i++){
    //     var row = [];
    //     row.push(new Date(dateArr[i]));
    //
    //     //for each country
    //     for(var c = 0; c < all.length; c++){
    //         row.push(allDeaths[c][i]);
    //     }
    //
    //     data.addRows(new Array(row));
    // }
    //
    // return data;
}

function setChart(stat) {
    var data = populateTable(stat);

    var options = {
        legend: {position: 'bottom'},
        title: 'Total deaths since ' + dateStart,
        height: 600,
        vAxis: {
            title: 'Total Deaths',
        },

        hAxis: {
            title: 'Date'
        }
    };
    drawChart(data,options);
    drawTable(data);
}

function drawChart(data, options){
    var chart = new google.visualization.LineChart(document.getElementById('linechart_material'));
    chart.draw(data, options);
}

function drawTable(data){
    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data, {
        showRowNumber: false,
        width: '100%',
        height: '100%',
        sortAscending: 'false'});
}


