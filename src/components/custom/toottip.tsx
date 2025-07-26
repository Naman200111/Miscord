// not using

interface TooltipProps {
  position: "right" | "left" | undefined;
  children: React.ReactNode;
  title: string | undefined;
}

const Tooltip = ({ position, children, title }: TooltipProps) => {
  return (
    <div className="relative">
      {position ? (
        <div className="absolute right-[-80px] z-[10]">{title}</div>
      ) : null}
      {children}
    </div>
  );
};

export default Tooltip;
