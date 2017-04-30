"use strict";

var appRoot = require('app-root-path');
var vsphere_easy = require(appRoot + "/lib/connector/vsphere.js");
var objFilter = require('obj-filter');

var vm_info_template = {
	"runtime": {
		"connectionState": "connected",
		"powerState": "poweredOn",
		"bootTime": "a timestamp",
		"paused": false,
		"snapshotInBackground": false
	},
	"guest": {
		"guestId": "ubuntu64Guest",
		"guestFullName": "Ubuntu Linux (64-bit)",
		"toolsStatus": "toolsOk",
		"hostName": "VM hostname",
		"ipAddress": "VM IP"
	},
	"config": {
		"name": "VM Fullname",
		"template": false,
		"vmPathName": "[Storage NAme] Fullname/Hostname - IP.vmx",
		"memorySizeMB": 2048,
		"cpuReservation": 0,
		"memoryReservation": 0,
		"numCpu": 1,
		"numEthernetCards": 1,
		"numVirtualDisks": 1,
		"uuid": "a UUID",
		"instanceUuid": "The VM's UUID",
		"guestId": "ubuntu64Guest",
		"guestFullName": "Ubuntu Linux (64-bit)",
		"annotation": "",
		"installBootRequired": false
	},
	"quickStats": {
		"overallCpuUsage": 25,
		"overallCpuDemand": 25,
		"guestMemoryUsage": 20,
		"hostMemoryUsage": 2070,
		"guestHeartbeatStatus": "green",
		"distributedCpuEntitlement": 25,
		"distributedMemoryEntitlement": 764,
		"staticCpuEntitlement": 61,
		"staticMemoryEntitlement": 2094,
		"privateMemory": 2042,
		"sharedMemory": 6,
		"swappedMemory": 0,
		"balloonedMemory": 0,
		"consumedOverheadMemory": 29,
		"ftLogBandwidth": -1,
		"ftSecondaryLatency": -1,
		"ftLatencyStatus": "gray",
		"compressedMemory": 0,
		"uptimeSeconds": 630686,
		"ssdSwappedMemory": 0
	},
	"overallStatus": "green"
};


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
		var vm_counter = 0;
		var timestamp = self.r.now();
		
		//~ console.log(JSON.stringify(args, null, 4));
		args.forEach(function(item) {
			var vm = item.propSet[0].val;
			
			vm_counter++;
			
			var vm_info = objFilter(vm_info_template, vm)
			
			//~ console.log(JSON.stringify(vm_info, null, 4));
			//~ console.log(self.r.now());
			
			vm_info.timestamp = timestamp;
			self.r.table('status').insert(vm_info).run();
		});
		
		console.log(Date() + ' Total VMs: ' + vm_counter);
	};
	var on_error = function (args) { throw new Error(args) };
	
	setInterval(check_vm_status, interval, this.vsphere, on_success, on_error);
	
	return this;
}


function check_vm_status (vsphere, on_success, on_error) {
	//~ console.log( 
	vsphere.vm_info( undefined, on_success, on_error)
	//~ );
}

module.exports = status;


// use InstanceUUID as unique vm id.  https://blogs.vmware.com/vsphere/2012/02/uniquely-identifying-virtual-machines-in-vsphere-and-vcloud-part-2-technical.html
