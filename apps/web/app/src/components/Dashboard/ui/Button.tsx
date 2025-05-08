import { FC, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../../lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[#3F3F46] text-white hover:bg-[#52525B]",
        outline: "bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500/10",
        ghost: "bg-transparent hover:bg-purple-500/10 text-purple-500",
        link: "bg-transparent underline underline-offset-4 text-cyan-500 hover:text-cyan-600",
        gradient: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
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
    </button>
  );
};

export default Button;