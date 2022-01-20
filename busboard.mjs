import fetch from "node-fetch";

import promptSync from "prompt-sync";
const prompt = promptSync();


let userStopCode = prompt("Please enter a bus stop code:")



fetch(`https://api.tfl.gov.uk/StopPoint/${userStopCode}/Arrivals`
    )
    .then(response => response.json())
    .then(body => console.log(body));

