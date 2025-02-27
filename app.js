const BASE_URL =
   "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_QliPXG22erPcG5eCjAD3OMTO0rzAu5YnQdnfRPws&currencies=EUR,USD,CAD,ZAR,INR";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Constructing URL with proper currency parameters
  const URL = `${BASE_URL}&base_currency=${fromCurr.value.toUpperCase()}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      msg.innerText = "Error fetching data. Please try again.";
      return;
    }

    let data = await response.json();

    // Log the entire response to inspect the structure
    console.log("API Response: ", data);

    // Now access the rate correctly
    let rate = data.data[toCurr.value.toUpperCase()];  // Assuming the structure is like data.data[currency]

    if (rate === undefined) {
      msg.innerText = `Exchange rate for ${fromCurr.value} to ${toCurr.value} not found.`;
      return;
    }

    // Calculate the final amount
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "There was an error processing your request.";
    console.error("Error: ", error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
