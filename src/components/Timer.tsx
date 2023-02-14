import { useEffect, useState } from 'react';

function formatTime(time: { m: number, ms: number, s: number }) {
  const m = time.m.toString().padStart(2, '0');
  const s = time.s.toString().padStart(2, '0');
  const ms = Math.floor(time.ms / 10).toString().padStart(2, '0');
  return `${m}:${s}:${ms}`;
}

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
            const ms = diff % 1000;
            const s = Math.floor(diff / 1000) % 60;
            const m = Math.floor(diff / 1000 / 60);
            setCurrentTime({ m, ms, s });
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
