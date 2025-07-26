import "./terms.scss";

export default function Terms() {
    return (
        <div className="terms-container">
            <h1>Terms and Conditions</h1>
            <p>
                Welcome to our E-Commerce Admin Dashboard. By registering and using this application, you agree to the following terms and conditions:
            </p>
            <ul>
                <li>You must provide accurate and up-to-date information during registration and profile updates.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.</li>
                <li>Do not share your login information with others. Notify us immediately of any unauthorized use of your account.</li>
                <li>All actions performed in the admin dashboard are logged for security and auditing purposes.</li>
                <li>We reserve the right to modify, suspend, or terminate your access to the dashboard at any time for violations of these terms or for maintenance.</li>
                <li>Any attempt to compromise the security or integrity of the system may result in legal action.</li>
                <li>Your use of this dashboard is also subject to our Privacy Policy.</li>
            </ul>
            <p>
                For more details, please refer to our full terms and conditions document or contact us at{" "}
                <a href="mailto:cshosain@gmail.com">cshosain@gmail.com</a>.
            </p>
            <p>
                <strong>Last updated:</strong> July 2025
            </p>
        </div>
    );
}