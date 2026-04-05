import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Index({ auth, contacts }) {
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [pagination, setPagination] = useState({ next_page_url: null, current_page: 1 });
    const [loadingMore, setLoadingMore] = useState(false);
    
    // 🚀 ESTADO PARA NOTIFICACIONES VISUALES
    const [unreadContacts, setUnreadContacts] = useState([]); 

    const chatContainerRef = useRef();
    const audioRef = useRef(new Audio('/sounds/alert.mp3'));

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // 🔊 Escucha Global y Notificaciones Visuales
    useEffect(() => {
        const channel = window.Echo.private(`chat.${auth.user.id}`)
            .listen('.message.sent', (e) => {
                const senderId = e.message.sender_id;

                // 1. Si el mensaje NO es del contacto que tengo abierto:
                if (selectedContact?.id !== senderId) {
                    // Sonido de alerta
                    audioRef.current.play().catch(() => console.log("Audio bloqueado"));
                    
                    // 🔴 Agregamos visualmente a la lista de "No leídos"
                    setUnreadContacts(prev => {
                        if (!prev.includes(senderId)) return [...prev, senderId];
                        return prev;
                    });
                } else {
                    // 2. Si es el contacto abierto, solo agregamos el mensaje al chat
                    setMessages(prev => [...prev, e.message]);
                    setTimeout(scrollToBottom, 50);
                }
            });

        return () => window.Echo.leave(`chat.${auth.user.id}`);
    }, [selectedContact, auth.user.id]);

    // 🚀 Al seleccionar un contacto
    const selectContact = (contact) => {
        setSelectedContact(contact);
        setMessages([]); 
        // 🧼 Limpiamos la notificación visual al abrir el chat
        setUnreadContacts(prev => prev.filter(id => id !== contact.id));
        
        axios.get(`/api/messages/${contact.id}`)
            .then(res => {
                setMessages(res.data.data.reverse());
                setPagination({ next_page_url: res.data.next_page_url, current_page: res.data.current_page });
                setTimeout(scrollToBottom, 100);
            });
    };

    // 🔄 Scroll WhatsApp
    const handleScroll = (e) => {
        if (e.currentTarget.scrollTop === 0 && pagination.next_page_url && !loadingMore) {
            loadMoreMessages();
        }
    };

    const loadMoreMessages = () => {
        setLoadingMore(true);
        const scrollHeightBefore = chatContainerRef.current.scrollHeight;
        axios.get(pagination.next_page_url).then(res => {
            const older = res.data.data.reverse();
            setMessages(prev => [...older, ...prev]);
            setPagination({ next_page_url: res.data.next_page_url, current_page: res.data.current_page });
            setLoadingMore(false);
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - scrollHeightBefore;
            }, 10);
        });
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const sendMessage = (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedContact?.id) return;

        axios.post('/api/messages', {
            receiver_id: selectedContact.id,
            content: newMessage,
            is_critical: false
        }).then(res => {
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
            setTimeout(scrollToBottom, 50);
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Comunicaciones" darkMode={isDarkMode}>
            <Head title="Chat - Smart Transport" />
            
            <div className={`flex h-[calc(100vh-160px)] mx-4 my-2 border shadow-2xl rounded-3xl overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'}`}>
                
                {/* 👥 LISTA DE CONTACTOS CON INDICADOR VISUAL */}
                <div className={`w-80 border-r flex flex-col ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                        <span className="font-black text-[10px] uppercase tracking-widest text-blue-500 italic">Central Radio</span>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {contacts.map(c => (
                            <div key={c.id} onClick={() => selectContact(c)} 
                                 className={`p-5 cursor-pointer transition-all flex items-center justify-between border-l-4 ${selectedContact?.id === c.id ? 'bg-blue-600/10 border-blue-500' : 'border-transparent hover:bg-black/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${isDarkMode ? 'bg-slate-800 text-blue-400 border border-white/5' : 'bg-blue-100 text-blue-600 border border-blue-200'}`}>
                                        {c.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={`font-black text-xs uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{c.role}</p>
                                    </div>
                                </div>

                                {/* 🔴 NOTIFICACIÓN VISUAL (Puntito rojo) */}
                                {unreadContacts.includes(c.id) && (
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-lg border border-red-400"></span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💬 ÁREA DE CHAT */}
                <div className="flex-1 flex flex-col relative">
                    {selectedContact ? (
                        <>
                            <div className={`p-4 border-b flex items-center gap-4 ${isDarkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-gray-100'}`}>
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">{selectedContact.name.charAt(0)}</div>
                                <span className="font-black text-xs uppercase tracking-widest">{selectedContact.name}</span>
                            </div>

                            <div ref={chatContainerRef} onScroll={handleScroll} className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                {messages.map(m => (
                                    <div key={m.id} className={`flex ${m.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-4 rounded-2xl text-xs font-bold shadow-xl ${m.sender_id === auth.user.id ? 'bg-blue-600 text-white' : (isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800 border border-gray-200')}`}>
                                            <p className="leading-relaxed">{m.content}</p>
                                            <span className="block text-[8px] text-right opacity-50 mt-1">{formatTime(m.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`p-4 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} className={`flex-1 px-6 py-3 rounded-2xl text-xs font-bold ${isDarkMode ? 'bg-slate-800 text-white border-none' : 'bg-gray-100 text-slate-900 border-gray-300'}`} placeholder="Escribir mensaje..." />
                                    <button type="submit" className="bg-blue-600 px-8 rounded-2xl text-white font-black text-xs uppercase hover:bg-blue-500 shadow-lg">Enviar</button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className={`flex-1 flex flex-col items-center justify-center opacity-30 ${isDarkMode ? 'text-slate-700' : 'text-slate-400'}`}>
                            <div className="text-8xl mb-4">📡</div>
                            <p className="font-black uppercase text-xs tracking-[0.5em]">Canal Desconectado</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}