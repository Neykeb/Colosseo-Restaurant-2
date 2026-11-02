type Props = {
  ariaExpanded?: boolean;
  ariaLabel: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
};

export function IconButton({ ariaExpanded, ariaLabel, buttonRef, children, className = "", onClick }: Props) {
  return (
    <button
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
      ref={buttonRef}
      type="button"
    >
      {children}
    </button>
  );
}