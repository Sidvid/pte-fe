import { Button, Input, Select, Card } from "antd";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { parseScript } from "@/utils/helpers/core-helpers";

const { TextArea } = Input;
const { Option } = Select;

function FillInBlankDropdown() {
  const [script, setScript] = useState("");
  const [parsed, setParsed] = useState<any[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePreview = () => {
    const result = parseScript(script);
    console.log("this", result);
    setParsed(result);

    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="space-y-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Authoring */}
      <Card className="rounded-xl shadow-md bg-white border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Question Script</h2>

        <TextArea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={6}
          placeholder="Example: I am {{human}{robot}{car}}..."
          className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />

        <Button
          type="primary"
          className="mt-4 h-10 text-base"
          disabled={!script.includes("{{")}
          onClick={handlePreview}
        >
          Preview Question
        </Button>
      </Card>

      {/* Preview */}
      <div ref={previewRef}>
        {parsed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
                       p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Question Preview
            </h3>

            <p className="flex flex-wrap gap-2 text-gray-800 text-lg">
              {parsed.map((part, index) => {
                if (part.type === "text") {
                  return <span key={index} className="text-lg">{part.value}</span>;
                }

                return (
                  <Select
                    key={index}
                    placeholder="Select"
                    className="min-w-[140px] h-10 text-base"
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
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Parser */

export default FillInBlankDropdown;
