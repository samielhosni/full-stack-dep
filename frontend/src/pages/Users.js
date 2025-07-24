import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8082/users') // Assuming user-service runs on port 8082
            .then(res => setUsers(res.data))
            .catch(() => setUsers([]));
    }, []);

    return (
        <div className="container mt-4">
            <h2>User List</h2>
            <ul className="list-group">
                {users.map(user => (
                    <li className="list-group-item" key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;