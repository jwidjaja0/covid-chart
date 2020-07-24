//TODO:Think about caching

//TEST CLASS
class RawData {
    constructor(listCountries, startDate, endDate) {
        listCountries.sort();
        this.listCountries = listCountries; //array
        this.startDate = startDate; //string
        this.endDate = endDate;

        //hack for default parameter, if blank, sets to today's date..
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
        this.numberPoints = this.Deaths[0].length;
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
                    date1 = date1.substring(0,10);

                    var yr = parseInt(date1.substring(0,4));
                    var mnth = parseInt(date1.substring(5,7));
                    var dt = parseInt(date1.substring(8,10));

                    this.dateArr.push(new Date(yr, (mnth-1), dt));
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
    setChart(stat);
});

function updateCountries(){
    countries = $('#list-countries').val(); //get selected countries
    rawData = new RawData(countries, dateStart, "");

    //TODO: need to be able to change to other stats;
    setChart("Deaths");
}

function updateStats(){
    stat = $('#stats').val();
    setChart(stat);
}

//list of countries interested
var countries = ['USA', 'UK', 'Sweden', 'Italy', 'South Korea', 'South Africa',
                    'Australia'];

var dateStart = '2020-03-15';
var rawData = new RawData(countries, dateStart, "");
var stat = "Deaths"; //initial stat

google.charts.load('current', {packages: ['corechart', 'line', 'table', 'controls']});
google.charts.setOnLoadCallback(function() {
    setChart("Deaths")
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

    // //Test controls, create dashboard
    // var dashboard = new google.visualization.Dashboard(
    //     document.getElementById("dashboard_div"));

    // //create range slider, passing options
    // var dateSlider = new google.visualization.ControlWrapper({
    //     'controlType' : 'DateRangeFilter',
    //     'containerID' : 'filter_div',
    //     'options' : {
    //         'filterColumnLabel': 'date'
    //     },
    // });

    var options = {
        legend: {position: legPos},
        title: 'Total ' + stat.toLowerCase() + ' since ' + dateStart,
        height: 600,
        vAxis: {
            title: 'Total ' + stat,
        },

        hAxis: {
            title: 'Date'
        }
    };

    //test controls
    // var chart = new google.visualization.ChartWrapper({
    //     chartType : 'LineChart',
    //     containerID : 'linechart',
    //     dataTable : data,
    //     options : {
    //         'height' : 600,
    //         'legend': 'bottom',
    //         'vAxis' : {
    //             'title': 'Total ' + stat
    //         },
    //         'hAxis' : {
    //             'title': 'Date'
    //         }
    //     }
    // })

    // dashboard.bind(dateSlider, chart);
    // dashboard.draw(data);

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


