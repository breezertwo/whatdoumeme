import { Button } from '@base-ui/react/button';

export interface CustomButtonProps {
  type?: number;
  onClick?: () => void;
  children: React.ReactNode;
}

export const CustomButton = ({ onClick, children }: CustomButtonProps) => {
  return (
    <Button className="btn btn-primary btn-full" onClick={onClick}>
      {children}
    </Button>
  );
};
