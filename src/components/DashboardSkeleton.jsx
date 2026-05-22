import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function DashboardSkeleton() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-cards">
        <Skeleton height={130} borderRadius={28} />
        <Skeleton height={130} borderRadius={28} />
        <Skeleton height={130} borderRadius={28} />
        <Skeleton height={130} borderRadius={28} />
      </div>

      <div className="skeleton-charts">
        <Skeleton height={360} borderRadius={28} />
        <Skeleton height={360} borderRadius={28} />
      </div>

      <Skeleton height={360} borderRadius={28} />
    </div>
  );
}

export default DashboardSkeleton;