# cloud-pci-bff
Back end for Front end application for Cloud PCI

### Installation Guide
-  $ npm install serverless -g
-  $ npm install
-  $ npm start

### Run tests
npm test

### Sonar Analysis
- $ npm install -g sonarqube-scanner
- $ sonar-scanner

### API Spec
````
GET  | {hos url}/v1/pci-bff/support/healthcheck 
GET  | {hos url}/v1/pci-bff/support/status 
POST | {hos url}/v1/pci-bff/batch/files/signed-url/input
POST | {hos url}/v1/pci-bff/batch/files/signed-url/output
GET  | {hos url}/v1/pci-bff/batch/jobs 
DELETE  | {hos url}/v1/pci-bff/batch/jobs/{jobId}
GET  | {hos url}/v1/pci-bff/auth/login
GET  | {hos url}/v1/pci-bff/auth/logout
GET  | {hos url}/v1/pci-bff/auth/user-details
POST | {hos url}/v1/pci-bff/pricing/pricing-data  
````

