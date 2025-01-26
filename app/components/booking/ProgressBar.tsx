import { Progress } from "@react-three/drei";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      <progress value={progress} max="100" className="w-full" />
      <div className="flex justify-between mt-2">
        <span className="text-sm">Enter Details</span>
        <span className="text-sm">Select Package</span>
        <span className="text-sm">Customize</span>
      </div>
    </div>
  )
}

