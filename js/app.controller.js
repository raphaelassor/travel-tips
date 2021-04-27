import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


window.onload = onInit;
window.onMoveToLoc=onMoveToLoc;
window.onRemoveLoc=onRemoveLoc;
window.onSearchLoc=onSearchLoc;

function onInit() {
    addEventListenrs();
    mapService.initMap()
        .then((map) => {
            google.maps.event.addListener(map, 'click', onClickMap )
        })
        .then(()=>renderLocs())
        .catch(() => console.log('Error: cannot init map'));
}

function addEventListenrs() {
  
    document.querySelector('.btn-add-marker').addEventListener('click', (ev) => {
        console.log('Adding a marker');
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
   
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

function onClickMap(ev){//first create object with name and loc(maybe weather also) and send to addLoc()
    mapService.getLocFromPos(ev.latLng)
     .then(loc=>{
        locService.addLoc(loc)
       mapService.addMarker(ev.latLng)
        renderLocs()
     })
}


function renderLocs(){
   locService.getLocs().then(locs=>{
       if(!locs.length)return
       const strHtml=locs.map(loc=>{
           return`<tr>
           <td>${loc.name}</td>
           <td>Weather</td>
           <td>
           <button onclick="onMoveToLoc('${loc.id}')">Go</button>
           <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
           </td>
           </tr>`
        })
        document.querySelector('table').innerHTML=strHtml.join('')
        mapService.removeMarkers()
        locs.forEach(loc=>mapService.addMarker({ lat: loc.lat, lng: loc.lng}))
    })
}

function onMoveToLoc(locId){
locService.getLocs().then(locs=>{
    const chosenLoc=locs.find(loc=>loc.id===locId)
    mapService.panTo(chosenLoc.lat, chosenLoc.lng);

})
}
function onRemoveLoc(locId){
    locService.removeLoc(locId)
    renderLocs()
}

function onSearchLoc(ev){
    ev.preventDefault();
    const locName=document.querySelector('form input').value
    mapService.getLocFromName(locName)
        .then(loc=>{
            locService.addLoc(loc)
            renderLocs()
            mapService.panTo(loc.lat,loc.lng)
        })

}
