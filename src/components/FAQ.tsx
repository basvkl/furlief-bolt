import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

const FAQItem = ({ question, answer, isOpen, toggle }: FAQItemProps) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
        onClick={toggle}
      >
        <span className="font-medium text-lg text-[#0E2A47]">{question}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-[#F9A826]" />
        ) : (
          <ChevronDown size={20} className="text-[#F9A826]" />
        )}
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-[#0E2A47]/80 leading-relaxed">{answer}</div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "What is Furlief?",
      answer: (
        <p>
          Furlief is a direct-to-consumer brand offering affordable oclacitinib tablets for dogs suffering from allergies and itching. Our product is a generic alternative to Apoquel, launching when its patent expires in November 2026.
        </p>
      ),
    },
    {
      question: "How does the waitlist work?",
      answer: (
        <p>
          By joining our waitlist, you'll be among the first to know when Furlief launches. We'll send you updates about our progress, early access opportunities, and special offers for waitlist members. There's no obligation to purchase.
        </p>
      ),
    },
    {
      question: "Is oclacitinib the same as Apoquel?",
      answer: (
        <p>
          Yes, oclacitinib is the active ingredient in Apoquel. When the patent expires in 2026, we'll be able to offer the same medication as a more affordable generic alternative, while maintaining the same quality and effectiveness.
        </p>
      ),
    },
    {
      question: "Will I need a prescription for Furlief?",
      answer: (
        <p>
          Yes, oclacitinib is a prescription medication. When we launch, we'll have a simple process for verifying your veterinarian's prescription before shipping your order. We're working to make this process as convenient as possible.
        </p>
      ),
    },
    {
      question: "When exactly will Furlief be available?",
      answer: (
        <p>
          Furlief will launch when Apoquel's patent expires in November 2026. By joining our waitlist now, you'll receive updates on our exact launch date and be first in line when we go live.
        </p>
      ),
    },
    {
      question: "How much cheaper will Furlief be compared to Apoquel?",
      answer: (
        <p>
          While we can't provide exact pricing yet, our goal is to offer significant savings compared to brand-name Apoquel. Generic medications typically cost 70-85% less than their brand-name counterparts. We're committed to making pet allergy medication more affordable for all dog owners.
        </p>
      ),
    },
  ];
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">Frequently Asked Questions</h2>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            Find answers to common questions about Furlief and our waitlist
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-[#FFF8E8] rounded-2xl p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggle={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;