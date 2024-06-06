"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const CookiesConsent = () => {
  const [showCookiesConsent, setShowCookiesConsent] = useState(false);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookies-consent", "true");
    setShowCookiesConsent(false);
  };
  const handleRejectCookies = () => {
    localStorage.setItem("cookies-consent", "false");
    setShowCookiesConsent(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cookies-consent") === null) {
        setShowCookiesConsent(true);
      }
    }
  }, []);

  if (!showCookiesConsent) return null;

  return (
    <div className="fixed bottom-0 h-[10rem] w-full bg-background3">
      <div className="container mx-auto flex h-full items-center gap-8 px-8 py-4">
        <div>
          <h2>Cookies Consent</h2>
          <p className="text-base text-white">
            We use cookies to ensure that we give you the best experience on our
            website. If you continue to use this site we will assume that you
            are happy with it.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleAcceptCookies}>Accept</Button>
          <Button onClick={handleRejectCookies} variant="destructive">
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CookiesConsent;
