import React, { useRef } from "react";

type TopicinputProps = {
  setTopic: (value: string) => void;
  setDifficultyLevel: (
    value: "Easy" | "Medium" | "Hard" | ""
  ) => void;
   difficulty: "Easy" | "Medium" | "Hard" | "";
};

function Topicinput({setTopic , setDifficultyLevel , difficulty}:TopicinputProps) {

    // Debounce
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTopic(value); // only after user stops typing for 500ms
    }, 500);
  };

  

  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto">
      
      {/* Topic Input */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">
          Describe your topic or enter your topic name
        </label>

        <textarea
          className="w-full min-h-[120px] rounded-lg bg-gray-100 px-4 py-3 
                     text-gray-800 placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     resize-none"
          placeholder="Enter the topic..."
          onChange={handleTopicChange}
        />
      </div>
      {/* Difficulty selector */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">
          Difficulty level
        </label>

        <select
          className="w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                       value={difficulty}
                onChange={(e) => setDifficultyLevel(
              e.target.value as "Easy" | "Medium" | "Hard" | ""
            )}
        >
           <option value="">Select Option</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

    </div>
  );
}

export default Topicinput;
