import { State } from '@/store/state';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  setMsg(state, msg: string) {
    state.msg = msg;
  }
};

export default mutations;
