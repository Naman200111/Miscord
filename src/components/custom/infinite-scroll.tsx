import { useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import useIntersectionObserver from "@/hooks/use-intersection-observer";

interface InfiniteScrollProps {
  manual?: boolean;
  fetchNextPage: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}

const InfiniteScroll = ({
  manual = false,
  fetchNextPage,
  isFetching,
  hasNextPage,
}: InfiniteScrollProps) => {
  const { observerRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && !manual) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage, manual]);

  return (
    <div ref={observerRef} className="flex justify-center">
      {isFetching && <Loader2Icon className="animate-spin" />}
      {manual && hasNextPage && !isFetching ? (
        <Button size="sm" onClick={() => fetchNextPage()}>
          Load More
        </Button>
      ) : null}
    </div>
  );
};

export default InfiniteScroll;
