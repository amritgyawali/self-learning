'use client'

import React from 'react'
import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, MessageSquare, User } from 'lucide-react'

interface BookingTask {
  id: string
  title: string
  customer: string
  date: string
  package: string
  status: string
  priority: 'high' | 'medium' | 'low'
}

interface Column {
  id: string
  title: string
  tasks: BookingTask[]
}

interface ColumnMap {
  [key: string]: Column
}

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'New Bookings',
    tasks: [
      {
        id: '1',
        title: 'Wedding Photography Session',
        customer: 'John & Sarah',
        date: '2024-06-15',
        package: 'Premium Package',
        status: 'todo',
        priority: 'high'
      }
    ]
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [
      {
        id: '2',
        title: 'Engagement Photoshoot',
        customer: 'Mike & Emma',
        date: '2024-05-20',
        package: 'Basic Package',
        status: 'inProgress',
        priority: 'medium'
      }
    ]
  },
  review: {
    id: 'review',
    title: 'Review',
    tasks: []
  },
  done: {
    id: 'done',
    title: 'Completed',
    tasks: [
      {
        id: '3',
        title: 'Wedding Video Editing',
        customer: 'Alex & Lisa',
        date: '2024-04-10',
        package: 'Premium Package',
        status: 'done',
        priority: 'low'
      }
    ]
  }
}

export default function AgileBoard() {
  const [columns, setColumns] = useState<ColumnMap>(initialColumns as ColumnMap)

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return
    
    // Extract the task ID and column ID from the draggable ID
    const [taskId, sourceColumnId] = active.id.toString().split('-')
    const [_, destColumnId] = over.id.toString().split('-')
    
    // If dropping in the same column
    if (sourceColumnId === destColumnId) {
      const column = columns[sourceColumnId]
      const oldIndex = column.tasks.findIndex(task => `${task.id}-${sourceColumnId}` === active.id)
      const newIndex = column.tasks.findIndex(task => `${task.id}-${sourceColumnId}` === over.id)
      
      if (oldIndex === newIndex) return
      
      const newTasks = arrayMove(column.tasks, oldIndex, newIndex)
      
      setColumns({
        ...columns,
        [sourceColumnId]: {
          ...column,
          tasks: newTasks
        }
      })
    } else {
      // Moving between columns
      const sourceColumn = columns[sourceColumnId]
      const destColumn = columns[destColumnId]
      
      // Find the task in the source column
      const taskIndex = sourceColumn.tasks.findIndex(task => `${task.id}-${sourceColumnId}` === active.id)
      if (taskIndex === -1) return
      
      const task = sourceColumn.tasks[taskIndex]
      
      // Create new arrays for both columns
      const newSourceTasks = [...sourceColumn.tasks]
      newSourceTasks.splice(taskIndex, 1)
      
      // Find the position in the destination column
      const overTaskId = over.id.toString().split('-')[0]
      const overTaskIndex = destColumn.tasks.findIndex(task => task.id === overTaskId)
      
      const newDestTasks = [...destColumn.tasks]
      // If dropping on a task, insert at that position, otherwise append to the end
      if (overTaskIndex !== -1) {
        newDestTasks.splice(overTaskIndex, 0, {
          ...task,
          status: destColumnId
        })
      } else {
        newDestTasks.push({
          ...task,
          status: destColumnId
        })
      }
      
      setColumns({
        ...columns,
        [sourceColumnId]: {
          ...sourceColumn,
          tasks: newSourceTasks
        },
        [destColumnId]: {
          ...destColumn,
          tasks: newDestTasks
        }
      })
    }
  }
  
  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleNotifyStaff = async (task: BookingTask) => {
    try {
      const message = `New booking assignment: ${task.title} for ${task.customer} on ${task.date}`
      // In a real app, you would call your notification service here
      console.log('Notifying staff:', message)
      // await notificationService.notifyStaff('staff-id', message)
    } catch (error) {
      console.error('Failed to notify staff:', error)
    }
  }

  // Create a sortable item component
  const SortableItem = ({ task, columnId }: { task: BookingTask, columnId: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: `${task.id}-${columnId}`,
    })
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
    
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task-card"
      >
        <Card className="bg-card">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">
              {task.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {task.customer}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {task.date}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${getPriorityColor(
                  task.priority
                )}`}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {task.priority} Priority
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => handleNotifyStaff(task)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Notify Staff
              </Button>
              {columnId !== 'done' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const nextStatus = {
                      todo: 'inProgress',
                      inProgress: 'review',
                      review: 'done'
                    }[columnId];
                    
                    if (nextStatus) {
                      // Create a synthetic drag end event
                      const taskIndex = columns[columnId].tasks.findIndex(t => t.id === task.id)
                      const event = {
                        active: { id: `${task.id}-${columnId}` },
                        over: { id: `placeholder-${nextStatus}` }
                      }
                      onDragEnd(event as DragEndEvent);
                    }
                  }}
                >
                  Move to Next Stage
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Create a droppable column component
  const DroppableColumn = ({ column }: { column: Column }) => {
    return (
      <div className="bg-muted rounded-lg p-4">
        <h2 className="font-semibold mb-4 flex items-center justify-between">
          {column.title}
          <Badge variant="secondary">{column.tasks.length}</Badge>
        </h2>
        <div className="space-y-4 min-h-[50px]">
          {column.tasks.map((task) => (
            <SortableItem key={task.id} task={task} columnId={column.id} />
          ))}
          {/* This is a placeholder for empty columns to allow dropping */}
          {column.tasks.length === 0 && (
            <div id={`placeholder-${column.id}`} className="h-2" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management Board</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notify All Staff
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-4 gap-4">
          {Object.values(columns).map((column) => (
            <SortableContext
              key={column.id}
              items={column.tasks.map(task => `${task.id}-${column.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableColumn column={column} />
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  )
}