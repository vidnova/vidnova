import* as React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  text: string;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  className = 'hidden md:block px-4 py-2 bg-blue-400 hover:bg-blue-500 w-full transition-colors text-white cursor-pointer rounded-lg',
}) => (
  <Button type="submit" className={className}>
    {text}
  </Button>
);
