window.overlayShowHide = function (elementId) {
	var div = document.getElementById(elementId);
	if (div != undefined) {
		div.classList.toggle("hidden");
	}
}