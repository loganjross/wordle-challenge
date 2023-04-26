export function Toggle({
  isToggled,
  onToggle,
}: {
  isToggled: boolean;
  onToggle: (isToggled: boolean) => void;
}) {
  return (
    <div
      className={` relative w-9 h-6 p-1 rounded-full flex bg-${
        isToggled ? "green" : "gray-400"
      }`}
      onClick={() => onToggle(!isToggled)}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-all`}
        style={{
          position: "absolute",
          top: "50%",
          left: isToggled ? "45%" : "10%",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
}
