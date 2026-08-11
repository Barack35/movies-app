export default function CardSkeleton({ count = 12 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div className="trending-skeleton" key={i} />
      ))}
    </>
  );
}
