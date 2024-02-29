import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: "https://idman.0x42.in",
    realm: "dev.avalon.cool",
    clientId: "dev.avalon.cool"
});

export default keycloak;