"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

var vsphere = require("./vendor/vsphere-sdk/dist/vsphere.js");
var config = require("./config.json");

vsphere.vimService(config.hostname).then(function(service) {
	var propertyCollector = service.serviceContent.propertyCollector,
	    rootFolder = service.serviceContent.rootFolder,
	    sessionManager = service.serviceContent.sessionManager,
	    viewManager = service.serviceContent.viewManager,
	    vim = service.vim,
	    vimPort = service.vimPort;
	return vimPort.login(sessionManager, config.username, config.password)
	.then(function() {
		return vimPort.createContainerView(viewManager, rootFolder,
		[ "VirtualMachine" ], true);
	})
	.then(function(containerView) {
		return vimPort.retrievePropertiesEx(propertyCollector, [
			vim.PropertyFilterSpec({
				objectSet: vim.ObjectSpec({
					obj: containerView,
					skip: true,
					selectSet: vim.TraversalSpec({
						path: "view",
						type: "ContainerView"
					})
				}),
				propSet: vim.PropertySpec({
					type: "VirtualMachine",
					pathSet: [ "name", "guest", "guestHeartbeatStatus", "resourceConfig", "storage", "summary", "overallStatus", "triggeredAlarmState" ]
				})
			})
		], vim.RetrieveOptions());
	})
	.then(function(result) {
		result.objects.forEach(function(item) {
			//~ console.log(item.propSet[0].val);
			//~ console.log("%o", item.propSet);
			console.log(JSON.stringify(item.propSet, null, 4));
		});
		return vimPort.logout(sessionManager);
	});
}).catch(function(err) {
	console.log(err.message);
});


// http://pubs.vmware.com/vsphere-60/index.jsp?topic=/com.vmware.wssdk.apiref.doc/index.html&single=true
// https://labs.vmware.com/flings/vsphere-sdk-for-javascript?download_url=https%3A%2F%2Fdownload3.vmware.com%2Fsoftware%2Fvmw-tools%2Fvsphere-sdk-for-javascript%2Fvsphere-1.1.0-src.tgz#comments
// https://download3.vmware.com/software/vmw-tools/vsphere-sdk-for-javascript/vsphere-1.1.0-src.tgz
