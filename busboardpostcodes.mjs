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
    const postcode = await fetch(`https://api.postcodes.io/postcodes?q=${userPostcode}`);
    const postcodeInfo = await postcode.json();

    const lat = postcodeInfo.result[0].latitude;
    const lon = postcodeInfo.result[0].longitude;

    const stopTypes = "NaptanPublicBusCoachTram";
    const buses = await fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&lat=
${lat}&lon=${lon}&radius=400`)
    const busStopsInfo = await buses.json();

        return busStopsInfo;
}


const getCommonName = function(busInformation, stopIndex) {
    return busInformation['stopPoints'][stopIndex].commonName;
    }













    // const stopPointOneDistance = Math.round(busesInfo.stopPoints[0].distance);
    // const stopPointTwoDistance = Math.round(busesInfo.stopPoints[1].distance);

    // const busTimesOne = await fetch(`https://api.tfl.gov.uk/StopPoint/${busesInfo.stopPoints[0].naptanId}/Arrivals`);
    // const busTimesStopOne = await busTimesOne.json()


    // busTimesStopOne.sort((b1, b2) => b1.timeToStation - b2.timeToStation);


    // console.log(`Bus ${busTimesStopOne[0].lineId} is coming in ${Math.floor(busTimesStopOne[0].timeToStation/60)} minutes and ${busTimesStopOne[0].timeToStation%60} seconds`);

    // console.log(
    // `${stopPointOneName} is ${stopPointOneDistance} metres away from ${userPostcode}.
    // Next bus: 


    //  ${stopPointTwoName} is ${stopPointTwoDistance} metres away from ${userPostcode}.
    // Next bus:
    //  `)








    const postcodeRes = await validatePostcode();
    // const busInformation = await fetchBusStops(postcodeRes);
    // getCommonName(busInformation, 0);



     // for(const bus of busesInfo.stopPoints)
    //     console.log(`${bus.commonName} is ${Math.round(bus.distance)} metres away from ${userPostcode}.`);
    // }