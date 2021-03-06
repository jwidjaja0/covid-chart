<?php
    require 'header.php';

    $allCountries = ['USA', 'UK', 'Sweden', 'Spain', 'Italy',
        'China', 'Brazil', 'India', 'Russia', 'Pakistan', 'Indonesia'];

    $defCountries = array_slice($allCountries, 0, 5);
    $defStat = "Deaths";
    if(isset($_SESSION['userId'])){
        require 'includes/loadPref.inc.php';
    }
?>

<script>
    var countries = <?php echo json_encode($allCountries); ?>;
    var defCountries = <?php echo json_encode($defCountries); ?>;
    var stat = <?php echo json_encode($defStat); ?>;
</script>

<div class="title">
    <p>Welcome
    <?php
    if(isset($_SESSION['userId'])){
        echo  $_SESSION['userUid'] . '!';
    }
    else echo 'guest!';
    ?>
    </p>
    <p>Data Source: John Hopkins CSSE</p>
</div>

<div>

    <div id="dashboard_div">
        <div id="linechart" class="chart"></div>
        <div id="filter_div"></div>

    </div>
</div>

<div class="container" id="options">

    <div class="opt">
        <label for="list-countries">Countries</label>
        <select class="sel-opt" size="6" multiple="multiple" id="list-countries">

        </select>
        <button onclick="updateCountries()">
            update!
        </button>
    </div>
    <div class="opt">
        <label for="stats">Stats</label>
        <select id="stats">
            <option value="Deaths">Deaths</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Recovered">Recovered</option>
            <option value="Active">Active</option>
        </select>
        <button onclick="updateStats()">update!</button>
    </div>



    <div id="savePref">
        <button onclick="savePref()">Save Pref</button>
    </div>

    <div id="result">

    </div>


</div>


<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

<script src="functions.js"></script>
<script>

    //add countries to select
    var listCountries = document.getElementById('list-countries');

    for(var i = 0; i < countries.length; i++){
        var option = document.createElement('option');

        option.value = countries[i];
        option.text = countries[i];
        listCountries.add(option);

        if(defCountries.includes(countries[i])){
            listCountries.options[i].selected = true;
        }
    }

    //highlight selected stat
    //var stat has the stat we want to highlight
    for (var option of document.getElementById("stats").options) {
        if(option.value == stat){
            option.selected = true;
        }
    }

    function savePref(){
        var statpref = $('#stats').val();
        var listCountries = document.getElementById('list-countries');
        var selected = [];
        for(var i = 0; i < listCountries.options.length; i++){
            if(listCountries.options[i].selected === true){
                selected.push(listCountries.options[i].value);
            }
        }
        //selected is now filled with selected elements
        $.ajax({
            method: 'POST',
            url : 'includes/pref.inc.php',
            data : { 'selCountries[]' : selected, 'statPref' : statpref},
            success : function(res){
                // console.log('ajax sent success');
                // $('#result').html(res);
                alert(res);
            }
        })
    }
</script>

<?php
    require 'footer.php';
?>