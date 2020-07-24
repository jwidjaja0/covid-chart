class RawData {
    constructor(listCountries, startDate, endDate) {
        this.listCountries = listCountries; //arrays
        this.startDate = startDate; //string
        this.endDate = endDate;
        if(endDate == ""){
            var today = new Date();
            var month = today.getMonth();
            if(month < 10){
                month = '0' + month;
            }
            var day = today.getDate();
            if(day < 10){
                day = '0' + day;
            }
            endDate = today.getFullYear() + "-" + month + "-" + day;
        }

    }
}