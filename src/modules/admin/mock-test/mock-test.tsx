import MockTestCard from "@/modules/common/cards/mock-test-card";
import { Card } from "antd";
import { div } from "motion/react-client";
import * as React from "react";
import { useNavigate } from "react-router";
const data = [
  {
    id: "test-1",
    title: "PTE Full Mock Test 01",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-2",
    title: "PTE Full Mock Test 02",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
  {
    id: "test-3",
    title: "PTE Full Mock Test 03",
    isPublished: false,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-4",
    title: "PTE Full Mock Test 04",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
  {
    id: "test-5",
    title: "PTE Full Mock Test 05",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-6",
    title: "PTE Full Mock Test 06",
    isPublished: false,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
  {
    id: "test-7",
    title: "PTE Full Mock Test 07",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-8",
    title: "PTE Full Mock Test 08",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
  {
    id: "test-9",
    title: "PTE Full Mock Test 09",
    isPublished: false,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-10",
    title: "PTE Full Mock Test 10",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
  {
    id: "test-11",
    title: "PTE Full Mock Test 11",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-12",
    title: "PTE Full Mock Test 12",
    isPublished: false,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
];
function MockTest() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row gap-10 flex-wrap justify-around items-center">
      {data.map((data) => {
        return (
          <div className="w-[45%]">
            <MockTestCard
              title={data.title}
              isPublished={data.isPublished}
              sections={data.sections}
              onExplore={() => navigate(`/mockTest/${data.id}`)}
            />
          </div>
        );
      })}
    </div>
  );
}

export default MockTest;
