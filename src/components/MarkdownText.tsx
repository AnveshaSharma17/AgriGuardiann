import React from "react";

interface MarkdownTextProps {
  content: string;
  className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({
  content,
  className = "",
}) => {
  // Simple markdown parser for common patterns
  const parseMarkdown = (text: string) => {
    // Split by newlines to handle line breaks
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      const elements: React.ReactNode[] = [];
      let currentText = line;
      let key = 0;

      // Handle bold **text**
      currentText = currentText.replace(/\*\*(.*?)\*\*/g, (_, boldText) => {
        const placeholder = `__BOLD_${key}__`;
        elements.push(
          <strong key={`bold-${key}`} className="font-semibold">
            {boldText}
          </strong>
        );
        key++;
        return placeholder;
      });

      // Handle italic *text*
      currentText = currentText.replace(/\*(.*?)\*/g, (_, italicText) => {
        const placeholder = `__ITALIC_${key}__`;
        elements.push(
          <em key={`italic-${key}`} className="italic">
            {italicText}
          </em>
        );
        key++;
        return placeholder;
      });

      // Handle bullet points
      const bulletMatch = currentText.match(/^[•\-\*]\s+(.+)$/);
      if (bulletMatch) {
        return (
          <div key={lineIndex} className="flex gap-2 ml-2">
            <span className="text-green-600">•</span>
            <span>{bulletMatch[1]}</span>
          </div>
        );
      }

      // Handle numbered lists
      const numberedMatch = currentText.match(/^(\d+)[\.\)]\s+(.+)$/);
      if (numberedMatch) {
        return (
          <div key={lineIndex} className="flex gap-2 ml-2">
            <span className="text-green-600 font-medium">
              {numberedMatch[1]}.
            </span>
            <span>{numberedMatch[2]}</span>
          </div>
        );
      }

      // Replace placeholders with actual elements
      const parts = currentText
        .split(/(__(?:BOLD|ITALIC)_\d+__)/)
        .filter(Boolean);

      return (
        <div key={lineIndex}>
          {parts.map((part, partIndex) => {
            const elementMatch = part.match(/__(\w+)_(\d+)__/);
            if (elementMatch) {
              return elements[parseInt(elementMatch[2])];
            }
            return part && <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`space-y-1 ${className}`}>{parseMarkdown(content)}</div>
  );
};
