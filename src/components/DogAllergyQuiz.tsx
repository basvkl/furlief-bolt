import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { submitQuizResponse } from '../lib/waitlist';
import { trackQuizStart, trackQuizComplete } from '../lib/analytics';

interface Question {
  id: number;
  text: string;
  options: string[];
  type?: 'single' | 'multiple';
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often does your dog scratch, lick, or bite their skin?",
    options: [
      "Rarely or never",
      "Occasionally (a few times a week)",
      "Frequently (daily)",
      "Constantly (multiple times per day)"
    ]
  },
  {
    id: 2,
    text: "Has your dog experienced any of these symptoms? (Select all that apply)",
    options: [
      "Red, irritated skin",
      "Hair loss or bald patches",
      "Recurring ear infections",
      "Paw licking or chewing",
      "Rubbing face against furniture or carpet",
      "None of the above"
    ],
    type: 'multiple'
  },
  {
    id: 3,
    text: "What treatments have you tried for your dog's itching or allergies?",
    options: [
      "Prescription medications (like Apoquel)",
      "Over-the-counter allergy remedies",
      "Special diet or food changes",
      "Medicated shampoos or topical treatments",
      "Nothing yet",
      "My dog doesn't have allergies"
    ]
  },
  {
    id: 4,
    text: "If you're using prescription allergy medication, approximately how much do you spend monthly?",
    options: [
      "Less than $50",
      "$50-$100",
      "$100-$200",
      "More than $200",
      "I don't currently use prescription medication"
    ]
  },
  {
    id: 5,
    text: "When your dog experiences allergy symptoms, how does it affect their quality of life?",
    options: [
      "No noticeable impact",
      "Mild discomfort but generally happy",
      "Moderate impact on activities and sleep",
      "Significant distress affecting daily activities",
      "Severe impact on overall wellbeing"
    ]
  }
];

const DogAllergyQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    trackQuizStart();
  };

  const handleAnswer = async (selectedAnswers: string[]) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswers;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const severityLevel = getBenefitLikelihood(newAnswers);
      setShowResults(true);
      
      // Track quiz completion and save to database
      await trackQuizComplete(newAnswers, severityLevel);
      await submitQuizResponse(newAnswers, severityLevel);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setHasStarted(false);
  };

  const getBenefitLikelihood = (allAnswers = answers) => {
    // High-risk indicators
    const frequentSymptoms = allAnswers[0]?.includes("Frequently (daily)") || allAnswers[0]?.includes("Constantly (multiple times per day)");
    const multipleSymptoms = (allAnswers[1]?.length || 0) >= 2 && !allAnswers[1]?.includes("None of the above");
    const usingExpensiveMeds = allAnswers[3]?.includes("More than $200") || allAnswers[3]?.includes("$100-$200");
    const severeImpact = allAnswers[4]?.includes("Significant distress affecting daily activities") || allAnswers[4]?.includes("Severe impact on overall wellbeing");

    if ((frequentSymptoms && multipleSymptoms) || (usingExpensiveMeds && severeImpact)) {
      return "High";
    }

    const moderateSymptoms = allAnswers[0]?.includes("Occasionally (a few times a week)");
    const someSymptoms = (allAnswers[1]?.length || 0) === 1 && !allAnswers[1]?.includes("None of the above");
    const moderateImpact = allAnswers[4]?.includes("Moderate impact on activities and sleep");

    if (moderateSymptoms || someSymptoms || moderateImpact) {
      return "Moderate";
    }

    return "Low";
  };

  const getResultMessage = () => {
    const likelihood = getBenefitLikelihood();
    const currentSpending = answers[3]?.[0];
    
    if (likelihood === "High") {
      return {
        title: "High Likelihood of Benefit",
        message: currentSpending?.includes("$200") 
          ? "Based on your responses, Furlief could provide significant relief while saving you up to 70% on medication costs."
          : "Your dog's symptoms suggest they could greatly benefit from affordable allergy medication.",
        action: "Join our waitlist to be first in line for affordable relief."
      };
    }
    
    if (likelihood === "Moderate") {
      return {
        title: "Moderate Likelihood of Benefit",
        message: "Your dog shows some signs of allergies. Furlief could help manage symptoms while being cost-effective.",
        action: "Join our waitlist to learn more about affordable treatment options."
      };
    }
    
    return {
      title: "Educational Information",
      message: "While your dog's symptoms appear mild, it's good to stay informed about allergy treatment options.",
      action: "Join our waitlist to receive educational content about pet allergies."
    };
  };

  const handleMultipleSelect = (option: string) => {
    const currentAnswers = answers[currentQuestion] || [];
    let newSelection: string[];

    if (option === "None of the above") {
      newSelection = [option];
    } else {
      newSelection = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option && a !== "None of the above")
        : [...currentAnswers.filter(a => a !== "None of the above"), option];
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = newSelection;
    setAnswers(newAnswers);
  };

  if (!hasStarted) {
    return (
      <section id="quiz\" className="py-16 md:py-24 bg-[#FFF8E8]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">
              Dog Allergy Quiz
            </h2>
            <p className="text-[#0E2A47]/80 mb-8">
              Answer a few questions to assess if your dog might benefit from allergy medication
            </p>
            <button
              onClick={handleStart}
              className="bg-[#F9A826] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#F9A826]/90 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-16 md:py-24 bg-[#FFF8E8]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">
              Dog Allergy Quiz
            </h2>
            <p className="text-[#0E2A47]/80">
              Answer a few questions to assess if your dog might benefit from allergy medication
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {!showResults ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#0E2A47]/60">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium text-[#F9A826]">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F9A826]/10 rounded-full">
                    <motion.div
                      className="h-full bg-[#F9A826] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: `${((currentQuestion + 1) / questions.length) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-[#0E2A47] mb-6">
                    {questions[currentQuestion].text}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => 
                          questions[currentQuestion].type === 'multiple'
                            ? handleMultipleSelect(option)
                            : handleAnswer([option])
                        }
                        className={`w-full text-left px-6 py-4 rounded-xl border ${
                          answers[currentQuestion]?.includes(option)
                            ? 'border-[#F9A826] bg-[#F9A826]/5'
                            : 'border-gray-200 hover:border-[#F9A826] hover:bg-[#F9A826]/5'
                        } transition-all duration-300 flex items-center justify-between group`}
                      >
                        <span className="text-[#0E2A47]">{option}</span>
                        {questions[currentQuestion].type === 'multiple' ? (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            answers[currentQuestion]?.includes(option)
                              ? 'border-[#F9A826] bg-[#F9A826]'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion]?.includes(option) && (
                              <CheckCircle2 size={14} className="text-white" />
                            )}
                          </div>
                        ) : (
                          <ChevronRight 
                            size={18} 
                            className="text-[#F9A826] opacity-0 group-hover:opacity-100 transition-opacity" 
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {questions[currentQuestion].type === 'multiple' && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleAnswer(answers[currentQuestion] || [])}
                        className="bg-[#F9A826] text-white font-semibold px-6 py-2 rounded-xl hover:bg-[#F9A826]/90 transition-colors"
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  {(() => {
                    const result = getResultMessage();
                    const likelihood = getBenefitLikelihood();
                    
                    return (
                      <>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                          likelihood === "High" ? "bg-red-100" :
                          likelihood === "Moderate" ? "bg-yellow-100" :
                          "bg-green-100"
                        }`}>
                          {likelihood === "High" ? (
                            <AlertCircle size={32} className="text-red-600" />
                          ) : likelihood === "Moderate" ? (
                            <AlertCircle size={32} className="text-yellow-600" />
                          ) : (
                            <CheckCircle2 size={32} className="text-green-600" />
                          )}
                        </div>

                        <h3 className="text-2xl font-bold text-[#0E2A47] mb-4">
                          {result.title}
                        </h3>

                        <p className="text-[#0E2A47]/80 mb-6">
                          {result.message}
                        </p>

                        <div className="space-y-4">
                          <a
                            href="#waitlist"
                            className="inline-block w-full bg-[#F9A826] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#F9A826]/90 transition-colors"
                          >
                            {result.action}
                          </a>
                          <button
                            onClick={resetQuiz}
                            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl border border-gray-200 hover:border-[#F9A826] hover:bg-[#F9A826]/5 transition-all"
                          >
                            <RotateCcw size={18} className="mr-2" />
                            Take Quiz Again
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DogAllergyQuiz;