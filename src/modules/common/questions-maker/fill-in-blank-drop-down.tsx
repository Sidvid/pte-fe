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
    <div className="space-y-8">
      {/* Authoring */}
      <Card className="rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">Question Script</h2>

        <TextArea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={4}
          placeholder="Example: I am {{human}{robot}{car}}..."
        />

        <Button
          type="primary"
          className="mt-4"
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
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Question Preview
            </h3>

            <p className="flex flex-wrap gap-2 text-gray-800 text-lg">
              {parsed.map((part, index) => {
                if (part.type === "text") {
                  return <span key={index}>{part.value}</span>;
                }

                return (
                  <Select
                    key={index}
                    placeholder="Select"
                    className="min-w-[140px]"
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
