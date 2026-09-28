import { accentBrandText } from "@/components/BrandText";
import OverlayShell from "@/components/overlays/OverlayShell";

const sections = [
  {
    title: "1. Introduction",
    paragraphs: [
      "At ScrapWRK, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or make a purchase.",
    ],
  },
  {
    title: "2. Information We Collect",
    paragraphs: [
      "We collect information you provide when you make a purchase, create an account, sign up for our newsletter, or contact us. This may include your name, email address, shipping address, and payment information.",
      "We also automatically collect certain information about your device, including IP address, browser type, and pages visited through cookies and similar technologies.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: ["We use your information to:"],
    list: [
      "Process and fulfill your orders",
      "Communicate with you about your purchase",
      "Send you marketing communications (if you've opted in)",
      "Improve our website and services",
      "Comply with legal obligations",
    ],
  },
  {
    title: "4. Sharing Your Information",
    paragraphs: [
      "We may share your information with service providers who help us operate our business, such as payment processors and shipping companies. We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "5. Data Security",
    paragraphs: [
      "We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "6. Cookies",
    paragraphs: [
      "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings, but disabling them may affect your experience on our site.",
    ],
  },
  {
    title: "7. Your Rights",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal information. To exercise these rights, please contact us using the information provided below.",
    ],
  },
  {
    title: "8. Children's Privacy",
    paragraphs: [
      "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    paragraphs: [
      'We may update this Privacy Policy from time to time. The updated version will be indicated by the "Last Updated" date at the top of this policy.',
    ],
  },
  {
    title: "10. Contact Us",
    paragraphs: [
      "If you have questions about this Privacy Policy, please contact us at: ",
    ],
    email: "info@scrapwrk.com",
  },
];

interface PrivacyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyOverlay = ({ isOpen, onClose }: PrivacyOverlayProps) => {
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  return (
    <OverlayShell
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Legal"
      title="Privacy Policy"
      description={accentBrandText(
        "How ScrapWRK collects, uses, and protects customer information.",
      )}
      meta={
        <div className="rounded-[24px] border border-stone-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            Last Updated
          </p>
          <p className="mt-2 text-sm font-medium text-stone-950">{formattedDate}</p>
        </div>
      }
    >
      <div className="grid gap-4">
        {sections.map((section) => (
          <section key={section.title} className="surface-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              {section.title}
            </p>

            <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700 sm:text-base">
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.title}-paragraph-${index}`}>
                  {accentBrandText(paragraph)}
                  {section.email && (
                    <a
                      href={`mailto:${section.email}`}
                      className="font-medium text-stone-950 underline underline-offset-4"
                    >
                      {section.email}
                    </a>
                  )}
                </p>
              ))}

              {section.list && (
                <ul className="space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-stone-950" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </OverlayShell>
  );
};

export default PrivacyOverlay;
