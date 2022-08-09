import { createContext, useMemo, useContext, useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from './AuthProvider';

export const AppContext = createContext();

export default function AppProvider({ children }) {
    const [isAddRoomVisible, setAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const { user: { uid } } = useContext(AuthContext);

    const roomCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            value: uid
        }
    }, [uid]);
    /**
     * name: 'room name', 
     * description: 'mo ta ',
     * members: [uid1, uid2, ...]
     */
    const rooms = useFirestore('rooms', roomCondition);

    const selectedRoom = useMemo(
        () => rooms.find(room => room.id === selectedRoomId) || {}
    , [rooms, selectedRoomId]);

    const usersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            value: selectedRoom.members,
        }
    }, [selectedRoom.members]);

    const members = useFirestore('users', usersCondition);

    return (
        <AppContext.Provider
            value={{
                rooms,
                members, 
                isAddRoomVisible, setAddRoomVisible,
                selectedRoomId, setSelectedRoomId,
                selectedRoom,
                isInviteMemberVisible, setInviteMemberVisible,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}
