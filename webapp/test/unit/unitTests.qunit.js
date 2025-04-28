/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"studies/firstui5project/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
