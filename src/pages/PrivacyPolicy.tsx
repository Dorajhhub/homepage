import React from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl p-4 pb-20 mx-auto">
      <div className="p-8 glass-card md:p-12 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 text-indigo-600 bg-indigo-100 rounded-xl dark:bg-indigo-900/30 dark:text-indigo-400">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            Privacy Policy
          </h1>
        </div>

        <div className="prose prose-lg text-gray-600 dark:prose-invert max-w-none dark:text-gray-300">
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h3>1. Introduction</h3>
          <p>
            Welcome to MinDevX. We respect your privacy and are committed to
            being transparent about how we handle your information. This privacy
            policy explains that we do not collect, store, or process any
            personal data from users who visit our website.
          </p>

          <h3>2. Information We Do Not Collect</h3>
          <p>MinDevX does not collect any of the following types of data:</p>
          <ul>
            <li>
              <strong>Identity Data</strong> (such as name, username, or similar
              identifiers)
            </li>
            <li>
              <strong>Contact Data</strong> (such as email address or phone
              number)
            </li>
            <li>
              <strong>Technical Data</strong> (such as IP addresses, browser
              information, device information, or login data)
            </li>
            <li>
              <strong>Usage Data</strong> (such as page interactions, clicks, or
              browsing behavior)
            </li>
          </ul>

          <h3>3. Cookies and Tracking</h3>
          <p>
            We do not use cookies, analytics tools, tracking scripts, or any
            third-party services that collect or process personal data.
          </p>

          <h3>4. Data Security</h3>
          <p>
            Since we do not collect or store any personal data, no personal
            information is at risk of being lost, accessed, or misused. However,
            we still maintain secure server environments to protect the general
            integrity of the website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
