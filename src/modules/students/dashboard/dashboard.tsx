// import Card from "@/modules/common/cards/take-a-test";
import React, { useState } from "react";
import useHttp from "@/hooks/use-http";
import ScoreReportCard from "@/modules/common/misc/analytics";
import { SuccessResponse } from "@/utils/model/model";
import {
  MockTest,
  MockTestResponse,
  RequestAssignmentResponse,
} from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router";
import dashboard from "@/modules/admin/dashboard/dashboard";
import { FaPlay } from "react-icons/fa";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { mockTestSample } from "../../../../mock-test-sample";
import MockTestPlayer from "../../../../MockTestPlayer";
import DailyTaskPlayer from "../../../../DailyTaskPlayer";
import StudentCompleteDashboard from "./StudentCompleteDashboard";
import MockTestPreviewPage from "../../../../TestMockPlayer";
import Login from "@/modules/common/pages/login";
import { PortalTypes } from "@/utils/model/common-enums";

function Dashboard() {
  const [requestedAssignment, setRequestedAssignment] = useState<any[]>();
  const navigate = useNavigate();
  const { sendRequest } = useHttp({ type: "auth" });
  // const navigation = useNavigate();
  const allAssignedTasks = useMutation({
    mutationFn: () =>
      sendRequest({ url: "requestAssignments", method: "GET" }) as Promise<
        SuccessResponse<RequestAssignmentResponse>
      >,
    onSuccess: (data: SuccessResponse<RequestAssignmentResponse>) => {
      const { response } = data;
      console.log("assigned tasks", response);
      setRequestedAssignment(response?.data);
    },
  });
  React.useEffect(() => {
    allAssignedTasks.mutateAsync();
  }, []);
  console.log("dailyTasks", requestedAssignment);
  const mockTaskResponse = {
    data: {
      id: "c3a03a62-90fa-45e6-8c3b-03aaee23b857",
      title: "MOCK TEST 23",
      published: true,
      index: 0,
      created_at: "2024-10-01T05:43:40.931Z",
      mock_test_sections: [
        {
          id: "adf8b7ea-a8cb-4575-9fe6-6bb286714c05",
          title: "MOCK TEST 23 - Listening",
          type: "ls",
          length: 16,
          duration: 40,
          questions: [
            {
              id: "20d61da4-9a27-4713-b774-845ca0fc11dc",
              type: "smw",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: ["iron", "wood", "plastic", "glasses"],
              },
              extra: {
                answer: "wood",
              },
            },
            {
              id: "751ba147-b113-480c-9f6f-8db9b7368e83",
              type: "sst",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "96eecfae-2d1f-444e-af3d-4ecf7fd61d41",
              type: "fib_l",
              index: 0,
              data: {
                text: "It is actually to some {{}} the same in adults. When you look at the number of studies that they looked at and {{}} , they actually had to {{}} more than 99% of the studies because they were {{}} done or just too small to be {{}} .",
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "e795126e-2fd7-4336-9d8a-ee9eeb87f5df",
              type: "fib_l",
              index: 0,
              data: {
                text: "So the most data {{}} to our research was from Finland and indeed Australia. So we found that anyone {{}} a hip replacement has got a six out of ten chance of it lasting 25 years. So really it's great news for the patient, it's a lot {{}} than we expected. We always had good {{}} of how long they would last, for 10 or 15 years, but really to go all the way up to 25 years, six out of ten lasting that long is really good news for our {{}} .",
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "95a1f69a-e060-4d98-a621-bed7abd5393d",
              type: "hiw",
              index: 0,
              data: {
                text: "It's hard to dismantle it though, it's a very interesting question you ask, James, because when does the hospital stop and then the outpatient repair begin and the general practice referral back into the hospital? So it's a continuous system. It's logical to think that as we age we are more likely to calculate some health problems, and some of those will be chronic conditions. So as the population in Australia ages, it's likely that we are going to experience many more chronic conditions, and often people over the age of 65 or 70 or 80 will have multiple chronic conditions.",
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "492274d7-a4e0-4cca-98c2-fb9a3c58674f",
              type: "hiw",
              index: 0,
              data: {
                text: "That's true. It didn't practically shock me all that much, they were pretty much what I expected. But yes, in this group of 11- and 12-year-old kids, and this is the objectively measured data measured by these Fitbit like articles we found they sleep about 9.5 hours a night, which is within the mentioned range of 9 to 11 hours. But also they sit for about 11 to 11.5 hours a day, so when you add those two together, that only gives them a little over three hours a day when they're actually on their feet. And of those three hours, only 30 minutes, 32 minutes on average they actually involved in moderate to vigorous physical activity, which is jogging and playing sports and so forth.",
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "bfbdba9d-fa9c-4ed6-8048-f902a885f560",
              type: "wfd",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "8c8b149a-9d88-478e-8d53-61d0323aeb16",
              type: "wfd",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "61effe5d-8315-4c12-946d-6bd83a44f555",
              type: "wfd",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "ce541902-b3bb-4cd7-8b0d-187e9fc7a18f",
              type: "hcs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: [
                  "Business students are finding it increasingly difficult to get employment. as the standard of law courses has declined since 2007. Employers have criticized the schools for adopting unsatisfactory teaching methods. and have urged them to ensure students get higher grades.",
                  "In order to improve the chances of their students obtaining jobs after they have finished their courses, some business schools are adjusting their grades. These adjustments are being made to all grades awarded since 2007 but instead of C benefiting the students it is, in some instances, having the opposite effect.",
                  "Some business schools have realized that their grading system has been inaccurate since 2007 and are currently making changes to correct the errors. Students' grades are being revised, and employers have welcomed this move as it means that they will be able to employ better qualified students.",
                  "Since 2007, the education of business students has been improving but this has not been reflected in the grades that they are achieving. Business schools have been under pressure from employers to ensure that the grades that students are achieving match their abilities far better than in recent years.",
                ],
              },
              extra: {
                answer:
                  "In order to improve the chances of their students obtaining jobs after they have finished their courses, some business schools are adjusting their grades. These adjustments are being made to all grades awarded since 2007 but instead of C benefiting the students it is, in some instances, having the opposite effect.",
              },
            },
            {
              id: "93ef0e0a-0f67-4c97-afd3-1fb937925710",
              type: "hcs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: [
                  "There are fewer Great White sharks in Australian waters than was once believed. This is because tagging has shown that sharks travel considerable distances, and a shark recorded east of Bass Strait one week is often recorded west of Bass Strait the next. However, sharks always return to their place of origin to breed.",
                  "A recent research study has shown that Australian Great White shark populations have remained surprisingly distinct as, despite travelling long distances. these sharks do not breed away from their original areas. This means that local shark habitats may have a greater effect on sharks than has been believed up to now.",
                  "There is a greater variety in the Great White shark populations in Australian waters than was previously thought to be the case. This means that some types of shark are actually more endangered than was believed. Scientists are therefore developing conservation programs which will help to protect these threatened species.",
                  "An investigation of Great White sharks in Australian waters has come up with some unexpected conclusions. as it found that the genetic make-up of sharks in one area was quite distinct from those found elsewhere. This made scientists realize that sharks do not swim as far away from their home areas as used to be thought.",
                ],
              },
              extra: {
                answer:
                  "A recent research study has shown that Australian Great White shark populations have remained surprisingly distinct as, despite travelling long distances. these sharks do not breed away from their original areas. This means that local shark habitats may have a greater effect on sharks than has been believed up to now.",
              },
            },
            {
              id: "254bb870-61fc-4935-9317-4eb24e1329cc",
              type: "mcm_l",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: [
                  "The student has not taken the required math and physics courses.",
                  "The student has already challenged the exam.",
                  "The student should get the permission from the head of the Medical Department.",
                  "The student is not majoring in engineering.",
                  "The course is open to all students without any restrictions.",
                ],
                question: "Which of the following are true?",
              },
              extra: {},
            },
            {
              id: "47768978-a06b-4226-9e93-b908ab9ff0b5",
              type: "mcm_l",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: [
                  "Architecture",
                  "Marketing",
                  "Railroad engineering",
                  "Industrial design",
                ],
                question:
                  "According to the instructor, which fields require an understanding of perspective?",
              },
              extra: {},
            },
            {
              id: "c7a626b1-e930-4cdf-9285-b774e8a5d39a",
              type: "smw",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: [
                  "in temperature",
                  "in appearance",
                  "in wetness",
                  "in airpressure",
                ],
              },
              extra: {
                answer: "in temperature",
              },
            },
            {
              id: "a3150ef7-22cf-4f8f-b717-d4b01dc5954f",
              type: "mcs_l",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: [
                  "It is the study of the universe.",
                  "Physical geography uses many other sciences.",
                  "Many other sciences use it to combine their ideas.",
                  "Energy is the biggest subject of physical geography.",
                ],
                question:
                  "Which statement is correct about physical geography?",
              },
              extra: {
                answer: "Physical geography uses many other sciences.",
              },
            },
            {
              id: "5bcd6adb-c58e-45fe-8ae1-f8f1f624837b",
              type: "mcs_l",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                choices: [
                  "Radiation from the sun",
                  "The functions of air",
                  "The collision of meteorites",
                  "The range of the atmosphere",
                ],
                question: "What is the talk mainly about?",
              },
              extra: {
                answer: "The functions of air",
              },
            },
          ],
        },
        {
          id: "71a13649-a1f7-42b0-be9e-b8582cf9569f",
          title: "MOCK TEST 23 - Reading",
          type: "rd",
          length: 16,
          duration: 25,
          questions: [
            {
              id: "525ac638-6fc1-47eb-919d-111c670167f6",
              type: "fib_rw",
              index: 0,
              data: {
                text: "President Xi Jinping and other top politicians have been given {{manually}{quickly}{domestically}{beautifully}} produced Covid vaccines, China has said. The news was {{released}{published}{printed}{shouted}} as part of a campaign to increase vaccination rates, especially of boosters. The deputy head of China's National Health Commission, Zeng Yixin, said it showed the leadership's {{confidence}{strategy}{technique}{value}} in the Chinese vaccines. Health information about {{these}{them}{those}{whose}} figures is not usually shared with the public.",
              },
              extra: {},
            },
            {
              id: "bc3d46b1-9fca-48b6-bce5-6bde2597f450",
              type: "fib_rw",
              index: 0,
              data: {
                text: 'During the ongoing anti-government protests in Sri Lanka, protesters {{prepared}{threw}{cancelled}{shouted}} slogans targeting former president Gotabaya Rajapaksa and his family. {{But}{While}{Though}{Despite}} they also raised chants against India. Slogans like - "Don\'t sell the country to India and the US"; "India: Sri Lanka is not another state"; and "India don\'t exploit Sri Lanka\'s situation" - could be {{widely}{extensively}{commonly}{visually}} heard during the demonstrations. But while anti-Indian sentiments like {{those}{there}{them}{these}} still persist, how Sri Lankans view India might be changing as the country grapples with political and economic chaos.',
              },
              extra: {},
            },
            {
              id: "d29ecdbd-21c3-4292-9406-93beead22f59",
              type: "fib_rw",
              index: 0,
              data: {
                text: "It's not every day you hear a love song about Kim Jong-Un. But if you fire up Jamie T's new album and {{jump}{start}{sing}{skip}} to a track called 50,000 Unmarked Bullets}{that's {{approximately}{exactly}{faithfully}{closely}} what you'll find. The lyrics are slightly cryptic, but a reference to a \"boarding school in Gumligen\" {{unfolds}{unlocks}{unleashes}{solve}} the puzzle- because that's where Kim allegedly {{lived}{studied}{considered}{survived}} as a teenager in the 1990s under the name \"Chol-pak\".",
              },
              extra: {},
            },
            {
              id: "b193d632-208b-489e-9f54-f97434460ff1",
              type: "fib_rw",
              index: 0,
              data: {
                text: "England overcame an improved performance from South Africa to {{comfortably}{happily}{luckily}{thankfully}} win the second Twenty20 by six wickets {{in}{at}{on}{of}} Worcester. The hosts chased 149 with an over to {{rest}{spare}{perform}{pick}}, Nat Sciver hitting a composed 41-ball 47 and Danni Wyatt a more aggressive 39 from 24 balls. Having made 111 in Thursday's first T20 defeat, South Africa {{pictured}{dismissed}{attacked}{posted}} 148-6.",
              },
              extra: {},
            },
            {
              id: "d50b257e-121d-4152-a2a6-eb7d78798f2f",
              type: "fib_rw",
              index: 0,
              data: {
                text: "Five wards at Scotland's largest hospital had to {{discuss}{understand}{operate}{function}} with one registered nurse on duty each. Staff at the Queen Elizabeth University Hospital in Glasgow experienced the {{shortage}{lack}{less}{smaller}} on Monday night. It is an example of the {{ultimate}{severe}{strong}{tight}} pressure affecting health services across the country}{which has intensified {{because}{due}{result}{relate}} to the Covid-19 pandemic.",
              },
              extra: {},
            },
            {
              id: "79275aad-28f3-4218-8635-b2d0eb36dd5a",
              type: "fib_r",
              index: 0,
              data: {
                text: "Boris Johnson could {{}} a by-election to remain as an MP if he is {{}} to have misled Parliament over parties in Downing Street during lockdown. The outgoing prime minister is facing a parliamentary inquiry over what he told MPs about the {{}}. If it rules {{}} him and he is suspended from the Commons for 10 days he could face a recall petition. This means voters in his Uxbridge and South Ruislip constituency could force a by-election for the seat.",
                choices: [
                  "managed",
                  "against",
                  "events",
                  "procure",
                  "over",
                  "face",
                  "procedures",
                  "found",
                ],
              },
              extra: {},
            },
            {
              id: "5d242d43-a0c5-49e1-a440-ad63fbd4f857",
              type: "fib_r",
              index: 0,
              data: {
                text: "People over the age of 50 and {{}} in at-risk groups on the Isle of Man are to be {{}} another Covid booster vaccine in autumn, the health minister has said. The announcement {{}} the latest advice from vaccine advisers in the UK. Some {{}} islanders will also be offered a seasonal flu jab to help top up their protection in the colder months.",
                choices: [
                  "offered",
                  "follows",
                  "them",
                  "vulnerable",
                  "accessed",
                  "goes",
                  "dangerous",
                  "for",
                  "those",
                ],
              },
              extra: {},
            },
            {
              id: "10a4844d-2fc6-4d98-b9af-5ff5023357c3",
              type: "fib_r",
              index: 0,
              data: {
                text: 'Phasing out gas boilers and {{}} more renewable energy sources are among the Isle of Man\'s updated {{}} to tackle climate change. The Isle of Man Climate Change Plan 2022-2027 was {{}} by the chief minister in Tynwald this week. Alfred Cannan told members that {{}} previous efforts current emissions were "as high today as they have ever been".',
                choices: [
                  "ideas",
                  "creating",
                  "outlined",
                  "despite",
                  "plans",
                  "harnessing",
                  "played",
                  "because",
                  "present",
                ],
              },
              extra: {},
            },
            {
              id: "8f85c3a5-e0c0-479f-9f45-fc70d017f033",
              type: "fib_r",
              index: 0,
              data: {
                text: "US President Joe Biden has announced $2.3bn (£1.9bn) to help {{}} infrastructure that can withstand {{}} weather and natural disasters. But he stopped short of {{}} declaring a climate emergency, which would grant him further powers. Mr Biden spoke in Massachusetts as a heatwave brings extreme weather {{}} Europe and North America.",
                choices: [
                  "extreme",
                  "formally",
                  "to",
                  "perform",
                  "great",
                  "build",
                  "naturally",
                  "in",
                  "at",
                ],
              },
              extra: {},
            },
            {
              id: "fc0e378d-3f1d-4985-ae34-8b98797dcc47",
              type: "fib_r",
              index: 0,
              data: {
                text: "Ben Stokes' {{}} goodbye to one-day international cricket should have seen his every move {{}} by his home crowd. {{}} when the England all-rounder {{}} walked off at the change of innings, few in the ground had sentimentality on their mind.",
                choices: [
                  "applauded",
                  "reluctant",
                  "wearily",
                  "but",
                  "deliberate",
                  "appealed",
                  "therefore",
                  "neutrally",
                  "anger",
                ],
              },
              extra: {},
            },
            {
              id: "0e61388f-65d1-4142-bc93-8c4916995c89",
              type: "mcm_r",
              index: 0,
              data: {
                text: "A third opinion takes psychological motivation much further into the realm of tribal ceremonies and mystery: the belief that certain animals assumed mythical significance as ancient ancestors or protectors of a given tribe or clan. Two types of images substantiate this theory: the strange, indecipherable geometric shapes that appear near some animals, and the few drawings of men. Wherever men appear they are crudely drawn and their bodies are elongated and rigid. Some men are in a prone position and some have bird or animal heads. Advocates for this opinion point to reports from people who have experienced a trance state, a highly suggestive state of low consciousness between waking and sleeping. Uniformly, these people experienced weightlessness and the sensation that their bodies were being stretched lengthwise. Advocates also point to people who believe that the forces of nature are inhabited by spirits, particularly shamans who believe that an animal's spirit and energy is transferred to them while in a trance. One Lascaux narrative picture, which shows a man with a birdlike head and a wounded animal, would seem to lend credence to this third opinion, but there is still much that remains unexplained. For example, where is the proof that the man in the picture is a shaman? He could as easily be a hunter wearing a headmask. Many tribal hunters, including some Native Americans, camouflaged themselves by wearing animal heads and hides.",
                choices: [
                  "To explain the state of consciousness the artists were in when they painted their pictures",
                  "To demonstrate the mythical significance of the strange geometric shapes",
                  "To indicate that trance states were often associated with activities that took place inside caves",
                  "To give a possible reason for the strange appearance of the men painted on the cave walls",
                  "To substantiate the belief that certain animals take mythical significance.",
                ],
                question:
                  "According to the paragraph, why do some scholars refer to a trance state to help understand the cave paintings?",
              },
              extra: {},
            },
            {
              id: "16a35190-6a48-4e56-b60a-5faf5512d798",
              type: "mcm_r",
              index: 0,
              data: {
                text: "The Cognitive Approach. Cognitive psychologists assert that our behavior is influenced by our values, by the ways in which we interpret our situations and by choice. For example, people who believe that aggression is necessary and justified-as during wartime-are likely to act aggressively, whereas people who believe that a particular war or act of aggression is unjust, or who think that aggression is never justified, are less likely to behave aggressively. One cognitive theory suggests that aggravating and painful events trigger unpleasant feelings. These feelings, in turn, can lead to aggressive action, but not automatically. Cognitive factors intervene. People decide whether they will act aggressively or not on the basis of factors such as their experiences with aggression and their interpretation of other people's motives. Supporting evidence comes from research showing that aggressive people often distort other people's motives. For example, they assume that other people mean them harm when they do not.",
                choices: [
                  "family traditions of handling conflicts",
                  "previous experiences with aggression",
                  "instinct to avoid aggression",
                  "beliefs about other people's intentions",
                  "financial rewards for aggressive acts",
                ],
                question:
                  "According to the cognitive approach described in the paragraphs, which of the following options may influence the decision whether to act aggressively?",
              },
              extra: {},
            },
            {
              id: "ae7bbc9d-131f-4dc7-b432-27106ad328ac",
              type: "mcs_r",
              index: 0,
              data: {
                text: "Many argue that art cannot be defined. We could go about this in several ways. Art is often considered as the process or product of deliberately arranging elements in a way that appeals to the senses or emotions. It encompasses a diverse range of human activities, creations and ways of expression, including music, literature, film, sculpture and paintings. The meaning of art is explored in a branch of philosophy known as aesthetics. At least, that is what Wikipedia claims.",
                choices: [
                  "Art is a difficult and complex form to explain.",
                  "Wikipedia defines art under aesthetics, which is a branch of philosophy.",
                  "Music, literature, film and sculpture do not define art.",
                  "Art is directed in a way that it deliberately appeals to the emotions of people.",
                ],
                question: "What is the main idea of the passage?",
              },
              extra: {
                answer: "Art is a difficult and complex form to explain.",
              },
            },
            {
              id: "2c3c47b8-7811-47a3-9385-96a224d67f39",
              type: "mcs_r",
              index: 0,
              data: {
                text: "Excise taxes are governmental levies on specific goods produced and consumed inside a country. They differ from tariffs, which usually apply only to foreign-made goods, and from sales taxes, which typically apply to all commodities other than those specifically exempted. In their modern farm, excise taxes were first developed by Holland in the 17th century, and established by law in England in 1643. Introduced into the Dutch colonies in America, the system spread to other colonies. Such taxes were first used by the federal government in 1791 and aroused great opposition. They were repealed (1802) in Thomas Jefferson's administration. During the War of 1812 comprehensive excise taxes were levied again but were repealed in 1817.",
                choices: [
                  "Excise taxes are levied on all products, while tariffs apply to government-made goods.",
                  "Excise taxes are levied on specifically identified commodities, while tariffs apply to all goods.",
                  "Excise taxes are levied on goods produced and consumed in one country, while tariffs apply to imports.",
                  "Excise taxes are levied on goods to which sales tax does not apply, while tariffs only apply to goods With sales tax imposed.",
                ],
                question:
                  "According to this text, how do excise taxes usually differ from tariffs?",
              },
              extra: {
                answer:
                  "Excise taxes are levied on goods produced and consumed in one country, while tariffs apply to imports.",
              },
            },
            {
              id: "91023a72-9a19-41ca-8f04-b4f53b235583",
              type: "ro",
              index: 0,
              data: {
                unordered_paragraphs: [
                  "A mule probably will not even know the name of the person who gives him his instructions, nor how to get in touch with him. Usually he even does not know the person to whom he has to make delivery.",
                  'To make identification of mules easier, several syndicates have devised their own "club ties" so that a mule wearing one can immediately be picked out.',
                  "Although the top men in smuggling business must work together, most of a syndicate's small fry, especially the mules, know only their immediate contacts. If caught there is little they can give away.",
                  "He will be told just to sit tight in a certain hotel or bar until someone contacts him. In this way if he is blown, coming through airport customs he cannot unwittingly lead agents to the next link in the chain.",
                  "All the persons at the receiving end do is to hang around the airport among the waiting crowd, and see that the mule comes through safely. If he does not, he is simply written off as a loss.",
                ],
              },
              extra: {
                ordered_paragraphs: [
                  "Although the top men in smuggling business must work together, most of a syndicate's small fry, especially the mules, know only their immediate contacts. If caught there is little they can give away.",
                  "A mule probably will not even know the name of the person who gives him his instructions, nor how to get in touch with him. Usually he even does not know the person to whom he has to make delivery.",
                  "He will be told just to sit tight in a certain hotel or bar until someone contacts him. In this way if he is blown, coming through airport customs he cannot unwittingly lead agents to the next link in the chain.",
                  "All the persons at the receiving end do is to hang around the airport among the waiting crowd, and see that the mule comes through safely. If he does not, he is simply written off as a loss.",
                  'To make identification of mules easier, several syndicates have devised their own "club ties" so that a mule wearing one can immediately be picked out.',
                ],
              },
            },
            {
              id: "492ec778-5faa-41b3-97c3-b3ccc24c1cfd",
              type: "ro",
              index: 0,
              data: {
                unordered_paragraphs: [
                  "A team of scientists has discovered two Earth-like planets in the habitable orbit of a Sun-like star.",
                  "Using observations gathered by NASA's Kepler Mission, the team found five planets orbiting a Sun-like star called Kepler-62.",
                  "Four of these planets are so-called super-Earths, larger than our own planet, but smaller than even the smallest ice giant planet in our Solar System.",
                  "These new super-Earths have radii of 1.3, 1.4, 1.6, and 1.9 times that of Earth. In addition, one of the five was a roughly Mars-sized planet, half the size of Earth.",
                ],
              },
              extra: {
                ordered_paragraphs: [
                  "A team of scientists has discovered two Earth-like planets in the habitable orbit of a Sun-like star.",
                  "Using observations gathered by NASA's Kepler Mission, the team found five planets orbiting a Sun-like star called Kepler-62.",
                  "Four of these planets are so-called super-Earths, larger than our own planet, but smaller than even the smallest ice giant planet in our Solar System.",
                  "These new super-Earths have radii of 1.3, 1.4, 1.6, and 1.9 times that of Earth. In addition, one of the five was a roughly Mars-sized planet, half the size of Earth.",
                ],
              },
            },
          ],
        },
        {
          id: "9ee6d4ca-8377-4439-8b69-849e3eb8f642",
          title: "MOCK TEST 23 - Speaking and Writing",
          type: "sw",
          length: 33,
          duration: 70,
          questions: [
            {
              id: "735201c2-415e-4c93-9822-200575099daf",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "c86b9293-8635-4d72-825d-a7fe6c5a3ca2",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "dc375dc3-f9a6-4b3e-8853-ba52e1087f51",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "13a5ec44-3222-4e9d-a1f3-7b8c54157e3d",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "e8d4a0c6-f363-41f7-9e21-95993674bb6f",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "0cd8721f-99d3-4455-9723-db1ddca512a4",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "45908a94-1924-4b30-85ed-219eea91daad",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "08939028-22cd-435e-8ecd-17770d831693",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "847e565b-60bb-4c44-aff7-9062cd6ed837",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "a62f4eff-89af-48dd-95dc-adb2be83a42d",
              type: "rs",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "e6540d2e-ca91-4be9-8dcf-6b2a0ddb8606",
              type: "rl",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "329b5309-fb5f-471a-a61a-70e1f583fea0",
              type: "asq",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {
                answer: "Capacity ",
              },
            },
            {
              id: "b8369b3b-9bfa-4904-af09-32ff95899089",
              type: "asq",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {
                answer: "Roof ",
              },
            },
            {
              id: "677e4eae-4436-4aa6-8440-e17aa6a4c449",
              type: "asq",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {
                answer: "Currency ",
              },
            },
            {
              id: "ab1d3c95-9c43-4b95-aad8-365e604d2ce5",
              type: "asq",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {
                answer: "Biographer ",
              },
            },
            {
              id: "c9f0dee9-690f-4fe6-8ade-05372ea60dbb",
              type: "asq",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {
                answer: "Astronaut",
              },
            },
            {
              id: "f739a391-86d8-4ac8-a604-2c18bbe01dc0",
              type: "rts",
              index: 0,
              data: {
                text: "You will be on vacation and you want to discuss with your boss how to work efficiently, such as working remotely or something like that. What should you say to your boss?",
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "48579298-cef5-47ed-8f4d-f86e341ea926",
              type: "rts",
              index: 0,
              data: {
                text: "You have an essay due tomorrow, but you have been feeling sick for the past two weeks. You went to the clinic and got a doctor's note. You feel bad about now but have to ask your professor for an extension until the weekend. You go to the professor's office. What do you say to him?",
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "c1a47df9-f202-4092-9806-8ce44d245c11",
              type: "sgd",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "2004996c-e23a-46e8-8e7f-54d36a6497ef",
              type: "sgd",
              index: 0,
              data: {
                audio:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "f86cc965-8c3b-4b9b-85af-18f82bc09949",
              type: "swt",
              index: 0,
              data: {
                text: "Bioluminescence, the extraordinary ability of some organisms to produce light, is one of nature's most fascinating phenomena. Found in a variety of creatures, from deep-sea squids to fireflies, bioluminescence serves a range of unique functions in the biological world. This natural glow is the result of a chemical reaction within the organism, involving a light-emitting molecule called luciferin and an enzyme known as luciferase. The color of the light produced can vary from green to blue, and even red, depending on the species and the environment in which they live. In the deep sea, bioluminescence is often used for survival strategies. Many marine creatures, such as the anglerfish, use their luminous ability to attract prey or mates in the darkness of the ocean depths. Some species emit light to confuse predators or as a defense mechanism to avoid being eaten. On land, fireflies are among the most well-known bioluminescent organisms. These insects use their light as a communication tool to attract mates. The pattern of flashes is unique to each species, helping them find suitable partners. Research into bioluminescence is not just limited to understanding these organisms but extends to its application in science and medicine. Bioluminescent proteins have been used in research to track the spread of cancer cells, monitor bacterial growth, and even detect environmental pollutants. In conclusion, bioluminescence is a remarkable example of nature's ingenuity. It not only adds beauty to the natural world but also plays a critical role in the survival of various species. With ongoing research, the secrets of bioluminescence continue to illuminate our understanding of life and offer exciting possibilities in scientific discovery.",
              },
              extra: {},
            },
            {
              id: "1777abe1-d944-46ea-9cce-cd7b0ce3d00c",
              type: "swt",
              index: 0,
              data: {
                text: "Stem cell research, a vital and continuously evolving field in biology and medicine, promises transformative advances in regenerative medicine. Stem cells are unique for their ability to develop into different cell types in the body, offering potential remedies for various diseases, including degenerative conditions and severe injuries. At the forefront of this research is the study of both embryonic and adult stem cells. Embryonic stem cells, derived from early-stage embryos, have the remarkable capacity to differentiate into any cell type, making them invaluable for developing new therapies. Adult stem cells, found in tissues like bone marrow and skin, have a more limited capacity for transformation but are crucial for tissue repair and regeneration. One of the most significant breakthroughs has been in the area of induced pluripotent stem cells (iPSCs). Scientists have learned to reprogram adult cells to an embryonic-like state, allowing them to generate any cell type. This innovation not only circumvents ethical concerns associated with embryonic stem cells but also opens up personalized treatment possibilities. Stem cell research has already led to notable advances, such as the use of stem cells in bone marrow transplants for leukemia patients. Ongoing research aims to harness stem cells for repairing damaged tissues and organs, potentially offering cures for conditions like Parkinson's disease, spinal cord injuries, and diabetes. Despite the promise, stem cell research faces scientific and ethical challenges, including the risk of cell rejection and ethical considerations in the use of embryonic cells. Nevertheless, the potential of stem cells to revolutionize medicine remains an exciting and hopeful prospect. In conclusion, stem cell research stands at the cutting edge of regenerative medicine, offering unprecedented opportunities to treat and potentially cure a wide range of diseases. As research progresses, it holds the key to unlocking new frontiers in medical treatment and human health.",
              },
              extra: {},
            },
            {
              id: "565c8fc3-455a-42b8-8c6e-bb5de0ac5bd4",
              type: "di",
              index: 0,
              data: {
                image:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "39140cba-f7d9-4972-886b-941c4d219c4b",
              type: "we",
              index: 0,
              data: {
                question:
                  "Bottled water prevails because of its convenience. Yet, plastic bottles have also caused a lot of environmental problems, so some claim that bottled water should be banned. To what extent do you agree or disagree with that?",
              },
              extra: {},
            },
            {
              id: "472cf15d-adde-4cfb-a1ee-0e212a402d5e",
              type: "di",
              index: 0,
              data: {
                image:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "67f1035d-a8c7-4a1b-842f-f3715e3e69a3",
              type: "di",
              index: 0,
              data: {
                image:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "142c151c-399c-4fff-8300-02a086943106",
              type: "di",
              index: 0,
              data: {
                image:
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
              },
              extra: {},
            },
            {
              id: "ae04eb68-be0b-4c0c-858d-8836ef8b8eac",
              type: "ra",
              index: 0,
              data: {
                text: "A bus carrying dozens of primary school children has crashed and caught fire just outside the Thai capital of Bangkok. Sixteen children and three teachers are reported to have escaped, but 22 pupils and three teachers are still unaccounted for, according to the country's transport minister. ",
              },
              extra: {},
            },
            {
              id: "1aa00f74-890e-40ff-b673-5fcd64057952",
              type: "ra",
              index: 0,
              data: {
                text: "Seventy-five years ago Sparsh Ahuja's family was one of millions to flee their homes as British India split into two new nations, India and Pakistan. His grandfather never spoke of the place he fled as a young boy - until his grandson encouraged him to open up. It would lead to two families - separated by religion, a border and many decades - reconnecting once again.",
              },
              extra: {},
            },
            {
              id: "271cf2dd-b410-4128-a109-c7badeb98965",
              type: "ra",
              index: 0,
              data: {
                text: "Almost 10 years ago James Howells threw away a hard drive during a clear out - forgetting about the Bitcoin on it. Now, with the Bitcoin worth an estimated £150m ($184m), he is planning to spend millions digging up a Newport landfill in a bid to find the lost hard drive. If recovered Mr Howells said he would give 10% of the proceeds to turn the city into a crypto-currency hub.",
              },
              extra: {},
            },
            {
              id: "1f9f316d-c0df-42eb-8d1d-a0302b538580",
              type: "ra",
              index: 0,
              data: {
                text: "The Isle of May in the Firth of Forth will re-open to the public after it was shut for five weeks due to bird flu. The majority of seabirds have now left the island as the breeding season is over for most species on the national nature reserve. Experts said it was not yet possible to assess how much the outbreak had affected birds on the island, but some species had successfully bred.",
              },
              extra: {},
            },
            {
              id: "22f64e15-67cf-4d9d-8099-3b14480eaa9e",
              type: "ra",
              index: 0,
              data: {
                text: "Hiring in the UK has slowed amidst uncertainty over the economy, according to a report. July saw the slowest increase in the number of permanent jobs filled for 17 months. KPMG said recruiters are becoming more tentative over hiring new staff.",
              },
              extra: {},
            },
            {
              id: "2c7d48cd-bcaa-4084-b9d5-38e5e6ad165d",
              type: "ra",
              index: 0,
              data: {
                text: 'The "real beauty of Ukraine and its people" is being showcased in a public art display in north-west London. Visions of Home is a collection of photographs, installations and digital works by artists from the country. It forms part of an annual art trail just outside Wembley Stadium, which is visited by millions of people a year.',
              },
              extra: {},
            },
          ],
        },
      ],
    },
  };
  const dailyTaskResponse = {
    data: [
      {
        id: "66f4fc8b-68e2-4a06-970f-9a17aadca6a5",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "persuading potential customers",
            "designing new products",
            "research and planning",
            "advertising and sales",
          ],
        },
        extra: {
          answer: "research and planning",
          script: "",
        },
        created_at: "2025-08-14T08:21:41.613Z",
      },
      {
        id: "8bd45bc8-ada1-4cbd-8d15-1884d1641448",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "You’re just waiting for a joke.",
            "You’re discouraged by jokers.",
            "You’re not ready for a joke.",
            "You're ready for a joke.",
          ],
        },
        extra: {
          answer: "You’re not ready for a joke.",
          script: "",
        },
        created_at: "2025-08-14T08:20:48.280Z",
      },
      {
        id: "10faf590-5ccb-4dfe-a765-cb3eb7cc7859",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "politely cover up.",
            "carefully avoid.",
            "consciously seek out.",
            "positively enjoy.",
          ],
        },
        extra: {
          answer: "consciously seek out.",
          script: "",
        },
        created_at: "2025-08-14T08:22:21.866Z",
      },
      {
        id: "dc3886ce-3f36-4a8b-b28f-0c23e1451fce",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "the benefits of getting up early.",
            "students’ body clocks.",
            "short sleeps during the school day.",
            "earlier bedtimes.",
          ],
        },
        extra: {
          answer: "students’ body clocks.",
          script: "",
        },
        created_at: "2025-08-14T08:23:08.297Z",
      },
      {
        id: "a4944fae-4ca0-43cb-a9cb-4eed05675b7d",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "by integrating different scientific fields.",
            "without ever really understanding them.",
            "which contradict common assumptions.",
            "instead of testing them.",
          ],
        },
        extra: {
          answer: "without ever really understanding them.",
          script: "",
        },
        created_at: "2025-08-14T08:24:18.959Z",
      },
      {
        id: "19f5678b-2ba2-46ed-a2c7-196b6756e04d",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "at least in contemporary Egypt.",
            "which is common practice.",
            "more than you would think.",
            "that has nothing to do with art.",
          ],
        },
        extra: {
          answer: "more than you would think.",
          script: "",
        },
        created_at: "2025-08-14T08:25:18.160Z",
      },
      {
        id: "4b73f8e7-4814-4a59-af0e-50bec8a4d476",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "the most famous musicians.",
            "the most people.",
            "the most popular dancers.",
            "the most prizes.",
          ],
        },
        extra: {
          answer: "the most people.",
          script: "",
        },
        created_at: "2025-08-14T08:26:03.700Z",
      },
      {
        id: "656105c0-1897-4f09-bd20-1d7a4ab19b76",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "I think there’s been a seismic societal shift since then.",
            "the topicality of Zola is, I think, very important.",
            "individuals deserve more attention than society.",
            "Zola is, I think, brilliant at depicting societal change.",
          ],
        },
        extra: {
          answer: "the topicality of Zola is, I think, very important.",
          script: "",
        },
        created_at: "2025-08-14T08:27:56.082Z",
      },
      {
        id: "603ee841-e855-42f6-8a4b-14e43a2448c8",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "curb the problem.",
            "initiate research into likely effects.",
            "clamp down on developed nations.",
            "facilitate such innovations.",
          ],
        },
        extra: {
          answer: "curb the problem.",
          script: "",
        },
        created_at: "2025-08-14T08:28:54.588Z",
      },
      {
        id: "70e40ba4-b921-4d74-823b-69de08496336",
        index: 0,
        type: "smw",
        data: {
          audio:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          choices: [
            "analyse its impact.",
            "assess their own honesty.",
            "raise their media literacy.",
            "handle alternative perspectives.",
          ],
        },
        extra: {
          answer: "raise their media literacy.",
          script: "",
        },
        created_at: "2025-08-14T08:29:41.398Z",
      },
    ],
    isSuccess: true,
    message: "Questions fetched successfully",
  };
  return (
    <>
      {/* <Card /> */}
      {/* //<ScoreReportCard />// */}
      {/* <Typography.Title level={3} style={{ marginBottom: "20px" }}>
        Assigned Tasks
      </Typography.Title>
      <Row gutter={[12, 12]}>
        {requestedAssignment?.map((item: any) => (
          <Col
            key={item.assigned_task_id}
            xl={8}
            lg={12}
            md={24}
            sm={24}
            xs={24}
          >
            <Card
              title={item.collection}
              hoverable
              extra={
                <Button icon={<FaPlay />} type="primary">
                  Start
                </Button>
              }
            >
              <p>{item.type}</p>
            </Card>
          </Col>
        ))}
      </Row> */}
      {/* {hiwQuestion?.map((question) => (
        <div key={question.id} style={{ marginBottom: "20px" }}>
          <QuestionRenderer
            question={question}
            questionNumber={1}
            totalQuestions={hiwQuestion?.length}
            onResponse={null}
            loading={false}
          />
        </div>
      ))} */}
      {/* <MockTestPlayer mockTestResponse={mockTaskResponse} /> */}

      {/* <DailyTaskPlayer questions={dailyTaskResponse?.data || []} /> */}
      <StudentCompleteDashboard />
      {/* <Login portal={PortalTypes.STUDENT} /> */}
      {/* <MockTestPreviewPage /> */}
    </>
  );
}

export default Dashboard;
