import fetch from "node-fetch";

import promptSync from "prompt-sync";
const prompt = promptSync();


let userPostcode = prompt("Please enter your postcode: ")



async function fetchPostcodeInfo() {
    const postcode = await fetch(`https://api.postcodes.io/postcodes?q=${userPostcode}`);
    const postcodeInfo = await postcode.json();
    const lat = postcodeInfo.result[0].latitude;
    const lon = postcodeInfo.result[0].longitude;

    const stopTypes = "NaptanOnstreetBusCoachStopPair,NaptanPublicBusCoachTram";
    const buses = await fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&lat=
${lat}&lon=${lon}&radius=200`)
    const busesInfo = await buses.json();


    // console.log(`Your nearest bus stop is ${busesInfo.stopPoints[0].commonName}`);
}


    fetchPostcodeInfo();