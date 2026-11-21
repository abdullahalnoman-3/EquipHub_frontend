"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How does the Stripe escrow payment system protect renters and owners?",
    answer:
      "When you book equipment on EquipHub, your payment is authorized and held securely in Stripe Escrow. Funds are only transferred to the owner after you inspect the equipment and confirm it is in safe, working condition at handover. If there is a critical discrepancy, your payment is refunded immediately.",
  },
  {
    question: "What happens if equipment malfunctions on-site during my rental?",
    answer:
      "All verified owners are required to provide equipment that has passed recent maintenance checks. If a technical defect occurs through normal use, contact the owner immediately through the platform. Owners can provide an instant replacement or issue a prorated refund for the unused rental days.",
  },
  {
    question: "How do I become an Equipment Owner and list my idle machinery?",
    answer:
      "Signing up as an Owner is simple and free! Register an account with the 'Owner' role, navigate to your Owner Dashboard, and click 'Add New Equipment'. Upload photos, set your daily or weekly rental price, specify your location, and submit for admin review. Once approved, your listing becomes instantly discoverable to thousands of local renters.",
  },
  {
    question: "What is the cancellation and refund policy?",
    answer:
      "Bookings cancelled at least 24 hours prior to the scheduled start time receive a 100% full refund with zero cancellation fees. For late cancellations within 24 hours, standard terms apply depending on the owner's equipment preparation schedule.",
  },
  {
    question: "Can I inspect the equipment before accepting handover?",
    answer:
      "Yes! Handover inspection is strongly encouraged. Both parties can verify operating status, fuel levels, and existing cosmetic wear before confirming active rental status in the EquipHub portal.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Everything you need to know about safety, escrow deposits, cancellations, and listing gear on EquipHub.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
