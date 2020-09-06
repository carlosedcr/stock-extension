function ghost(isDeactivated) {
    options.style.color = isDeactivated ? 'graytext' : 'black';
                                                // The label color.
    options.frequency.disabled = isDeactivated; // The control manipulability.
}
  
window.addEventListener('load', function() {
    // Initialize the option controls.
	options.isActivated.checked = JSON.parse(localStorage.isActivated);
                                           // The display activation.
    options.frequency.value = localStorage.frequency;
                                           // The display frequency, in minutes.
    alertOptions.asset.value = localStorage.asset ?? "";
    alertOptions.maxprice.value = localStorage.maxPrice;
    alertOptions.minprice.value = localStorage.minPrice;
    alertOptions.paidPrice.value = localStorage.paidPrice;
    alertOptions.quantity.value = localStorage.quantity ?? "";
    
    if (!options.isActivated.checked) { ghost(true); }
  
    // Set the display activation and frequency.
    options.isActivated.onchange = function() {
      localStorage.isActivated = options.isActivated.checked;
      ghost(!options.isActivated.checked);
    };
  
    options.frequency.onchange = function() {
      localStorage.frequency = options.frequency.value;
    };

    var save = document.getElementById('save');

    save.addEventListener('click', function() {
        localStorage.asset = alertOptions.asset.value;
        localStorage.maxPrice = alertOptions.maxprice.value;
        localStorage.minPrice = alertOptions.minprice.value;
        localStorage.paidPrice = alertOptions.paidPrice.value;
        localStorage.quantity = alertOptions.quantity.value;

        if (localStorage.asset) {
            getStockPriceFromGoogle(alertOptions.asset.value);
            setLoadingTooltip();
        } else {
            resetBadgeText();
            resetTollTip();
        }
   	});
});

function setLoadingTooltip() {
	chrome.browserAction.setTitle({ title: localStorage.asset + " Carregando..." });
}

function resetBadgeText() {
    chrome.browserAction.setBadgeText({ text: "N/A" });
    chrome.browserAction.setBadgeBackgroundColor({ color: [100, 100, 100, 255] });
}

function resetTollTip() {
    chrome.browserAction.setTitle({ title: "Monitor Ações" });
}
