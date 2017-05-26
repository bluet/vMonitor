var express = require('express');
var router = express.Router();

var appRoot = require('app-root-path');
var config = require(appRoot + "/config.json");
var status_checker = require(appRoot + "/lib/status.js");
var checker = new status_checker(config);
checker.every(5000);

/* GET instance listing. */
router.get('/', function(req, res, next) {
	
	// FIXME: check permission
	
	var list = Object.keys(checker.current());
	res.json(list);
});

// GET instance stats
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	
	// more than 1 id
	if (id.charAt(36) === ',') {
		id = id.split(',');
	}
	//~ console.log(JSON.stringify(id, null, 4));
	
	// FIXME: check permission
	
	//get instance stats by ID
	var stats = checker.current(id);
	res.json(stats);
});

// MODIFY instance stats
// boot, reboot, power off
router.patch('/:id', function(req, res, next) {
	var id = req.params.id;
	var payload = req.body;
	
	// FIXME: check permission
	
	// FIXME: do operations by action. vm.runtime.powerState
	
	res.send('Not implemented yet');
});

router.options('/:id', function(req, res, next) {
	var id = req.params.id;
	
	return res.json(id);
});

module.exports = router;
