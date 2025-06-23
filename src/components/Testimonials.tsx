import React from 'react';
import { Star, Quote } from 'lucide-react';

const VetTestimonial = ({ quote, name, title }: {
  quote: string;
  name: string;
  title: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <Quote size={24} className="text-[#F9A826] mb-4" />
    <p className="text-[#0E2A47]/80 mb-4">{quote}</p>
    <div>
      <p className="font-semibold text-[#0E2A47]">{name}</p>
      <p className="text-[#0E2A47]/70 text-sm">{title}</p>
    </div>
  </div>
);

const DogOwnerTestimonial = ({ quote, name, dogName }: {
  quote: string;
  name: string;
  dogName: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="text-[#F9A826] fill-current" />
      ))}
    </div>
    <p className="text-[#0E2A47]/80 mb-2">{quote}</p>
    <p className="font-semibold text-[#0E2A47]">{name} & {dogName}</p>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">Trusted by Veterinarians</h2>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            Leading veterinary professionals support affordable allergy medication for dogs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <VetTestimonial
            quote="Access to affordable allergy medication is crucial for long-term pet health. This generic alternative will help many dogs get the relief they need."
            name="Dr. Sarah Mitchell, DVM"
            title="Veterinary Dermatologist"
          />
          <VetTestimonial
            quote="Having a cost-effective option for oclacitinib will make a significant difference in how we treat allergic conditions in dogs."
            name="Dr. James Chen, DVM"
            title="Clinical Director"
          />
          <VetTestimonial
            quote="This will be a game-changer for pet owners who struggle with the cost of long-term allergy medication for their dogs."
            name="Dr. Emily Rodriguez, DVM"
            title="Small Animal Specialist"
          />
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-[#0E2A47] mb-4">What Pet Parents Say</h3>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            Hear from dog owners about their experiences with allergy medication costs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DogOwnerTestimonial
            quote="We spend over $200 monthly on allergy medication. An affordable alternative would be life-changing for us and our Luna."
            name="Jessica"
            dogName="Luna"
          />
          <DogOwnerTestimonial
            quote="Max's allergies require year-round treatment. Having a more affordable option would help us maintain his treatment consistently."
            name="Michael"
            dogName="Max"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;