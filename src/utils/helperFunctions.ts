export const getNoteEmoji = (content: string) => {
  const emojiMap: { [key: string]: string } = {
    "#meeting": "📅",
    "#idea": "💡",
    "#task": "✅",
    "#personal": "🔒",
  };

  const foundEmoji = Object.keys(emojiMap).find((key) => content.includes(key));
  return foundEmoji ? emojiMap[foundEmoji] : "📑";
};

export const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval}${unit[0]}`;
    }
  }

  return "Just now";
};
