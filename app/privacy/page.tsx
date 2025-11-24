export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>Introduction</h2>
        <p>
          We respect your privacy and are committed to protecting your personal
          data. This privacy policy will inform you about how we handle your
          personal data when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect, use, store and transfer different kinds of personal
          data about you:
        </p>
        <ul>
          <li>Identity Data (name, username)</li>
          <li>Contact Data (email address, telephone numbers)</li>
          <li>
            Technical Data (IP address, browser type and version, time zone
            setting)
          </li>
          <li>Usage Data (information about how you use our website)</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your personal data for the following purposes:</p>
        <ul>
          <li>To send you our newsletter (if you subscribed)</li>
          <li>To respond to your inquiries</li>
          <li>To improve our website and services</li>
          <li>To analyze website usage and performance</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We have implemented appropriate security measures to prevent your
          personal data from being accidentally lost, used, or accessed in an
          unauthorized way.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Request access to your personal data</li>
          <li>Request correction of your personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Request restriction of processing your personal data</li>
          <li>Request transfer of your personal data</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us
          at:
          <br />
          <a
            href="mailto:privacy@artist.com"
            className="text-primary hover:underline"
          >
            privacy@artist.com
          </a>
        </p>
      </div>
    </div>
  );
}
