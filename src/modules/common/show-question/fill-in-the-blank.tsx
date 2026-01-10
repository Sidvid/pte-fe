import React, { useState } from "react";
import { Select, Card } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { parseScript } from "@/utils/helpers/core-helpers";

const { Option } = Select;

interface Props {
  text: string;
}

const FillInTheBlanks: React.FC<Props> = ({ text }) => {
  const parsed = parseScript(text);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Question Card */}
      <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <p className="text-gray-800 text-lg leading-relaxed flex flex-wrap gap-2">
          {parsed.map((part, i) => {
            if (part.type === "text") {
              return <span key={i}>{part.value}</span>;
            }

            return (
              <Select
                key={i}
                placeholder="Select"
                value={answers[part.index]}
                onChange={(value) => handleChange(part.index, value)}
                className="min-w-[140px]"
                size="middle"
              >
                {part.options.map((opt: string) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            );
          })}
        </p>
      </Card>

      {/* Selected Answers */}
      <AnimatePresence>
        {Object.keys(answers).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-md p-4"
          >
            <h3 className="font-semibold text-gray-700 mb-2">Your Answers</h3>

            <div className="flex flex-wrap gap-2">
              {Object.values(answers).map((ans, idx) => (
                <motion.span
                  key={idx}
                  layout
                  className="px-3 py-1 rounded-full text-sm 
                             bg-indigo-100 text-indigo-700 font-medium"
                >
                  {ans}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FillInTheBlanks;
