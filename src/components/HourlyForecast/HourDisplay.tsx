export function HourDisplay({
  hourItem,
  hourFormat,
}: {
  hourItem: string;
  hourFormat: "12" | "24";
}) {
  if (hourFormat === "12") {
    const hours = hourItem.replace(/[a-z]/gi, "").trim();
    const chars = hourItem.replace(/[0-9]/g, "").trim();
    return (
      <div className="flex items-center gap-1.5 text-lg">
        <span>{hours}</span>
        <span className="text-white/50">{chars}</span>
      </div>
    );
  } else {
    const [h, min] = hourItem.split(":");
    const currentHour = parseInt(h, 10).toString();

    return (
      <div className="flex items-center gap-0.75 text-lg">
        <div className="flex items-center gap-0.5">
          <span>{currentHour}</span>
          <span>:</span>
        </div>

        <span className="text-white/50 font-normal">{min}</span>
      </div>
    );
  }
}
