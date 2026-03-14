import { useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import useIntersectionObserver from "@/hooks/use-intersection-observer";

interface InfiniteScrollProps {
  manual?: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const InfiniteScroll = ({
  manual = false,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteScrollProps) => {
  const { observerRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && !manual) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage, manual]);

  return (
    <div ref={observerRef} className="flex justify-center">
      {isFetchingNextPage && <Loader2Icon className="animate-spin" />}
      {manual && hasNextPage && !isFetchingNextPage ? (
        <Button size="sm" onClick={() => fetchNextPage()}>
          Load More
        </Button>
      ) : null}
    </div>
  );
};

export default InfiniteScroll;
