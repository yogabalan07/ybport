import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { WashiTape, HandDrawnArrow, StarDoodle, HandDrawnCircle } from './doodles/DoodleIcons';
import { Mail, Github, Linkedin, Copy, Check, Send, Sparkles, MessageSquare, Coffee, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
    `Portfolio Inquiry from ${formState.name || 'Visitor'}`
  )}&body=${encodeURIComponent(
    `Hi Yogabalan,\n\n${formState.message || ''}\n\nFrom: ${formState.name || ''} (${formState.email || ''})`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) return;

    // Truthful workflow: pre-fill the visitor's own email client.
    // Nothing is stored or transmitted from this page.
    setSubmitting(true);
    window.location.href = mailtoUrl;
    window.setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
    }, 400);
  };

  return (
    <section id="contact" className="py-24 bg-[#F8F5EE] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFFFF] border border-[#141517]/20 rounded-full text-xs font-mono text-[#1D4ED8] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open for 2026 Internships &amp; Collaborations</span>
          </div>

          <div className="relative inline-block">
            <h2 className="text-4xl sm:text-5xl font-black text-[#141517] tracking-tight">
              LET'S BUILD SOMETHING.
            </h2>
            <div className="hidden sm:block absolute -top-4 -right-10 pointer-events-none">
              <StarDoodle className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <p className="text-base sm:text-lg text-[#575961] leading-relaxed">
            Have an idea, project, internship opportunity, or just want to talk hardware &amp; software? Drop a message or reach out directly.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: DIRECT CONTACT DETAILS & NOTEBOOK CHIPS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <div className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 shadow-[5px_6px_0px_#141517]">
              <div className="absolute -top-3 left-6">
                <WashiTape className="w-20 h-5" color="rgba(254, 240, 138, 0.9)" angle="-2deg" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="p-2.5 rounded-xl bg-[#1D4ED8]/10 text-[#1D4ED8]">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="font-bold text-[#141517] hover:text-[#1D4ED8] transition-colors break-all text-sm sm:text-base"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#141517]/10 flex items-center justify-between">
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-[#F8F5EE] border border-[#141517]/20 rounded-md hover:bg-[#141517] hover:text-white transition-all cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email Address</span>
                    </>
                  )}
                </button>

                <span className="font-hand text-sm text-[#1D4ED8] font-bold">
                  // fastest: email
                </span>
              </div>
            </div>

            {/* Social Channels Card */}
            <div className="bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 shadow-[5px_6px_0px_#141517] space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#141517] block">
                Connect on Developer Platforms
              </span>

              <div className="space-y-2.5">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl hover:border-[#141517] hover:shadow-[2px_3px_0px_#141517] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-[#141517]" />
                    <div>
                      <span className="text-sm font-bold text-[#141517] block">GitHub</span>
                      <span className="text-xs font-mono text-[#575961]">github.com/{PERSONAL_INFO.githubUsername}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#1D4ED8] font-semibold">Visit →</span>
                </a>

                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl hover:border-[#141517] hover:shadow-[2px_3px_0px_#141517] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-[#1D4ED8]" />
                    <div>
                      <span className="text-sm font-bold text-[#141517] block">LinkedIn</span>
                      <span className="text-xs font-mono text-[#575961]">Professional Profile &amp; Updates</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#1D4ED8] font-semibold">Connect →</span>
                </a>
              </div>
            </div>

            {/* Handwritten sketch note */}
            <div className="p-4 bg-[#FEF9C3] border border-amber-300 rounded-xl space-y-1">
              <span className="font-hand text-lg text-amber-950 font-bold block">
                "Hardware prototypes are best discussed over technical schematics and good coffee."
              </span>
              <span className="text-[11px] font-mono text-amber-800">
                — Yogabalan B R, KSR College of Engineering
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[6px_7px_0px_#141517]">
              
              {/* Corner Tape */}
              <div className="absolute -top-3 right-12">
                <WashiTape className="w-28 h-6" color="rgba(191, 219, 254, 0.85)" angle="2deg" />
              </div>

              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-600 shadow-[3px_3px_0px_#141517]">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-[#141517]">
                    Email Draft Ready ✓
                  </h3>
                  <p className="text-sm text-[#575961] max-w-md mx-auto">
                    Your email client should now be open with a message addressed to <span className="font-mono text-[#1D4ED8]">{PERSONAL_INFO.email}</span>. Press <span className="font-bold text-[#141517]">Send</span> there to complete delivery — nothing was sent from this page yet.
                  </p>
                  <p className="text-xs text-[#575961] max-w-md mx-auto">
                    No email client opened? Copy the address on the left and send the message manually.
                  </p>
                  
                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href={mailtoUrl}
                      className="px-4 py-2 text-xs font-mono font-bold bg-[#1D4ED8] text-white rounded-lg shadow-sm hover:bg-[#141517] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Reopen Email Draft</span>
                    </a>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-4 py-2 text-xs font-mono font-bold bg-[#F8F5EE] border border-[#141517] rounded-lg hover:bg-[#141517] hover:text-white transition-all cursor-pointer"
                    >
                      ← Back to Edit
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#141517]/10">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8]">
                      TRANSMISSION NOTEBOOK // DISPATCH FORM
                    </span>
                    <span className="font-hand text-sm text-[#EA580C] font-bold">
                      Opens your email app
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 ink-input-wrapper">
                      <label className="text-xs font-mono font-bold text-[#141517] uppercase block">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Rivera"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FCFBF8] border-1.5 border-[#141517]/30 rounded-xl text-sm text-[#141517] placeholder:text-[#575961]/50 focus:outline-hidden focus:border-[#1D4ED8] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 ink-input-wrapper">
                      <label className="text-xs font-mono font-bold text-[#141517] uppercase block">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FCFBF8] border-1.5 border-[#141517]/30 rounded-xl text-sm text-[#141517] placeholder:text-[#575961]/50 focus:outline-hidden focus:border-[#1D4ED8] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 ink-input-wrapper">
                    <label className="text-xs font-mono font-bold text-[#141517] uppercase block">
                      Message / Project Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Hi Yogabalan, I reviewed your ESP32 LoRa and full-stack projects and would love to discuss an engineering opportunity..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FCFBF8] border-1.5 border-[#141517]/30 rounded-xl text-sm text-[#141517] placeholder:text-[#575961]/50 focus:outline-hidden focus:border-[#1D4ED8] transition-all resize-y"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-[11px] font-mono text-[#575961]">
                      * Opens your email app with this message pre-filled — nothing is sent until you press Send in your email client.
                    </span>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#141517] rounded-xl shadow-[4px_4px_0px_#1D4ED8] hover:shadow-[5px_5px_0px_#1D4ED8] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Preparing Email...' : 'Open Email Draft'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* Handwritten footer quote */}
        <div className="mt-16 text-center">
          <p className="font-hand text-2xl sm:text-3xl font-bold text-[#141517]">
            "Made with curiosity, code &amp; a little caffeine. ☕"
          </p>
          <span className="block font-mono text-xs text-[#575961] mt-1">
            // Handcrafted digital sketchbook portfolio
          </span>
        </div>

      </div>
    </section>
  );
};
