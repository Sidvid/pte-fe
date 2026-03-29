export const swapItems = <T,>(arr: T[], from: number, to: number): T[] => {
  const next = [...arr];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};
export const parseScript = (text: string) => {
  if (!text) {
    return [{ type: "text", value: "" }];
  }

  const regex = /\{\{(.*?)\}\}/g;
  const parts: any[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }

    const options = match[1]
      .split("}{")
      .map((opt) => opt.replace("{", "").replace("}", ""));

    parts.push({
      type: "blank",
      options,
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return parts;
};

export const formatDate = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

export const formatTime = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
