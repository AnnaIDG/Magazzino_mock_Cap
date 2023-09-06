/*global QUnit*/

sap.ui.define([
	"tile_project/tile_project/controller/tile.controller"
], function (Controller) {
	"use strict";

	QUnit.module("tile Controller");

	QUnit.test("I should test the tile controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
