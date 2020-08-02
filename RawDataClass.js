class RawData {
    constructor(listCountries, startDate, endDate) {
        // listCountries.sort();
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