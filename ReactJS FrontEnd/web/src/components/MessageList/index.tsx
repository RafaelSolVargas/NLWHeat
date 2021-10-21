import { api } from '../../services/api'
import { io } from 'socket.io-client'
import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'
import { useEffect, useState } from 'react'

type Message = {
    id: string,
    text: string,
    user: {
        name: string
        avatar_url: string,
    }
}
/* Cria um array de mensagens para ir armazenando todas as novas mensagens que forme chegando */
let messagesQueue: Message[] = []
/* Conforme chegam as mensagens são armazenadas no array */
const socket = io('http://localhost:4000')
socket.on('new_message', newMessage => {
    messagesQueue.push(newMessage);
})

export function MessageList() {
    // O <> afirma que o useState irá armazenar uma lista de tipos Message
    const [messages, setMessages] = useState<Message[]>([])


    useEffect(() => {
        api.get<Message[]>('/messages/last3').then(response => {
            setMessages(response.data)
        })
    }, [])

    /* A cada 3 seg irá ver se tem novas mensagens na fila e irá colocá-la */
    useEffect(() => {
        const timer = setInterval(() => {

            if (messagesQueue.length > 0) {
                /* Coloca a nova mensagem e repete as duas ultimas já mostradas, usando um filtro Boolean
                para caso algum desses valores for undefined ou null não irá deixar passar para o setMessages */
                setMessages(currentMessages => [
                    messagesQueue[0],
                    currentMessages[0],
                    currentMessages[1]
                ].filter(Boolean))

                messagesQueue.shift()
            }
        }, 5000)
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt='DoWhile 2021'></img>
            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name}></img>
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}