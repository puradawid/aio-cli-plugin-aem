/* 
   This is the module responsible for reading configuration file
   while the user is located in the folder (or within the folder)
   that has .aem.json file.

   Example of the config file:
   {
        "local" : {
            "host": "localhost",
            "port": "4502",
            "username": "admin",
            "password": "admin"
        }
    }

    There are multiple development vectors here:
    - the module should seek for the configuration from PWD to the
      top level folders
    - if configuration was not found, the module should inform about
      creating a one
    - validation of that configuration - not every property should be here
    - encoded password input - master password in another, untracked file
*/

const defaultConfig = {
    host: 'localhost'
}

const readConfig = () => {
    const potentialPath = process.env.PWD + '/.aem.json';
    try {
        return require(potentialPath);
    } catch (error) {
        return defaultConfig;
    }
}

module.exports = {
    readConfig: readConfig
}