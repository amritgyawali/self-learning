'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Bell, 
  Calendar, 
  MessageSquare, 
  User, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Edit,
  Trash2,
  BarChart4
} from 'lucide-react'
import { Label } from '@/components/ui/label'

interface BookingTask {
  id: string
  title: string
  customer: string
  date: string
  package: string
  status: string
  priority: 'high' | 'medium' | 'low'
  description?: string
  dueDate?: string
  assignedTo?: string[]
  completionPercentage?: number
  tags?: string[]
  createdAt?: string
  updatedAt?: string
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
        priority: 'high',
        description: 'Full day wedding photography coverage including ceremony and reception',
        dueDate: '2024-06-10',
        assignedTo: ['Mike'],
        completionPercentage: 0,
        tags: ['wedding', 'premium'],
        createdAt: '2024-05-01',
        updatedAt: '2024-05-01'
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
        priority: 'medium',
        description: 'Pre-wedding engagement photoshoot at the beach',
        dueDate: '2024-05-15',
        assignedTo: ['Emma'],
        completionPercentage: 50,
        tags: ['engagement', 'basic'],
        createdAt: '2024-04-15',
        updatedAt: '2024-05-05'
      }
    ]
  },
  review: {
    id: 'review',
    title: 'Review',
    tasks: [
      {
        id: '4',
        title: 'Family Portrait Session',
        customer: 'Johnson Family',
        date: '2024-05-10',
        package: 'Family Package',
        status: 'review',
        priority: 'medium',
        description: 'Family portrait session with 5 family members',
        dueDate: '2024-05-12',
        assignedTo: ['David'],
        completionPercentage: 80,
        tags: ['family', 'portrait'],
        createdAt: '2024-04-20',
        updatedAt: '2024-05-08'
      }
    ]
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
        priority: 'low',
        description: 'Post-production editing of wedding video footage',
        dueDate: '2024-04-20',
        assignedTo: ['James'],
        completionPercentage: 100,
        tags: ['video', 'editing', 'premium'],
        createdAt: '2024-03-15',
        updatedAt: '2024-04-18'
      }
    ]
  }
}

export default function AgileBoard() {
  const [columns, setColumns] = useState<ColumnMap>(initialColumns as ColumnMap)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isViewingTask, setIsViewingTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<BookingTask | null>(null)
  const [newTask, setNewTask] = useState<Partial<BookingTask>>({
    title: '',
    customer: '',
    date: '',
    package: '',
    priority: 'medium',
    status: 'todo',
    description: '',
    dueDate: '',
    assignedTo: [],
    tags: []
  })
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Filter tasks based on search query and priority filter
  const filteredColumns = React.useMemo(() => {
    const result = { ...columns }
    
    if (searchQuery || priorityFilter !== 'all') {
      Object.keys(result).forEach(columnId => {
        result[columnId] = {
          ...result[columnId],
          tasks: result[columnId].tasks.filter(task => {
            const matchesSearch = searchQuery ? (
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            ) : true
            
            const matchesPriority = priorityFilter !== 'all' ? task.priority === priorityFilter : true
            
            return matchesSearch && matchesPriority
          })
        }
      })
    }
    
    return result
  }, [columns, searchQuery, priorityFilter])

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
          status: destColumnId,
          updatedAt: new Date().toISOString().split('T')[0]
        })
      } else {
        newDestTasks.push({
          ...task,
          status: destColumnId,
          updatedAt: new Date().toISOString().split('T')[0]
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
      alert(`Staff notified about: ${task.title}`)
    } catch (error) {
      console.error('Failed to notify staff:', error)
    }
  }
  
  const handleAddTask = () => {
    const today = new Date().toISOString().split('T')[0]
    const newTaskComplete: BookingTask = {
      id: String(Date.now()),
      title: newTask.title || 'New Task',
      customer: newTask.customer || 'Customer Name',
      date: newTask.date || today,
      package: newTask.package || 'Standard Package',
      status: newTask.status || 'todo',
      priority: newTask.priority as 'high' | 'medium' | 'low' || 'medium',
      description: newTask.description || '',
      dueDate: newTask.dueDate || '',
      assignedTo: newTask.assignedTo || [],
      completionPercentage: 0,
      tags: newTask.tags || [],
      createdAt: today,
      updatedAt: today
    }
    
    setColumns({
      ...columns,
      [newTaskComplete.status]: {
        ...columns[newTaskComplete.status],
        tasks: [...columns[newTaskComplete.status].tasks, newTaskComplete]
      }
    })
    
    // Reset form
    setNewTask({
      title: '',
      customer: '',
      date: '',
      package: '',
      priority: 'medium',
      status: 'todo',
      description: '',
      dueDate: '',
      assignedTo: [],
      tags: []
    })
    setIsAddingTask(false)
  }
  
  const handleUpdateTask = () => {
    if (!selectedTask) return
    
    const updatedTask = {
      ...selectedTask,
      ...newTask,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    setColumns({
      ...columns,
      [updatedTask.status]: {
        ...columns[updatedTask.status],
        tasks: columns[updatedTask.status].tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      }
    })
    
    setSelectedTask(null)
    setNewTask({
      title: '',
      customer: '',
      date: '',
      package: '',
      priority: 'medium',
      status: 'todo',
      description: '',
      dueDate: '',
      assignedTo: [],
      tags: []
    })
    setEditMode(false)
    setIsViewingTask(false)
  }
  
  const handleDeleteTask = (taskId: string, columnId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setColumns({
        ...columns,
        [columnId]: {
          ...columns[columnId],
          tasks: columns[columnId].tasks.filter(task => task.id !== taskId)
        }
      })
      
      if (selectedTask?.id === taskId) {
        setSelectedTask(null)
        setIsViewingTask(false)
      }
    }
  }
  
  const handleNotifyAllStaff = () => {
    const pendingTasks = [
      ...columns.todo.tasks,
      ...columns.inProgress.tasks,
      ...columns.review.tasks
    ]
    
    const message = `You have ${pendingTasks.length} pending tasks that need attention.`
    console.log('Notifying all staff:', message)
    alert(`All staff notified about ${pendingTasks.length} pending tasks`)
  }
  
  const getTaskAnalytics = () => {
    const totalTasks = Object.values(columns).reduce(
      (sum, column) => sum + column.tasks.length, 0
    )
    
    const completedTasks = columns.done.tasks.length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    
    const priorityDistribution = {
      high: 0,
      medium: 0,
      low: 0
    }
    
    Object.values(columns).forEach(column => {
      column.tasks.forEach(task => {
        priorityDistribution[task.priority]++
      })
    })
    
    return {
      totalTasks,
      completedTasks,
      completionRate,
      priorityDistribution
    }
  }
  
  const analytics = getTaskAnalytics()

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
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">
                {task.title}
              </CardTitle>
              <div className="flex gap-1">
                {task.dueDate && new Date(task.dueDate) < new Date() && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
                {task.tags && task.tags.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {task.tags[0]}{task.tags.length > 1 ? `+${task.tags.length - 1}` : ''}
                  </Badge>
                )}
              </div>
            </div>
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
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Due: {task.dueDate}
              </div>
            )}
            <div className="flex items-center justify-between">
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
              {task.completionPercentage !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {task.completionPercentage}% Complete
                </span>
              )}
            </div>
            {task.assignedTo && task.assignedTo.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Assigned to: {task.assignedTo.join(', ')}</span>
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotifyStaff(task);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Notify
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask(task);
                  setIsViewingTask(true);
                }}
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                Details
              </Button>
              {columnId !== 'done' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextStatus = {
                      todo: 'inProgress',
                      inProgress: 'review',
                      review: 'done'
                    }[columnId];
                    
                    if (nextStatus) {
                      // Create a synthetic drag end event
                      const event = {
                        active: { id: `${task.id}-${columnId}` },
                        over: { id: `placeholder-${nextStatus}` }
                      }
                      onDragEnd(event as DragEndEvent);
                    }
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Next
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
          <div className="flex items-center gap-2">
            {column.title}
            {column.id === 'todo' && <Badge variant="default" className="bg-blue-500">New</Badge>}
            {column.id === 'inProgress' && <Badge variant="default" className="bg-yellow-500">Active</Badge>}
            {column.id === 'review' && <Badge variant="default" className="bg-purple-500">Review</Badge>}
            {column.id === 'done' && <Badge variant="default" className="bg-green-500">Done</Badge>}
          </div>
          <Badge variant="secondary">{column.tasks.length}</Badge>
        </h2>
        <div className="space-y-4 min-h-[200px]">
          {column.tasks.map((task) => (
            <SortableItem key={task.id} task={task} columnId={column.id} />
          ))}
          {/* This is a placeholder for empty columns to allow dropping */}
          {column.tasks.length === 0 && (
            <div id={`placeholder-${column.id}`} className="h-2" />
          )}
        </div>
        {column.id === 'todo' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => {
              setNewTask(prev => ({ ...prev, status: 'todo' }));
              setIsAddingTask(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management Board</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart4 className="h-4 w-4" />
            Analytics
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleNotifyAllStaff}
          >
            <Bell className="h-4 w-4" />
            Notify All Staff
          </Button>
          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setNewTask({
                title: '',
                customer: '',
                date: '',
                package: '',
                priority: 'medium',
                status: 'todo',
                description: '',
                dueDate: '',
                assignedTo: [],
                tags: []
              });
              setIsAddingTask(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add New Task
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showAnalytics && (
        <div className="mb-6 grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.completionRate.toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.priorityDistribution.high}</div>
              <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-red-500 rounded-full" 
                  style={{ width: `${analytics.totalTasks ? (analytics.priorityDistribution.high / analytics.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>New: {columns.todo.tasks.length}</span>
                <span>In Progress: {columns.inProgress.tasks.length}</span>
                <span>Review: {columns.review.tasks.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-4 gap-4">
          {Object.values(filteredColumns).map((column) => (
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

      {/* Add Task Dialog */}
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for the booking management board.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Wedding Photography Session"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Customer</Label>
                <Input
                  id="customer"
                  value={newTask.customer}
                  onChange={(e) => setNewTask({ ...newTask, customer: e.target.value })}
                  placeholder="John & Sarah"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Booking Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Package</Label>
                <Input
                  id="package"
                  value={newTask.package}
                  onChange={(e) => setNewTask({ ...newTask, package: e.target.value })}
                  placeholder="Premium Package"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'high' | 'medium' | 'low' })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">New Booking</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe the task details..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assigned To (comma separated)</Label>
              <Input
                id="assignedTo"
                value={newTask.assignedTo?.join(', ') || ''}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value.split(',').map(item => item.trim()) })}
                placeholder="Mike, Emma"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newTask.tags?.join(', ') || ''}
                onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(',').map(item => item.trim()) })}
                placeholder="wedding, premium"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Task Dialog */}
      <Dialog open={isViewingTask} onOpenChange={setIsViewingTask}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {editMode ? 'Edit Task' : 'Task Details'}
              <div className="flex gap-2">
                {!editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewTask(selectedTask || {});
                      setEditMode(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (selectedTask) {
                      handleDeleteTask(selectedTask.id, selectedTask.status);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {editMode ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Task Title</Label>
                  <Input
                    id="edit-title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Customer</Label>
                  <Input
                    id="edit-customer"
                    value={newTask.customer}
                    onChange={(e) => setNewTask({ ...newTask, customer: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Booking Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-package">Package</Label>
                  <Input
                    id="edit-package"
                    value={newTask.package}
                    onChange={(e) => setNewTask({ ...newTask, package: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'high' | 'medium' | 'low' })}
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">New Booking</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-completion">Completion Percentage</Label>
                <Input
                  id="edit-completion"
                  type="number"
                  min="0"
                  max="100"
                  value={newTask.completionPercentage}
                  onChange={(e) => setNewTask({ ...newTask, completionPercentage: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-assignedTo">Assigned To (comma separated)</Label>
                <Input
                  id="edit-assignedTo"
                  value={newTask.assignedTo?.join(', ') || ''}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value.split(',').map(item => item.trim()) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={newTask.tags?.join(', ') || ''}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(',').map(item => item.trim()) })}
                />
              </div>
            </div>
          ) : (
            <div className="py-4">
              {selectedTask && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">Customer</h4>
                      <p className="text-sm">{selectedTask.customer}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Package</h4>
                      <p className="text-sm">{selectedTask.package}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">Booking Date</h4>
                      <p className="text-sm">{selectedTask.date}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Due Date</h4>
                      <p className="text-sm">{selectedTask.dueDate || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Description</h4>
                    <p className="text-sm">{selectedTask.description || 'No description provided'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">Priority</h4>
                      <Badge className={`${getPriorityColor(selectedTask.priority)} text-white`}>
                        {selectedTask.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Status</h4>
                      <Badge variant="outline">
                        {selectedTask.status === 'todo' && 'New Booking'}
                        {selectedTask.status === 'inProgress' && 'In Progress'}
                        {selectedTask.status === 'review' && 'Review'}
                        {selectedTask.status === 'done' && 'Completed'}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">Assigned To</h4>
                      <p className="text-sm">{selectedTask.assignedTo?.join(', ') || 'Not assigned'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Completion</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${selectedTask.completionPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{selectedTask.completionPercentage || 0}%</span>
                      </div>
                    </div>
                  </div>
                  {selectedTask.tags && selectedTask.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold">Tags</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTask.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <p>Created: {selectedTask.createdAt || 'Unknown'}</p>
                    </div>
                    <div>
                      <p>Last Updated: {selectedTask.updatedAt || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                <Button onClick={handleUpdateTask}>Save Changes</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsViewingTask(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}