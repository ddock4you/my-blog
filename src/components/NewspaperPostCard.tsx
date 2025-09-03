import { PostWithCategory } from '@/lib/post';
import PostCard from './PostCard';

interface NewspaperPostCardProps {
  post: PostWithCategory;
  index: number;
  totalCount: number;
}

function NewspaperPostCard({ post, index, totalCount }: NewspaperPostCardProps) {
  // 각 화면 크기별 컬럼 수
  const mdColumns = 2;
  const lgColumns = 3;

  // 각 화면 크기별로 마지막 컬럼인지 확인
  const isLastColumnMd = (index + 1) % mdColumns === 0;
  const isLastColumnLg = (index + 1) % lgColumns === 0;

  // 각 화면 크기별로 마지막 행인지 확인
  const isLastRowMd = index >= totalCount - (totalCount % mdColumns || mdColumns);
  const isLastRowLg = index >= totalCount - (totalCount % lgColumns || lgColumns);

  return (
    <div className="relative">
      {/* 오른쪽 세로선 - 마지막 컬럼이 아닐 때만 표시 */}
      {!isLastColumnMd && (
        <div className="absolute top-0 -right-4 hidden h-full w-px bg-black md:block lg:hidden"></div>
      )}
      {!isLastColumnLg && (
        <div className="absolute top-0 -right-4 hidden h-full w-px bg-black lg:block"></div>
      )}

      {/* 아래쪽 가로선 - 마지막 행이 아닐 때만 표시 */}
      {!isLastRowMd && (
        <div className="absolute -bottom-4 left-0 hidden h-px w-full bg-black md:block lg:hidden"></div>
      )}
      {!isLastRowLg && (
        <div className="absolute -bottom-4 left-0 hidden h-px w-full bg-black lg:block"></div>
      )}

      {/* PostCard 컴포넌트 재사용 */}
      <PostCard post={post} />
    </div>
  );
}

export default NewspaperPostCard;
