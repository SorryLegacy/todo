import React, { useState, useEffect, useRef } from 'react';
import taskService, { Notification } from '../services/task';

const apiEndpoint = process.env.REACT_APP_API_BACKEND?.replace(/(^\w+:|^)\/\//, '');

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const initialNotifications = await taskService.getNotifications();
      const enhancedNotifications = initialNotifications.map((notification) => ({
        ...notification,
        isNew: !notification.date, // Помечаем как новое, если нет `date`
      }));
      setNotifications(enhancedNotifications);
    };

    const setupWebSocket = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token is missing!');
        return;
      }

      if (wsRef.current) {
        console.log('WebSocket already open');
        return;
      }

      const ws = new WebSocket(`ws://${apiEndpoint}/ws?token=${accessToken}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        try {
          let parsedData = JSON.parse(event.data);
          console.log('Полученные данные:', parsedData);
          parsedData = JSON.parse(parsedData)
          if (!Array.isArray(parsedData)) {
            throw new Error('Ожидается массив уведомлений');
          }
      
          const newNotifications: Notification[] = parsedData.map((notification) => ({
            ...notification,
            isNew: !notification.date,
          }));
      
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const filteredNotifications = newNotifications.filter(
              (notification) => !existingIds.has(notification.id)
            );
            return [...filteredNotifications, ...prev];
          });
        } catch (error) {
          console.error('Ошибка обработки уведомлений:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        wsRef.current = null;
      };
    };

    fetchNotifications();
    setupWebSocket();

    const handleBeforeUnload = () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleNotificationClick = (id: string) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'mark_as_read', id }));

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isNew: false } : notification
        )
      );
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-lg font-bold mb-2">Уведомления</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-2 rounded shadow-sm ${
                notification.isNew ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <p>{notification.message}</p>
              <span className="text-xs text-gray-500">
                {notification.date
                  ? new Date(notification.date).toLocaleString()
                  : 'Новое'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Нет новых уведомлений</p>
      )}
    </div>
  );
};

export default NotificationList;
