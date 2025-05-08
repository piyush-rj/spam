import { FC, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../../lib/utils';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-yellow-500 text-black hover:bg-yellow-600",
        outline: "bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10",
        ghost: "bg-transparent hover:bg-yellow-500/10 text-yellow-500",
        link: "bg-transparent underline-offset-4 hover:underline text-yellow-500",
        gradient: "bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:brightness-110",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-12 px-8 rounded-md text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
  VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  size,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {variant === 'gradient' && (
        <span className="absolute inset-0 rounded-md overflow-hidden">
          <span className="absolute inset-0 opacity-0 hover:opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.4)_0,_transparent_70%)] transition-opacity duration-500" />
        </span>
      )}
    </button>
  );
};

export default Button;