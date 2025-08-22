document.addEventListener("DOMContentLoaded", () => {
    const dropList = document.querySelectorAll(".drop-list select"),
    fromCurrency = document.querySelectorAll(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

    for (let i = 0; i < dropList.length; i++) {
        for (let currency_code in country_code) {
            let selected;
            if(i === 0){
                selected = currency_code === "USD" ? "selected" : "";
            } else if(i === 1) {
                selected = currency_code === "LKR" ? "selected" : "";
            }
            let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
            dropList[i].insertAdjacentHTML("beforeend", optionTag);
        }
        dropList[i].addEventListener("change", e =>{
            loadFlag(e.target);
        })
    }

    function loadFlag(element){
        for(code in country_code){
            if(code == element.value){
                let imgTag = element.parentElement.querySelector("img");
                imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
            }
        }
    }

    window.addEventListener("load", () =>{
        getExchangeRate();
    });

    getButton.addEventListener("click", e =>{
        e.preventDefault();
        getExchangeRate();
    });

    const exchangeIcon = document.querySelector(".drop-list .icon");
    exchangeIcon.addEventListener("click", ()=>{
        let tempCode = fromCurrency[0].value;   
        fromCurrency[0].value = toCurrency.value;  
        toCurrency.value = tempCode;

        loadFlag(fromCurrency[0]);
        loadFlag(toCurrency);

        getExchangeRate();
    });


    function getExchangeRate(){
        const amount = document.querySelector(".amount input");
        exchangeRateTxt = document.querySelector(".exchange-rate");
        let amountVal = amount.value;
        if(amountVal == "" || amountVal == "0"){
            amount.value = "1";
            amountVal = 1;
        }
        exchangeRateTxt.innerText = "Getting exchange rate...";
        let url = `https://v6.exchangerate-api.com/v6/f1f3e8549d84a26e0b734f0d/latest/${fromCurrency[0].value}`;
        fetch(url).then(response => response.json()).then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency[0].value} = ${totalExchangeRate} ${toCurrency.value}`;
        }).catch(() =>{
            exchangeRateTxt.innerText = "Something went wrong";
        });
    }
});
