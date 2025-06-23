import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
}

const symptoms: Symptom[] = [
  {
    id: 'scratching',
    name: 'Excessive Scratching',
    description: 'Frequent scratching, especially around ears, face, or paws',
    severity: 'moderate'
  },
  {
    id: 'redness',
    name: 'Red or Irritated Skin',
    description: 'Visible inflammation or redness on the skin',
    severity: 'moderate'
  },
  {
    id: 'hairloss',
    name: 'Hair Loss',
    description: 'Patches of missing fur or thinning coat',
    severity: 'severe'
  },
  {
    id: 'licking',
    name: 'Excessive Licking',
    description: 'Constant licking of paws or other areas',
    severity: 'moderate'
  },
  {
    id: 'ears',
    name: 'Ear Problems',
    description: 'Frequent ear infections or scratching at ears',
    severity: 'severe'
  },
  {
    id: 'eyes',
    name: 'Watery Eyes',
    description: 'Excessive tearing or eye discharge',
    severity: 'mild'
  },
  {
    id: 'sneezing',
    name: 'Sneezing',
    description: 'Frequent sneezing or nasal discharge',
    severity: 'mild'
  },
  {
    id: 'hotspots',
    name: 'Hot Spots',
    description: 'Moist, red, irritated patches on the skin',
    severity: 'severe'
  }
];

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const getSeverityLevel = () => {
    const selected = symptoms.filter(s => selectedSymptoms.includes(s.id));
    const severeCases = selected.filter(s => s.severity === 'severe').length;
    const moderateCases = selected.filter(s => s.severity === 'moderate').length;

    if (severeCases >= 1 || selected.length >= 4) return 'high';
    if (moderateCases >= 2 || selected.length >= 2) return 'moderate';
    return 'low';
  };

  const handleCheck = () => {
    setShowResults(true);
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setShowResults(false);
  };

  return (
    <section id="symptom-checker" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">
              Dog Allergy Symptom Checker
            </h2>
            <p className="text-[#0E2A47]/80">
              Select all symptoms your dog is experiencing to get a preliminary assessment
            </p>
          </div>

          {!showResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom) => (
                <motion.button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-4 rounded-xl border ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'border-[#F9A826] bg-[#F9A826]/5'
                      : 'border-gray-200 hover:border-[#F9A826] hover:bg-[#F9A826]/5'
                  } transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedSymptoms.includes(symptom.id)
                        ? 'border-[#F9A826] bg-[#F9A826]'
                        : 'border-gray-300'
                    }`}>
                      {selectedSymptoms.includes(symptom.id) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-[#0E2A47]">{symptom.name}</h3>
                      <p className="text-sm text-[#0E2A47]/70">{symptom.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  getSeverityLevel() === 'high' ? 'bg-red-100' :
                  getSeverityLevel() === 'moderate' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Info size={32} className={
                    getSeverityLevel() === 'high' ? 'text-red-600' :
                    getSeverityLevel() === 'moderate' ? 'text-yellow-600' :
                    'text-green-600'
                  } />
                </div>

                <h3 className="text-2xl font-bold text-[#0E2A47] mb-4">
                  Assessment Results
                </h3>

                <p className="text-[#0E2A47]/80 mb-6">
                  Based on the {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected:
                </p>

                <div className={`inline-block px-4 py-2 rounded-full font-medium mb-6 ${
                  getSeverityLevel() === 'high' ? 'bg-red-100 text-red-700' :
                  getSeverityLevel() === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {getSeverityLevel() === 'high' ? 'High likelihood of allergies' :
                   getSeverityLevel() === 'moderate' ? 'Moderate likelihood of allergies' :
                   'Low likelihood of allergies'}
                </div>

                <div className="space-y-4">
                  <p className="text-[#0E2A47]/80">
                    {getSeverityLevel() === 'high' 
                      ? "Your dog is showing multiple significant allergy symptoms. We recommend consulting with a veterinarian."
                      : getSeverityLevel() === 'moderate'
                      ? "Your dog is showing some allergy symptoms. Monitor their condition and consider veterinary advice."
                      : "Your dog is showing minimal allergy symptoms. Continue monitoring for any changes."}
                  </p>

                  <div className="flex flex-col space-y-3">
                    <a
                      href="#waitlist"
                      className="inline-block bg-[#F9A826] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#F9A826]/90 transition-colors"
                    >
                      Join Waitlist for Affordable Relief
                    </a>
                    <button
                      onClick={resetChecker}
                      className="inline-block px-6 py-3 rounded-xl border border-gray-200 hover:border-[#F9A826] hover:bg-[#F9A826]/5 transition-all"
                    >
                      Check Different Symptoms
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!showResults && selectedSymptoms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <button
                onClick={handleCheck}
                className="bg-[#F9A826] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#F9A826]/90 transition-colors"
              >
                Check Symptoms
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;