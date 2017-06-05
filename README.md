# vMonitor

VirtualMachine and Service monitor for vSphere (VMware ESXi Cluster)

## Installation

### 1. Clone the repo (or download)

```
git clone https://github.com/BlueT/vMonitor.git
cd vMonitor
```

### 2. Setup vsphere-vm-monitor

```
npm install
cp config.json.example config.json

# Edit config.json
```

### 3. Install vSphere SDK for JavaScript in vendor/vsphere-sdk/ folder

Download vsphere-1.x.x-src.tgz from https://labs.vmware.com/flings/vsphere-sdk-for-javascript (for example *vsphere-1.1.0-src.tgz*)  
Save in vendor/vsphere-sdk/, extract it and install.

```
mkdir -p vendor/vsphere-sdk/
cd vendor/vsphere-sdk/

# download vsphere-1.x.x-src.tgz and save here

tar zxvf vsphere-1.1.0-src.tgz
npm install
```

### 4. Prepare Database
```
# Go back to project folder
cd ../../

# Prepare data folder
mkdir ./rethinkdb-data

# Start RethinkDB in docker
docker run --name rethinkdb -v "$PWD/rethinkdb-data:/data" -d rethinkdb
```

### 5. Run it

```
npm start
```

### 6. Check VM info

List all instance ID
- GET http://localhost:3000/instance/

Get VM instance info
- GET http://localhost:3000/instance/ID-OF-VM-INSTANCE

Change state (Boot / Reboot / Shutdown) (Not implement yet)
- PATHC http://localhost:3000/instance/ID-OF-VM-INSTANCE

