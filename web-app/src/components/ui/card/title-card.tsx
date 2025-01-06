function TitleCard({ title, children, topMargin, topSideButtons }: any) {
  return (
    <div
      className={
        "card w-full bg-base-100 p-6 shadow-xl " + (topMargin || "mt-6")
      }
    >
      <div
        className={`text-xl font-semibold ${topSideButtons ? "inline-block" : ""}`}
      >
        {title}
        {topSideButtons && (
          <div className="float-right inline-block">{topSideButtons}</div>
        )}
      </div>
      <div className="divider mt-2"></div>
      <div className="h-full w-full bg-base-100 pb-6">{children}</div>
    </div>
  );
}

export default TitleCard;
