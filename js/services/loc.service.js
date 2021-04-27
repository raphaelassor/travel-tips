import {utilService} from './util.service.js'
import {storageService} from './storage.service.js'

export const locService = {
    getLocs,
    addLoc,
    removeLoc,
    setSelectedLoc,
    getSelectedLoc
}
const LOCS_KEY='locs';
let gLocs = storageService.loadFromStorage(LOCS_KEY)||[];
let gSelectedLoc;


function getLocs() {
    return  Promise.resolve(gLocs);
}

function addLoc(loc){
    const addedLoc={
        id:utilService.makeId(),
        name:loc.name,
        weather:loc.weather,
        lat:loc.lat,
        lng:loc.lng,
        createdAt:Date.now(),
        updatedAt:Date.now()
    }
    gLocs.push(addedLoc)
    storageService.saveToStorage(LOCS_KEY,gLocs)
    gSelectedLoc=addedLoc;
}

function removeLoc(locId){
    getLocs()
    .then(locs=>{
        const locIdx=locs.findIndex(loc=>loc.id===locId)
        locs.splice(locIdx,1);
        storageService.saveToStorage(LOCS_KEY,gLocs)
    })
    
}

function setSelectedLoc(locId){
 gSelectedLoc=gLocs.find(loc=>loc.id===locId)
}
function getSelectedLoc(){
    return gSelectedLoc
}

