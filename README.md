# Interoperable Non-Repudiation Protocol powered by DKGs


This is the main repo of the project carried out during my research period at the University of Strathclyde under supervision of Prof. Ross Horne.

During these three weeks we worked on a novel approach to non-repudiation, which led us to consider it as a novel proposal for HTTP Signature protocol.

# Setup
The following dependencies are required

- `yarn` version 1.22.19
- `node` version 18.17.0
- `pnpm` version 8.15.5
- `python` version 3.10 (if you have multiple version specify the version 3.10 to yarn using `yarn config set python /path/to/python3.10`)

The repository is structured into four folders, one per each agent of the system, plus a lib folder containing libraries needed for the project.
### Demo App
It is a demo of an app interacting with a Solid Community Solid Server.
### Demo Issuer
It is a demo of an issuer responsible for releasing credentials to the users.
### Demo TTP
It is a demo for a Trusted Third Party, responsible for decrypting the message of the protocol
### Demo User
It is a demo for the wallet of the user, which receives credentials, create new VP and send it to the App.

## Notice
Regarding the library folder, it is important to know that the `.tgz` files you found there have been created by starting from the source code existing in the folder. If you are facing some trubelshoot, you can consider regenerating these files according to the documentation existing in each source code project.

## TODO
* On the Demo Application, the DIDs for wrapped VP are inserted manually, we have to automate this behaviour.
* Create a DIDDocument to upload in building phase, so that one can easily upload it in its POD.
* Manage multiple connection from all the parties in order to check the loads.
* Save the non-repudiable message in a graph.
