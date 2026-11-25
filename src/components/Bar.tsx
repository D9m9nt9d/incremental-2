function Bar({ percent }: { percent: number }) {
  return (
    <div className="relative h-6 border-2 border-r-0 border-black bg-white">
      <div
        className={`h-full transition-[width,background-color] ease-linear duration-100 ${percent > 80 ? "bg-green-400" : "bg-lime-400"
          }`}
        style={{ width: `${percent}%` }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, transparent 0, transparent calc(10% - 2px), black calc(10% - 2px), black 10%)",
        }}
      />
    </div>
  )
}

export default Bar