import React, { useState, ChangeEvent, FocusEvent } from "react";
import toast from "react-hot-toast";

interface CallerTuneProps {
  defaultValue?: string;
}

function CallerTune({ defaultValue = "00:00:00" }: CallerTuneProps) {
  const [callerTuneTime, setCallerTuneTime] = useState<string>(defaultValue);

  const validateTimeFormat = (time: string): boolean => {
    const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/; // Ensures HH:MM:SS in 24-hour format
    return timePattern.test(time);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCallerTuneTime(e.target.value); // Update the value without validation
  };

  const handleTimeBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!validateTimeFormat(value)) {
      toast.error("Invalid format! Use HH:MM:SS");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">
        Caller Tune Time (HH:MM:SS)
      </label>
      <input
        name="crbt"
        type="text"
        placeholder="HH:MM:SS"
        value={callerTuneTime}
        onChange={handleTimeChange} // Update value on change
        onBlur={handleTimeBlur} // Validate on blur
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={8}
        required
      />
    </div>
  );
}

export default CallerTune;