const addressvalidation = document.querySelector ('#addressvalid');
const regionvalidation = document.querySelector ('#regionvalid');
const cityvalidation = document.querySelector ('#cityvalid');

addressvalidation.classList.add('d-none');
regionvalidation.classList.add('d-none');
cityvalidation.classList.add('d-none');


const address = document.querySelector('#address');
const region = document.querySelector('#region');
const attractions = document.querySelector('#attractions');
document.querySelector('#tabs').classList.add('d-none');
document.querySelector('#rightNowDiv').classList.add('d-none');
document.querySelector('#nextDiv').classList.add('d-none');


// const city = document.querySelector('#select');
// const index = city.selectedIndex;
// const radio = document.querySelector('input[name="degree"]:checked');

const search = document.querySelector('#search');
search.addEventListener('click', submit);



function submit() {
flag1 =0;
floag2=0;
flag3 =0;
const city = document.querySelector('select');
const index = city.selectedIndex;
const radio = document.querySelector('input[name="degree"]:checked');

if(address.value === ""){
    addressvalidation.classList.remove('d-none');
    flag1=0;
}

if(region.value === ""){
    regionvalidation.classList.remove('d-none'); 
    flag2=0;
}

if(city.options[index].value ==="Select city"){
    cityvalidation.classList.remove('d-none');  
    flag3=0; 
}

if(address.value!==""){
    addressvalidation.classList.add('d-none');
    flag1=1;
}
if(region.value!==""){
    regionvalidation.classList.add('d-none');
    flag2=1;
}
if(city.options[index].value!=="Select city"){
    flag3=1;
    cityvalidation.classList.add('d-none');}

console.log(address.value+" "+region.value);
console.log('option value selected:'+city.options[index].value);
console.log(radio.value);
if(flag1===1 && flag2 === 1 && flag3 ===1){
      request1();
    //   openAIreq(city.options[index].value);
      attractions.style.display = "block";
}

}
// console.log('try '+address.value+" "+region.value+" "+city.options[index].value);

    function request1(){
        var result;
        const address = document.querySelector('#address');
        const region = document.querySelector('#region');
        const city = document.querySelector('select');
        const index = city.selectedIndex;
        const radio = document.querySelector('input[name="degree"]:checked');
        var xhr = new XMLHttpRequest // Set up our HTTP request
        xhr.onreadystatechange = function (){    // Setup our listener to process completed requests
            if (xhr.readyState !== 4) return; // Only run if the request is complete
            if ( xhr.status >= 200 && xhr.status < 300){// Process our return data
                console.log(JSON.parse (xhr.responseText));  // What to do when the request is successful
                const arr= JSON.parse(xhr.responseText);
                if(arr.length <1)alert("No result for that location");
                result = arr[0];
                console.log(result);
                lat = result.lat;
                lon = result.lon;
                console.log(lat + " "+lon);
                if(radio.value === "c") {units= "metric";}
                else if(radio.value ==="f"){units = "imperial";}
                cnt=0;
                requestWeather(lat,lon,units);
                requestForecast(lat,lon,units);
                mapDisplay(lon,lat,cnt);
                cnt++;
                
                
            
            }
            else{
                console.log('error',xhr);// What to do when the request has failed
            }
        };
    
        xhr.open('GET', 'https://nominatim.openstreetmap.org/search?q='+address.value+','+ region.value+','+ city.options[index].value+'&format=json');//create and send a GET request
        xhr.send();
        }

        function requestWeather(lat,lon,units) {

            var xhr = new XMLHttpRequest // Set up our HTTP request
             xhr.onreadystatechange = function (){    // Setup our listener to process completed requests
                 if (xhr.readyState !== 4) return; // Only run if the request is complete
                 if ( xhr.status >= 200 && xhr.status < 300){// Process our return data
                    //  console.log(JSON.parse (xhr.responseText));  // What to do when the request is successful
                     const arr= JSON.parse(xhr.responseText);
                     result = arr;
                     console.log(result);
                     const weatherDescr = result.weather[0].description;
                     const weatherIcon = result.weather[0].icon;
                     const mainTemp = result.main.temp;
                     const mainPressure = result.main.pressure;
                     const mainHumidity = result.main.humidity;
                     const mainTempMin = result.main.temp_min;
                     const mainTempMax = result.main.temp_max;
                     const windSpeed = result.wind.speed;
                     const cloudsAll = result.clouds.all;
                     const sysCountry = result.sys.country;
                     const sysSunrise = result.sys.sunrise;
                     const sysSunset = result.sys.sunset;
                     const namePlace = result.name;
                     console.log(weatherDescr);
                     console.log(weatherIcon);
                     console.log(mainTemp);
                     console.log(mainPressure);
                     console.log(mainHumidity);
                     console.log(mainTempMin);
                     console.log(mainTempMax);
                     console.log(windSpeed);
                     console.log(cloudsAll);
                     console.log(sysCountry);
                     console.log(sysSunrise);
                     console.log(sysSunset);

                     var unixTimestamp = sysSunrise;
                     const sunrise = unixTimestamp * 1000;
                    const sunriseObj = new Date(sunrise);
                    var hoursSunrise = sunriseObj.getHours();
                    var minutesSunrise = sunriseObj.getMinutes();
                    if(minutesSunrise <10 && minutesSunrise>0) minutesSunrise = '0'+""+minutesSunrise;
                    if(hoursSunrise <10 && hoursSunrise>0) hoursSunrise = '0'+""+hoursSunrise;

                    var unixTimestamp = sysSunset;
                    const sunset = unixTimestamp * 1000;
                   const sunsetObj = new Date(sunset);
                   const hoursSunset = sunsetObj.getHours();
                   var minutesSunset = sunsetObj.getMinutes();
                   if(minutesSunset <10) minutesSunset = '0'+""+minutesSunset;

                    document.querySelector('#icon').src = "https://openweathermap.org/img/w/"+weatherIcon+".png";
                    document.querySelector('#descriptionWeather').innerHTML = weatherDescr+" in "+namePlace;
                    // metric
                    if(units==="metric"){
                        document.querySelector("#temperatureNow").innerHTML = mainTemp+"°C";
                        document.getElementById("temperatureNow").style.fontSize = "x-large";
                        document.querySelector('#firstRight').innerHTML = mainPressure+" hPa";
                        document.querySelector('#thirdRight').innerHTML = windSpeed+" meters/sec";
                        document.querySelector("#tempMin").innerHTML = "L:" + mainTempMin + "°C";
                        document.querySelector("#tempMin").style.color = "blue";
                        document.querySelector("#tempMax").innerHTML = "H:"+mainTempMax+"°C";
                        document.querySelector("#tempMax").style.color = "red";
                    }
                    else if(units==="imperial"){
                        document.querySelector("#temperatureNow").innerHTML = mainTemp+"°F";
                        document.getElementById("temperatureNow").style.fontSize = "x-large";
                        document.querySelector('#firstRight').innerHTML = mainPressure+" Mb";
                        document.querySelector('#thirdRight').innerHTML = windSpeed+" miles/hour";
                        document.querySelector("#tempMin").innerHTML = "L:" +mainTempMin + "°F";
                        document.querySelector("#tempMin").style.color = "blue";
                        document.querySelector("#tempMax").innerHTML = "H:"+mainTempMax+"°F";
                        document.querySelector("#tempMax").style.color = "red";
                    }

                     document.querySelector('#firstLeft').innerHTML = "Pressure";
                     document.querySelector('#secondLeft').innerHTML = "Humidity";
                     document.querySelector('#thirdLeft').innerHTML = "Wind Speed";
                     document.querySelector('#fourthLeft').innerHTML = "Cloud Cover";
                     document.querySelector('#fifthLeft').innerHTML = "Sunrise";
                     document.querySelector('#sixthLeft').innerHTML = "Sunset";

                    //  document.querySelector('#firstRight').innerHTML = mainPressure;
                     document.querySelector('#secondRight').innerHTML = mainHumidity+' %';
                    //  document.querySelector('#thirdRight').innerHTML = windSpeed;
                     document.querySelector('#fourthRight').innerHTML = cloudsAll;
                     document.querySelector('#fifthRight').innerHTML = hoursSunrise + ":"+ minutesSunrise;
                     document.querySelector('#sixthRight').innerHTML = hoursSunset + ":"+minutesSunset;



                     document.querySelector('#tabs').classList.remove('d-none');
                    document.querySelector('#rightNowDiv').classList.remove('d-none');

                 }
                 else{
                     console.log('error',xhr);// What to do when the request has failed
                 }
             };
             xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&"+"lon="+lon+"&units="+units+"&APPID=4f10af3b895e7aeb394db8fc02599c3f");
             xhr.send();
            
         }


         function requestForecast(lat,lon,units) {
            var xhr = new XMLHttpRequest // Set up our HTTP request
            xhr.onreadystatechange = function (){    // Setup our listener to process completed requests
                if (xhr.readyState !== 4) return; // Only run if the request is complete
                if ( xhr.status >= 200 && xhr.status < 300){// Process our return data
                    // console.log(JSON.parse (xhr.responseText));  // What to do when the request is successful
                    const arr= JSON.parse(xhr.responseText);
                     result = arr;
                     console.log(result);
                     let dt = [] ; 
                     let maintemp = [];
                     let mainpressure = [];
                     let mainhumidity = [];
                     let weatherMain = [];
                     let weatherDescription = [];
                     let weatheric = [];
                     let cloudsall = [];
                     let wspeed = [];
                    let newdt=[];

                     for (let i = 0; i < 8; i++){
                     dt[i] = result.list[i].dt;
                     var date = new Date(dt[i] * 1000);
                     var hours = date.getHours();
                    var minutes = "0" + date.getMinutes();
                    if(minutes<10 && minutes>0) minutes = '0'+""+minutes;
                     if(hours<10 && hours>0) hours = '0'+""+hours;
                     newdt[i] = hours + ':' + minutes;
                     maintemp[i] = result.list[i].main.temp;
                     mainpressure[i] = result.list[i].main.pressure;
                     mainhumidity[i] = result.list[i].main.humidity;
                     weatherMain[i] = result.list[i].weather[0].main;
                     weatherDescription[i] = result.list[i].weather[0].description;
                     weatheric[i]= result.list[i].weather[0].icon;
                     cloudsall[i] = result.list[i].clouds.all;
                     wspeed[i] = result.list[i].wind.speed;
                     cityname = result.city.name;
                     console.log(weatheric[i]);
                     }
                    if(units === "metric"){
                        tempSymb = " °C";
                        pressureSymb = " hPa";
                        windspeedSymb = " meters / sec";
                    }
                    else if(units==="imperial"){
                        tempSymb = "°F";
                        pressureSymb = "Mb";
                        windspeedSymb = "miles / hour";
                    }
                     for(let i=0; i<8;i++){
                     document.getElementById("time"+i).innerHTML = newdt[i] ;
                     document.getElementById("image"+i).src = "https://openweathermap.org/img/w/"+weatheric[i]+".png";
                     document.getElementById("temp"+i).innerHTML = maintemp[i]+tempSymb;
                     document.getElementById("cloud"+i).innerHTML = cloudsall[i];

                    //  document.querySelector('#second1').innerHTML = newdt[1];
                    //  document.querySelector('#image2').src = "https://openweathermap.org/img/w/"+weatheric[1]+".png";
                    //  document.querySelector('#second3').innerHTML = maintemp[1];
                    //  document.querySelector('#second4').innerHTML = cloudsall[1];

                    //  document.querySelector('#third1').innerHTML = newdt[2];
                    //  document.querySelector('#image3').src = "https://openweathermap.org/img/w/"+weatheric[2]+".png";
                    //  document.querySelector('#third3').innerHTML = maintemp[2];
                    //  document.querySelector('#third4').innerHTML = cloudsall[2];

                    //  document.querySelector('#fourth1').innerHTML = newdt[3];
                    //  document.querySelector('#image4').src = "https://openweathermap.org/img/w/"+weatheric[3]+".png";
                    //  document.querySelector('#fourth3').innerHTML = maintemp[3];
                    //  document.querySelector('#fourth4').innerHTML = cloudsall[3];

                    //  document.querySelector('#fifth1').innerHTML = newdt[4];
                    //  document.querySelector('#image5').src = "https://openweathermap.org/img/w/"+weatheric[4]+".png";
                    //  document.querySelector('#fifth3').innerHTML = maintemp[4];
                    //  document.querySelector('#fifth4').innerHTML = cloudsall[4];
                     }
                     document.querySelector("#first5").addEventListener("click", function(){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                     document.querySelector("#second5").addEventListener("click",function (){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                     document.querySelector("#third5").addEventListener("click", function (){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                     document.querySelector("#fourth5").addEventListener("click", function (){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                     document.querySelector("#fifth5").addEventListener("click", function (){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                     document.querySelector("#sixth5").addEventListener("click", function (){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                     document.querySelector("#seventh5").addEventListener("click", function (){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                     document.querySelector("#eightth5").addEventListener("click", function (){viewButton(this,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb);});
                    

                
                }
                else{
                    console.log('error',xhr);// What to do when the request has failed
                }
            };
            xhr.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units='+units+'&APPID=4f10af3b895e7aeb394db8fc02599c3f');//create and send a GET request
            xhr.send();
        }


// function openAIreq(city){
//     // Set up our HTTP request
//   var xhr = new XMLHttpRequest();
//   // Setup our listener to process completed requests
//   xhr.onreadystatechange = function () {
//     // Only run if the request is complete
//     if (xhr.readyState !== 4) return;
//     // Process our return data
//     if (xhr.status >= 200 && xhr.status < 300) {
//       console.log(JSON.parse(xhr.responseText));
//       document.querySelector("#spinner").classList.add('d-none');
//       par = document.getElementById("attrParagraph")
//       partext = JSON.parse(xhr.responseText).choices[0].text;
//       par.innerHTML = partext;
//       title = document.getElementById("attrTitle");
//       title.innerHTML = "Attractions in " +city;
      
      
//     } 
//     else {
//       console.log("error", xhr);
//     }
//   };
 
//   xhr.open("POST", "https://api.openai.com/v1/completions");


//   data = {};
//   data.model = "text-davinci-003";
//   data.prompt = "Tell me places that i have to go in "+ city;
//   data.temperature = 0.7;
//   data.max_tokens = 256;
//   data.top_p = 1;
//   data.frequency_penalty = 0;
//   data.presence_penalty = 0;
  
//   xhr.setRequestHeader("Content-Type" , "application/json");
//   xhr.setRequestHeader("Authorization" , "Bearer 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");

//   xhr.send(JSON.stringify(data));
// }
        
       
   
function mapDisplay(lon,lat,cnt){
   
    var map = new ol.Map({ 
             target: 'map', 
             layers: [ 
                 new ol.layer.Tile({ 
                     source: new ol.source.OSM()
                     })
                    ], 
                    view: new ol.View({ 
                        // center: ol.proj.fromLonLat([33.4079103, 35.1463009]),
                        center: ol.proj.fromLonLat([lon,lat]),
                        zoom: 5
                    }) 
                });
    
                layer_temp = new ol.layer.Tile({ 
                    source: new ol.source.XYZ({ 
                    url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=4f10af3b895e7aeb394db8fc02599c3f', 
                    })
                 });
                     map.addLayer(layer_temp);
    
                     layer_precipitation = new ol.layer.Tile({ 
                        source: new ol.source.XYZ({ 
                        url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=4f10af3b895e7aeb394db8fc02599c3f', 
                            }) 
                        }); 
                     map.addLayer(layer_precipitation);
                    }


    
                
 

 function functActive(element){
    element.className = "nav-link active";
    element.style.color = "blue";
    element.style.backgroundColor = "white";
    if(document.querySelector('#tabNow') === element){
        document.querySelector('#tabNext').className = "nav-link";
        document.querySelector('#tabNext').style.color = "white";
        document.querySelector('#tabNext').style.backgroundColor = "blue";
        document.querySelector('#nextDiv').classList.add('d-none');
        document.querySelector('#rightNowDiv').classList.remove('d-none');

    }
    else if(document.querySelector('#tabNext') === element){
        document.querySelector('#tabNow').className = "nav-link";
        document.querySelector('#tabNow').style.color = "white";
        document.querySelector('#tabNow').style.backgroundColor = "blue";
        document.querySelector('#rightNowDiv').classList.add('d-none');
        document.querySelector('#nextDiv').classList.remove('d-none');
       
    }
 }

 function viewButton(x,cityname,dt,weatheric,weatherMain,weatherDescription,mainhumidity,mainpressure,wspeed,tempSymb,pressureSymb,windspeedSymb){
    console.log(x.id);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if(x.id === "first5"){
        const timestamp = dt[0];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[0]+"("+weatherDescription[0]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[0]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[0]+"%"; 
        document.querySelector('#modal2span5').innerHTML = mainpressure[0]+pressureSymb;
        document.querySelector('#modal2span6').innerHTML = wspeed[0]+windspeedSymb;
    }
    else if(x.id ==="second5"){

        const timestamp = dt[1];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[1]+"("+weatherDescription[1]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[1]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[1]+"%"; 
        document.querySelector('#modal2span5').innerHTML = mainpressure[1]+pressureSymb;
        document.querySelector('#modal2span6').innerHTML = wspeed[1]+windspeedSymb;
    }
    else if(x.id ==="third5"){
        const timestamp = dt[2];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[2]+"("+weatherDescription[2]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[2]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[2]+"%"; 
        document.querySelector('#modal2span5').innerHTML = mainpressure[2]+pressureSymb;
        document.querySelector('#modal2span6').innerHTML = wspeed[2]+windspeedSymb;
    }
    else if(x.id ==="fourth5"){
        const timestamp = dt[3];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[3]+"("+weatherDescription[3]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[3]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[3]+"%";
        document.querySelector('#modal2span5').innerHTML = mainpressure[3]+pressureSymb; 
        document.querySelector('#modal2span6').innerHTML = wspeed[3]+windspeedSymb;
        
    }
    else if(x.id ==="fifth5"){
        const timestamp = dt[4];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[4]+"("+weatherDescription[4]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[4]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[4]+"%"; 
        document.querySelector('#modal2span5').innerHTML = mainpressure[4]+pressureSymb;
        document.querySelector('#modal2span6').innerHTML = wspeed[4]+windspeedSymb;
        
    }
    else if(x.id ==="sixth5"){
        const timestamp = dt[5];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[5]+"("+weatherDescription[5]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[5]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[5]+"%"; 
        document.querySelector('#modal2span5').innerHTML = mainpressure[5]+pressureSymb;
        document.querySelector('#modal2span6').innerHTML = wspeed[5]+windspeedSymb;
        
    }
    else if(x.id ==="seventh5"){
        const timestamp = dt[6];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[6]+"("+weatherDescription[6]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[6]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[6]+"%"; 
        document.querySelector('#modal2span5').innerHTML = mainpressure[6]+pressureSymb;
        document.querySelector('#modal2span6').innerHTML = wspeed[6]+windspeedSymb;
        
    }
    else if(x.id ==="eighth5"){
        const timestamp = dt[7];
        const date = new Date(timestamp * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        dateTime = day + " "+month+" "+year+" "+hour+":"+minute;
        document.querySelector("#modaltitle").innerHTML = "Weather in "+cityname+" on "+dateTime;
        document.querySelector("#pModal1").innerHTML = weatherMain[7]+"("+weatherDescription[7]+")";
        document.querySelector('#imgModal1').src = "https://openweathermap.org/img/w/"+weatheric[7]+".png";
        document.querySelector('#modal2span4').innerHTML = mainhumidity[7]+"%"; 
        document.querySelector('#modal2span5').innerHTML = mainpressure[7]+pressureSymb;
        document.querySelector('#modal2span6').innerHTML = wspeed[7]+windspeedSymb;
        
    }
 }
