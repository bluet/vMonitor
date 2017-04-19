# vsphere-vm-monitor

VirtualMachine and Service monitor for vSphere (VMware ESXi Cluster)

## Installation

1. Clone the repo (or download)

```
git clone https://github.com/BlueT/vsphere-vm-monitor.git
cd vsphere-vm-monitor
```

2. Setup vsphere-vm-monitor

```
npm install
cp config.json.example config.json

# Edit config.json
```

3. Install vSphere SDK for JavaScript in vendor/vsphere-sdk/ folder

Download vsphere-1.x.x-src.tgz from https://labs.vmware.com/flings/vsphere-sdk-for-javascript (for example *vsphere-1.1.0-src.tgz*)  
Save in vendor/vsphere-sdk/, extract it and install.

```
mkdir -p vendor/vsphere-sdk/
cd vendor/vsphere-sdk/

# download vsphere-1.x.x-src.tgz and save here

tar zxvf vsphere-1.1.0-src.tgz
npm install
```



4. Run it

```
# Go back to project folder
cd ../../

npm start
```

