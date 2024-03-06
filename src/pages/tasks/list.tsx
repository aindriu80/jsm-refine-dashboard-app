import {
  KanbanBoardContainer,
  KanbanBoard,
} from '@/components/tasks/kanban/board'
import ProjectCard from '@/components/tasks/kanban/card'
import KanbanColumn from '@/components/tasks/kanban/column'
import KanbanItem from '@/components/tasks/kanban/item'
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries'
import { TaskStage } from '@/graphql/schema.types'
import { TasksQuery } from '@/graphql/types'
import { useList } from '@refinedev/core'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import React from 'react'

const List = () => {
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: 'taskStages',
    filters: [
      {
        field: 'title',
        operator: 'in',
        value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE'],
      },
    ],
    sorters: [
      {
        field: 'createdAt',
        order: 'asc',
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  })
  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: 'tasks',
    sorters: [
      {
        field: 'dueDate',
        order: 'asc',
      },
    ],
    queryOptions: {
      enabled: !!stages,
    },
    pagination: {
      mode: 'off',
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  })

  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unassignedStage: [],
        stages: [],
      }
    }

    const unassignedStage = tasks.data.filter((task) => task.stageId === null)

    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
      // Include all required properties for a Task
      checklist: tasks.checklist,
      comments: tasks.comments,
      commentsAggregate: tasks.commentsAggregate,
      createdBy: tasks.createdBy,
      usersAggregate: tasks.usersAggregate,
    }))
    return {
      unassignedStage,
      columns: grouped,
    }
  }, [stages, tasks])

  const handleAddCard = (args: { stageId: string }) => {}

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanColumn
            id="unassigned"
            title={'unassigned'}
            count={taskStages.unassignedStage?.length || 0}
            onAddClick={() => handleAddCard({ stageId: 'unassigned' })}>
            {taskStages.unassignedStage?.map((task) => (
              <KanbanItem
                key={task?.id}
                id={task?.id}
                data={{ ...task, stageId: 'unassigned' }}>
                <ProjectCard {...task} dueDate={task?.dueDate || undefined} />

                {/* <ProjectCard
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  completed={task.completed}
                  dueDate={task?.dueDate || undefined}
                /> */}
              </KanbanItem>
            ))}
          </KanbanColumn>
        </KanbanBoard>
      </KanbanBoardContainer>
    </>
  )
}

export default List
