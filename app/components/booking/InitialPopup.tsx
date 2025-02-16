'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "@heroicons/react/24/solid"

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Invalid mobile number" }),
  weddingDate: z.date().min(new Date(), { message: "Wedding date must be in the future" }),
})

interface InitialPopupProps {
  isOpen: boolean;
  onSubmit: (data: any) => void;
}

export default function InitialPopup({ isOpen, onSubmit }: InitialPopupProps) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      mobile: '',
      weddingDate: new Date(),
    },
  })

  const onSubmitForm = (data: any) => {
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] bg-white" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Let's Start Planning Your Perfect Wedding Photography!</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => <Input {...field} type="tel" />}
            />
            {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
          </div>
          <div className="relative">
            <Label htmlFor="weddingDate">Wedding Date</Label>
            <div className="relative">
              <Controller
                name="weddingDate"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center">
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="MMMM d, yyyy"
                      minDate={new Date()}
                      className="w-full p-2 border rounded pr-10"
                      popperPlacement="bottom-end"
                    />
                    <CalendarIcon
                      className="w-5 h-5 absolute right-3 text-gray-500 cursor-pointer"
                      onClick={() => document.querySelector('.react-datepicker__input-container input')?.focus()}
                    />
                  </div>
                )}
              />
            </div>
            {errors.weddingDate && <p className="text-red-500">{errors.weddingDate.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-300">Proceed to Packages</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}