"use strict";

var appRoot = require('app-root-path');
var vsphere_easy = require(appRoot + "/lib/connector/vsphere.js");
var objFilter = require('obj-filter');

var vm_info_template = {
	"vm": { "value": "vm-57" },
	"runtime": {
		"host": { "value": "host-690" },
		"connectionState": "connected",
		"powerState": "poweredOn",
		"bootTime": "a timestamp 2017-04-18T11:11:19.354Z",
		"paused": false,
		"snapshotInBackground": false
	},
	"guest": {
		"toolsStatus": "toolsOk",
		"hostName": "VM hostname (fqdn)",
		"ipAddress": "VM IP"
	},
	"config": {
		"name": "VM Fullname",
		"vmPathName": "[Storage Name] Fullname/Hostname - IP.vmx",
		"memorySizeMB": 2048,
		"numCpu": 1,
		"numEthernetCards": 1,
		"numVirtualDisks": 1,
		"instanceUuid": "The VM's UUID",
		"guestId": "ubuntu64Guest",
		"guestFullName": "Ubuntu Linux (64-bit)",
		"installBootRequired": false
	},
	"quickStats": {
		"overallCpuUsage": "Aggregated CPU usage across all cores on the host in MHz",
		"guestMemoryUsage": "Physical memory usage on the host in MB",
		"guestHeartbeatStatus": "green"
	},
	"overallStatus": "green"
};


function status(args) {
	var self = this;
	var rdb_dbname = args.rdb_dbname || 'vmonitor';
	var rdb_hostname = args.rdb_hostname;
	
	this.stats = {};
	
	delete args.rdb_dbname;
	delete args.rdb_hostname;
	
	this.vsphere = new vsphere_easy(args);
	this.r = require('rethinkdbdash')({
		db: rdb_dbname,
		host: rdb_hostname
	});
	
	return this;
};


status.prototype.every = function start (interval) {
	var self = this;
	interval = interval || 15000;
	
	var on_success = function (args) {
		var vm_counter = 0;
		var timestamp = (new Date().getTime() / 1000.0);
		
		args.forEach(function(item) {
			var vm = item.propSet[0].val;
			var vm_info = objFilter(vm_info_template, vm);
			//~ console.log(JSON.stringify(vm, null, 4));
			
			vm_counter++;
			
			vm_info.instanceID = vm_info.config.instanceUuid;
			delete vm_info.config.instanceUuid;
			vm_info.timestamp = self.r.epochTime(timestamp);
			self.r.table('status').insert(vm_info).run()
			.then(function() {
				self.stats[vm_info.instanceID] = vm_info;
				self.stats[vm_info.instanceID].timestamp = timestamp;
			});
		});
		
		console.log(Date() + ' Total VMs: ' + vm_counter);
	};
	var on_error = function (args) { throw new Error(args) };
	
	setInterval(check_vm_status, interval, this.vsphere, on_success, on_error);
	
	return this;
}


function check_vm_status (vsphere, on_success, on_error) {
	
	vsphere.vm_info( undefined, on_success, on_error)
}


status.prototype.current = function (id) {
	var self = this;
	
	if (typeof id === 'undefined') {
		return self.stats;
	} else if (typeof id === 'string') {
		var ret = {};
		ret[id] = self.stats[id];
		return ret;
	} else if (id.constructor === Array) {
		var ret = {};
		id.forEach(function(element) {
			ret[element] = self.stats[element];
		});
		return ret;
	} else {
		throw new Error('id should be string, array, or undefined');
	}
}

module.exports = status;


// use InstanceUUID as unique vm id.  https://blogs.vmware.com/vsphere/2012/02/uniquely-identifying-virtual-machines-in-vsphere-and-vcloud-part-2-technical.html
