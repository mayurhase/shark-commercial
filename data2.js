var servicesData,
	brandsData,
	aboutData,
	configData,
	caseStudiesData,
	loadedImages = 0,
	preloadImageArray = [];

$(document).ready(function () {
	$.ajaxSetup({
		cache: false,
	});

	let promises = [];

	promises.push(
		$.get("data/config.csv", "text", function (data) {
			configData = $.csv.toObjects(data);
			configData.map((config) => {
				configData[config.key] = config.value;
			});
			addConfigData(configData);
		})
	);

	// promises.push(
	// 	$.get("data/services.csv", "text", function (data) {
	// 		servicesData = $.csv.toObjects(data);
	// 		servicesData.map((speaker, index) => {
	// 			addServicesData(index, speaker.title, speaker.detail);
	// 		});
	// 	})
	// );

	promises.push(
		$.get("data/case-studies.csv", "text", function (data) {
			caseStudiesData = $.csv.toObjects(data);
			caseStudiesData.map((cs, index) => {
				preloadImageArray.push(
					`assets/images/cs-logos/${cs.brand.toLowerCase()}.svg`
				);
				if (cs.media.includes(",")) {
					let CSMedia = cs.media
						.split(",")
						.map((item) => item.trim());
					for (i in CSMedia) {
						preloadImageArray.push(
							`assets/case-studies-media/${CSMedia[i]}`
						);
					}
				} else {
					preloadImageArray.push(
						`assets/case-studies-media/${cs.media}`
					);
				}
			});
		})
	);

	promises.push(
		$.get("data/brands.csv", "text", function (data) {
			brandsData = $.csv.toObjects(data);
			brandsData = brandsData.filter((item) => item.show == "TRUE");
			brandsData.map((brand, index) => {
				addBrandsData(brand.name, brand.show, index);
				preloadImageArray.push(
					`assets/images/brands-new/colored/${brand.name.toLowerCase()}.png`
				);
			});
		})
	);

	promises.push(
		$.get("data/about.csv", "text", function (data) {
			aboutData = $.csv.toObjects(data);
			aboutData.map((content) => {
				addAboutData(content.title, content.detail);
			});
		})
	);

	Promise.all(promises).then((values) => {
		preloadImages();
	});
});

function addServicesData(index, title, detail) {
	$(`#services-grid`).children().eq(index).children().eq(0).html(title);
	$(`#services-grid`).children().eq(index).children().eq(1).html(detail);
}

function addBrandsData(name, visible, index) {
	if (visible != "TRUE") return;
	if (index < 9)
		$("#brand-logos").append(`
		<img
			src="assets/images//brands-new/colored/${name.toLowerCase()}.png"
			alt="${name} Logo"
			class="brand-logo"
		>
	`);
	if (index < 6)
		$("#brands-cubes").append(`
			<div class="brand-box">
				<img src="assets/images//brands-new/colored/${name.toLowerCase()}.png" alt="${name}" />
			</div>
	`);
}

function addAboutData(title, detail) {
	$("#about-lc-title").html(title);
	$("#about-lc-detail").html(detail);
}

function addConfigData(data) {
	$("#email-div>a").html(data.email);
	$("#cta-button").html(data.cta);
	$("#email-div>a").attr("href", "mailto:" + data.email);
}

function preloadImages() {
	// console.log(preloadImageArray);
	for (var i = 0; i < preloadImageArray.length; i++) {
		var tempImage = new Image();
		// tempImage.addEventListener("load", trackProgress, true);
		tempImage.src = preloadImageArray[i];
	}
}

// function trackProgress() {
// 	loadedImages++;

// 	if (loadedImages == preloadImageArray.length) {
// 		imagesLoaded();
// 	}
// }

// function imagesLoaded() {
// 	console.log("All images loaded!");
// }
