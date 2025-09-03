interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({
  message = '아직 작성된 포스트가 없습니다.',
  className = 'col-span-full py-12 text-center',
}: EmptyStateProps) {
  return (
    <div className={className}>
      <p className="text-lg text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
