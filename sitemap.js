const PERSONALIZATION_COOKIE_DETAILS = {
  cookieKey: "personalization_consent_status",
  values: {
    optIn: "opt-in",
    optOut: "opt-out"
  }
}
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
const cookieOption = getCookie(PERSONALIZATION_COOKIE_DETAILS.cookieKey)
SalesforceInteractions.init({
  cookieDomain: "e-commerce-is.azurewebsites.net",
  consents: new Promise((resolve) => {
    if (cookieOption != null && cookieOption != undefined && cookieOption != "") {
      resolve([
        {
          provider: "Self",
          purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
          status: PERSONALIZATION_COOKIE_DETAILS.values.optIn == cookieOption ? SalesforceInteractions.ConsentStatus.OptIn : SalesforceInteractions.ConsentStatus.OptOut
        },
      ]);
    }
    SalesforceInteractions.cashDom("#opt-in-personalization").on("click", () => {
      resolve([
        {
          provider: "Self",
          purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
          status: SalesforceInteractions.ConsentStatus.OptIn
        },
      ]);
    });
    SalesforceInteractions.cashDom("#opt-out-personalization").on("click", () => {
      resolve([
        {
          provider: "Self",
          purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
          status: SalesforceInteractions.ConsentStatus.OptOut
        },
      ]);
    });

  }),
}).then(() => {
  const sitemapConfig = {
    global: {
      listeners: [
        SalesforceInteractions.listener("click", "#opt-in-personalization", () => {
          const consent = [{
            provider: "Self",
            purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
            status: SalesforceInteractions.ConsentStatus.OptIn
          }];
          SalesforceInteractions.updateConsents(consent);
        }),
        SalesforceInteractions.listener("click", "#opt-out-personalization", () => {
          const consent = [{
            provider: "Self",
            purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
            status: SalesforceInteractions.ConsentStatus.OptOut
          }];
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
        isMatch: () => /^\/login$/.test(window.location.pathname),
        interaction: {
          name: "Login Page",
        }
      },
      {
        name: "products_page",
        isMatch: () => /^\/store$/.test(window.location.pathname),
        interaction: {
          name: "All Products List Page",
        }
      },
      {
        name: "product_detail",
        /*
                The best practice for isMatch is to match as quickly as possible. If matching immediately is not an option, you can use a Promise.
                The Promise should resolve true or false and not pend indefinitely. This Promise example uses a setTimeout to prevent the isMatch from pending indefinitely if the match condition is not met fast enough. In this scenario, we know that the match condition will be met within 50 milliseconds or not at all. Note that using a timeout like this might not be sufficient in all cases and if you are using a Promise it should be tailored to your specific use-case.
                */
        isMatch: () =>
          new Promise((resolve, reject) => {
            let isMatchPDP = setTimeout(() => {
              resolve(false);
            }, 50);
            return (/^\/product\/[0-9a-zA-Z]+$/.test(window.location.pathname) && SalesforceInteractions.DisplayUtils.pageElementLoaded(
              "div.container div.product-container[data-product-id]",
              "html",
            ).then(() => {
              clearTimeout(isMatchPDP);
              resolve(true);
            }));
          }),
        interaction: {
          name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
          catalogObject: {
            type: "Product",
            id: () => {
              return SalesforceInteractions.util.resolveWhenTrue.bind(() => {
                const productId = window.location.pathname.split("/").slice(-1)[0];
                if (productId) {
                  return productId;
                } else {
                  return false;
                }
              });
            },
            attributes: {
              sku: {
                id: SalesforceInteractions.resolvers.fromSelectorAttribute("div.product-container", "data-product-id"),
              },
              name: SalesforceInteractions.resolvers.fromSelector("div.product-container h2#product-title"),
              description: SalesforceInteractions.resolvers.fromSelector(
                "div.product-container h4#product-description",
                (desc) => desc.trim(),
              ),
              url: SalesforceInteractions.resolvers.fromHref(),
              imageUrl: SalesforceInteractions.resolvers.fromSelectorAttribute(
                "div.product-container img.product-image",
                "src",
                (url) => window.location.origin + url,
              ),
              inventoryCount: 1,
              price: SalesforceInteractions.resolvers.fromSelector(
                "div.product-container h5#product-price",
                (price) => parseFloat(price.replace(/[^0-9\.]+/g, "")),
              )
            },
          },
        },
        listeners: [
          SalesforceInteractions.listener("click", "input[type=submit]", () => {
            let lineItem = SalesforceInteractions.mcis.buildLineItemFromPageState(
              "div.product-container h6#product-quantity",
            );
            lineItem.quantity = 1;
            SalesforceInteractions.sendEvent({
              interaction: {
                name: SalesforceInteractions.CartInteractionName.AddToCart,
                lineItem: lineItem,
              },
            });
          }),
        ],
        contentZones: [
          {name: "Related product container", selector: "div#recommendation-container"}
        ]
      }
    ]
  };
  SalesforceInteractions.initSitemap(sitemapConfig);
});