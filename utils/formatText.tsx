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
