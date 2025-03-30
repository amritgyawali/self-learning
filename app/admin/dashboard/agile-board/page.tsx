'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, Clock, MessageSquare, User } from 'lucide-react'

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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const task = sourceColumn.tasks.find((t: BookingTask) => t.id === draggableId)

    if (!task) return

    const newSourceTasks = [...sourceColumn.tasks]
    newSourceTasks.splice(source.index, 1)

    const newDestTasks = [...destColumn.tasks]
    newDestTasks.splice(destination.index, 0, {
      ...task,
      status: destination.droppableId
    })

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: newSourceTasks
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: newDestTasks
      }
    })
  }

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management Board</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notify All Staff
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {Object.values(columns).map((column: Column) => (
            <div key={column.id} className="bg-muted rounded-lg p-4">
              <h2 className="font-semibold mb-4 flex items-center justify-between">
                {column.title}
                <Badge variant="secondary">{column.tasks.length}</Badge>
              </h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 min-h-[50px]"
                  >
                    {column.tasks.map((task: BookingTask, index: number) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps as React.DraggableProps}
                            {...provided.dragHandleProps as React.DraggableProps}
                            className="bg-card"
                          >
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
                                <span className="text-xs text-muted-foreground capitalize" key={`priority-${task.id}`}>
                                  {task.priority} Priority
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => handleNotifyStaff(task)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Notify Staff
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}