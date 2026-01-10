import { NoiseBackground } from "@/components/ui/noise-background";
import QuestionMaker from "@/modules/common/questions-maker/question-maker";
import {
  SectionTypeTitle,
  TypesOfQuestion,
} from "@/utils/constants/app-constants";
import { SectionType } from "@/utils/model/common-enums";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Collapse, CollapseProps, Drawer, FloatButton, Select } from "antd";
import { title } from "process";
import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import Label from "@/components/atoms/label";
function ViewSingleMockTest() {
  const [open, setOpen] = React.useState(false);

  const [selectedQuestionType, setSelectedQuestionType] =
    React.useState<string>("");
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Drawer
        title="Add New Question"
        size="large"
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <div className=" flex flex-col gap-10">
          <div className="flex gap-10">
            <div className="flex flex-col items-center ">
              <Select
                title="Question Type"
                value={selectedQuestionType || undefined}
                placeholder="Select Question Type"
                options={Object.keys(TypesOfQuestion)
                  .map((key) => {
                    return TypesOfQuestion[key as keyof typeof TypesOfQuestion];
                  })
                  .flat()}
                className="w-[350px]"
                onSelect={(_, { title }) => {
                  setSelectedQuestionType(title!);
                }}
              />
              {selectedQuestionType && (
                <div className="flex flex-row gap-2 items-center">
                  <AiOutlineInfoCircle className="text-chart-4" />
                  <p className="text-chart-4 f10">{`Selected Question will be added in ${selectedQuestionType} Section`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
      <FloatButton
        onClick={() => {
          setOpen(true);
        }}
        icon={<FaPlusCircle />}
      />
    </div>
  );
}

export default ViewSingleMockTest;
