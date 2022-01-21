import fetch from "node-fetch";

import promptSync from "prompt-sync";
const prompt = promptSync();


let userPostcode = prompt("Please enter your postcode: ")



async function fetchPostcodeInfo() {
    const postcode = await fetch(`https://api.postcodes.io/postcodes?q=${userPostcode}`);
    const postcodeInfo = await postcode.json();

    postcodeInfo.result[0].longitude

    const buses = await fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=
    ${postcodeInfo.result[0].latitude}&lon=${postcodeInfo.result[0].longitude}`)
    const busesInfo = await buses.json();


    console.log(`Your nearest bus stop is ${busesInfo.stopPoints[0].commonName}`);
}


    fetchPostcodeInfo();

