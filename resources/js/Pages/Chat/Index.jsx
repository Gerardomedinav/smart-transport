import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Index({ auth, contacts }) {
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true); 
    const [paginationMeta, setPaginationMeta] = useState(null); 
    const scrollRef = useRef();
    const audioRef = useRef(new Audio('/sounds/alert.mp3'));

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const quickMessages = [
        { label: '🚨 SOS', content: '¡EMERGENCIA! Necesito asistencia inmediata.', critical: true },
        { label: '💥 ACCIDENTE', content: 'He tenido un accidente. Vehículo detenido.', critical: true },
        { label: '🚧 OBSTRUCCIÓN', content: 'Ruta obstruida. Posible demora.', critical: false },
        { label: '🔧 FALLA TÉCNICA', content: 'El vehículo presenta una falla mecánica.', critical: false },
    ];

    // 🚀 INTEGRACIÓN: CAPTURAR MENSAJE AUTOMÁTICO DE LA ALERTA
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const contactId = params.get('contact_id');
        const autoMsg = params.get('auto_msg');

        if (contactId) {
            const contact = contacts.find(c => c.id == contactId);
            if (contact) {
                setSelectedContact(contact);
                // Si hay mensaje automático, lo enviamos de inmediato al seleccionar
                if (autoMsg) {
                    axios.post('/api/messages', {
                        receiver_id: contactId,
                        content: autoMsg,
                        is_critical: true
                    }).then(res => {
                        setMessages(prev => [...prev, res.data]);
                        // Limpiamos la URL para que no se re-envíe al recargar
                        window.history.replaceState({}, '', `/chat?contact_id=${contactId}`);
                    });
                }
            }
        }
    }, [contacts]);

    useEffect(() => {
        if (selectedContact) {
            axios.get(`/api/messages/${selectedContact.id}`)
                .then(res => {
                    setMessages(res.data.data.reverse());
                    setPaginationMeta(res.data);
                });
            
            const channel = window.Echo.private(`chat.${auth.user.id}`)
                .listen('.message.sent', (e) => {
                    if (e.message.is_critical) {
                        audioRef.current.play().catch(() => console.log("Audio bloqueado"));
                    }
                    if (e.message.sender_id === selectedContact.id) {
                        setMessages(prev => [...prev, e.message]);
                    }
                });

            return () => window.Echo.leave(`chat.${auth.user.id}`);
        }
    }, [selectedContact, auth.user.id]);

    const loadMoreMessages = () => {
        if (paginationMeta?.next_page_url) {
            axios.get(paginationMeta.next_page_url)
                .then(res => {
                    const olderMessages = res.data.data.reverse();
                    setMessages(prev => [...olderMessages, ...prev]);
                    setPaginationMeta(res.data);
                });
        }
    };

    useEffect(() => { 
        if (paginationMeta?.current_page === 1) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); 
        }
    }, [messages]);

    const sendMessage = (e, content = null, isCritical = false) => {
        if (e) e.preventDefault();
        const text = content || newMessage;
        if (!text.trim() || !selectedContact?.id) return;

        axios.post('/api/messages', {
            receiver_id: selectedContact.id,
            content: text,
            is_critical: isCritical
        }).then(res => {
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Comunicaciones" darkMode={isDarkMode}>
            <Head title="Chat - Smart Transport" />
            
            <div className={`flex h-[calc(100vh-180px)] ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl overflow-hidden border shadow-2xl transition-colors duration-300`}>
                
                <div className={`w-80 border-r ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'} backdrop-blur-xl overflow-y-auto`}>
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <span className="font-black text-[10px] uppercase tracking-widest text-slate-500 italic">Terminal</span>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-[9px] px-2 py-1 rounded bg-blue-600 text-white font-bold uppercase hover:bg-blue-500 transition-colors">
                            {isDarkMode ? '☀️ Claro' : '🌙 Oscuro'}
                        </button>
                    </div>
                    {contacts.map(c => (
                        <div key={c.id} onClick={() => {
                            setSelectedContact(c);
                            setMessages([]); 
                        }} 
                             className={`p-4 cursor-pointer transition-all border-l-4 ${selectedContact?.id === c.id ? 'bg-blue-600/10 border-blue-500' : 'border-transparent hover:bg-slate-800'}`}>
                            <p className={`font-black text-xs uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">{c.role}</span>
                        </div>
                    ))}
                </div>

                <div className="flex-1 flex flex-col">
                    {selectedContact ? (
                        <>
                            <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
                                {paginationMeta?.next_page_url && (
                                    <div className="flex justify-center mb-4">
                                        <button onClick={loadMoreMessages} className="text-[10px] font-black uppercase text-blue-500 hover:underline">
                                            ↑ Cargar mensajes anteriores
                                        </button>
                                    </div>
                                )}

                                {messages.map(m => (
                                    <div key={m.id} className={`flex ${m.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-xs font-bold shadow-md transition-all relative ${
                                            m.is_critical 
                                            ? 'bg-red-600 text-white animate-pulse border-2 border-red-400' 
                                            : (m.sender_id === auth.user.id ? 'bg-blue-600 text-white' : (isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800 border border-gray-300'))
                                        }`}>
                                            {m.is_critical && <span className="block text-[8px] mb-1 font-black uppercase underline">⚠️ Emergencia</span>}
                                            <p className="mb-1 leading-relaxed">{m.content}</p>
                                            <span className="block text-[8px] text-right opacity-60 font-medium">{formatTime(m.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>

                            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-t p-4 space-y-3`}>
                                <div className="flex flex-wrap gap-2">
                                    {quickMessages.map((q, i) => (
                                        <button key={i} onClick={() => sendMessage(null, q.content, q.critical)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border shadow-sm ${
                                                q.critical ? 'border-red-500 text-red-500 hover:bg-red-600 hover:text-white' : 'border-slate-700 text-slate-400 hover:bg-blue-600 hover:text-white'
                                            }`}>
                                            {q.label}
                                        </button>
                                    ))}
                                </div>
                                <form onSubmit={(e) => sendMessage(e)} className="flex gap-2">
                                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                        className={`flex-1 ${isDarkMode ? 'bg-slate-800 text-white border-none' : 'bg-gray-100 text-slate-900 border-gray-300'} rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500`} 
                                        placeholder="Escribir instrucción manual..." />
                                    <button type="submit" className="bg-blue-600 px-6 rounded-xl text-white font-black text-xs uppercase hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                                        Enviar
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className={`flex-1 flex flex-col items-center justify-center ${isDarkMode ? 'text-slate-700 bg-slate-950' : 'text-slate-400 bg-gray-50'}`}>
                            <div className="text-6xl mb-4 opacity-10">📡</div>
                            <div className="font-black uppercase text-[10px] tracking-[0.5em]">Seleccione Canal de Radio</div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}