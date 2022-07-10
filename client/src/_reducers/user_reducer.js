import { LOGIN_USER, REGISTER_USER } from "../_actions/types";
export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      // action.payload 는 백엔드에서 post 성공했을 때 출력되는 json(...)
      // 왜냐면 user_action에서 payload 가 request이기 때문에
      return { ...state, loginSuccess: action.payload };
      break;
    case REGISTER_USER:
      return { ...state, register: action.payload };
    default:
      return state;
  }
}
