import { Card, List, Space, Tag, Typography, Divider } from "antd";

const { Title, Text, Paragraph } = Typography;

const getQuestionTypeLabel = (type?: string) => {
  const map: Record<string, string> = {
    ra: "Read Aloud",
    rs: "Repeat Sentence",
    di: "Describe Image",
    rl: "Retell Lecture",
    asq: "Answer Short Question",
    rts: "Respond to Situation",
    sgd: "Summarize Group Discussion",
    we: "Write Essay",
    swt: "Summarize Written Text",
    sst: "Summarize Spoken Text",
    ro: "Re-order Paragraphs",
    rfib: "Reading Fill in the Blanks",
    rwfib: "Reading & Writing Fill in the Blanks",
    fib_r: "Reading Fill in the Blanks",
    fib_rw: "Reading & Writing Fill in the Blanks",
    lfib: "Listening Fill in the Blanks",
    fib_l: "Listening Fill in the Blanks",
    rmcsa: "Reading MCQ Single",
    rmcma: "Reading MCQ Multiple",
    mcs_r: "Reading MCQ Single",
    mcm_r: "Reading MCQ Multiple",
    lmcsa: "Listening MCQ Single",
    lmcma: "Listening MCQ Multiple",
    mcs_l: "Listening MCQ Single",
    mcm_l: "Listening MCQ Multiple",
    hcs: "Highlight Correct Summary",
    hiw: "Highlight Incorrect Words",
    smw: "Select Missing Word",
    wfd: "Write From Dictation",
  };

  return map[type || ""] || type || "Question";
};

const JsonBlock = ({ data }: { data: any }) => (
  <pre className="overflow-auto rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
    {JSON.stringify(data, null, 2)}
  </pre>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Title level={5} className="!mb-3 !mt-0">
    {title}
  </Title>
);

const AudioResponseReview = ({ item }: { item: any }) => {
  const response = item?.student_response || {};
  const evaluation = item?.evaluation || {};
  const question = item?.question || {};

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Card className="rounded-2xl bg-slate-50">
        <SectionTitle title="Question" />

        {question?.data?.text && <Paragraph>{question.data.text}</Paragraph>}

        {question?.data?.image && (
          <img
            src={question.data.image}
            alt="question"
            className="max-h-[320px] rounded-xl object-contain"
          />
        )}

        {question?.data?.audio && (
          <div className="mt-3">
            <audio controls src={question.data.audio} className="w-full" />
          </div>
        )}
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Your Response" />

        {response?.recording ? (
          <audio controls src={response.recording} className="w-full" />
        ) : (
          <Text type="secondary">No playable audio response available</Text>
        )}

        {evaluation?.transcript && (
          <>
            <Divider />
            <Text strong>Transcript</Text>
            <Paragraph className="!mt-2">{evaluation.transcript}</Paragraph>
          </>
        )}
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Evaluation" />
        <Space wrap>
          <Tag color="blue">Raw: {evaluation?.raw ?? 0}</Tag>
          <Tag color="purple">Max: {evaluation?.max_raw ?? 0}</Tag>
        </Space>

        {question?.extra?.script && (
          <>
            <Divider />
            <Text strong>Expected / Reference</Text>
            <Paragraph className="!mt-2">{question.extra.script}</Paragraph>
          </>
        )}
      </Card>
    </Space>
  );
};

const TextResponseReview = ({ item }: { item: any }) => {
  const response = item?.student_response || {};
  const evaluation = item?.evaluation || {};
  const question = item?.question || {};

  const studentText = response?.input || response?.text || "";

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Card className="rounded-2xl bg-slate-50">
        <SectionTitle title="Question" />
        {question?.data?.prompt && (
          <Paragraph>{question.data.prompt}</Paragraph>
        )}
        {question?.data?.text && <Paragraph>{question.data.text}</Paragraph>}
        {question?.data?.audio && (
          <div className="mt-3">
            <audio controls src={question.data.audio} className="w-full" />
          </div>
        )}
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Your Response" />
        <div className="rounded-2xl bg-slate-50 p-4">
          <Paragraph className="!mb-0 whitespace-pre-wrap">
            {studentText || "-"}
          </Paragraph>
        </div>
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Evaluation" />
        <Space wrap>
          <Tag color="blue">Raw: {evaluation?.raw ?? 0}</Tag>
          <Tag color="purple">Max: {evaluation?.max_raw ?? 0}</Tag>
        </Space>

        {evaluation?.transcript && (
          <>
            <Divider />
            <Text strong>Transcript</Text>
            <Paragraph className="!mt-2">{evaluation.transcript}</Paragraph>
          </>
        )}

        {question?.extra?.script && (
          <>
            <Divider />
            <Text strong>Expected / Reference</Text>
            <Paragraph className="!mt-2">{question.extra.script}</Paragraph>
          </>
        )}
      </Card>
    </Space>
  );
};

const MCQReview = ({ item }: { item: any }) => {
  const question = item?.question || {};
  const response = item?.student_response || {};
  const evaluation = item?.evaluation || {};

  const options = question?.data?.options || question?.data?.choices || [];

  const selected = response?.selected;
  const selectedArray = Array.isArray(selected)
    ? selected
    : typeof selected === "number"
      ? [selected]
      : [];

  const correctAnswers =
    question?.extra?.answers ||
    (question?.extra?.answer !== undefined ? [question.extra.answer] : []);

  const normalizedCorrectIndices = correctAnswers.map((ans: any) => {
    if (typeof ans === "number") return ans;
    return options.findIndex((o: any) => o === ans);
  });

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Card className="rounded-2xl bg-slate-50">
        <SectionTitle title="Question" />
        {question?.data?.text && <Paragraph>{question.data.text}</Paragraph>}
        {question?.data?.question && (
          <Paragraph strong>{question.data.question}</Paragraph>
        )}
        {question?.data?.audio && (
          <div className="mt-3">
            <audio controls src={question.data.audio} className="w-full" />
          </div>
        )}
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Options Review" />
        <List
          dataSource={options}
          renderItem={(option: any, index: number) => {
            const isSelected = selectedArray.includes(index);
            const isCorrect = normalizedCorrectIndices.includes(index);

            return (
              <List.Item>
                <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <div>
                    <Text>{option}</Text>
                  </div>
                  <Space>
                    {isSelected && <Tag color="blue">Your Answer</Tag>}
                    {isCorrect && <Tag color="green">Correct</Tag>}
                  </Space>
                </div>
              </List.Item>
            );
          }}
        />
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Evaluation" />
        <Space wrap>
          <Tag color="blue">Raw: {evaluation?.raw ?? 0}</Tag>
          <Tag color="purple">Max: {evaluation?.max_raw ?? 0}</Tag>
        </Space>
      </Card>
    </Space>
  );
};

const FillBlanksReview = ({ item }: { item: any }) => {
  const question = item?.question || {};
  const response = item?.student_response || {};
  const evaluation = item?.evaluation || {};

  const userInputs = response?.inputs || [];
  const expectedAnswers = question?.extra?.answers || [];
  const text = question?.data?.text || "";

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Card className="rounded-2xl bg-slate-50">
        <SectionTitle title="Question" />
        <Paragraph className="!mb-0 whitespace-pre-wrap">{text}</Paragraph>
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Your Answers" />
        <Space wrap>
          {userInputs.length ? (
            userInputs.map((ans: any, index: number) => (
              <Tag key={index} color="blue">
                {index + 1}. {ans}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No answers submitted</Text>
          )}
        </Space>
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Expected Answers" />
        <Space wrap>
          {expectedAnswers.length ? (
            expectedAnswers.map((ans: any, index: number) => (
              <Tag key={index} color="green">
                {index + 1}. {ans}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No expected answer data available</Text>
          )}
        </Space>
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Evaluation" />
        <Space wrap>
          <Tag color="blue">Raw: {evaluation?.raw ?? 0}</Tag>
          <Tag color="purple">Max: {evaluation?.max_raw ?? 0}</Tag>
        </Space>
      </Card>
    </Space>
  );
};

const ReorderReview = ({ item }: { item: any }) => {
  const question = item?.question || {};
  const response = item?.student_response || {};
  const evaluation = item?.evaluation || {};

  const userOrder = response?.inputs || [];
  const expectedOrder =
    question?.extra?.answers || question?.extra?.correctOrder || [];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Card className="rounded-2xl bg-slate-50">
        <SectionTitle title="Your Order" />
        <List
          dataSource={userOrder}
          renderItem={(text: any, index: number) => (
            <List.Item>
              <div className="w-full rounded-2xl bg-white px-4 py-3 shadow-sm">
                <Text strong className="mr-2">
                  {index + 1}.
                </Text>
                <Text>{text}</Text>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Expected Order" />
        {expectedOrder?.length ? (
          <List
            dataSource={expectedOrder}
            renderItem={(text: any, index: number) => (
              <List.Item>
                <div className="w-full rounded-2xl bg-slate-50 px-4 py-3">
                  <Text strong className="mr-2">
                    {index + 1}.
                  </Text>
                  <Text>{text}</Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Expected order not available</Text>
        )}
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Evaluation" />
        <Space wrap>
          <Tag color="blue">Raw: {evaluation?.raw ?? 0}</Tag>
          <Tag color="purple">Max: {evaluation?.max_raw ?? 0}</Tag>
        </Space>
      </Card>
    </Space>
  );
};

const HIWReview = ({ item }: { item: any }) => {
  const question = item?.question || {};
  const response = item?.student_response || {};
  const evaluation = item?.evaluation || {};

  const selected = response?.inputs || [];
  const correct = question?.extra?.answers || [];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={20}>
      <Card className="rounded-2xl bg-slate-50">
        <SectionTitle title="Question Transcript" />
        <Paragraph className="!mb-0 whitespace-pre-wrap">
          {question?.data?.text || "-"}
        </Paragraph>
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Your Selected Word Indexes" />
        <Space wrap>
          {selected.length ? (
            selected.map((ans: any, index: number) => (
              <Tag key={index} color="blue">
                {ans}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No selections made</Text>
          )}
        </Space>
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Correct Word Indexes" />
        <Space wrap>
          {correct.length ? (
            correct.map((ans: any, index: number) => (
              <Tag key={index} color="green">
                {ans}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No expected answer data available</Text>
          )}
        </Space>
      </Card>

      <Card className="rounded-2xl">
        <SectionTitle title="Evaluation" />
        <Space wrap>
          <Tag color="blue">Raw: {evaluation?.raw ?? 0}</Tag>
          <Tag color="purple">Max: {evaluation?.max_raw ?? 0}</Tag>
        </Space>
      </Card>
    </Space>
  );
};

type QuestionReviewRendererProps = {
  item: any;
};

const QuestionReviewRenderer = ({ item }: QuestionReviewRendererProps) => {
  if (!item) {
    return <Text type="secondary">No question selected</Text>;
  }

  const type = item?.type;

  const audioTypes = ["ra", "rs", "di", "rl", "asq", "rts", "sgd"];
  const textTypes = ["we", "swt", "sst", "wfd"];
  const mcqTypes = [
    "rmcsa",
    "rmcma",
    "mcs_r",
    "mcm_r",
    "lmcsa",
    "lmcma",
    "mcs_l",
    "mcm_l",
    "hcs",
    "smw",
  ];
  const fillTypes = ["rfib", "rwfib", "fib_r", "fib_rw", "lfib", "fib_l"];

  if (audioTypes.includes(type)) {
    return <AudioResponseReview item={item} />;
  }

  if (textTypes.includes(type)) {
    return <TextResponseReview item={item} />;
  }

  if (mcqTypes.includes(type)) {
    return <MCQReview item={item} />;
  }

  if (fillTypes.includes(type)) {
    return <FillBlanksReview item={item} />;
  }

  if (type === "ro") {
    return <ReorderReview item={item} />;
  }

  if (type === "hiw") {
    return <HIWReview item={item} />;
  }

  return (
    <Card className="rounded-2xl">
      <SectionTitle
        title={`Unsupported Review Type: ${getQuestionTypeLabel(type)}`}
      />
      <JsonBlock data={item} />
    </Card>
  );
};

export default QuestionReviewRenderer;
