export function setProgress(setLoading: (value: number) => void) {
  let percent = 0;

  let interval = window.setInterval(() => {
    if (percent <= 50) {
      const rand = Math.round(Math.random() * 5);
      percent += rand;
      setLoading(percent);
    } else {
      window.clearInterval(interval);
      interval = window.setInterval(() => {
        percent += Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          window.clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    window.clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      window.clearInterval(interval);
      interval = window.setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          window.clearInterval(interval);
        }
      }, 2);
    });
  }

  return { loaded, percent, clear };
}
