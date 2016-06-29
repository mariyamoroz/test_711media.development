(function () {

    document.addEventListener("DOMContentLoaded", ready);
    document.getElementById('clear').addEventListener('click', clearList);
    var form = document.getElementById('form'),
        cityList = document.getElementById('cityList'),
        errorMsg = document.getElementById('errorMsg'),
        preloader = document.getElementById('preloader'),
        cities = [];
    
    function ready() {
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var cityInput = form.children.city,
                city = cityInput.value;
            if(!city){
                //show error msg
                showError('Fill in city');
                return;
            }

            togglePreloader();
            var url = 'http://api.openweathermap.org/data/2.5/weather?appid=6b83dfa0dc941cd4864bd3fac1834fbb&units=metric&q='+city;

            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    togglePreloader();
                }
                if (xhr.readyState == 4 && xhr.status == 200) {
                    try{
                        var response = JSON.parse(xhr.responseText);
                    } catch (e) {
                        //show error msg
                        showError(response.message);
                        return;
                    }
                    if(response.cod && response.cod === 404) {
                        //show error msg response.message
                        showError(response.message);

                    } else if (response.cod && response.cod === 200){
                        //add city
                        addCity(response);
                        cityInput.value = null;
                    }

                } else if (xhr.readyState == 4 && xhr.status !== 200) {
                    showError(xhr.statusText);
                }
            };
            xhr.send();
        });
    }

    function addCity(city) {
        cities.push(city);
        renderList();
    }

    function clearList() {
        cities = [];
        renderList();
    }

    function renderList() {
        var html = '';
        cities.forEach(function (city) {

            var weather = city.sys.country+': '+city.main.temp+'°C, '+city.weather[0].description+
                '<img src="http://openweathermap.org/img/w/'+city.weather[0].icon+'.png">';

            var weatherStyle = weather.fontsize(3);
            html += '<li>'
                + city.name+', '+ weatherStyle +
                '</li>'

        });
        cityList.innerHTML = html;
    }

    function showError(msg) {
        errorMsg.innerText = msg || 'City doesn\'t found';
        form.className = 'error-state';
        setTimeout(function () {
            errorMsg.innerText = '';
            form.className = '';
        }, 3000)
    }

    function togglePreloader() {
        if (preloader.style.display == ''){
            preloader.style.display = 'block';
        } else {
            preloader.style.display = '';
        }
    }

})();