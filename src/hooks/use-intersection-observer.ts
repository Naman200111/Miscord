import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = () => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { observerRef, isIntersecting };
};

export default useIntersectionObserver;
