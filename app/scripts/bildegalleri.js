/* BILDE */

var Bilde = function(objekt) {
	this.src_liten = objekt.media.m.replace("_m", "_s");
	this.src_stor = objekt.media.m.replace("_m", "");
	this.tittel = objekt.title;
	this.el = $('<img title="' + this.tittel + '" class="bilde bilde-liten" src="' + this.src_liten + '" title="' + this.src_stor + '" />')
};

Bilde.prototype.init = function() {
	this.el.on("click", function() {
		var indeks = $(this).index();
		vis_stort_bilde(indeks);
	}); 
	this.forhandslast();
};

Bilde.prototype.forhandslast = function() {
	// Lite triks for å forhåndslaste bildene i nettleseren, 
	// slik at applikasjonen virker mer snappy ;-)
	var stort_bilde = new Image();
	stort_bilde.src = this.src_stor;
};

Bilde.prototype.rendre_stor = function() {
	return '<img title="' + this.tittel + '" class="bilde bilde-stor" src="' + this.src_stor + '" title="' + this.src_stor + '" />';
};

/* BILDEGALLERI */

var bilder = [];
var bildeviser = $('<div class="bildeviser" />');

var lag_flickr_url = function(sokeord) {
	var streng = "http://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&tags=" + sokeord + "&tagmode=all&format=json&jsoncallback=?"
	return streng;
};

var lag_bildeobjekter = function(items) {

	// Vi itererer over respons, og lager et nytt bilde-objekt per item 

	$(items).each(function() {
		var item = this;
		var bilde = new Bilde(item); 
		bilde.init(); 
		bilder.push(bilde); // Vi legger til hvert bilde-objekt på slutten av arrayet 
	});

};

var lag_bildestripe_html = function(antall_bilder) {
	var container = $('<div class="bildestripe" />');

	for(i = 0; i < antall_bilder; i++) {
		var bilde = bilder[i];
		container.append(bilde.el);
	}

	return container; 
};

var vis_stort_bilde = function(indeks) {
	var bilde = bilder[indeks];
	var html = bilde.rendre_stor(); 
	bildeviser.html(html);
};

var start_bildegalleri = function(el) {

	// Tar i mot et dom-element med jQuery-funksjoner, f.eks.
	// $('<div id="bildegalleri" />');

	var sok = "Trondheim";
	var url = lag_flickr_url(sok);
	var antall_bilder = 8;

	$.ajax({
		dataType: "json",
		url: url,
		success: function(respons) {
			lag_bildeobjekter(respons.items); 
			var html = lag_bildestripe_html(antall_bilder); 
			el.prepend(html);
			el.append(bildeviser);
			vis_stort_bilde(0);
		}
	});

};