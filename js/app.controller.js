import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'



window.onload = onInit;
window.onMoveToLoc = onMoveToLoc;
window.onRemoveLoc = onRemoveLoc;
window.onSearchLoc = onSearchLoc;
window.onCopyToClipboard=onCopyToClipboard;

function onInit() {
    addEventListenrs();
    mapService.initMap()
        .then((map) => {
            google.maps.event.addListener(map, 'click', onClickMap)
        })
        .then(() => renderLocs())
        .catch(() => console.log('Error: cannot init map'))
        .then(() =>catchParams())
         
}

function addEventListenrs() {

    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                document.querySelector('.user-pos').innerText =
                    `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
                mapService.panTo(pos.coords.latitude, pos.coords.longitude);
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })

}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function catchParams(){
    const urlParams = new URLSearchParams(window.location.search);
    const latParam = urlParams.get('lat');
    const lngParam= urlParams.get('lng');
    console.log(lngParam,latParam)
    if(!(latParam||lngParam))return
    mapService.panTo(latParam, lngParam)
    onAddLoc({lat:latParam,lng:lngParam})
}

function onClickMap(ev) {//first create object with name and loc(maybe weather also) and send to addLoc()
   onAddLoc({lat:ev.latLng.lat(),lng:ev.latLng.lng()})
}

function onAddLoc(pos){
    mapService.getLocFromPos(pos)
    .then(loc => {
            weatherService.getWeather(pos)
            .then(weather=>{
                loc.weather=weather
                locService.addLoc(loc)
                console.log(loc)
                renderLocs()
            })
            mapService.addMarker(pos)
        })
}

function renderLocs() {
    locService.getLocs().then(locs => {
        if (!locs.length) return
        const strHtml = locs.map(loc => {
            if(!loc.weather) {
                loc.weather={
                    temp:''
                } 
            }
            return `<tr>
           <td>${loc.name}</td>
           <td>${loc.weather.temp}</td>
           <td>
           <button onclick="onMoveToLoc('${loc.id}')">Go</button>
           <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
           </td>
           </tr>`
        })
        document.querySelector('table').innerHTML = strHtml.join('')
        mapService.removeMarkers()
        locs.forEach(loc => mapService.addMarker({ lat: loc.lat, lng: loc.lng }))
    })
}

function onMoveToLoc(locId) {
    locService.setSelectedLoc(locId)
    locService.getLocs().then(locs => {
        const chosenLoc = locs.find(loc => loc.id === locId)
        mapService.panTo(chosenLoc.lat, chosenLoc.lng);

    })
}
function onRemoveLoc(locId) {
    locService.removeLoc(locId)
    renderLocs()
}

function onSearchLoc(ev) {
    ev.preventDefault();
    const locName = document.querySelector('form input').value
    mapService.getPosFromName(locName)
        .then(pos => {
            onAddLoc(pos)
            mapService.panTo(pos.lat, pos.lng)
        })
}

function onCopyToClipboard(){
    console.log('on copy to clipboard')
    const loc=locService.getSelectedLoc()
    if(!loc)return
    const elUrl=document.getElementById('url-copy');
    elUrl.value=`https://raphaelassor.github.io/travel-tips/?lat=${loc.lat}&lng=${loc.lng}`;
    console.log(elUrl)
    elUrl.select();
    elUrl.setSelectionRange(0, 99999)
    document.execCommand("copy");
}
