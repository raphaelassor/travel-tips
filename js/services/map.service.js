

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getPosFromName,
    getLocFromPos,
    removeMarkers
}

const G_API_KEY='AIzaSyDu60DBoSBmTbdyFbq4kBMadZFAhdfJJxs'
var gMap;
let gMarkers=[];

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
           return gMap;
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    gMarkers.push(marker)
    
}

function removeMarkers(){
    gMarkers.forEach(marker=>{
        marker.setMap(null)
    })
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function getPosFromName(locName){
    const urlQuery=locName.replaceAll(' ','+')
   return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlQuery}&key=${G_API_KEY}`)
    .then(res=>{
        const pos={
            lat:res.data.results[0].geometry.location.lat,
            lng:res.data.results[0].geometry.location.lng,
        }
            return pos;
    })
    .catch(err=> console.log('error in finding Address, use modal to notify ',err))
}

function getLocFromPos(pos){
    const lat=pos.lat
    const lng=pos.lng
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${G_API_KEY}`)
    .then(res=>{
        const loc={
            name: res.data.results[0]['formatted_address'],
            lat,
            lng,
        }
        console.log(loc,'api called')
            return loc;
    })
    .catch(err=>console.log('could not find name ',err))
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${G_API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}