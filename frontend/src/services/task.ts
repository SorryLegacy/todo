import { api } from "./api";

const getChangedFields = <T>(original: T, updated: Partial<T>): Partial<T> => {
    const changedFields: Partial<T> = {}
    for (const key in updated) {
        if (updated[key] !== original[key]) {
            changedFields[key] = updated[key]
        }
    }
    return changedFields
}
export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'new' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    deadline: string;
    updated_at: string;
  }

export interface Notification {
    id: string
    message: string
    date: string
    isNew: boolean
}


const taskService = {
    async listTask<T>(search: string = ''): Promise<Task[]> {
        let url = '/api/v1/tasks'

        if (search) {
            url += `?search=${search}`
        }

        const tasks = await api.getJson<Task[]>(url)
        return tasks
    },
    
    async updateTask<T>(id: string, originalTask: Task, task: Partial<Task>, showToast?: (message: string, status: 'success' | 'error') => void,
    ): Promise<Task> {
        const changedFields = getChangedFields(originalTask, task)
        if (Object.keys(changedFields).length === 0) {
            if(showToast) {
                showToast("No changes detected", "error")
                return originalTask
            }

        }
        const updatedTask = await api.patchJson<Task>(`/api/v1/tasks/${id}`, changedFields)
        if (showToast) {
            showToast("Changes apply succesfully", "success")
        }
        return updatedTask
    },

    async deleteTask<T>(id: string, showToast?: (message: string, status: 'success' | 'error') => void,): Promise<Record<string, any>> {
        const response = await api.deleteJson<Record<string, any>>(`/api/v1/tasks/${id}`)
        if (showToast) {
            showToast("Task deleted", "success")
        }
        return response
    },

    async createTask<T>(task: Partial<Task>, showToast?: (message: string, status: 'success' | 'error') => void,): Promise<Task>{
        const newTask = await api.postJson<Task>('/api/v1/tasks', { ...task })
        if (showToast) {
            showToast("Task created", "success")
        }
        return newTask
    },

    async getNotifications<T>(): Promise<Notification[]>{
        const notification = await api.getJson<Notification[]>('/api/v1/tasks/notifications')
        return notification
    }


}


export default taskService
