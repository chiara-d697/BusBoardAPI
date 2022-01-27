import fetch from "node-fetch";
import promptSync from "prompt-sync";
const prompt = promptSync();


const validatePostcode = async function()  {
    let res = '';
    do {
        try {
            const userPostcode = prompt("Please enter your postcode: ");
            const fetchValidate = await fetch(`https://api.postcodes.io/postcodes/${userPostcode}/validate`);
            const validateUserPostcode = await fetchValidate.json();
            res = validateUserPostcode.result;

            if(res === false) {
                throw new Error(`It looks like ${userPostcode} isn't a valid postcode.`)
            } else {
                return userPostcode;
            }
            
        }
        catch (error) {
            console.error(error.message);
        }
    } while(res === false);
}


const fetchBusStops = async function(userPostcode) {
    let lat = 0;
    let lon = 0;

    
    try {
        const postcode = await fetch(`https://api.postcodes.io/postcodes?q=${userPostcode}`);
        const postcodeInfo = await postcode.json();

        lat = postcodeInfo.result[0].latitude;
        lon = postcodeInfo.result[0].longitude;

        const stopTypes = "NaptanPublicBusCoachTram";
        const buses = await fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&lat=
${lat}&lon=${lon}&radius=400`)
        const busStopsInfo = await buses.json();

        if (busStopsInfo['stopPoints'].length === 0) {
            throw new Error(`It looks like there aren't any TFL bus stops near you, how about trying a different postcode?`);
            
        } else {
            return busStopsInfo;
        }
    }
    catch(error) {
        console.error(error.message);
    }
}


const getStopDistance = async function(busInformation, stopIndex) {

        const stationName = busInformation['stopPoints'][stopIndex].commonName;
        const distance = Math.round(busInformation['stopPoints'][stopIndex].distance);
    
        console.log(`${stationName} is ${distance} metres away from the provided postcode.`)
}


const getBusTimes = async function(busInformation) {

    try {
        const busTimes = await fetch(`https://api.tfl.gov.uk/StopPoint/${busInformation['stopPoints'][0].naptanId}/Arrivals`);
        const stopBusTimes = await busTimes.json();
        const sortedArrivals = stopBusTimes.sort((b1, b2) => b1.timeToStation - b2.timeToStation);


        if(busTimes.length === 0) {
            throw new Error('It looks like there aren\'t any predicted arrivals near you. Why not try at a different time?');
        } else {
            return sortedArrivals;
        }
    }

    catch(error) {
        console.error(error.message);
    }
}

const displayNextBuses = async function(getBusTimes, arrivalIndex) {

    const lineId = getBusTimes[arrivalIndex].lineId;
    const destination = getBusTimes[arrivalIndex].destinationName;
    const arrivalTime = Math.floor(getBusTimes[arrivalIndex].timeToStation / 60);

    console.log(`Bus ${lineId} to ${destination} is arriving in ${arrivalTime}mins.`)
}



        const userPostcode = await validatePostcode();
        const stops = await fetchBusStops(userPostcode);
        if (stops) {
            const closestStation = await getStopDistance(stops, 0);
            for (let i = 0; i < 5; i++) {
                const arrivals = await getBusTimes(stops);
                await displayNextBuses(arrivals, i);
            }
        }    
















    
  





     // for(const bus of busesInfo.stopPoints)
    //     console.log(`${bus.commonName} is ${Math.round(bus.distance)} metres away from ${userPostcode}.`);
    // }