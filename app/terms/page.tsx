export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>Agreement to Terms</h2>
        <p>
          By accessing this website, you agree to be bound by these terms of
          service and agree that you are responsible for compliance with any
          applicable local laws.
        </p>

        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the
          materials on this website for personal, non-commercial transitory
          viewing only. This is the grant of a license, not a transfer of title,
          and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>
            Attempt to reverse engineer any software contained on this website
          </li>
          <li>
            Remove any copyright or other proprietary notations from the
            materials
          </li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including but not limited to music,
          videos, images, text, and graphics, is the property of the artist and
          is protected by international copyright laws.
        </p>

        <h2>User Content</h2>
        <p>
          If you submit content to our website (such as comments or contact form
          submissions), you grant us a non-exclusive, worldwide, royalty-free
          license to use, reproduce, and publish such content.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The materials on this website are provided on an 'as is' basis. We
          make no warranties, expressed or implied, and hereby disclaim and
          negate all other warranties including, without limitation, implied
          warranties or conditions of merchantability, fitness for a particular
          purpose, or non-infringement of intellectual property.
        </p>

        <h2>Limitations</h2>
        <p>
          In no event shall the artist or its suppliers be liable for any
          damages arising out of the use or inability to use the materials on
          this website.
        </p>

        <h2>Modifications</h2>
        <p>
          We may revise these terms of service at any time without notice. By
          using this website you are agreeing to be bound by the then current
          version of these terms of service.
        </p>

        <h2>Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us at:
          <br />
          <a
            href="mailto:legal@artist.com"
            className="text-primary hover:underline"
          >
            legal@artist.com
          </a>
        </p>
      </div>
    </div>
  );
}
