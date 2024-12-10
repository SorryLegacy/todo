import asyncio
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from depends import get_task_service_ws, TaskService

from api.v1 import router_v1

app = FastAPI(docs_url="/api/docs")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_v1)


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    task_service: TaskService = Depends(get_task_service_ws)
):
    await websocket.accept()

    try:
        last_sent_time = 0
        while True:
            try:
                receive_task = asyncio.create_task(websocket.receive_json())
                current_time = time.time()
                
                if current_time - last_sent_time >= 1000:
                    deadlines_task = asyncio.create_task(task_service.get_upcoming_deadlines_for_user())
                    tasks = [receive_task, deadlines_task]
                else:
                    tasks = [receive_task]
                
                done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
                
                for task in done:
                    if task is receive_task: 
                        try:
                            message = task.result()
                            if message.get("type") == "mark_as_read":
                                notification_id = message.get("id")
                                if notification_id:
                                    await task_service.mark_as_read(notification_id)
                        except WebSocketDisconnect:
                            print("Клиент отключился")
                            return  
                        except Exception as e:
                            print(f"Ошибка обработки входящего сообщения: {e}")
                    elif 'deadlines_task' in locals() and task is deadlines_task:
                        try:
                            upcoming_deadlines = task.result()
                            if upcoming_deadlines:
                                await websocket.send_json(upcoming_deadlines.model_dump_json())
                                last_sent_time = current_time
                        except Exception as e:
                            print(f"Ошибка при отправке уведомлений: {e}")

                for task in pending:
                    task.cancel()

                await asyncio.sleep(0.1)

            except WebSocketDisconnect:
                print("Клиент отключился")
                break
    except Exception as e:
        print(f"WebSocket error: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)