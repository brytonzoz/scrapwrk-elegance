import OverlayShell from "@/components/overlays/OverlayShell";
import { Instagram, Mail, Phone, Send, Twitter } from "lucide-react";
import { useState } from "react";

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactOverlay = ({ isOpen, onClose }: ContactOverlayProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = name ? `SCRAPWRK inquiry from ${name}` : "SCRAPWRK inquiry";
    const body = [
      name ? `Name: ${name}` : "",
      email ? `Email: ${email}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:bryton.p.zoz@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <OverlayShell
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Contact"
      title="Get In Touch"
      description="Have questions about our products or interested in collaboration? We'd love to hear from you. Fill out the form or reach out to us directly."
      meta={
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            className="rounded-[24px] border border-stone-200 bg-white px-4 py-3 transition hover:border-stone-300 hover:bg-stone-100"
            href="mailto:bryton.p.zoz@gmail.com"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Email
            </p>
            <p className="mt-2 text-sm font-medium text-stone-950">bryton.p.zoz@gmail.com</p>
          </a>
          <a
            className="rounded-[24px] border border-stone-200 bg-white px-4 py-3 transition hover:border-stone-300 hover:bg-stone-100"
            href="tel:+14696512656"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Phone
            </p>
            <p className="mt-2 text-sm font-medium text-stone-950">+1 (469) 651-2656</p>
          </a>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            Message
          </p>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                Name
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-[20px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-[20px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                Message
              </label>
              <textarea
                className="mt-2 min-h-[160px] w-full rounded-[20px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-400"
                placeholder="Your message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
            <button className="cta-primary w-full sm:w-auto" type="submit">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>

        <div className="grid gap-5">
          <div className="surface-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Reach Out Directly
            </p>
            <div className="mt-4 space-y-4">
              <a
                href="mailto:bryton.p.zoz@gmail.com"
                className="flex items-start gap-3 rounded-[22px] border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-stone-50">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-950">Email</p>
                  <p className="mt-1 text-sm text-stone-600 break-all">bryton.p.zoz@gmail.com</p>
                </div>
              </a>
              <a
                href="tel:+14696512656"
                className="flex items-start gap-3 rounded-[22px] border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-stone-50">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-950">Phone</p>
                  <p className="mt-1 text-sm text-stone-600">+1 (469) 651-2656</p>
                </div>
              </a>
            </div>
          </div>

          <div className="surface-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Follow Us
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="cta-secondary h-12 w-12 rounded-full px-0 py-0"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="cta-secondary h-12 w-12 rounded-full px-0 py-0"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </OverlayShell>
  );
};

export default ContactOverlay;
