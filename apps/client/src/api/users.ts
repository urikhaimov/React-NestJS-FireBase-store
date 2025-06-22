import axios from 'axios';

export async function fetchUsers(token: string) {
  return axios.get('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
