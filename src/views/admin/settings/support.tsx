import { Link } from "react-router-dom";

function Support() {
  return (
    <>
      <div className="mx-[auto] max-w-[1170px] p-8 pt-28 md:pt-12">
        <h1 className="my-5 text-2xl font-semibold">Support Page</h1>
        <ul>
          <ul>
            <h2 className="font-bold">Data Safety Concerns:</h2>
            <p className="Roboto">
              We understand the importance of ensuring the safety and security
              of user data. Our team is committed to addressing any concerns
              regarding data safety promptly and effectively. If you have
              encountered any issues related to data safety while using our app,
              please reach out to us using the contact information provided
              below. We take all reports seriously and will investigate the
              matter thoroughly to ensure compliance with data protection
              standards.
            </p>
          </ul>
          <li><br/>
            <h2 className="font-bold">Account Deletion Request:</h2>
            <ol>
              <li>
                <p>
                  If you wish to delete your account from our system, we are
                  here to assist you. Please send an email to{" "}
                  <Link
                    style={{ color: "blue" }}
                    to={"mailto:beep@cargator.org"}
                  >
                    beep@cargator.org
                  </Link>{" "}
                  with the subject line "Account Deletion Request." In your
                  email, kindly provide the following information:
                </p>
              </li>
              <li>
                <p>Your Mobile Number associated with the account.</p>
              </li>
              <li>
                <p>
                  A brief reason for your account deletion request (optional but
                  appreciated).
                </p>
              </li>
              <li>
                <p>
                  Confirmation that you understand the consequences of deleting
                  your account, including the loss of access to your data and
                  any associated services.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              Once we receive your request, our support team will verify your
              identity and process your account deletion request within 7
              business days. You will receive a confirmation email once your
              account has been successfully deleted from our system.
            </p>
          </li><br/>
          <li>
            <h2 className="font-bold">Contact Us:</h2>
            <p>
              <Link style={{ color: "blue" }} to={"mailto:beep@cargator.org"}>
                beep@cargator.org
              </Link>
            </p>
          </li><br/>
          <li>
            <p>
              Our support team is available Monday to Friday, 9:00 AM to 5:00 PM
              GMT to assist you with any questions or concerns you may have.
            </p>
          </li><br/>
          <li>
            <p>
              We appreciate your trust in our service and are dedicated to
              providing you with the best possible experience. Your feedback and
              support are invaluable to us as we continue to improve our
              platform.
            </p>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Support;
