import { accentBrandText } from "@/components/BrandText";
import OverlayShell from "@/components/overlays/OverlayShell";

const sections = [
  {
    title: "1. Introduction",
    paragraphs: [
      'Welcome to ScrapWRK ("we," "our," or "us"). By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
    ],
  },
  {
    title: "2. Use of Services",
    paragraphs: [
      "Our services are intended for personal, non-commercial use. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of our service without express written permission from us.",
    ],
  },
  {
    title: "3. Products and Purchases",
    paragraphs: [
      "All products are handmade and unique. Colors and details may vary slightly from the images shown. By purchasing our products, you acknowledge that variations are part of the handmade nature of our items.",
      "Prices are subject to change without notice. We reserve the right to refuse service to anyone for any reason at any time.",
    ],
  },
  {
    title: "4. Shipping and Returns",
    paragraphs: [
      "We ship worldwide. Shipping times vary by location. Once your order ships, you will receive a tracking number via email.",
      "Due to the handmade nature of our products, all sales are final. However, if your item arrives damaged, please contact us within 7 days of receipt.",
    ],
  },
  {
    title: "5. Intellectual Property",
    paragraphs: [
      "All content on our website, including text, graphics, logos, images, and software, is the property of ScrapWRK and is protected by copyright laws. You may not use our intellectual property without our prior written consent.",
    ],
  },
  {
    title: "6. User Content",
    paragraphs: [
      "By submitting content to our website (such as reviews or testimonials), you grant us a non-exclusive, royalty-free license to use, reproduce, modify, and display that content in connection with our services.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, ScrapWRK shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
    ],
  },
  {
    title: "8. Changes to Terms",
    paragraphs: [
      "We reserve the right to modify these terms at any time. Your continued use of our services after changes are made constitutes your acceptance of the updated terms.",
    ],
  },
  {
    title: "9. Contact Information",
    paragraphs: [
      "If you have any questions about these Terms of Service, please contact us at: ",
    ],
    email: "info@scrapwrk.com",
  },
];

interface TermsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOverlay = ({ isOpen, onClose }: TermsOverlayProps) => {
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  return (
    <OverlayShell
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Legal"
      title="Terms of Service"
      description={accentBrandText(
        "The terms that apply when customers access or purchase through the ScrapWRK storefront.",
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
            </div>
          </section>
        ))}
      </div>
    </OverlayShell>
  );
};

export default TermsOverlay;
