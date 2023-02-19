SalesforceInteractions.init({
    cookieDomain: "ec2-13-126-250-169.ap-south-1.compute.amazonaws.com",
    consents: [{
        purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
        provider: "Consent Provider",
        status: {
            consents: new Promise(resolve => {
                SalesforceInteractions.cashDom("#opt-in-personalization").on("click", () => {
                    resolve([{
                        provider: "Consent Provider",
                        purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
                        status: SalesforceInteractions.ConsentStatus.OptIn
                    }]);
                });
                SalesforceInteractions.cashDom("#opt-out-personalization").on("click", () => {
                    resolve([{
                        provider: "Consent Provider",
                        purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
                        status: SalesforceInteractions.ConsentStatus.OptOut
                    }]);
                });
            })
        }
    }]
}).then(() => {
    const sitemapConfig = {
        global: {
            listeners: [
                SalesforceInteractions.listener("click", "#opt-in-personalization", () => {
                    const consent = {
                        provider: "Consent Provider",
                        purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
                        status: SalesforceInteractions.ConsentStatus.OptIn
                    };
                    SalesforceInteractions.updateConsents(consent);
                }),
                SalesforceInteractions.listener("click", "#opt-out-personalization", () => {
                    const consent = {
                        provider: "Consent Provider",
                        purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
                        status: SalesforceInteractions.COnsentStatus.OptOut
                    };
                    SalesforceInteractions.updateConsents(consent);
                })
            ]
        },
        pageTypeDefault: {
            name: "default",
            interaction: {
                name: "Default Page"
            }
        },
        pageTypes: [
            {
                name: "login_page",
                isMatch: () => /\login/.test(window.location.pathname)
            }
        ]
    };
    SalesforceInteractions.initSitemap(sitemapConfig);
});