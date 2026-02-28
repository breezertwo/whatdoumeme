import { Button } from '@base-ui/react/button';

export interface ButtonContainerProps {
  onConfirmClicked?: () => void;
  onLeaveClick?: () => void;
}

export const ButtonContainer = ({ onConfirmClicked, onLeaveClick }: ButtonContainerProps) => {
  return (
    <div className="btn-row">
      {onConfirmClicked && (
        <Button className="btn btn-primary" onClick={onConfirmClicked}>
          Confirm
        </Button>
      )}
      {onLeaveClick && (
        <Button className="btn btn-secondary" onClick={onLeaveClick}>
          Leave
        </Button>
      )}
    </div>
  );
};
