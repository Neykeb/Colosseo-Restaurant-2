type Props = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: "primary" | "light" | "outline-light";
};

export function ActionLabel({ children, className = "", title, variant = "primary" }: Props) {
  return (
    <span aria-disabled="true" className={`button button-${variant} button-disabled ${className}`.trim()} title={title}>
      {children}
    </span>
  );
}