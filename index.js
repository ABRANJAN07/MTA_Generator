const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your project name: ', (name) => {
  rl.question('Enter your XSUAA module name: ', (uaa) => {
    rl.question('Enter your xsuaa service instance name'), (xsuaa) => {
        const yaml = `
- name: ${name}-destination-content
  type: com.sap.application.content
  requires:
  - name: ${name}-destination-service
    parameters:
      content-target: true
  - name: ${name}-repo-host
    parameters:
      service-key:
        name: ${name}-repo-host-key
  - name: srv-api 
  - name: ${uaa}
    parameters:
      service-key:
        name: ${uaa}-key
  parameters:
    content:
      instance:
        destinations:
        - Authentication: OAuth2UserTokenExchange
          Name: srv-api
          TokenServiceInstanceName: ${xsuaa}-service
          TokenServiceKeyName: ${uaa}-key
          URL: ~{srv-api/srv-url}
        - Name: ${name}_repo_host
          ServiceInstanceName: ${name}-html5-srv
          ServiceKeyName: ${name}-repo-host-key
          sap.cloud.service: com.sn.${name}
        - Authentication: OAuth2UserTokenExchange
          Name: ${uaa}
          ServiceInstanceName: ${xsuaa}-service
          ServiceKeyName: ${uaa}-key
          sap.cloud.service: com.sn.${name}
       existing_destinations_policy: ignore
  build-parameters:
    no-source: true
resources:
- name: ${name}-repo-host
  type: org.cloudfoundry.managed-service
  parameters:
    service: html5-apps-repo
    service-name: ${name}-html5-srv
    service-plan: app-host
- name: ${name}-destination-service
  type: org.cloudfoundry.managed-service
  parameters:
    config:
      HTML5Runtime_enabled: true
      version: 1.0.0
    service: destination
    service-name: ${name}-destination-service
    service-plan: lite
`;

        fs.writeFile('generatedCode.yaml', yaml, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('YAML code generated successfully!');
        }
        rl.close();
        });
    }
  });
});
