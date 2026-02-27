export function getHour(hour: string, hourFormat: "12" | "24") {
  if (hourFormat === "12") {
    const hours = hour.replace(/[a-z]/gi, "").trim();
    const chars = hour.replace(/[0-9]/g, "").trim();
    return (
      <div className="flex items-center gap-1 font-medium text-sm lg:text-lg">
        <span>{hours}</span>
        <span className=" text-white/50">{chars}</span>
      </div>
    );
  } else {
    const [h, m] = hour.split(":");
    const currentHour = parseInt(h, 10).toString();

    return (
      <div className="flex items-center gap-0.75 text-sm lg:text-lg">
        <div className="flex items-center gap-0.5 font-medium">
          <span>{currentHour}</span>
          <span>:</span>
        </div>
        <span className=" text-white/50 font-normal">{m}</span>
      </div>
    );
  }
}
