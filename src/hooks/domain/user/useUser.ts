import {useQuery} from '@tanstack/react-query';
import {userService} from './userServices';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userService.getUser,
  });
};
