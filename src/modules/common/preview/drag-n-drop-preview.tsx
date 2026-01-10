import { numberToLetterMap } from "@/utils/constants/app-constants";
import { Option } from "@/utils/model/model";
import { AiOutlineFileProtect } from "react-icons/ai";
const QuestionPreview = ({ options }: { options: Option[] }) => {
  if (!options.length) return null;

  return (
    <div
      className="
        mt-6 p-5 rounded-xl
        bg-gray-50
        border border-gray-200
      "
    >
      <div className="flex items-center gap-2">
        <span>
          <AiOutlineFileProtect />
        </span>
        <p className="text-sm font-semibold text-gray-700">Question Preview</p>
      </div>

      <div className="space-y-2">
        {options.map((opt, index) => (
          <div key={opt.id} className="flex gap-3 text-gray-800">
            <span className="font-semibold">
              Option {numberToLetterMap[index + 1]}:
            </span>
            <span className="flex-1">{opt.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default QuestionPreview;
