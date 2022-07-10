import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authUser } from "../_actions/user_action";
export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
      dispatch(authUser()).then((response) => {
        console.log(response);
        //로그인 하지 않은 상태인데 로그인 해야하는 페이지에 접근할 때
        if (!response.payload.isAuth) {
          if (option) {
            navigate("/login");
          }
        } else {
          //로그인은 했지만 Admin이 아닌데 Admin 페이지에 접근할 때
          if (adminRoute && !response.payload.isAdmin) {
            navigate("/");
          } else {
            if (!option) {
              navigate("/");
            }
          }
        }
      });
    });
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
