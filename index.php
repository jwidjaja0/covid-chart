<?php
    require 'header.php';
?>


<main role="main" class="container">
    <p>Data Source: John Hopkins CSSE</p>
</main>

<div>

    <div id="dashboard_div">
        <div id="linechart" class="chart"></div>
        <div id="filter_div"></div>

    </div>
</div>

<div class="container" id="options">

    <div class="opt">
        <label for="list-countries">Countries</label>
        <select multiple="multiple" id="list-countries">

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

    <?php
        if(isset($_SESSION['userId'])){
            echo '<p>You are logged in!</p>';
        }
        else{
            echo '<p>You are logged out!</p>';
        }
    ?>


</div>


<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

<script src="functions.js"></script>
<script>
    var listCountries = document.getElementById('list-countries');

    for(var i = 0; i < countries.length; i++){
        var option = document.createElement('option');
        option.value = countries[i];

        option.text = countries[i];
        listCountries.add(option);
        listCountries.options[i].selected=true;
    }
</script>

<?php
    require 'footer.php';
?>