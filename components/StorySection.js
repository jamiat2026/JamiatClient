import React from "react";

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
  const isEmerald = idx % 2 === 0;

  return (
    <div className="flex items-start gap-4 lg:gap-6">
      <div
        className={`${isEmerald ? "bg-emerald-100" : "bg-amber-100"
          } w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center flex-shrink-0 mt-1`}
      >
        <span
          className={`${isEmerald ? "text-emerald-600" : "text-amber-600"
            } h-6 w-6 lg:h-8 lg:w-8 flex items-center justify-center`}
        >
          {icon}
        </span>
      </div>
      <div className="space-y-2 lg:space-y-3 w-full">
        <h3 className="font-semibold lg:text-xl text-gray-900">
          {item?.title}
        </h3>
        <p className="text-gray-600 lg:text-lg leading-relaxed">
          {item?.content}
        </p>
      </div>
    </div>
  );
};
