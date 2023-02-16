import { useEffect, useState } from 'react';
import { formatTime, splitTime } from '../util';

function Timer({
  startTime,
  endTime,
}: {
  startTime: Date,
  endTime?: Date | null,
}) {
  const [currentTime, setCurrentTime] = useState<{ m: number, ms: number, s: number }>();

  useEffect(
    () => {
      const interval = setInterval(
        () => {
          if (startTime) {
            const time = (endTime ?? new Date()).getTime();
            const diff = time - startTime.getTime();
            setCurrentTime(splitTime(diff));
          }
        },
        35,
      );
      return () => clearInterval(interval);
    },
    [startTime, endTime],
  );

  return (
    <span>
      {currentTime ? formatTime(currentTime) : ''}
    </span>
  );
}

export default Timer;
