import React, { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export const StorySection = ({ items, icons }) => (
  <div className="border-0 bg-white shadow-sm hover:shadow-lg rounded-xl transition-all duration-300">
    <div className="p-6 lg:p-12 space-y-4 lg:space-y-8">
      {items?.map((item, idx) => (
        <StoryItem key={idx} item={item} icon={icons[idx % icons.length]} idx={idx} />
      ))}
    </div>
  </div>
);

const StoryItem = ({ item, icon, idx }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(textRef.current.scrollHeight > 120);
      }
    };
    checkOverflow();
    const timeoutId = setTimeout(checkOverflow, 100);
    return () => clearTimeout(timeoutId);
  }, [item?.content]);

  const isEmerald = idx % 2 === 0;

  return (
    <div className="flex items-start gap-4 lg:gap-6">
      <div
        className={`${
          isEmerald ? "bg-emerald-100" : "bg-amber-100"
        } w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center flex-shrink-0 mt-1`}
      >
        <span
          className={`${
            isEmerald ? "text-emerald-600" : "text-amber-600"
          } h-6 w-6 lg:h-8 lg:w-8 flex items-center justify-center`}
        >
          {icon}
        </span>
      </div>
      <div className="space-y-2 lg:space-y-3 w-full">
        <h3 className="font-semibold lg:text-xl text-gray-900">
          {item?.title}
        </h3>
        <div className="relative">
          <div
            ref={textRef}
            className={`text-gray-600 lg:text-lg leading-relaxed transition-all duration-500 ${
              isExpanded 
                ? "max-h-[300px] overflow-y-auto pr-2" 
                : "max-h-[120px] overflow-hidden"
            }`}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#10B981 transparent'
            }}
          >
            {item?.content}
          </div>
          
          {/* Gradient overlay when collapsed */}
          {!isExpanded && isOverflowing && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
        
        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors group"
          >
            {isExpanded ? (
              <>Show Less <ChevronRight className="w-4 h-4 -rotate-90 group-hover:-translate-y-0.5 transition-transform" /></>
            ) : (
              <>Read More <ChevronRight className="w-4 h-4 rotate-90 group-hover:translate-y-0.5 transition-transform" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
