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
POST | {hos url}/v1/pci-bff/batch/signed-url/{source}    
````

