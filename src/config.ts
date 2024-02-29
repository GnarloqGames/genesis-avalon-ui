interface Configuration {
    apiBaseUrl?: string
    oidcRedirectUrl?: string
    oidcAuthorityUrl?: string
    oidcClientId?: string
    oidcScope?: string
}

export default {
    apiBaseUrl: "http://localhost:8080",
    oidcRedirectUrl: "http://localhost:8081",
    oidcAuthorityUrl: "https://idman.0x42.in/realms/dev.avalon.cool",
    oidcClientId: "dev.avalon.cool",
    oidcScope: "openid build"
} as Configuration