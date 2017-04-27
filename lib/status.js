"use strict";

var appRoot = require('app-root-path');
var vsphere_easy = require(appRoot + "/lib/connector/vsphere.js");


function status(args) {
	var self = this;
	var rdb_dbname = args.rdb_dbname || 'vmonitor';
	var rdb_hostname = args.rdb_hostname;
	
	delete args.rdb_dbname;
	delete args.rdb_hostname;
	
	this.vsphere = new vsphere_easy(args);
	this.r = require('rethinkdbdash')({
		db: rdb_dbname,
		host: rdb_hostname
	});
	
	//~ console.log(this);
	
	return this;
};


status.prototype.every = function start (interval) {
	var self = this;
	interval = interval || 15000;
	
	//~ console.log(this.vsphere);
	
	var on_success = function (args) {
		console.log(JSON.stringify(args, null, 4));
	};
	var on_error = function (args) { throw new Error(args) };
	
	setInterval(check_vm_status, interval, this.vsphere, on_success, on_error);
	
	return this;
}


function check_vm_status (vsphere, on_success, on_error) {
	console.log( vsphere.vm_info( undefined, on_success, on_error) );
}

module.exports = status;
