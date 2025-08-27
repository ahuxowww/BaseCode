import {api} from '../../../services/api';

export const userService = {
  getUser: () => api.get('/user'),
};
