"use client";

import { useState, useEffect } from "react";

type CookieConsent = "accepted" | "rejected" | undefined;
type CookieConfirmationMessage = "visible" | "hidden";

export default function CookieBanner() {

  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [cookieConfirmationMessage, setCookieConfirmationMessage] = useState<CookieConfirmationMessage>("hidden");
  const [hideCookieBannerBlock, setHideCookieBannerBlock] = useState<boolean>(false);

  const [nonEssentialCookiesConsent, setNonEssentialCookiesConsent] = useState<CookieConsent>();

  // Check if the user has already given consent for non-essential cookies
  useEffect(() => {
    const nonEssentialCookiesConsent = localStorage.getItem("nonEssentialCookiesConsent") === null ? undefined : localStorage.getItem("nonEssentialCookiesConsent") as CookieConsent;
    if (!nonEssentialCookiesConsent) {
      setShowCookieBanner(true);
    }
  }, [nonEssentialCookiesConsent]);

  // Check if the user has already hidden the confirmation message
  useEffect(() => {
    const cookieConfirmationMessage = localStorage.getItem("cookieConfirmationMessage") === null ? "hidden" : localStorage.getItem("cookieConfirmationMessage") as CookieConfirmationMessage;
    console.log("cookieConfirmationMessage", cookieConfirmationMessage);
    if (cookieConfirmationMessage === "visible") {
      setCookieConfirmationMessage("visible");
    }
    if (cookieConfirmationMessage === "hidden" && nonEssentialCookiesConsent !== undefined) {
      setHideCookieBannerBlock(true);
    }
  }, [cookieConfirmationMessage]);

  // function to handle the acceptance of cookies
  const handleAcceptCookies = () => {
    localStorage.setItem("nonEssentialCookiesConsent", "accepted");
    setShowCookieBanner(false);
    setCookieConfirmationMessage("visible");
    localStorage.setItem("cookieConfirmationMessage", "visible");
    setNonEssentialCookiesConsent("accepted");
    try {
      console.log("Start analytics tracking if the user has accepted cookies");
    }
    catch (error) {
      console.error("Error starting analytics tracking:", error);
    }
  };

  // function to handle the rejection of cookies
  const handleRejectCookies = () => {
    localStorage.setItem("nonEssentialCookiesConsent", "rejected");
    setShowCookieBanner(false);
    setCookieConfirmationMessage("visible");
    localStorage.setItem("cookieConfirmationMessage", "visible");
    setNonEssentialCookiesConsent("rejected");
  };

  // function to handle hiding the confirmation message
  const handleHideConfirmation = () => {
    localStorage.setItem("cookieConfirmationMessage", "hidden");
    setCookieConfirmationMessage("hidden");
    setHideCookieBannerBlock(true);
  };

  // function to handle changing cookie settings
  const handleChangeCookieSettings = () => {
    setShowCookieBanner(true);
    setCookieConfirmationMessage("hidden");
    localStorage.setItem("cookieConfirmationMessage", "hidden");
    localStorage.removeItem("nonEssentialCookiesConsent");
    setNonEssentialCookiesConsent(undefined);
  }

  return (
    <>
      <div className="govuk-cookie-banner" data-nosnippet role="region" aria-label="Cookies on Manage intellectual property account" hidden={hideCookieBannerBlock}>

        <div className="govuk-cookie-banner__message govuk-width-container" hidden={!showCookieBanner}>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h2 className="govuk-cookie-banner__heading govuk-heading-m">
                Cookies on Manage intellectual property account
              </h2>
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">We use some essential cookies to make this service work.</p>
                <p className="govuk-body">We’d also like to use analytics cookies so we can understand how you use the service and make improvements.</p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button type="button" className="govuk-button" data-module="govuk-button" onClick={handleAcceptCookies}>
              Accept analytics cookies
            </button>
            <button type="button" className="govuk-button" data-module="govuk-button" onClick={handleRejectCookies}>
              Reject analytics cookies
            </button>
            <a className="govuk-link" href="/cookies">View cookies</a>
          </div>
        </div>

        {/* confirmation banner */}

        <div className="govuk-cookie-banner__message govuk-width-container" role="alert" hidden={cookieConfirmationMessage !== "visible"}>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">You’ve {nonEssentialCookiesConsent} analytics cookies. You can{" "}
                  <button className="reset-button govuk-link" onClick={handleChangeCookieSettings}>change your cookie settings</button> at any time.</p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button type="button" className="govuk-button" data-module="govuk-button" onClick={handleHideConfirmation}>
              Hide cookie message
            </button>
          </div>
        </div>

        {/* / confirmation banner */}

      </div>

    </>
  );
}