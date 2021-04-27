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
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function addLoc(pos){
    const loc={
        id:utilService.makeId(),
        name:pos.name,
        weather:'',
        lat:pos.lat,
        lng:pos.lng,
        createdAt:Date.now(),
        updatedAt:Date.now()
    }
    gLocs.push(loc)
    storageService.saveToStorage(LOCS_KEY,gLocs)
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

