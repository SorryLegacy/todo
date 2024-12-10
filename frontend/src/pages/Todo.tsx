import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Header from '../laylout/Header';
import SplitBackgroundLayout from '../laylout/SplitBackgroundLayout';
import taskService, { Task } from '../services/task'
import { useToast } from '../services/toast';
import NotificationList from '../ui/notificationList';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);


  useEffect(() => {
    const getTasks = async () => {
      const tasks = await taskService.listTask(searchQuery)
      setTasks(tasks)
    }
    getTasks( )
  }, [searchQuery])


  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      const response = await taskService.deleteTask(taskToDelete.id, showToast)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    deadline: string;
    priority: Task['priority'];
  }>({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
  });

  const updateTask = async (taskId: string, data: Partial<Task>) => { 
    const originalTask = tasks.find(task => task.id == taskId)
    if (originalTask){
      const updatedTask = await taskService.updateTask(taskId, originalTask, data, showToast)
      return updatedTask
    }
  }

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, {"status": newStatus})
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    updateTaskStatus(taskId, newStatus);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (newTask.title.trim() && newTask.deadline) {
      const task: Partial<Task> = {
        title: newTask.title,
        description: newTask.description,
        status: 'new',
        priority: newTask.priority,
        deadline: new Date(newTask.deadline).toISOString().slice(0, 19),
      };
      const taksNew = await taskService.createTask(task, showToast)

      setTasks((prevTasks) => [...prevTasks, taksNew]);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', deadline: '', priority: 'medium' });
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const filteredTasks = tasks
    .sort((a, b) => {
      const priorityOrder: Record<Task['priority'], number> = {
        high: 3,
        medium: 2,
        low: 1,
      };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const columns = [
    { title: 'Новая', status: 'new' as const, bgColor: 'bg-blue-100' },
    { title: 'В процессе', status: 'in_progress' as const, bgColor: 'bg-blue-300' },
    { title: 'Завершённая', status: 'completed' as const, bgColor: 'bg-blue-500' },
  ];

  return (
    <>
      <Header />
      <SplitBackgroundLayout>
        <div className="flex flex-col gap-4 p-4 overflow-auto ">
          <div className="flex justify-between items-center overflow-auto">
            <input
              type="text"
              placeholder="Поиск задач..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 border bg-white rounded-md focus:outline-none focus:ring"
            />
            <button
              onClick={handleAddTask}
              className="bg-white px-4 py-2 rounded-md"
            >
              Добавить новую задачу
            </button>
          </div>

          <div className="flex gap-4 overflow-hidden">
            {columns.map((column) => (
              <div
                key={column.status}
                className={`flex-1 ${column.bgColor} shadow-md rounded p-4 w-96 overflow-auto`}
                onDrop={(e) => handleDrop(e, column.status)}
                onDragOver={handleDragOver}
              >
                <h2 className="text-lg font-bold mb-4">{column.title}</h2>
                <div className="space-y-4">
                  {filteredTasks
                    .filter((task) => task.status === column.status)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-white shadow rounded flex flex-col gap-2"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{task.title}</h3>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              task.priority === 'high'
                                ? 'bg-red-500 text-white'
                                : task.priority === 'medium'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}
                          >
                            {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Дедлайн: {task.deadline}
                        </p>
                        <p className="text-sm text-gray-500">
                          Обновлено: {new Date(task.updated_at).toLocaleString()}
                        </p>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(task.id, e.target.value as Task['status'])
                          }
                          className="mt-2 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          <option value="new">Новая</option>
                          <option value="in_progress">В процессе</option>
                          <option value="completed">Завершённая</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditTask(task)}
                            className="bg-yellow-500 w-1/2 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task)}
                            className="bg-red-500 w-1/2 text-white px-4 py-2 rounded-md hover:bg-red-600"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      

      <ReactModal
        isOpen={isModalOpen || !!editTask}
        onRequestClose={() => {
          setIsModalOpen(false);
          setEditTask(null);
        }}
        className="modal-content bg-white p-6 rounded shadow-md w-96 overflow-auto"
        overlayClassName="modal-overlay fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        <h2 className="text-lg font-bold mb-4">
          {editTask ? 'Редактировать задачу' : 'Добавить новую задачу'}
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Название задачи"
            value={editTask ? editTask.title : newTask.title}
            onChange={(e) =>
              editTask
                ? setEditTask({ ...editTask, title: e.target.value })
                : setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
            className="p-2 border rounded-md focus:outline-none focus:ring"
          />
          <textarea
            placeholder="Описание задачи"
            value={editTask ? editTask.description || '' : newTask.description}
            onChange={(e) =>
              editTask
                ? setEditTask({ ...editTask, description: e.target.value })
                : setNewTask((prev) => ({ ...prev, description: e.target.value }))
            }
            className="p-2 border rounded-md focus:outline-none focus:ring"
          />
          <input
            type="datetime-local"
            value={editTask ? editTask.deadline : newTask.deadline}
            onChange={(e) =>
              editTask
                ? setEditTask({ ...editTask, deadline: e.target.value })
                : setNewTask((prev) => ({ ...prev, deadline: e.target.value }))
            }
            className="p-2 border rounded-md focus:outline-none focus:ring"
          />
          <select
            value={editTask ? editTask.priority : newTask.priority}
            onChange={(e) =>
              editTask
                ? setEditTask({ ...editTask, priority: e.target.value as Task['priority'] })
                : setNewTask((prev) => ({ ...prev, priority: e.target.value as Task['priority'] }))
            }
            className="p-2 border rounded-md focus:outline-none focus:ring"
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setEditTask(null);
            }}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={async () => {
              try {
                if (editTask) {
                  await updateTask(editTask.id, { ...editTask });
                  setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                      task.id === editTask.id ? { ...editTask, updated_at: new Date().toISOString() } : task
                    )
                  );
                  setEditTask(null)
                } else {
                  handleSaveTask();
                }
              } catch (error) {
                console.error("Ошибка при обновлении задачи:", error);
              } finally {
                console.log('test')
                setIsModalOpen(false)
                console.log()
              }

            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {editTask ? 'Сохранить изменения' : 'Создать'}
          </button>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isDeleteModalOpen}
        onRequestClose={cancelDeleteTask}
        className="modal-content bg-white p-6 rounded shadow-md w-96 overflow-auto"
        overlayClassName="modal-overlay fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        <h2 className="text-lg font-bold mb-4">Удалить задачу</h2>
        <p>Вы уверены, что хотите удалить задачу "{taskToDelete?.title}"?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={cancelDeleteTask}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={confirmDeleteTask}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </ReactModal>
      </SplitBackgroundLayout>
    </>
  );
};
export default TaskBoard;