import Card from "@/components/molecules/card/card";

import * as React from "react";

import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button, FloatButton, Modal, Select } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { AiOutlineFileText, AiOutlineCarryOut } from "react-icons/ai";
import SelectionCard from "@/components/molecules/selection-avatar/selection-avatar";
import { useMutation } from "@tanstack/react-query";
import useHttp from "@/hooks/use-http";
import { OptionsType, SuccessResponse } from "@/utils/model/model";
import {
  DailyTasksResponse,
  ScheduleResponse,
  Task,
} from "@/utils/model/response-models";

export default function ScheduleGrid() {
  const [openModal, setOpenModal] = React.useState(false);

  const [modalData, setModalData] = React.useState<{
    weekday: string;
    selectedType: "mock" | "task";
    task: string;
    allTask: OptionsType[];
  }>({
    weekday: "",
    selectedType: "mock",
    task: "",
    allTask: [],
  });
  const [schedule, setSchedule] = React.useState<ScheduleResponse[]>();
  const { sendRequest } = useHttp({ type: "auth" });
  const scheduleCall = useMutation({
    mutationFn: () =>
      sendRequest({ url: "schdule", method: "GET" }) as Promise<
        SuccessResponse<ScheduleResponse[]>
      >,
    onSuccess: (data: SuccessResponse<ScheduleResponse[]>) => {
      const { response } = data;
      setSchedule(response.data);
    },
  });
  const allTasksCall = useMutation({
    mutationFn: () =>
      sendRequest({ url: "allDailyTask", method: "GET" }) as Promise<
        SuccessResponse<DailyTasksResponse>
      >,
    onSuccess: (data: SuccessResponse<DailyTasksResponse>) => {
      const { response } = data;
      console.log("all task", response?.data?.tasks);
      setModalData((preValues) => ({
        ...preValues,
        allTask: response?.data?.tasks.map((items) => ({
          title: items.title,
          value: items.title,
        })),
      }));
    },
  });
  const updateWeeklyScheduleCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({ url: "schdule", method: "POST", payload }) as Promise<
        SuccessResponse<ScheduleResponse[]>
      >,
    onSuccess: (data: SuccessResponse<ScheduleResponse[]>) => {
      const { response } = data;
      setSchedule(response.data);
      scheduleCall.mutateAsync();
    },
  });
  React.useLayoutEffect(() => {
    scheduleCall.mutateAsync();
    allTasksCall.mutateAsync();
  }, []);

  const getOptionsForSelectedCard = () => {
    if (modalData.selectedType === "mock") {
      return [
        { title: "Mock Test", value: "Mock Test" },
        { title: "Official Test", value: "Official Test" },
      ];
    } else {
      return modalData.allTask;
    }
  };
  const updateWeeklyScheduleHandler = () => {};

  return (
    <div className="flex flex-wrap gap-20 p-20 justify-start">
      {schedule!?.map((item) => (
        <WeeklyScheduleCard
          key={item.weekday_name}
          day={item.weekday_name}
          tasks={item.tasks}
        />
      ))}

      <FloatButton
        onClick={() => {
          setOpenModal(true);
        }}
        icon={<FaPlusCircle />}
      />
      {schedule?.length && (
        <Modal
          open={openModal}
          title="Add New Schedule Item"
          onCancel={() => setOpenModal(false)}
          footer={[
            <Button key="back" onClick={() => setOpenModal(false)}>
              Return
            </Button>,
            <Button
              onClick={updateWeeklyScheduleHandler}
              key="submit"
              type="primary"
            >
              Submit
            </Button>,
          ]} // Hiding default footer for a cleaner look
          centered
          width={600}
        >
          <div className="flex flex-col gap-24 mt-[30px] p-10">
            {/* 1. Weekday Selector */}
            <div className="flex flex-col gap-8">
              <label className="f14 w600 text-primary opacity-80">
                Select Weekday
              </label>
              <Select
                placeholder="Select a Weekday"
                className="w-full h-[45px]"
                options={schedule!?.map((item) => ({
                  label: item.weekday_name,
                  value: item.weekday_name,
                }))}
              />
            </div>

            {/* 2. Type Selector (The New UI) */}
            <div className="flex flex-col gap-8">
              <label className="f14 w600 text-primary opacity-80">
                Select Activity Type
              </label>

              <div className="grid grid-cols-2 gap-16">
                <SelectionCard
                  title="Mock Test"
                  subtitle="Practice full exams"
                  icon={AiOutlineFileText}
                  isSelected={modalData.selectedType === "mock"}
                  onClick={() =>
                    setModalData((preValues) => ({
                      ...preValues,
                      selectedType: "mock",
                    }))
                  }
                />

                <SelectionCard
                  title="Daily Task"
                  subtitle="Routine exercises"
                  icon={AiOutlineCarryOut}
                  isSelected={modalData.selectedType === "task"}
                  onClick={() =>
                    setModalData((preValues) => ({
                      ...preValues,
                      selectedType: "task",
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-8">
                <label className="f14 w600 text-primary opacity-80">
                  Select Task
                </label>
                <Select
                  value={modalData.task}
                  onChange={(item) => {
                    setModalData((preValues) => ({ ...preValues, task: item }));
                  }}
                  placeholder="Select a Task"
                  className="w-full h-[45px]"
                  options={getOptionsForSelectedCard()} // Your schedule map here
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
function WeeklyScheduleCard({
  day,
  tasks,
}: {
  day: string;
  tasks: ScheduleResponse["tasks"];
}) {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const isToday = dayName === day;
  const onCrossPress = (task: any) => {
    console.log("this is pressded schedl", task);
  };
  return (
    <div className="w-[300px]">
      <Card ribbonText={isToday ? "Today" : ""}>
        {/* --- Header Section --- */}
        <div className="flex items-center w-full gap-10 mb-[20px]">
          <h3 className="f20 w500 text-link whitespace-nowrap">{day}</h3>

          <div className="flex-1 h-[2px] bg-link rounded-3xl"></div>
        </div>

        {/* --- Task List --- */}
        <ul className="flex flex-col gap-10 w-full">
          <AnimatePresence>
            {tasks.map((task, idx) => (
              <TaskChip
                key={`${day}-${idx}`} // Unique key is important for animation
                index={idx}
                task={task.name}
                onDelete={() => onCrossPress({ day, tasks: [task] })} // Passed specific task
              />
            ))}
          </AnimatePresence>
        </ul>
      </Card>
    </div>
  );
}

const TaskChip = ({
  index,
  task,
  onDelete,
}: {
  index: number;
  task: string;
  onDelete: () => void;
}) => {
  return (
    <motion.li
      layout // Smoothly adjusts layout when items are removed
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <div
        className="
        flex items-center justify-between 
     hover:bg-link/5 dark:hover:bg-link/10
  border border-transparent hover:border-link/30
        px-12 py-10 
        rounded-12 
        shadow-sm hover:shadow-md 
        transition-all duration-300
        cursor-default
        rounded-lg
        hover:cursor-pointer

      "
      >
        {/* Left Side: Number & Text */}
        <div className="flex items-center gap-12 overflow-hidden">
          {/* Stylized Index Badge */}
          <div
            className="
            flex-shrink-0 w-24 h-24 rounded-full 
            bg-link/10 text-link 
            flex items-center justify-center 
            f10 w700
          "
          >
            {index + 1}
          </div>

          {/* Task Text */}
          <span className="f12 w500 text-primary truncate pr-4">{task}</span>
        </div>

        {/* Right Side: Delete Action */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering row click
            onDelete();
          }}
          className="
            flex items-center justify-center
            w-24 h-24 rounded-full
            text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors duration-200
            opacity-0 group-hover:opacity-100 
            translate-x-10 group-hover:translate-x-0
            transform transition-all
          "
        >
          <FaTimes size={12} />
        </button>
      </div>
    </motion.li>
  );
};
