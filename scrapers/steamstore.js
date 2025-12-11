arcadeHud.addScraper({
	"id": "steamstore",
	"api_version": 0.1,
	"title": "Steam Store",
	"summary": "PC Games",
	"description": "The Steam Store has lots of PC games, VR games, plus some apps & movies.",
	"homepage": "http://store.steampowered.com/",
	"search": "http://store.steampowered.com/search/?term=$TERM",
	"can_acquire": true,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"reference": 100,
		"description": 100,
		"title": 100,
		"screen": 100,
		"marquee": 100,
		"file": 50,
		"type": 100
	},
	"hasLogo": true,
	"rank": 1,
	"quickTypes":
	{
		"pc": true
	},
	"quickAllTypes":
	{
		"pc": true,
		"other": true
	},
	"run": function(url, field, doc)
	{
		var response = {};

		// reference
		var referenceElem = doc.querySelector("link[rel='canonical']");
		var referenceURL = referenceElem.getAttribute("href");

		var regex = new RegExp("(http|https):\/\/(?:www\.)?store\.steampowered\.com\/app\/[0-9]+\/");
		var results = regex.exec(referenceURL);
		referenceURL = results[0];

		response.reference = referenceURL;

		// get appId extracted
		var appId = referenceURL.substring(0, referenceURL.length-1);
		appId = appId.substring(appId.lastIndexOf("/") + 1);

		// file
		response.file = appId;

		// description
		var descriptionElem = doc.querySelector("meta[name='Description']");
		response.description = descriptionElem.getAttribute("content");

		// get app data ready
		var appData = doc.querySelector('.gamehighlight_desktopcarousel[data-featuretarget="gamehighlight-desktopcarousel"]');
		appData = appData.getAttribute('data-props');
		appData = JSON.parse(appData);

		// title
		response.title = appData.appName;

		// screen
		var screen = appData.screenshots[0].full;

		if (screen.indexOf('https://') === 0) {
		    screen = 'http://' + screen.substring(8);	// convert to http for AArcade image loader
		}
		response.screen = screen;

		// marquee
		response.marquee = "http://cdn.akamai.steamstatic.com/steam/apps/" + appId + "/header.jpg";

		// type
		response.type = "pc";

		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;

		//var screenElem = doc.querySelector(".highlight_strip_screenshot");
		//if( !!screenElem )
		//	validForScrape = true;

		var appData = doc.querySelector('.gamehighlight_desktopcarousel[data-featuretarget="gamehighlight-desktopcarousel"]');
		appData = appData.getAttribute('data-props');
		if( appData ) {
			validForScrape = true;
		}

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 3000,
	"runDelay": 0
});