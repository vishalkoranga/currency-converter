const API_KEY = "3d8ae7c9b38144ffa43f0c9b4ec306a4";
const BASE_URL = "https://openexchangerates.org/api/latest.json";

const dropdowns = document.querySelectorAll(".selectcontainer select");
const btn = document.querySelector(".button1");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const output = document.querySelector(".output");

for (let select of dropdowns) {
    for (let country in countryList) {
        if (countryList.hasOwnProperty(country)) {
            let newOption = document.createElement("option");
            newOption.innerText = country;
            newOption.value = country;
            
            if (select.getAttribute("name") === "from" && country === "USD") {
                newOption.selected = true; 
            } else if (select.getAttribute("name") === "to" && country === "INR") {
                newOption.selected = true;
            }
            
            select.appendChild(newOption);
        }
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countrycode = countryList[currCode];
    let newsrc = `https://flagsapi.com/${countrycode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let input = document.querySelector("form input");
    let inpval = input.value;
    if (inpval === "" || inpval < 1) {
        inpval = 1;
        input.value = "1";
    }
    const fromcurrency = fromcurr.value.toUpperCase();
    const tocurrency = tocurr.value.toUpperCase();
    const URL = `${BASE_URL}?app_id=${API_KEY}&base=USD&symbols=${fromcurrency},${tocurrency}`;
    let response = await fetch(URL);
    let data = await response.json();

    let fromRate = data.rates[fromcurrency];
    let toRate = data.rates[tocurrency];

    let convertedcurr;
    if (fromcurrency === 'USD') {
        convertedcurr = inpval * toRate;
    } else if (tocurrency === 'USD') {
        convertedcurr = inpval / fromRate;
    } else {
        convertedcurr = inpval * (toRate / fromRate);
    }

    output.innerText = convertedcurr.toFixed(2);
});
