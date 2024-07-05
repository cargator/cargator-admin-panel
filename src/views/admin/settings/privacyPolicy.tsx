import React from "react";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="mx-[auto] max-w-[1170px] p-8 pt-28 md:pt-12">
      <h1 className="my-5 text-2xl font-semibold">
        Privacy Policy (as of 13th may)
      </h1>
      <ol>
        <li>
          <h2 className="font-bold">Introduction</h2>
          <p>
            Welcome to Sukam-Express, a mobile application committed to
            prioritizing user privacy. This Privacy Policy outlines how we
            handle your personal information when you use our services.{" "}
          </p>
        </li>
        <li>
          <h2 className="font-bold">Information We Collect</h2>
          <ol>
            <li>
              <h2 className="font-bold">Personal Information</h2>
              <p>
                When using Sukam-Express, we may collect specific personal
                information, including but not limited to: Device information
                (e.g., device type, operating system)Log data (e.g., access
                times, IP addresses)Account information
              </p>
            </li>
            <li>
              <h2 className="font-bold">Usage of Location Data</h2>
              <p>
                While we do not actively collect user location data, Sukam-Express may request access to your device's location for the sole
                purpose of providing you with location-based services. You have
                the option to deny this access.
              </p>
            </li>
            <li>
              <h2 className="font-bold">Purpose of Collection</h2>
              <p>
                We collect this information to provide you with a better
                service, enhance your user experience, and respond effectively
                to your inquiries and support requests.
              </p>
            </li>
            <li>
              <h2 className="font-bold">User Control</h2>
              <p>
                You have the right to delete this information at any time,
                giving you control over your data and privacy. For data deletion
                requests, please contact us at{" "}
                <Link style={{ color: "blue" }} to={"mailto:beep@cargator.org"}>
                  beep@cargator.org
                </Link>
                .
              </p>
            </li>
          </ol>
        </li>
        <li>
          <h2 className="font-bold">Data Security</h2>
          <p>
            We prioritize the security of your personal information and
            implement appropriate measures to protect it from unauthorized
            access, disclosure, alteration, and destruction.
          </p>
        </li>
        <li>
          <h2 className="font-bold">Third-Party Services</h2>
          <p>
            Sukam-Express may use third-party services that collect, monitor,
            and analyze information. These services have their own privacy
            policies addressing how they use such information.
          </p>
        </li>
        <li>
          <h2 className="font-bold">Consent</h2>
          <p>
            By using Sukam-Express, you consent to the terms outlined in this
            Privacy Policy.
          </p>
        </li>
        <li>
          <h2 className="font-bold">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. Any changes will
            be effective immediately upon posting the revised policy.
          </p>
        </li>
        <li>
          <h2 className="font-bold">Contact Us</h2>
          <p>
            If you have any questions, concerns, or wish to request data
            deletion, please contact us at{" "}
            <Link style={{ color: "blue" }} to={"mailto:beep@cargator.org"}>
              beep@cargator.org
            </Link>
            .
          </p>
        </li>
      </ol>
    </div>
  );
}

export default PrivacyPolicy;
