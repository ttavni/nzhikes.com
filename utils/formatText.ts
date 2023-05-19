export function formatText(text: string) {
  // Replace "-" with a space using the replace() method
  text = text.replace(/-/g, " ");

  // Capitalize every word using the split() and map() methods
  text = text
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return text;
}

export function emojiDecider(text: string) {
  let info = text.toLowerCase();
  switch (true) {
    case info.includes("km"):
      return "🥾"; // Hiking emoji
    case info.includes("hours"):
      return "⌛"; // Time emoji
    case info.includes("easy"):
      return "🟢"; // Green circle emoji
    case info.includes("medium"):
    case info.includes("intermediate"):
      return "🟠"; // Orange circle emoji
    case info.includes("hard"):
      return "🔴"; // Red circle emoji
    case info.includes("elevation"):
      return "🚶‍♂️"; // Steps emoji
    case info.includes("loop"):
      return "🔄"; // Loop emoji
    case info.includes("out & back"):
    case info.includes("point to point"):
      return "⛔"; // Loop emoji
    default:
      return "🚶‍♂️"; // Default emoji (hiking)
  }
}
