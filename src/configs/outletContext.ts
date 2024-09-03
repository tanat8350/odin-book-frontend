import { useOutletContext } from 'react-router-dom';
import { type Context } from '../configs/type';

export function useUser() {
  return useOutletContext<Context>();
}
