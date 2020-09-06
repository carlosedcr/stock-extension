  // Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}

  // Test for notification support.
if (window.Notification) {
  // While activated, show notifications at the display frequency.
  //if (JSON.parse(localStorage.isActivated)) { show('teste'); }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;

    if (JSON.parse(localStorage.isActivated) && localStorage.frequency <= interval) {
      getStockPriceFromGoogle(localStorage.asset);
      interval = 0;
    }

  }, 60000);
}

function getStockPriceFromGoogle(stock) {
  jQuery.ajax({
    url: 'https://www.google.com.br/search?q=' + stock,
    success: function (result) {
      price = $(result).find('.IsqQVc:first').text();
      if (validPrice(price)) {
        let value = priceToBRL(price);
        
        localStorage.price = value;
        updateBadge(value);
        setToolTip();

        if (value >= localStorage.maxPrice) {
          show("Alerta de preço maximo", "icon48.png");
        } else if (value <= localStorage.minPrice) {
          show("Alerta de preço minimo", "icon48-down.png");
        }
      }
    }
  });
}

function show(msg, icon) {
	var alert = {
		type: "basic",
		title: localStorage.asset, 
		message: msg, 
		iconUrl: icon, 
		isClickable: !1, 
		requireInteraction: !0
	};
    
	chrome.notifications.create("priceAlert", alert);
}

function updateBadge(value) {
	paidPrice = localStorage.paidPrice;
	color = value > paidPrice ? [0, 188, 0, 255] : value < paidPrice ? [255, 0, 0, 255] : [188, 188, 0, 255];

	chrome.browserAction.setBadgeBackgroundColor({ color: color });
	chrome.browserAction.setBadgeText({ text: "" +  value});
}

function setToolTip() {
    var d = new Date();

	//Rendimento
    var rendimento = localStorage.price - localStorage.paidPrice;
    var percentage = (rendimento / localStorage.paidPrice) * 100;

	//Por ativo
	var byAsset = (percentage * localStorage.paidPrice) / 100;
	//Total
    var total = byAsset * localStorage.quantity;

    var title = localStorage.asset + "\n" +
    d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds() + " > " + "R$ " + localStorage.price + "\n\n" +
    "Rendimento (" + round(percentage) + "%): " + "R$ " + round(byAsset) + " Por ação. Total sobre " + localStorage.quantity + " ações: R$ " + round(total) + "\n" +
    "Alerta de preço maximo (R$): " + localStorage.maxPrice + "\n" +
    "Alerta de preço minimo (R$): " + localStorage.minPrice;

    chrome.browserAction.setTitle({ title: title });
}

function validPrice(newValue) {
	let reg = new RegExp('[.,]*[0-9]');
	if (reg.test(newValue)) return true;
	else return false;
}

function priceToBRL(price) {
	return parseFloat(price.replace(/,/g,'.'));
}

function round(number) {
    return (Math.round(number * 100)/100).toFixed(2);
}
  