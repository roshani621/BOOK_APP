import { useEffect } from 'react';
import socket from './socket';

const NotificationSocket = ({onNotification}) => {

    useEffect(()=>{
        const token = localStorage.getItem("b_token");

        if(!token){
            console.log('Token not found');
            return;
        }

        const handleConnect = () =>{
            console.log("Socket connected: ", socket.id)
        }

        socket.emit(
            "join_notification_room",
            token
        );

        console.log(
            `Joined notification room`
        );

        const handleNotification = (notification) =>{
            console.log(
                "New notification received:",
                notification
            );

            if(onNotification){
                onNotification(notification);
            }
        };

        socket.on(
            "connect",
            handleConnect
        )

        socket.on(
            "new_notification",
            handleNotification
        );

        if(!socket.connected){
            socket.connect();
        } else{
            handleConnect();
        }

        return ()=>{
            socket.off(
                "connect",
                handleConnect
            )

            socket.off(
                "new_notification",
                handleNotification
            )
        }
    }, [onNotification]);
    return null;
};

export default NotificationSocket;