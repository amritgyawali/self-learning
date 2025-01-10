import { Progress } from "@/components/ui/progress"

export default function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      <Progress value={progress} className="w-full" />
      <div className="flex justify-between mt-2">
        <span className="text-sm">Enter Details</span>
        <span className="text-sm">Select Package</span>
        <span className="text-sm">Customize</span>
      </div>
    </div>
  )
}

