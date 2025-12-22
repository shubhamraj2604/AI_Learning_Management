import { Button } from "@/components/ui/button";
import {
  FileText,
  Code,
  Briefcase,
  Dumbbell,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

type studyType = {
  selectedStudyType : (value:string) => void;
};
function Selectoptions({selectedStudyType}:studyType) {
  const options = [
    { name: "Exam", icon: FileText },
    { name: "Coding", icon: Code },
    { name: "Job Interview", icon: Briefcase },
    { name: "Practice", icon: Dumbbell },
    { name: "Other", icon: MoreHorizontal },
  ];

  const [selectOption , setSelectOption] = useState("");

  return (
    <div className="">
      <h2 className="text-center mb-6 text-2xl font-semibold">
        For which you want to create your personal study material
      </h2>

      <div className="flex items-center justify-center gap-6 flex-wrap">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => {setSelectOption(option.name) ; selectedStudyType(option.name)}}
            className={`
              group
              p-6 w-48 mt-10
              flex flex-col items-center justify-center
              border rounded-2xl
              cursor-pointer
              transition-all duration-200
              hover:border-blue-500 hover:bg-blue-50
              ${option?.name == selectOption && 'bg-gray-300'}
            `}
          >
            <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition">
              <option.icon size={32} className="text-blue-600" />
            </div>
 
            <h2 className="mt-3 text-sm font-medium text-center">
              {option.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Selectoptions;
