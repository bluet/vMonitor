"use strict";

var appRoot = require('app-root-path');
var conf = require(appRoot + "/config.json");
var vsphere_easy = require(appRoot + "/lib/connector/vsphere.js");
var v = new vsphere_easy(conf);

v.vm_info();
